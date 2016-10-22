NGINX: 配置HTTP负载均衡
2015年12月14日 星期一
19:43
 
0、简单的负载均衡
0、环境介绍：
proxy-172.16.2.243（前端负载均衡）
web01-172.16.2.244
web02-172.16.2.245
 
windows7-172.16.2.28
 
1、负载均衡配置
## proxy前端
**********************************************************
upstream websrv01 {
    server 172.16.2.244;
    server 172.16.2.245;
}
 
server {
    listen 80;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log main;
 
    location / {
        proxy_pass http://websrv01;
    }
**********************************************************
 
## web01
**********************************************************
server {
    listen 80;
    server_name localhost;
    root /data/server/nginx/html;
    access_log /data/log/weblog/access.log main;
 
    location / {
        index index.html index.php;
    }
**********************************************************
 
## web02
**********************************************************
server {
    listen 80;
    server_name localhost;
    root /data/server/nginx/html;
    access_log /data/log/weblog/access.log main;
 
    location / {
        index index.html index.php;
    }
********************************************************** 
2、访问效果
## 先修改web01和web02的index.html内容
## web01
# vim /data/server/nginx/html/index.html
***********************
FROM: 172.16.2.244
***********************
## web02
# vim /data/server/nginx/html/index.html
***********************
FROM: 172.16.2.245
***********************
 
## proxy上访问
# curl -xlocalhost:80 www.loadB.com
FROM: 172.16.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.16,2,245
# curl -xlocalhost:80 www.loadB.com
FROM: 172.16.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.16,2,245
## 244和255交替出现
 
## 在windows上用chrome访问
## 编辑C:\Windows\System32\drivers\etc\hosts文件，添加如下内容
****************************
172.16.2.243 www.loadB.com 
****************************
## 打开chrome浏览器，访问www.loadB.com，不断刷新后会发现以下内容交替出现

 

## 如果持续出现一个，很有可能是因为浏览器缓存问题 
3、日志查看
## proxy
# tail /data/log/weblog/www.loadB.com.log
172.16.2.28 - - [15/Dec/2015:18:58:33 +0800] "GET / HTTP/1.1" 200 19 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" "-"
 
## web01
# tail /data/log/weblog/access.log
172.16.2.243 - - [15/Dec/2015:19:01:12 +0800] "GET / HTTP/1.0" 200 19 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" "-"
 
## web02
# tail /data/log/weblog/access.log
172.16.2.243 - - [15/Dec/2015:18:58:22 +0800] "GET / HTTP/1.0" 200 19 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" "-"
 
## 看到上面日志，发现两个问题
1、看proxy端的日志，无法分辨是哪一个web服务器处理的请求
2、看web端的日志，源ip不是客户端ip，而是proxy的ip
## 下面我们来解决它们 
1、proxy端的日志配置
## upstream 模块的变量
$upstream_addr:             处理请求的upstream 服务器地址
$upstream_status:           upstream 服务器的应答状态
$upstream_response_time:    upstream 服务器的响应时间
$upstream_http_$HEADER:     任意的协议头信息例如：$upstream_http_host
## 日志配置
# vim nginx.conf
**********************************************************
## 增加log_format
log_format upstream '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '$upstream_addr "$upstream_status" "$upstream_response_time"';
 
## 修改www.loadB.com的日志格式配置
access_log /data/log/weblog/www.loadB.com.log upstream;
**********************************************************
 
## 重启nginx
# nginx -t
# nginx -s reload
 
## 用172.16.2.28访问数次后，重新查看日志记录
# tail /data/log/weblog/www.loadB.com.log
172.16.2.28 - - [16/Dec/2015:00:24:08 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.245:80 "200" "0.001"
172.16.2.28 - - [16/Dec/2015:00:24:08 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.244:80 "200" "0.001"
172.16.2.28 - - [16/Dec/2015:00:24:08 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.245:80 "200" "0.001"
172.16.2.28 - - [16/Dec/2015:00:24:08 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.244:80 "200" "0.001"
## 这里就可以看到哪一台web服务器处理的请求，处理的状态码，处理的时间了 
2、获取客户端真实IP
## 语法介绍
Syntax:        set_real_ip_from address | CIDR | unix:;
Default:        -
Context:        http, server, location
Defines trusted addresses that are known to send correct replacement addresses. If the special value unix: is specified, all UNIX-domain sockets will be trusted.
 
IPv6 addresses are supported starting from versions 1.3.0 and 1.2.1.
## 设置了此项的ip都会被认为是信任的ip，因此它们都拥有了可以提交client源ip的资格
 
===================================================
 
Syntax:        real_ip_header field | X-Real-IP | X-Forwarded-For | proxy_protocol;
Default:        
real_ip_header X-Real-IP;
Context:        http, server, location
Defines the request header field whose value will be used to replace the client address.
 
The proxy_protocol parameter (1.5.12) changes the client address to the one from the PROXY protocol header. The PROXY protocol must be previously enabled by setting the proxy_protocol parameter in the listen directive.
## X-Forwarded-For是将最后一个转发ip作为访问ip写入日志中 
## 配置文件修改
## 使用X-Real-IP
===============================================
## proxy端配置
# vim nginx.conf
**********************************************************
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
*         proxy_set_header X-Real-IP       $remote_addr;
*         proxy_set_header Host            $host;
    }
}
********************************************************** 
## web端配置
# vim nginx.conf
**********************************************************
## 放在http块中
set_real_ip_from 172.16.2.243;
real_ip_header   X-Real-IP;
********************************************************** 
## 查看效果
## proxy端日志查看
# tail -1 /data/log/weblog/www.loadB.com.log
172.16.2.28 - - [16/Dec/2015:01:46:32 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.245:80 "200" "0.001"
 
## web端日志查看
# tail -1 /data/log/weblog/access.log
172.16.2.28 - - [16/Dec/2015:01:46:32 +0800] "GET / HTTP/1.0" 200 19 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" "-" 
## 使用X-Forwarded-For
===========================================
## proxy端配置
# vim nginx.conf
**********************************************************
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
#        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host            $host;
    }
}
********************************************************** 
## web端配置
# vim nginx.conf
**********************************************************
## 放在http块中
set_real_ip_from 172.16.2.243;
real_ip_header   X-Forwarded-For;
********************************************************** 
## 查看效果
## proxy端日志查看
# tail -1 /data/log/weblog/www.loadB.com.log
172.16.2.28 - - [16/Dec/2015:03:19:59 +0800] "GET / HTTP/1.1" 200 19 "-" 172.16.2.244:80 "200" "0.000"
 
## web端日志查看
# tail -1 /data/log/weblog/access.log
172.16.2.28 - - [16/Dec/2015:03:20:00 +0800] "GET / HTTP/1.0" 200 19 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36" "172.16.2.28" 
 
错误汇总
===========================================
错误1、
## 无法配置"set_real_ip_from"
# nginx -t
nginx: [emerg] unknown directive "set_real_ip_from" in /data/server/nginx/conf/nginx.conf:26
nginx: configuration file /data/server/nginx/conf/nginx.conf test failed
解决方案：
## recompile nginx 
# /etc/init.d/nginxd stop
# cp nginx.conf /root/
# rm -rf /data/server/nginx/*
# cd /usr/local/src/nginx-1.8.0
# make clean
# ./configure --user=nginx --group=nginx --prefix=/data/server/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre  --with-http_realip_module
# make
# make install
# cp /root/nginx.conf /data/server/nginx/conf/ 
3、其他负载方式
## Least connected load balancing
## 原配置
****************************************************
upstream websrv01 {
#    least_conn;
    server 172.16.2.244;
    server 172.16.2.245;
}
 
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
#        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host            $host;
    }
}
****************************************************
 
## ab(Apache HTTP server benchmarking tool)测试
## 备份日志文件
# mv www.loadB.com.log 20151023/
# kill -HUP `cat /data/server/nginx/logs/nginx.pid`
 
## 对proxy做20000次访问测试，同时，在此期间对web01做2000次访问测试
## 在proxy上
# ab -n 20000 -c 100 -X localhost:80 http://www.loadB.com:80/        # 必须要加最后的"/"
## 在web01上
# ab -n 2000 -c 100 localhost/
 
## 结果是两台机器次数基本一致
# cat /data/log/weblog/www.loadB.com.log |cut -d ' ' -f 12 |sort|uniq -c
  10021 172.16.2.244:80
  10019 172.16.2.245:80
 
## 修改配置，采用least_conn负载均衡
****************************************************
upstream websrv01 {
    least_conn;
    server 172.16.2.244;
    server 172.16.2.245;
}
 
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
#        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host            $host;
    }
}
****************************************************
# nginx -t
# nginx -s reload
 
## 每次测试前必须先重新生成空的日志文件
# rm -rf www.loadB.com.log  
# kill -HUP `cat /data/server/nginx/logs/nginx.pid` 
 
## ab测试1
## 对proxy做100000次访问测试，同时，在此期间对web01做20000次访问测试
## 在proxy上
# ab -n 100000 -c 100 -X localhost:80 http://www.loadB.com:80/    
## 在web01上
# ab -n 20000 -c 100 localhost/
 
## proxy日志统计
# cat /data/log/weblog/www.loadB.com.log |cut -d ' ' -f 12 |sort|uniq -c
  49794 172.16.2.244:80
  50259 172.16.2.245:80
## 后来又进行了次数不一的测试，发现在web01也有大量访问的时候，proxy确实会把放在web01上的访问减少一些 
## Session persistence
## 修改配置，采用least_conn负载均衡
****************************************************
upstream websrv01 {
    ip_hash;
    server 172.16.2.244;
    server 172.16.2.245;
}
 
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
#        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host            $host;
    }
}
****************************************************
## proxy访问
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
 
## 使用浏览器访问，会一直显示一个ip返回
 
## 特别需要注意的两点
* 需要解决的一个问题是，如果页面有跳转，web01的主页你登录了以后，跳转到了web02上，而session会话是保存在web01，这样就有一个session在不同主机间如何共享的问题
* 因为是ip做了hash的key，绑定了我们的某一个web_server,这样的情况下，就不能随意的删除主机，而是在要临时停止一台主机的情况下，在该主机后面添加" down"，这样就会把绑定该down掉的主机的请求ip转交给别的web_server去解析 
## Weighted load balancing
## 修改配置，采用least_conn负载均衡
****************************************************
upstream websrv01 {
    server 172.16.2.244 weight=3;
    server 172.16.2.245;
}
 
server {
    listen 80 ;
    server_name www.loadB.com;
    access_log /data/log/weblog/www.loadB.com.log upstream;
 
    location / {
        proxy_pass http://websrv01;
#        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host            $host;
    }
}
****************************************************
## proxy访问
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.245
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.244
# curl -xlocalhost:80 www.loadB.com
FROM: 172.26.2.245
 
## 权重指定了某个服务器访问次数的占比，这个要根据每个服务器具体的运行状态来调整 
## 更多的选项
proxy_next_upstream
指定在什么条件下，转到下个upstream服务器，使用时必须存在upstream和proxy_pass
upstream backends {
......
}
 
server {
......
      location / {
        proxy_pass http://backends;
        proxy_next_upstream error timeout http_404;
    }
}
 
backup
在主要的web server都不可访问的情况下启用加上此标识的服务器
 
down
暂时使增加该标识的服务器不可访问，而且会将ip_hash负载下的，对应此server的ip key转交给其他正常服务器
 
keepalive
正常的http连接，会在传输完成后关闭，而此标识能让连接不关闭一段指定的时长，来增快加载速度

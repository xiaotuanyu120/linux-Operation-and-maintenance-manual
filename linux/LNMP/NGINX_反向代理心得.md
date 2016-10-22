NGINX: 反向代理心得
2016年1月19日
11:22
 
## 环境介绍
A机器:
ip-a.a.a.a
nginx-要代理到B机器
B机器:
ip-b.b.b.b
nginx-需要被A机器代理
 
## 配置文件如下
********************************************
server
{
    listen 80 default_server;
    server_name yibet.cc www.yibet.cc;
    access_log  /web/log/www.yibet.cc.log  access;
 
    location / {
        proxy_pass                       http://b.b.b.b:80;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header Host            $host;
    }
}
********************************************
 
## 现象1
一直返回502错误
## 原因:B机器配置中做了防止直接用ip访问,而我们用ip代理过去,导致了此错误
## 修复：禁止B机器配置防ip直接访问
 
## 现象2
用a.a.a.a访问,一直访问的是nginx欢迎页面
## 原因:A机器请求代理到B机器,按"proxy_set_header Host $host"配置，B机器开始匹配"a.a.a.a"，因为没有配置，则返回default服务器的内容
## 修复：A机器把"proxy_set_header Host $host"临时关闭，B机器在虚拟主机的server_name 中添加"b.b.b.b"

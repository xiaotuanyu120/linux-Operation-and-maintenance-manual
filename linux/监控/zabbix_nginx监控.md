zabbix:nginx监控
2015年12月1日 星期二
16:05
 
NGINX开启状态收集
1、查看nginx编译时是否将状态模块编译
# /usr/local/nginx/sbin/nginx -V
nginx: nginx version: nginx/1.0.0
nginx: TLS SNI support enabled
nginx: configure arguments: --user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
 
2、配置nginx status访问页面
# vim /usr/local/nginx/conf/nginx.conf
************************************
## 放在server{}（server_name localhost）块中
   location ~ /nginx_status {
            stub_status on;
            access_log off;
            allow 127.0.0.1;
            deny all;
   }
***************************************
## 重启服务
# /usr/local/nginx/sbin/nginx -s reload
 
3、访问监控页面
# curl http://127.0.0.1/nginx_status
Active connections: 3491
server accepts handled requests
 1159391 1159391 1262564
Reading: 85 Writing: 3406 Waiting: 0
 
## 状态项详解：
Active connections，活跃连接
server accepts handled requests，
成功处理的连接数，成功创建的握手数，总共处理的请求数
Reading，读取到客户端的Header数
Writing，返回给客户端的Header数
Waiting，驻留连接（在keep-alive开启时，等于active-(reading+writing)
 
## 访问效率很高，请求被很快处理的情况下，waiting数多是正常的，代表了已成功建立起连接，如果reading和writing数比较多，说明并发比较大，正在处理连接请求。
 
4、创建状态收集脚本
# vim nginx_status.sh
***********************************
#!/bin/bash
 
case $1 in
  active)
    curl -s http://127.0.0.1/nginx_status | awk '/Active/ {print $3}' ;;
  accepts)
    curl -s http://127.0.0.1/nginx_status | awk 'NR==3 {print $1}' ;;
  handled)
    curl -s http://127.0.0.1/nginx_status | awk 'NR==3 {print $2}' ;;
  requests)
    curl -s http://127.0.0.1/nginx_status | awk 'NR==3 {print $3}' ;;
  reading)
    curl -s http://127.0.0.1/nginx_status | awk '/Reading/ {print $2}' ;;
  writing)
    curl -s http://127.0.0.1/nginx_status | awk '/Writing/ {print $4}' ;;
  waiting)
    curl -s http://127.0.0.1/nginx_status | awk '/Waiting/ {print $6}' ;;
  *)
    echo "Usage: $0 { active | accepts | handled | requests | reading | writing | waiting }" ;;
esac
*********************************** 
ZABBIX配置
1、添加自定义的key配置文件
# vim /usr/local/zabbix20/etc/zabbix_agentd.conf.d/nginx_status.conf
*****************************************
## Nginx_status
 
UserParameter=nginx.active,/root/sh/nginx_status.sh active
UserParameter=nginx.accepts,/root/sh/nginx_status.sh accepts
UserParameter=nginx.handled,/root/sh/nginx_status.sh handled
UserParameter=nginx.requests,/root/sh/nginx_status.sh requests
UserParameter=nginx.reading,/root/sh/nginx_status.sh reading
UserParameter=nginx.writing,/root/sh/nginx_status.sh writing
UserParameter=nginx.waiting,/root/sh/nginx_status.sh waiting
*****************************************
# vim /usr/local/zabbix20/etc/zabbix_agentd.conf
*****************************************
Include=/usr/local/zabbix20/etc/zabbix_agentd.conf.d/nginx_status.conf
*****************************************
2、重启zabbix_agentd
]# /usr/local/zabbix20/sbin/zabbix_agentd restart

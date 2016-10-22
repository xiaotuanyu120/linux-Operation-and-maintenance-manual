---
title: 隐藏nginx tomcat版本号
date: 2016年6月3日
categories: 14:45
---
 
出于安全，一般会隐藏掉服务器信息和对应的版本,避免攻击者通过当前版本的服务器软件的漏洞进行攻击
隐藏NGINX 信息及版本号
第一步：
vi /usr/local/nginx/conf/nginx.conf
在http{}中加入
server_tokens off;
第二歩：
vi /usr/local/nginx/conf/fastcgi_params
将里面的
fastcgi_param SERVER_SOFTWARE nginx/$nginx_version;
修改为：
fastcgi_param SERVER_SOFTWARE nginx;
隐藏TOMCAT信息及版本号
1. cd apache-tomcat-7.0.59/lib
2. mkdir test
3. cd test
4. jar xf ../catalina.jar
5. vi org/apache/catalina/util/ServerInfo.properties
6. server.info=Tomcat
7. server.number=6
8. server.built=Jan 18 2013 14:51:10 UTC
9. jar cf ../catalina.jar ./*
10. rm -rf test

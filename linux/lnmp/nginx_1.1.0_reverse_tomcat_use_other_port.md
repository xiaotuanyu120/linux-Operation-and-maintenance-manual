---
title: nginx: 1.1.0 nginx反向代理tomcat，使用非80端口
date: 2016-12-14 14:11:00
categories: linux/lnmp
tags: [tomcat,nginx]
---
### nginx: 1.0 nginx反向代理tomcat，使用非80端口

---

### 1. 需求背景 & 遇到的问题
#### 1) 需求：  
nginx给tomcat集群做反向代理，80端口因为特殊原因无法使用，所以使用其他端口代替。  
#### 2) 问题：  
但是发现一个问题是，打开web界面，使用ip访问时，所有的静态网络资源都显示不出来。  
而如果使用域名来访问，则可以显示静态网络资源。
#### 3) 初步分析：
使用chrome查看请求过程，发现静态网络资源访问时，竟然请求的是80端口，而不是我们自定义的端口；  

网上大量查找资料，加上同事的帮助，发现原因是，我们向nginx发送请求，使用的是自定义端口，nginx将请求发送给tomcat，而tomcat在返回其他网络资源给客户端时，它并不知道我们使用了自定义端口，所以默认使用了ip:80端口，而我们的web服务器并没有监听80，所以出现了资源请求失败的情况。  
而之所以域名可以访问静态资源，是因为tomcat返回给客户端时使用的是域名，而域名经过dns解析，获得的是我们自己配置的自定义端口，当然不会出错。  
虽然这样不会影响域名的访问，但是为了开发人员调试方便，还是需要解决它。

---

### 2. 解决办法
#### 1) 方法1(tomcat)
既然此问题出现在tomcat返回给客户端http网络资源时出现问题，当然要从tomcat的配置下手  
- `http`：`$CATALINA_BASE/conf/server.xml`
```
<Connector port="6236" protocol="HTTP/1.1"
               proxyPort="6116"
               ...
               redirectPort="8443" useBodyEncodingForURI="true" URIEncoding="UTF-8" />
```
增加配置`proxyPort`，将其配置为自定义的端口，则tomcat在返回给客户端时，会使用配置的端口，客户端使用这个端口则可正确访问静态网络资源。

- `https`：`$CATALINA_BASE/conf/server.xml`
```
<Connector port="6236" protocol="HTTP/1.1"
               proxyPort="6116"
               sslProtocol='SSL'
               scheme='https'
               ...
               redirectPort="8443" useBodyEncodingForURI="true" URIEncoding="UTF-8" />
```
此处比http增加了`sslProtocol`,`scheme`  

[proxyPort参考配置](http://www.ituring.com.cn/article/48042)  
[https下配置参考](http://stackoverflow.com/questions/3561667/can-i-run-tomcat-securely-on-port-443-and-insecurely-on-8080)

#### 2) 方法2(nginx)
之所以tomcat不知道nginx配置的自定义端口，那也有nginx的部分原因，是因为nginx没有显式的告诉tomcat它使用了什么端口，所以tomcat才会傻傻的去使用默认的80
```
location / {
                proxy_pass http://tomcat;
                index index.jsp index.htm index.html;
                proxy_redirect off;
                proxy_set_header Host $host:$server_port;
                proxy_headers_hash_max_size 51200;
                proxy_headers_hash_bucket_size 6400;
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $http_x_forwarded_for;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
```
将`proxy_set_header Host $host;`改为`proxy_set_header Host $host:$server_port;`

#### 3) 总结
无论是在nginx还是tomcat上去配置，原理都是在request header中的$host后面增加端口号。
- 当我们使用ip来访问的时候
我们使用ip:port访问，request到达tomcat后，tomcat会根据request中的host来返回其他资源的连接给客户端，即返回http://ip:port/something ，所以这时是可以用server_port来解决的
- 当我们使用域名访问的时候
首先来讨论域名的解析，假设一个www.test.com。  
默认情况下，此域名会经由A记录来到一个ip地址，默认的端口是80来进行request；  
但是我们不能使用80，而是在A记录之后指向了一个cdn，cdn指向了源ip:non_80_port，此时request到达tomcat，tomcat根据request中的host为url:non_80_port给客户端，而客户端使用这个去请求时就会出错，因为该域名被解析时，默认的端口是80。而如果我们自己使用fiddler软件去本地解析域名到ip:non_80_port，此时就可成功访问，因为url:non_80_port本来就解析到了正确的端口non_80_port。

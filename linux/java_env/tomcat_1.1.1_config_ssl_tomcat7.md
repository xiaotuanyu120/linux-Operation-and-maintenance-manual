---
title: tomcat 1.1.1 配置-SSL
date: 2017-02-16 10:20:00
categories: linux/java_env
tags: [tomcat,linux]
---
### tomcat 1.1.1 配置-SSL

---

### 0. 简要介绍
- [tomcat6 ssl howto文档](https://tomcat.apache.org/tomcat-6.0-doc/ssl-howto.html)
- [tomcat7 ssl howto文档](https://tomcat.apache.org/tomcat-7.0-doc/ssl-howto.html)
- [tomcat7 apr文档](http://tomcat.apache.org/tomcat-7.0-doc/apr.html)

tomcat6和7在ssl的配置上大同小异，所以使用tomcat同时代替这两个版本进行说明。  

在howto文档中可得到信息，tomcat对ssl有两种实现方式：
- the JSSE implementation provided as part of the Java runtime (since 1.4)
- the APR implementation, which uses the OpenSSL engine by default.

由于apr模式基本上是tomcat优化的标配，在这里我们仅对apr对ssl的配置进行说明，在apr模式下配置ssl时，需要使用以下Connector配置
``` xml
<!-- Define a HTTP/1.1 Connector on port 8443, APR implementation -->
<Connector protocol="org.apache.coyote.http11.Http11AprProtocol"
           port="8443" .../>
```
如果不手动制定apr的protocol，tomcat会自动在两种实现方式中选择，但推荐明确的指定apr的protocol。  

对于证书文件，如果使用JSSE，需要使用keystoreFile和keystorPass，感兴趣的可以查看howto连接，而在apr模式下，需要使用SSLCertificateFile和SSLCertificateKeyFile
``` xml
<!-- Define a SSL Coyote HTTP/1.1 Connector on port 8443 -->
<Connector
           protocol="org.apache.coyote.http11.Http11AprProtocol"
           port="8443" maxThreads="200"
           scheme="https" secure="true" SSLEnabled="true"
           SSLCertificateFile="/usr/local/ssl/server.crt"
           SSLCertificateKeyFile="/usr/local/ssl/server.pem"
           SSLVerifyClient="optional" SSLProtocol="TLSv1+TLSv1.1+TLSv1.2"/>
```
虽然在howto文档中，我们看到key文件使用的是pem格式，但是参照apr文档中对于https配置的介绍，我们也可以使用server.key。

---

### 1. 线上实践实例
综合上述文档，实际使用格式如下
``` xml
<Connector port="443" protocol="org.apache.coyote.http11.Http11AprProtocol"
     maxThreads="32000" SSLEnabled="true" scheme="https" secure="true"
     SSLCertificateFile="${catalina.base}/conf/server.crt"
     SSLCertificateKeyFile="${catalina.base}/conf/server.key" />
```
对于crt，key，pem，jks等证书格式，howto文档中均有介绍，详细生成和获得方式也可以google出很多教程，这里不再涉及

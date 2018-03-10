---
title: error 1.0.0 SSLHandshakeException handshake_failure
date: 2018-03-10 10:02:00
categories: linux/java_env
tags: [linux, java_env, ssl, handshake_failure]
---
### error 1.0.0 SSLHandshakeException handshake_failure

---

### 1. 错误信息
``` java
[ERROR]_2018-03-08 16:31:10 990 : [http-apr-8580-exec-81] \
getHttpContentByBtParam 请求调用异常：
javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure
```

### 2. 解决办法
问题的原因，是https使用的ssl证书没有加到信任列表里面，如果是直接用浏览器访问时，浏览器会提示我们不安全，但是依然会显示页面内容。但是因为是java程序连接，所以直接就提示创建连接失败了。  
这样的解决思路就来到了如何将需要连接的域名的ssl证书增加到受信任列表中，java程序是跑在jvm虚拟机里面，默认是用的是`<java-home>/lib/security/cacerts`。
给jvm增加ssl证书可以参照[microsoft java add certificate](https://docs.microsoft.com/en-us/azure/java-add-certificate-ca-store)
``` bash
# list all certificate
keytool -list -keystore cacerts

# example to add equifaxsecureca
keytool -keystore cacerts -importcert \
  -alias equifaxsecureca \
  -file Equifax_Secure_Certificate_Authority.cer
```

上面的方法之外，还有一种粗暴的解决办法，是直接下载oracle的一种无限制的策略文件到jdk中，来关闭ssl证书白名单限制。
[stackoverflow answer](https://stackoverflow.com/questions/38203971/javax-net-ssl-sslhandshakeexception-received-fatal-alert-handshake-failure)  

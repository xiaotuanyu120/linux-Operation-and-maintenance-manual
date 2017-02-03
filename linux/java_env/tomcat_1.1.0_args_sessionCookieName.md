---
title: tomcat 1.1.0 参数-sessionCookieName
date: 2017-01-25 10:44:00
categories: linux/java_env
tags: [tomcat,linux,sessionCookieName]
---
### tomcat 1.1.0 参数-sessionCookieName

---

### 1. sessionCookieName简介
The name to be used for all session cookies created for this context. If set, this overrides any name set by the web application. If not set, the value specified by the web application, if any, will be used, or the name JSESSIONID if the web application does not explicitly set one.

大意就是这个参数的设定会影响cookie的名称

---

### 2. 设定实例
``` bash
vim $CATALINA_BASE/conf/server.xml
*****************************
<Context path="" docBase="/path/to/yourprojectfolder" debug="0" reloadable="false" sessionCookieName="yourcookieName" />
*****************************
```
> 这样当你在客户端访问时，cookie的名称就会你设定的名称

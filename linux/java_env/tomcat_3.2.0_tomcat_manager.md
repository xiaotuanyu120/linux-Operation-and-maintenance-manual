---
title: tomcat 3.2.0 tomcat manager
date: 2018-03-29 11:04:00
categories: linux/java_env
tags: [linux,tomcat]
---
### tomcat 3.2.0 tomcat manager

---

### 1. tomcat manager是啥？
[tomcat manager](https://tomcat.apache.org/tomcat-7.0-doc/manager-howto.html)可以用来热部署project，也可以用来监控jvm状态，也可以来查看session。详细可以查看tomcat官方文档。

### 2. tomcat manager配置
- `$CATALINA_BASE/conf/[enginename]/[hostname]/manager.xml`, manager的context配置。
```
<Context privileged="true" antiResourceLocking="false"
         docBase="${catalina.home}/webapps/manager">
  <Valve className="org.apache.catalina.valves.RemoteAddrValve"
         allow="127\.0\.0\.1" />
</Context>
```
> allow可以配置成`allow="^.*$"`来允许所有，但是强烈不推荐，有安全问题。  

- `$CATALINA_BASE/conf/tomcat-users.xml`, 授权的tomcat manager用户配置。
```
manager-gui — Access to the HTML interface.
manager-status — Access to the "Server Status" page only.
manager-script — Access to the tools-friendly plain text interface that is described in this document, and to the "Server Status" page.
manager-jmx — Access to JMX proxy interface and to the "Server Status" page.
```
```
<tomcat-users>
<role rolename="manager-script"/>
<role rolename="manager-gui"/>
<user username="tomcat" password="tomcat" roles="manager-script,manager-gui"/>
</tomcat-users>
```
> tomcat有四个roles，一个用户可以分配多个roles

### 3. tomcatmanager python
[tomcatmanager github](https://github.com/tomcatmanager/tomcatmanager)  
我们可以用这个库来使用`manager-script`角色的用户来管理tomcat。原理就是利用了tomcat manager的`/manager/text/<command>[?parameters]`([官方文档](https://tomcat.apache.org/tomcat-7.0-doc/manager-howto.html#Supported_Manager_Commands))

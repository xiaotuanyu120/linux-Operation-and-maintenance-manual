---
title: tomcat 3.2.0 管理-web界面查看tomcat状态
date: 2016-12-05 11:54:00
categories: linux/java_env
tags: [linux,java,tomcat,stat]
---
### tomcat 3.2.0 管理-web界面查看tomcat状态

---

### 1. 如何在web上查看tomcat状态(tomcat6)
`conf/tomcat-users.xml`增加以下内容
``` bash
<role rolename="manager"/>
<user username="admin" password="tomcat" roles="admin,manager"/>
```
重启服务后，访问`http://ip:port/` -> Tomcat Manager -> Server Status

---
title: tomcat 1.1.2 server.xml 配置
date: 2018-03-29 17:11:00
categories: java/tomcat
tags: [tomcat,linux]
---
### tomcat 1.1.2 server.xml 配置

---

### 0. 简要介绍
$CATALINA_HOME/conf/server.xml是tomcat的主要配置文件。  

### 1. server.xml
#### 1) 结构说明
- Server，顶层元素
- Service，包含engine和与engine绑定的connector
- Engine
- Host，虚拟主机

#### 2) Host配置
- appBase，指定部署app的base目录，默认是webapps。
- deployOnStart，设定为true时，在tomcat启动时去启动appBase目录下的app，默认是true。
- autoDeploy，设定为true时，会定期检查app中文件是否被更新过或有新文件，若有更新和新增，则部署它们。用于热部署，默认是true。
- deployXML，设定为true时，会加载应用中的/META-INF/context.xml文件。为了安全，推荐设定为false。当设定为false时，tomcat会去xmlBase下加载独立在app之外的上下文xml文件。默认为true
- xmlBase，上下文xml文件所在目录，默认为conf/<engine_name>/<host_name>。
- deployIgnore，appBase中忽略启动的app，支持正则匹配。
>``` xml
<Host deployIgnore=".*ROOT.*|.*host.*|.*manager.*|.*docs.*|.*example.*" />
```

> 常规情况下，我们可以讲autoDeploy、deployXML、deployOnStart全部设置为false，然后通过增加context元素来手动指定我们需要启动的app路径。  
也可以开启deployOnStart=true，然后用deployIgnore排除掉我们不希望启动的app

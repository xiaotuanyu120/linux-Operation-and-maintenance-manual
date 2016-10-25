jenkins: C6安装
2016年8月11日
16:30
 
---
title: jenkins2.7.2在Centos6安装
date: 2016-08-12 10:45:00
categories: jenkins
tags: [java,jenkins,linux]
---
### jenkins 稳定版安装
``` bash
# 安装jenkins稳定版的源和key
wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
 
# 安装jenkins
yum install jenkins
yum install java-1.8.0-openjdk
```
 
**用jdk1.7.0启动时报错，报错信息如下**
``` bash
Running from: /usr/lib/jenkins/jenkins.war
webroot: $user.home/.jenkins
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog info
INFO: Logging initialized @369ms
Aug 12, 2016 8:40:40 AM winstone.Logger logInternal
INFO: Beginning extraction from war file
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog warn
WARNING: Empty contextPath
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog info
INFO: jetty-9.2.z-SNAPSHOT
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog info
INFO: NO JSP Support for /, did not find org.eclipse.jetty.jsp.JettyJspServlet
Aug 12, 2016 8:40:40 AM hudson.WebAppMain contextInitialized
SEVERE: Failed to initialize Jenkins
java.lang.InternalError
        at sun.security.ec.SunEC.initialize(Native Method)
        at sun.security.ec.SunEC.access$000(SunEC.java:49)
        at sun.security.ec.SunEC$1.run(SunEC.java:61)
        at sun.security.ec.SunEC$1.run(SunEC.java:58)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.ec.SunEC.<clinit>(SunEC.java:58)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
        at java.lang.Class.newInstance(Class.java:383)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:221)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:206)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.jca.ProviderConfig.doLoadProvider(ProviderConfig.java:206)
        at sun.security.jca.ProviderConfig.getProvider(ProviderConfig.java:187)
        at sun.security.jca.ProviderList.loadAll(ProviderList.java:282)
        at sun.security.jca.ProviderList.removeInvalid(ProviderList.java:299)
        at sun.security.jca.Providers.getFullProviderList(Providers.java:173)
        at java.security.Security.removeProvider(Security.java:444)
        at hudson.WebAppMain.contextInitialized(WebAppMain.java:117)
        at org.eclipse.jetty.server.handler.ContextHandler.callContextInitialized(ContextHandler.java:800)
        at org.eclipse.jetty.servlet.ServletContextHandler.callContextInitialized(ServletContextHandler.java:444)
        at org.eclipse.jetty.server.handler.ContextHandler.startContext(ContextHandler.java:791)
        at org.eclipse.jetty.servlet.ServletContextHandler.startContext(ServletContextHandler.java:294)
        at org.eclipse.jetty.webapp.WebAppContext.startWebapp(WebAppContext.java:1349)
        at org.eclipse.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1342)
        at org.eclipse.jetty.server.handler.ContextHandler.doStart(ContextHandler.java:741)
        at org.eclipse.jetty.webapp.WebAppContext.doStart(WebAppContext.java:505)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:132)
        at org.eclipse.jetty.server.Server.start(Server.java:387)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:114)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:61)
        at org.eclipse.jetty.server.Server.doStart(Server.java:354)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at winstone.Launcher.<init>(Launcher.java:152)
        at winstone.Launcher.main(Launcher.java:352)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at Main._main(Main.java:246)
        at Main.main(Main.java:91)
 
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog warn
WARNING: FAILED w.@561b0019{/,file:/root/.jenkins/war/,STARTING}{/root/.jenkins/war}: java.lang.InternalError
java.lang.InternalError
        at sun.security.ec.SunEC.initialize(Native Method)
        at sun.security.ec.SunEC.access$000(SunEC.java:49)
        at sun.security.ec.SunEC$1.run(SunEC.java:61)
        at sun.security.ec.SunEC$1.run(SunEC.java:58)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.ec.SunEC.<clinit>(SunEC.java:58)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
        at java.lang.Class.newInstance(Class.java:383)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:221)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:206)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.jca.ProviderConfig.doLoadProvider(ProviderConfig.java:206)
        at sun.security.jca.ProviderConfig.getProvider(ProviderConfig.java:187)
        at sun.security.jca.ProviderList.loadAll(ProviderList.java:282)
        at sun.security.jca.ProviderList.removeInvalid(ProviderList.java:299)
        at sun.security.jca.Providers.getFullProviderList(Providers.java:173)
        at java.security.Security.removeProvider(Security.java:444)
        at hudson.WebAppMain.contextInitialized(WebAppMain.java:117)
        at org.eclipse.jetty.server.handler.ContextHandler.callContextInitialized(ContextHandler.java:800)
        at org.eclipse.jetty.servlet.ServletContextHandler.callContextInitialized(ServletContextHandler.java:444)
        at org.eclipse.jetty.server.handler.ContextHandler.startContext(ContextHandler.java:791)
        at org.eclipse.jetty.servlet.ServletContextHandler.startContext(ServletContextHandler.java:294)
        at org.eclipse.jetty.webapp.WebAppContext.startWebapp(WebAppContext.java:1349)
        at org.eclipse.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1342)
        at org.eclipse.jetty.server.handler.ContextHandler.doStart(ContextHandler.java:741)
        at org.eclipse.jetty.webapp.WebAppContext.doStart(WebAppContext.java:505)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:132)
        at org.eclipse.jetty.server.Server.start(Server.java:387)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:114)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:61)
        at org.eclipse.jetty.server.Server.doStart(Server.java:354)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at winstone.Launcher.<init>(Launcher.java:152)
        at winstone.Launcher.main(Launcher.java:352)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at Main._main(Main.java:246)
        at Main.main(Main.java:91)
 
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog info
INFO: Started ServerConnector@188553b2{HTTP/1.1}{0.0.0.0:8080}
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog warn
WARNING: FAILED org.eclipse.jetty.server.Server@5939d7b1: java.lang.InternalError
java.lang.InternalError
        at sun.security.ec.SunEC.initialize(Native Method)
        at sun.security.ec.SunEC.access$000(SunEC.java:49)
        at sun.security.ec.SunEC$1.run(SunEC.java:61)
        at sun.security.ec.SunEC$1.run(SunEC.java:58)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.ec.SunEC.<clinit>(SunEC.java:58)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
        at java.lang.Class.newInstance(Class.java:383)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:221)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:206)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.jca.ProviderConfig.doLoadProvider(ProviderConfig.java:206)
        at sun.security.jca.ProviderConfig.getProvider(ProviderConfig.java:187)
        at sun.security.jca.ProviderList.loadAll(ProviderList.java:282)
        at sun.security.jca.ProviderList.removeInvalid(ProviderList.java:299)
        at sun.security.jca.Providers.getFullProviderList(Providers.java:173)
        at java.security.Security.removeProvider(Security.java:444)
        at hudson.WebAppMain.contextInitialized(WebAppMain.java:117)
        at org.eclipse.jetty.server.handler.ContextHandler.callContextInitialized(ContextHandler.java:800)
        at org.eclipse.jetty.servlet.ServletContextHandler.callContextInitialized(ServletContextHandler.java:444)
        at org.eclipse.jetty.server.handler.ContextHandler.startContext(ContextHandler.java:791)
        at org.eclipse.jetty.servlet.ServletContextHandler.startContext(ServletContextHandler.java:294)
        at org.eclipse.jetty.webapp.WebAppContext.startWebapp(WebAppContext.java:1349)
        at org.eclipse.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1342)
        at org.eclipse.jetty.server.handler.ContextHandler.doStart(ContextHandler.java:741)
        at org.eclipse.jetty.webapp.WebAppContext.doStart(WebAppContext.java:505)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:132)
        at org.eclipse.jetty.server.Server.start(Server.java:387)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:114)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:61)
        at org.eclipse.jetty.server.Server.doStart(Server.java:354)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at winstone.Launcher.<init>(Launcher.java:152)
        at winstone.Launcher.main(Launcher.java:352)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at Main._main(Main.java:246)
        at Main.main(Main.java:91)
 
Aug 12, 2016 8:40:40 AM org.eclipse.jetty.util.log.JavaUtilLog info
INFO: Stopped ServerConnector@188553b2{HTTP/1.1}{0.0.0.0:8080}
Aug 12, 2016 8:40:40 AM winstone.Logger logInternal
INFO: Winstone shutdown successfully
Aug 12, 2016 8:40:40 AM winstone.Logger logInternal
SEVERE: Container startup failed
java.lang.InternalError
        at sun.security.ec.SunEC.initialize(Native Method)
        at sun.security.ec.SunEC.access$000(SunEC.java:49)
        at sun.security.ec.SunEC$1.run(SunEC.java:61)
        at sun.security.ec.SunEC$1.run(SunEC.java:58)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.ec.SunEC.<clinit>(SunEC.java:58)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
        at java.lang.Class.newInstance(Class.java:383)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:221)
        at sun.security.jca.ProviderConfig$2.run(ProviderConfig.java:206)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.security.jca.ProviderConfig.doLoadProvider(ProviderConfig.java:206)
        at sun.security.jca.ProviderConfig.getProvider(ProviderConfig.java:187)
        at sun.security.jca.ProviderList.loadAll(ProviderList.java:282)
        at sun.security.jca.ProviderList.removeInvalid(ProviderList.java:299)
        at sun.security.jca.Providers.getFullProviderList(Providers.java:173)
        at java.security.Security.removeProvider(Security.java:444)
        at hudson.WebAppMain.contextInitialized(WebAppMain.java:117)
        at org.eclipse.jetty.server.handler.ContextHandler.callContextInitialized(ContextHandler.java:800)
        at org.eclipse.jetty.servlet.ServletContextHandler.callContextInitialized(ServletContextHandler.java:444)
        at org.eclipse.jetty.server.handler.ContextHandler.startContext(ContextHandler.java:791)
        at org.eclipse.jetty.servlet.ServletContextHandler.startContext(ServletContextHandler.java:294)
        at org.eclipse.jetty.webapp.WebAppContext.startWebapp(WebAppContext.java:1349)
        at org.eclipse.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1342)
        at org.eclipse.jetty.server.handler.ContextHandler.doStart(ContextHandler.java:741)
        at org.eclipse.jetty.webapp.WebAppContext.doStart(WebAppContext.java:505)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:132)
        at org.eclipse.jetty.server.Server.start(Server.java:387)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:114)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:61)
        at org.eclipse.jetty.server.Server.doStart(Server.java:354)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at winstone.Launcher.<init>(Launcher.java:152)
        at winstone.Launcher.main(Launcher.java:352)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at Main._main(Main.java:246)
        at Main.main(Main.java:91)
```
 
### apache安装与配置
**安装httpd2.2**
``` bash
yum install httpd
```
**配置httpd**
 
``` bash
# 主配文件，配置
vim /etc/httpd/conf/httpd.conf
**********************************
# 确保下列proxy模块被加载
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule proxy_ftp_module modules/mod_proxy_ftp.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
LoadModule proxy_connect_module modules/mod_proxy_connect.so
...
 
# 确保主配文件包含了虚拟主机配置目录
Include conf.d/*.conf
**********************************
 
# 创建虚拟主机文件
vim /etc/httpd/conf.d/jenkins.conf
**********************************
<VirtualHost *:80>
    ServerName demo.jenkins.com
    ProxyRequests Off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    ProxyPreserveHost on
    ProxyPass / http://127.0.0.1:8080/
</VirtualHost>
# 注意"http://127.0.0.1:8080/"要写全，最开始写成"http://127.0.0.1:8080"报错
**********************************
```
 
**重启httpd服务**
``` bash
service httpd restart
```
> 注意检查报错信息，做出相应修改
 
### jenkins配置
``` bash
# 配置jenkins只监听本机ip
vim /etc/sysconfig/jenkins
**********************************
JENKINS_LISTEN_ADDRESS="127.0.0.1"
**********************************
 
# 重启jenkins
service jenkins restart
```
 
### 访问测试
- 修改本机的hosts文件，"10.10.180.11 demo.jenkins.com"，来本机解析测试域名
- web浏览器访问"demo.jenkins.com"
- 按照提示找到默认密码，并记得登录后修改它
``` bash
cat /var/lib/jenkins/secrets/initialAdminPassword
4506575e41914f5791dafac528dff1b5
```

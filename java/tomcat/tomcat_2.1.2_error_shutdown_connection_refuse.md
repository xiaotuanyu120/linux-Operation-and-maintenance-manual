---
title: tomcat 2.1.2 问题-tomcat7 shutdown 提示 connection refused
date: 2018-08-03 15:47:00
categories: java/tomcat
tags: [linux,java_env,tomcat,iptables]
---
### tomcat 2.1.2 问题-tomcat7 shutdown 提示 connection refused

---

### 0. 前言
给开发搭建测试环境，软件版本如下：
- jdk: 7u99
- tomcat: 7.0.90
    - shutdown port: 7081
    - connector port: 7080
- os: centos 7.4

发现一个特别奇怪的问题，tomcat启动后，使用shutdown.sh或者catalina.sh stop无法关闭tomcat

---

### 1. 问题描述
错误日志
```
Using CATALINA_BASE:   /home/paycallback/pcb7080
Using CATALINA_HOME:   /home/paycallback/pcb7080
Using CATALINA_TMPDIR: /home/paycallback/pcb7080/temp
Using JRE_HOME:        /usr/java/jdk1.7.0_79/jre
Using CLASSPATH:       /home/paycallback/pcb7080/bin/bootstrap.jar:/home/paycallback/pcb7080/bin/tomcat-juli.jar
Aug 03, 2018 3:43:00 PM org.apache.catalina.startup.Catalina stopServer
SEVERE: Could not contact localhost:7180. Tomcat may not be running.
Aug 03, 2018 3:43:00 PM org.apache.catalina.startup.Catalina stopServer
SEVERE: Catalina.stop: 
java.net.ConnectException: Connection refused
	at java.net.PlainSocketImpl.socketConnect(Native Method)
	at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:339)
	at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:200)
	at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:182)
	at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
	at java.net.Socket.connect(Socket.java:579)
	at java.net.Socket.connect(Socket.java:528)
	at java.net.Socket.<init>(Socket.java:425)
	at java.net.Socket.<init>(Socket.java:208)
	at org.apache.catalina.startup.Catalina.stopServer(Catalina.java:505)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:606)
	at org.apache.catalina.startup.Bootstrap.stopServer(Bootstrap.java:343)
	at org.apache.catalina.startup.Bootstrap.main(Bootstrap.java:430)
```

### 2. 尝试解决思路
- 查看进程和监听端口，发现进程正常启动，端口也正常在监听。
- 尝试使用telnet测试shutdown端口，发现telnet命令不存在，结果使用yum安装telnet时发现无法安装，提示连接yum源无法解析。于是顺着思路怀疑是dns问题，替换了多个dns无法解决问题。结果就是这里，在错误的路上越走越远。

### 3. 解决办法和原因分析
发现折腾dns半天搞不定，就怀疑是不是阿里云的安全组防火墙有问题，结果关闭了一下防火墙，发现立刻就能shutdown了。仔细看了一下防火墙规则，发现了失误之处
```
# Firewall configuration written by system-config-firewall
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
# -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# -A INPUT -p icmp -j ACCEPT
# -A INPUT -i lo -j ACCEPT

...

-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```
原来问题出现在防火墙规则上，本来上面五条规则是匹配在一起使用的，如果要禁用要全部禁用，如果要启用要一起启用，结果我看到后面两条被禁用，觉得不安全就给启用了，导致了这个问题。


详细分析一下那五条iptables规则
- ` -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT`，INPUT的连接状态的tcp全部通过
- ` -A INPUT -p icmp -j ACCEPT`，ping包全部通过
- ` -A INPUT -i lo -j ACCEPT`，lo网卡的全部通过
- `-A INPUT -j REJECT --reject-with icmp-host-prohibited`， INPUT全部拒绝，同时拒绝ping
- `-A FORWARD -j REJECT --reject-with icmp-host-prohibited`，FORWARD全部拒绝，同事拒绝转发ping

详细原因就是因为lo那条，tomcat是通过localhost去连接7080端口，结果我们没让它通行，所以才会报connection refused。

**总结**
其实还有一些其他原因会导致这个，比如说shutdown端口没有监听（tomcat进程没有正常启动）等。 还是要具体问题具体分析
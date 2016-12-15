---
title: tomcat: 1.1.0 tomcat9安装配置
date: 2016-01-07 21:35:00
categories: linux/java_env
tags: [tomcat]
---
### 1.1.0 tomcat9安装配置

---

### 0. 版本的选择
http://tomcat.apache.org/whichversion.html
## 有关版本的介绍，每个tomcat版本对应什么java版本可在上面链接中查看1、安装tomcat 9
1）下载、安装tomcat9
# wget http://www.eu.apache.org/dist/tomcat/tomcat-9/v9.0.0.M1/bin/apache-tomcat-9.0.0.M1.tar.gz
# tar zxvf apache-tomcat-9.0.0.M1.tar.gz
# mv /usr/local/src/apache-tomcat-9.0.0.M1 /usr/local/tomcat9

## 拷贝并编辑启动脚本
# cp -pv /usr/local/tomcat9/bin/catalina.sh /etc/init.d/tomcat
# vi /etc/init.d/tomcat
**************************************
# chkconfig: 2345 63 37          #注意chkconfig后面的":"，忘记的话会提示不支持chkconfig
# description: tomcat server init script
# Source Function Library
. /etc/init.d/functions
JAVA_HOME=/usr/local/jdk1.8.0_66
CATALINA_HOME=/usr/local/tomcat9
**************************************

## 设置tomcat服务开机启动
# chmod 755 /etc/init.d/tomcat
# chkconfig --add tomcat
# chkconfig tomcat on
# service tomcat start
Using CATALINA_BASE:   /usr/local/tomcat9
Using CATALINA_HOME:   /usr/local/tomcat9
Using CATALINA_TMPDIR: /usr/local/tomcat9/temp
Using JRE_HOME:        /usr/local/jdk1.8.0_66
Using CLASSPATH:       /usr/local/tomcat9/bin/bootstrap.jar:/usr/local/tomcat9/bin/tomcat-juli.jar
Tomcat started.

## 编辑iptables防火墙，放行8080端口
# vim /etc/sysconfig/iptables
**************************************
在"-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT"下添加
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
**************************************
# service iptables restart
2、查看状态
## 查看tomcat进程
# ps aux |grep tomcat
root       2403  0.6 12.3 2741832 124128 pts/2  Sl   08:45   0:08 /usr/local/jdk1.8.0_66/bin/java -Djava.util.logging.config.file=/usr/local/tomcat9/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -classpath /usr/local/tomcat9/bin/bootstrap.jar:/usr/local/tomcat9/bin/tomcat-juli.jar -Dcatalina.base=/usr/local/tomcat9 -Dcatalina.home=/usr/local/tomcat9 -Djava.io.tmpdir=/usr/local/tomcat9/temp org.apache.catalina.startup.Bootstrap start

## 查看tomcat监听端口
# netstat -lnpt |grep java
tcp        0      0 ::ffff:127.0.0.1:8005       :::*                        LISTEN      2403/java
tcp        0      0 :::8009                     :::*                        LISTEN      2403/java
tcp        0      0 :::8080                     :::*                        LISTEN      2403/java
## 端口简介
## server.xml中配置
8005，用于shutdown tomcat服务
8009，用于listen ajp的port
（The Apache JServ Protocol (AJP) is a binary protocol that can proxy inbound requests from a web server through to an application server that sits behind the web server.）
8080，用于web访问的port

## 网络访问8080端口效果


3、配置简介
1）可通过CATALINA_HOME和CATALINA_BASE来实现MULTIPLE INSTANCE的效果
CATALINA_HOME指定tomcat安装目录，主要包括bin,lib
CATALINA_BASE指定instance目录，主要需要拷贝conf,lib,logs,webapps,work,temp
CLASSPATH变量可指定以上两个变量的lib，系统会优先查找CATALINA_BASE的
2）官方推荐多instance的时候，lib最好是独立的
3）所有配置的详解，最好查看tomcat官方网站，都会有详细的讲解
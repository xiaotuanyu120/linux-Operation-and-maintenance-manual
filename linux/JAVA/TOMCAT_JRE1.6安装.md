TOMCAT: JRE1.6安装
2016年9月27日
11:40
 
---
title: JRE1.6安装
date: 2016-09-27 11:42:00
categories: java
tags: [java,jre]
---
### 下载并安装jre1.6
需要注册oracle帐号才能在下面下载
http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html
 
### 安装jre1.6
``` bash
chmod u+x jre-6u45-linux-x64.bin
sh jre-6u45-linux-x64.bin
mv jre1.6.0_45 /usr/local/
ln -s /usr/local/jre1.6.0_45/ /usr/local/jdk
 
### 初始化java环境
``` bash
vi /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
source /etc/profile.d/java-env.sh
```

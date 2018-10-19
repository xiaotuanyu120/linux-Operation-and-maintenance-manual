---
title: tomcat 2.1.0 问题-tomcat7启动速度慢
date: 2017-02-06 14:28:00
categories: java/tomcat
tags: [linux,java_env,tomcat]
---
### tomcat 2.1.0 问题-tomcat7启动速度慢

---

### 1. 问题现象
目前公司线上大部分依旧使用tomcat6，有一个新项目使用了tomcat7，发现每次重启该tomcat，启动速度都很不理想。于是仔细观察tomcat启动日志，发现主要明显卡顿在此处  
`<DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.`  
于是google了一下，在tomcat的wiki上发现了此问题的[原因和解决办法](https://wiki.apache.org/tomcat/HowTo/FasterStartUp#Entropy_Source)

---

### 2. 原因
serverlet 3.0带来了几个"plugability features"，带来了好处的同时，付出的代价是，会在启动时扫描JAR和类文件。具体信息可以查看上面wiki链接中的信息，简要来讲，就是tomcat7+版本每次启动时，都会默认去扫描一系列的文件并解析它们，这样就造成了严重的启动延时，而wiki中给了我们一系列的普通解决办法，包括删除没必要的jar文件，跳过jar文件，按照自身情况禁用websocket等，但下面的解决办法，是wiki作者重点推荐的

---

### 3. 解决办法
配置JRE，使其可以使用不堵塞的方式来扫描文件
``` bash
# 设定java属性
-Djava.security.egd=file:/dev/./urandom
```
> 需要严格按照上面的配置进行设定，详细介绍看wiki中的介绍

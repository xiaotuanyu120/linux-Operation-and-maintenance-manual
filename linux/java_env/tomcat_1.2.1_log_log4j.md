---
title: tomcat 1.2.1 日志-log4j配置相对路径
date: 2017-02-03 17:24:00
categories: linux/java_env
tags: [linux,tomcat,log4j]
---
### tomcat 1.2.1 日志-log4j配置相对路径

---

### 0. 什么是log4j？
[tomcat6中的log文档](https://tomcat.apache.org/tomcat-6.0-doc/logging.html)
log4j其实就是一个基于java的日志记录工具。

---

### 1. 遇到的问题
巡检服务器，发现根目录下多了大量日志/logs/some.logs  

---

### 2. 分析过程
于是使用lsof分析，发现竟然是新部署的一个tomcat在使用。  
于是去查看了tomcat的$CATALINA_BASE/conf/logging.properties和$CATALINA_BASE/bin/catalina.sh中的CATALINA_OUT配置，发现都是默认配置  而且/logs中的日志名称也不是catalina相关。

于是，分析可能是采用其他日志工具记录的日志，前去代码目录下的WEB-INF/classes/查看，果然有log4j的配置文件log4j.properties，查看文件内容，重点关注日志文件path配置，找到了相关配置为"log4j.appender.A1.File=../logs/some.log"  
看来开发者的本意是要将logs放在CATALINA_BASE的上级目录的logs目录中，但是显然这样配置出了问题。于是去查询了一下官方的[示例配置](https://tomcat.apache.org/tomcat-6.0-doc/logging.html)，发现示例配置中对于相对路径的日志配置有这样一段"log4j.appender.LOCALHOST.File=${catalina.base}/logs/localhost."  

---

### 3. 解决办法
修改log4j.properties中`log4j.appender.A1.File=../logs/some.log`为`log4j.appender.A1.File=${catalina.base}/../logs/some.log`

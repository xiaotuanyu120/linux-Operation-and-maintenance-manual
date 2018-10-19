---
title: tomcat 1.2.2 日志-JULI日志级别
date: 2016-11-04 11:24:00
categories: java/tomcat
tags: [linux,java,tomcat6,loglevel]
---
### tomcat 1.2.2 日志-日志级别

---

### 1. tomcat6中的日志库种类
tomcat6可以使用三种日志库-[参考连接](http://tomcat.apache.org/tomcat-6.0-doc/logging.html)
- system logging API, java.util.logging
- Java Servlets specification提供的logging API, javax.servlet.ServletContext.log(...)
- 使用第三方的日志框架  

---

### 2. 默认的日志库
#### 1) 默认策略
系统JDK中提供的默认的java.util.logging功能很有限制，所以tomcat默认采用自己的java.util.logging，名称为JULI，代替了JDK中的日志库。  

#### 2) 配置文件指引
JULI默认情况下是启动的，除了全局的java.util.logging外，还支持classloader级别的配置。这意味着tomcat可以在以下几个层面进行配置：
- 全局配置，配置文件<code>${catalina.base}/conf/logging.properties</code>。由启动脚本中的<code>java.util.logging.config.file</code>配置，若没有此配置，或者该文件不可读，则采用系统JRE中的<code>${java.home}/lib/logging.properties</code>文件。
- 在web应用中，配置文件是<code>WEB-INF/classes/logging.properties</code>。

#### 3) 日志级别
默认：INFO  
其他：SEVERE, WARNING, INFO, CONFIG, FINE, FINER, FINEST, ALL

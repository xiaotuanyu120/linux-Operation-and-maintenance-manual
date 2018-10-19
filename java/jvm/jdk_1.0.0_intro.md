---
title: jdk: 1.0.0 jdk简介
date: 2016-01-07 21:35:00
categories: java/jvm
tags: [jdk]
---
### 1.0.0 jdk简介

---

### 0. 什么是JDK？
Java Development Kit（JDK）是SUN针对Java开发人员发布的免费软件开发工具包（SDK，Software development kit）。自从Java推出以来，JDK已经成为使用最广泛的Java SDK。由于JDK的一部分特性采用商业许可证，而非开源。因此，2006年SUN宣布将发布基于GPL的开源JDK，使JDK成为自由软件。在去掉了少量闭源特性之后，SUN最终促成了GPL的OpenJDK的发布。

---

### 1. 什么是JRE？
JRE：java standard edition runtime environment  
适用于服务器或者单纯用来提供java运行程序环境

---

### 2. "jdk" vs "server jre" vs "jre"
- jdk包含jre
- server jre适合长时间运行的服务器环境
- jre适合客户端用户，可快速启动java程序

---

### 3. java环境变量
- JAVA_HOME, jdk家目录
- JRE_HOME, jre目录，一般在`$JAVA_HOME/jre`
- CLASSPATH, 用户定义的类和包所在的目录，一般在`$JAVA_HOME/lib:$JRE_HOME/lib`

---

### 4. 查看java环境版本
``` bash
java -version
java version "1.8.0_66"
Java(TM) SE Runtime Environment (build 1.8.0_66-b17)
Java HotSpot(TM) 64-Bit Server VM (build 25.66-b17, mixed mode)```

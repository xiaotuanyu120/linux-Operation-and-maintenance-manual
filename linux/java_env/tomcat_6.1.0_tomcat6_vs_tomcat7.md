---
title: tomcat 6.1.0 tomcat6 和 tomcat7的简要区别
date: 2017-02-14 15:30:00
categories: linux/java_env
tags: [linux,tomcat]
---
### tomcat 6.1.0 tomcat6 和 tomcat7的简要区别

---

### 0. 什么是[tomcat](http://tomcat.apache.org/whichversion.html)？
Apache tomcat 是Java Servlet和JavaServerPages技术的开源实现，按照Sun提供的技术规范，实现了对前两种技术的支持，并提供了web服务器的功能。所以，tomcat既是一个servlet容器，又同时是一个web服务器。  

两种技术简要介绍如下：
- [Servlet](https://zh.wikipedia.org/wiki/Java_Servlet)  
是用Java编写的服务器端程序。其主要功能在于交互式地浏览和修改数据，生成动态Web内容。
- [JavaServerPage](https://zh.wikipedia.org/wiki/JSP)  
是由Sun Microsystems公司倡导和许多公司参与共同创建的一种使软件开发者可以响应客户端请求，而动态生成HTML、XML或其他格式文档的Web网页的技术标准。

---

### 1. Apache Tomcat 6.x
tomcat6在tomcat5.5的基础上发布，实现了Servlet2.5和JSP2.1规范，另外还有以下新特性：
- Memory usage optimizations，内存用量优化
- Advanced IO capabilities，高级IO功能
- Refactored clustering
但是目前tomcat6已经不在被官方支持，官方推荐升级为tomcat7或之后版本

---

### 2. Apache Tomcat 7.x
tomcat7是在tomcat6基础上发布，实现了Servlet3.0，JSP2.2，EL2.2和WebSocket1.1规范，另外还有以下新特性：
- Web application memory leak detection and prevention
- Improved security for the Manager and Host Manager applications
- Generic CSRF protection
- Support for including external content directly in a web application
- Refactoring (connectors, lifecycle) and lots of internal code clean-up

PS:
Servlet3.0的重要变化，Pluggability, Ease of development, Async Servlet, Security, File Uploading

---

### 3. 简要总结
tomcat7相对于tomcat6，增加了安全性，而且如果不考虑WebSocket的情况下，同时可选用jdk6和jdk7。  
目前了解到的tomcat7的新特性对部署造成的困扰，主要是因为安全性的增强，tomcat7中加强了随机数的获取，有时候会导致启动过慢，另外tomcat6下的代码在7下，并不能100%兼容(不是开发，无法深入的解读)。其他的以后遇到会持续更新

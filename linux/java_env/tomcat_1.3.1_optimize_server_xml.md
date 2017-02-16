---
title: tomcat 1.3.1 优化-server.xml
date: 2017-02-15 14:18:00
categories: linux/java_env
tags: [linux,java_env,tomcat]
---
### tomcat 1.3.1 优化-server.xml

---

###
Connector配置
- MaxSpareThreads，tomcat6及之后，已经移除
- enableLookups，设定为false，跳过对hostname的反解析，默认是false
- acceptCount，默认为100，当所有的线程在使用中，排队的队列长度，超过这个长度的请求会被直接拒绝

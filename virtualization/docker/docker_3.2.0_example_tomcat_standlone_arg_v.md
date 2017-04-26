---
title: 3.2.0 tomcat使用-v参数挂载本地代码和日志目录
date: 2017-04-26 15:16:00
categories: virtualization/docker
tags: [docker,tomcat]
---
### 0. 目标
个人对container的理解是，container是无状态的，container的销毁和重建成本很低，基于此认识，希望在tomcat的container上实现tomcat程序和java代码及日志的分离

目标：
1. 代码和tomcat容器分离
2. 日志和tomcat容器分离

---

### 1. tomcat容器实现代码、日志和容器分离
#### 1) 构建tomcat容器
``` bash
# 构建目录
tree tomcatnew
tomcatnew
├── Dockerfile
└── entrypoint.sh

0 directories, 2 files

# Dockerfile内容
cat tomcatnew/Dockerfile
**************************************************
FROM tomcat:7.0.75-jre7

COPY entrypoint.sh /usr/local/tomcat/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/tomcat/bin/entrypoint.sh"]
**************************************************

# entrypoint.sh内容
**************************************************
#!/bin/bash

/usr/local/tomcat/bin/catalina.sh start && tail -f /usr/local/tomcat/logs/catalina.out
**************************************************

# 构建tomcat7容器
cd tomcatnew
docker build -t tomcat7:new .
```
> 曾经试过使用tomcat官方的标准容器启动，启动命令为"catalina.sh run"，然后出现一个问题是挂载的日志目录正常，但是唯独缺少最重要的catalina.out日志

#### 2) 启动tomcat7容器
``` bash
# 启动tomcat7容器
docker run -itd -p 8000:8080 -v /root/tomcat-test/logs:/usr/local/tomcat/logs:rw -v /root/tomcat-test/ROOT/:/usr/local/tomcat/webapps/ROOT tomcat7:new
# /root/tomcat-test/ROOT是本地的代码目录

# 查看日志目录
ls /root/tomcat-test/logs/
catalina.2017-04-25.log  host-manager.2017-04-25.log  localhost_access_log.2017-04-25.txt
catalina.out             localhost.2017-04-25.log     manager.2017-04-25.log
```
> 此处只是展示的一个tomcat容器下的日志解决方案，多个tomcat时，还是把日志输出到统一的一台日志处理机器上更方便

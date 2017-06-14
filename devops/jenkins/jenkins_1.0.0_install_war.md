---
title: jenkins: 1.0.0 安装
date: 2016-08-12 10:45:00
categories: devops/jenkins
tags: [java,jenkins,linux]
---
### jenkins: 1.0.0 安装

---

### 1. jenkins源码安装
#### 0) JDK环境
[JDK8下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
``` bash
tar zxf jdk-8u131-linux-x64.tar.gz
mv jdk1.8.0_131 /usr/local/
ln -s /usr/local/jdk1.8.0_131 /usr/local/jdk

vim /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
source /etc/profile.d/java-env.sh
```
> 推荐jdk8

#### 1) 下载jenkins
``` bash
# 下载jenkins
wget http://ftp.yz.yamagata-u.ac.jp/pub/misc/jenkins/war-stable/2.46.3/jenkins.war
```
> 下载下来的是war包，也就是说我们只需要使用java容器来加载启动就可以了

#### 2) 部署tomcat
``` bash
wget http://mirror.rise.ph/apache/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.tar.gz
tar zxf apache-tomcat-8.5.15.tar.gz
mv apache-tomcat-8.5.15 /usr/local/tomcat8
```

#### 3) 启动jenkins
``` bash
# 将jenkins放入到tomcat托管
mv jenkins.war /usr/local/tomcat8/webapps/

# 启动jenkins
/usr/local/tomcat8/bin/startup.sh
```
> 访问http://ip:8080/jenkins，输入/root/.jenkins/secrets/initialAdminPassword中保存的临时密码，就可以正常访问jenkins了

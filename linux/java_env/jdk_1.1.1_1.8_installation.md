---
title: jdk: 1.1.1 jdk1.8安装
date: 2016-01-07 21:35:00
categories: linux/java_env
tags: [jdk]
---
### 1.1.1 jdk1.8安装

---
### 1. 下载并安装jre1.8
[jdk1.8下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

---

### 2. 安装JAVA环境
#### 1) 安装
``` bash
tar zxvf server-jdk-8u66-linux-x64.tar.gz
mv jdk1.8.0_66/ /usr/local/
ln -s /usr/local/jdk1.8.0_102 /usr/local/jdk
```
#### 2) 配置java环境变量
``` bash
vim /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
source /etc/profile.d/java-env.sh
```

---
title: 2.1.1 镜像-查找与下载镜像
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 2.1.1 镜像-查找与下载镜像

---

### 1. 搜索镜像
``` bash
docker search tomcat
NAME                           DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
tomcat                         Apache Tomcat is an open source implementa...   1193      [OK]
dordoka/tomcat                 Ubuntu 14.04, Oracle JDK 8 and Tomcat 8 ba...   31                   [OK]
davidcaste/alpine-tomcat       Apache Tomcat 7/8 using Oracle Java 7/8 wi...   15                   [OK]
cloudesire/tomcat              Tomcat server, 6/7/8                            12                   [OK]
andreptb/tomcat                Debian Jessie based image with Apache Tomc...   6                    [OK]
openweb/oracle-tomcat          A fork off of Official tomcat image with O...   5                    [OK]
fbrx/tomcat                    Minimal Tomcat image based on Alpine Linux      4                    [OK]
...
```
> 字段介绍：
- NAME             名称
- DESCRIPTION      描述
- STARS            星星（好评度）
- OFFICIAL         是否官方版本
- AUTOMATED        是否自动创建
>我们可以看到最高好评度的就是官方创建的official版本
---

### 2. 获取镜像
``` bash
# 获取默认镜像
docker pull tomcat
Using default tag: latest
latest: Pulling from library/tomcat
5040bd298390: Pull complete
fce5728aad85: Pull complete
c42794440453: Pull complete
9789263043d1: Pull complete
6c6ea13aad15: Pull complete
55336e5423a8: Pull complete
b278bc2055e9: Pull complete
53161d17f4ce: Pull complete
f0f5041f1011: Pull complete
25928c7caaa1: Pull complete
cfed2024bbdf: Pull complete
Digest: sha256:0fb173e213111be292962336777a134d43f59c1b8cc2da3cbaaf6308ee7a490a
Status: Downloaded newer image for tomcat:latest

# 指定tag获取镜像
docker pull tomcat:7.0.75-jre7-alpine
7.0.75-jre7-alpine: Pulling from library/tomcat
b7f33cc0b48e: Pull complete
43a564ae36a3: Pull complete
93e4c3809f11: Pull complete
f994fbfa33b2: Pull complete
8bc378fa6428: Pull complete
569f0d7875b5: Pull complete
1c8ddc5ce010: Pull complete
7709f7014e0d: Pull complete
Digest: sha256:ff39d0b3dd5f445cf3fbb600740d09ae2fe86b1fbd6c3a6285de2c8702e4db13
Status: Downloaded newer image for tomcat:7.0.75-jre7-alpine
```
> docker的image是分layer的，我们可以看到下载的时候，是分layer下载的，layer是由AUFS文件系统支撑的  
TAG可以指定版本  
docker pull 语法：
- `docker pull [参数] [仓库地址[:端口]/]名称[:TAG]`  
- `docker pull 名称`

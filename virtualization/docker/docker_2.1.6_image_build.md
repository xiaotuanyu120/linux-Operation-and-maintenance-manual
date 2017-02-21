---
title: 2.1.6 镜像-build 镜像
date: 2017-02-21 15:38:00
categories: virtualization/docker
tags: [docker,image]
---
### 2.1.6 镜像-build 镜像

---

### 0. 目标
假设已经安装docker，从零开始build一个tomcat应用镜像  
其中最重要的地方是dockerfile的语法和编写。

---

### 1. dockerfile
dockerfile是一个脚本，其中包含了多种命令及参数，用以在基础image之上进行修改并创建新的image。  
具体的语法和介绍，见[dockerfile官方文档](https://docs.docker.com/engine/reference/builder/)
``` bash
mkdir tomcat7
cd tomcat7
touch Dockerfile
vim Dockerfile
*****************************
From tomcat:7.0.75-jre7
MAINTAINER zack

ADD index.txt /usr/local/tomcat/webapps/ROOT
*****************************

echo "hello world" > index.txt
```

---

### 2. build image
``` bash
docker build -t tomcat7:test .
Sending build context to Docker daemon 3.072 kB
Step 1/3 : FROM tomcat:7.0.75-jre7
7.0.75-jre7: Pulling from library/tomcat
5040bd298390: Pull complete
fce5728aad85: Pull complete
c42794440453: Pull complete
9789263043d1: Pull complete
6c6ea13aad15: Pull complete
55336e5423a8: Pull complete
228d33a53bdd: Pull complete
3a1cfabb401c: Pull complete
b5f79327b275: Pull complete
9af156814a79: Pull complete
b746aa8b2a6c: Pull complete
Digest: sha256:f13fb03f10b5b549a0aedc8bfbfe9b416024e34a9394d58dfc96f62b01ace2fd
Status: Downloaded newer image for tomcat:7.0.75-jre7
 ---> ba0a180b4eb7
Step 2/3 : MAINTAINER zack
 ---> Running in 339e4f80147f
 ---> a48246d3100f
Removing intermediate container 339e4f80147f
Step 3/3 : ADD index.txt /usr/local/tomcat/webapps/ROOT/
 ---> 1689dc190a0c
Removing intermediate container 487da4842a09
Successfully built 1689dc190a0c
```

---

### 3. 运行测试
``` bash
docker run -itd --rm -p 8000:8080 tomcat7:test

# 查看结果
curl 192.168.33.110:8000/index.txt
hello world
```

---
title: 4.2.0 在docker中运行jenkins
date: 2018-01-27 10:53:00
categories: virtualization/docker
tags: [docker,jenkins]
---
### 4.2.0 在docker中运行jenkins

---

### 0. 环境
安装docker和docker-compose肯定是必备环境，这里会使用docker-compose来启动一个nginx和一个jenkins，link在一起提供服务  
[run jenkins in container](https://github.com/jenkinsci/docker/blob/master/README.md)  
[jenkins image on docker hub](https://hub.docker.com/r/jenkins/jenkins/)

---

### 1. 准备文件
准备文件目录结构
``` bash
mkdir -p /data/docker/nginx
```
nginx 文件准备
``` bash
echo 'FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/conf.d/' > /data/docker/nginx/Dockerfile

echo '# Configuration for the server
server {
    charset utf-8;
    listen 80;
    location / {
        proxy_pass       http://jenkins:8080;
        proxy_redirect   off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
        }
    }' > /data/docker/nginx/nginx.conf
```
docker-compose文件准备
``` bash
echo "# nginx:80 --> jenkins:8080
version: '2'
services:
  nginx:
    container_name: nginx
    build: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    links:
      - jenkins
  jenkins:
    image: 'jenkins/jenkins:lts'
    container_name: jenkins
    restart: always
    volumes:
      - '/data/jenkins_home:/var/jenkins_home'" > /data/docker/docker-compose-nginx-jenkins.yaml
```

### 2. 运行jenkins
``` bash
# 创建jenkins数据目录
mkdir -p /data/jenkins_home

# 因为jenkins在container中的属主属组是jenkins，uid是1000，需要提前设定好属主属组，不然会报错
chown -R 1000:1000 /data/jenkins_home

# 使用docker-compose启动jenkins
docker-compose -f /data/docker/docker-compose-nginx-jenkins.yaml up -d
```

### 3. 用以上方式启动jenkins的问题，及解决方案
使用以上方式启动jenkins，有几个问题  
#### 1) 缺少组件
- 没有git
- 没有jdk
- 没有mvn
google搜索了解决方案
``` bash
mkdir jenkins
cd jenkins
echo 'FROM jenkins/jenkins:lts
USER root
RUN apt-get update \
      && apt-get install -y git maven sudo libltdl7 \
      && rm -rf /var/lib/apt/lists/*
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
USER jenkins
ADD jdk8.tar.gz /usr/local/
ADD jenkins.sh /etc/profile.d' > Dockerfile
```
> jdk8 是下载的包解压后自己打的tar包，jenkins.sh里面是写了jdk8的环境变量，其他git和mvn是使用apt-get安装
#### 2) 如何在jenkins(docker)中编译docker镜像
jenkins本身就是docker中运行的，怎么在它里面完成编译docker镜像的任务呢，难道我需要在里面继续安装一个docker？  
显然那样太low，网上参考google文档，找到了一种解决方案，就是通过mountdocker文件和socket文件去docker容器中，使jenkins可以调用host的docker命令和socket文件，来达到编译镜像的目的
``` yaml
version: '2'
services:
  jenkins:
    #image: 'jenkins/jenkins:lts'
    image: 'jenkins/jenkins:myjks'
    container_name: jenkins
    restart: always
    volumes:
      - /data/jenkins_home:/var/jenkins_home
      - /var/run:/var/run:rw
      - /usr/bin/docker:/usr/bin/docker
```
> jenkins/jenkins:myjks，是我按照上面的Dockerfile自己编译的docker镜像

> 注意如果jenkins里面配置unix:///var/run/docker.sock时提示找不到，或者权限不足，可以改一下docker.sock的文件权限来解决

> 注：[参考链接](https://renzedevries.wordpress.com/2016/06/30/building-containers-with-docker-in-docker-and-jenkins/)

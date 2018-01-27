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

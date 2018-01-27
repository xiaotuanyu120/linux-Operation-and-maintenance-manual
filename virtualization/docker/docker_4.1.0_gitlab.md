---
title: 4.1.0 在docker中运行gitlab ce
date: 2018-01-27 09:04:00
categories: virtualization/docker
tags: [docker,gitlab]
---
### 4.1.0 在docker中运行gitlab ce

---

### 0. 环境
安装docker和docker-compose肯定是必备环境，这里会使用docker-compose来启动一个nginx和一个gitlab，link在一起提供服务  
[run gitlab ce in container](https://docs.gitlab.com/omnibus/docker/)  
[gitlab image on docker hub](https://hub.docker.com/r/gitlab/gitlab-ce/)

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
        proxy_pass       http://gitlab:80;
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
echo "# nginx:80 --> gitlab:80
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
      - gitlab
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: gitlab
    restart: always
    hostname: 'gitlab.example.com'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab.example.com'
        # Add any other gitlab.rb configuration here, each on its own line
    volumes:
      - '/data/gitlab/config:/etc/gitlab'
      - '/data/gitlab/logs:/var/log/gitlab'
      - '/data/gitlab/data:/var/opt/gitlab'" > /data/docker/docker-compose-nginx-gitlab.yaml
```

### 2. 运行gitlab
``` bash
# 创建gitlab数据目录
mkdir -p /data/gitlab/{config,logs,data}

# 使用docker-compose启动gitlab
docker-compose -f /data/docker/docker-compose-nginx-gitlab.yaml up -d
```

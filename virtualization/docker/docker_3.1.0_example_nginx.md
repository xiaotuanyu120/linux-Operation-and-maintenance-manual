---
title: 3.1.0 docker封装nginx服务
date: 2017-03-04 15:42:00
categories: virtualization/docker
tags: [docker,nginx]
---
### 3.1.0 docker封装nginx服务

---

### 0. 环境
[docker hub上的nginx官方镜像](https://hub.docker.com/_/nginx/)
OS: Centos7
docker: 17.03.0-ce
nginx: 1.10.3(stable)

---

### 1. docker启动nginx服务

#### 1) 创建Dockerfile
``` bash
mkdir html
cd html
vim Dockerfile
**************************************************
FROM nginx:1.10.3
COPY index.html /usr/share/nginx/html
**************************************************
echo "good" > index.html
```

#### 2) 创建self-nginx镜像
``` bash
docker build -t self-nginx .
Sending build context to Docker daemon 3.072 kB
Step 1/2 : FROM nginx:1.10.3
 ---> e526633b91df
Step 2/2 : COPY index.html /usr/share/nginx/html
 ---> 4b50e760a3a1
Removing intermediate container d7d4a2c041a4
Successfully built 4b50e760a3a1
```

#### 3) 运行self-nginx镜像
``` bash
docker run --name my-nginx -d -p 8080:80 self-nginx
8ab9e23cd8e1ff11438c700c6e4cae042733cd08ca14ef5518e22e4934ac503e

docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                           NAMES
8ab9e23cd8e1        self-nginx          "nginx -g 'daemon ..."   6 seconds ago       Up 5 seconds        443/tcp, 0.0.0.0:8080->80/tcp   my-nginx
```
> 参数简介
- -d，使用daemon模式运行
- -p，端口转发

#### 4) 检查状态
``` bash
curl http://127.0.0.1:8080/index.html
good
```

---
title: 4.0.0 docker 本地registry
date: 2017-07-07 16:51:00
categories: virtualization/docker
tags: [docker,registry]
---
### 4.0.0 docker 本地registry

---

### 0. 安装docker
安装本地的registry之前，我们需要首先安装docker。然后使用docker启动一个registry的镜像就启动了registry服务。
> docker安装参照[docker官方安装文档](https://docs.docker.com/engine/installation/#server)和[docker中文安装文档(centos7)](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)

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
    client_max_body_size 1000M;
    location / {
        proxy_pass       http://reg:5000;
        proxy_redirect   off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
        }
    }' > /data/docker/nginx/nginx.conf
```
> client_max_body_size 1000M; 是为了防止上传时的413错误，这个错误提示客户端上传数据容量超过限制；

docker-compose文件准备
``` bash
echo "# nginx:80 --> reg:5000
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
      - reg
  reg:
    image: 'registry:2'
    container_name: reg
    restart: always
    volumes:
      - '/data/registry:/var/lib/registry'" > /data/docker/docker-compose-registry.yaml
```

### 2. 运行reg
``` bash
# 创建registry数据目录
mkdir -p /data/registry

# 使用docker-compose启动registry
docker-compose -f /data/docker/docker-compose-registry.yaml up -d
```

### 3. 从docker HUB上拷贝镜像到本地registry
1. 从docker HUB上下载镜像
``` bash
docker pull ubuntu:16.04
```
2. tag下载的镜像
``` bash
docker tag ubuntu:16.04 localhost:5000/my-ubuntu
docker images
REPOSITORY                 TAG                 IMAGE ID            CREATED             SIZE
registry                   2                   c2a449c9f834        8 days ago          33.2MB
ubuntu                     16.04               d355ed3537e9        2 weeks ago         119MB
localhost:5000/my-ubuntu   latest              d355ed3537e9        2 weeks ago         119MB
```
3. 上传镜像到本地registry中
``` bash
docker push localhost:5000/my-ubuntu
```
4. 移除本地镜像
``` bash
docker image remove ubuntu:16.04
docker image remove localhost:5000/my-ubuntu
```
5. 从本地registry中下载镜像
``` bash
docker pull localhost:5000/my-ubuntu
```

---

### 4. 关停registry
``` bash
docker stop registry
```
> 重新启动registry后，上传的镜像依然存在

``` bash
docker stop registry && docker rm -v registry
```
> 删除了容器后，上传的镜像也会删除

---

### 5. registry服务配置
1. 自动启动registry
``` bash
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  registry:2
```
> docker使用`--restart=always`来重新启动无论因为任何原因退出的容器，当然，不包括手动执行`docker stop`命令。加上此参数开启的容器，可以尝试kill掉它的进程，会发现它会自动启动。

2. 自定义端口
如果5000端口已经被使用，使用`-p 5001:5000`来指定5001端口
``` bash
docker run -d \
  -p 5001:5000 \
  --name registry-test \
  registry:2
```
但如果希望改变容器内部的运行端口， 使用`-e REGISTRY_HTTP_ADDR=0.0.0.0:5001`
``` bash
docker run -d \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:5001 \
  -p 5001:5001 \
  --name registry-test \
  registry:2
```
3. 挂载外部目录储存数据
``` bash
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /mnt/registry:/var/lib/registry \
  registry:2
```

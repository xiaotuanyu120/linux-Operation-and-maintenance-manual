---
title: 3.3.0 docker nginx with multiple sites
date: 2018-08-10 09:57:00
categories: virtualization/docker
tags: [docker,nginx]
---
### 3.3.0 docker nginx with multiple sites

### 0. 背景
有时候我们会在同一台主机上，使用一个nginx来提供多个站点的访问，这种需求的情况下，可能会需要nginx镜像代理其他nginx镜像。

### 1. 静态文件容器和nginx容器
``` bash
mkdir ~/docker-test/{nginx-proxy,staticfiles}
```

#### 1) 静态文件nginx镜像准备
进入staticfiles目录
``` bash
cd ~/docker-test/staticfiles
```

测试html文件`index.html`
```
hi this is a test file
```

将测试html文件打包
``` bash
tar zcvf html.tar.gz index.html
```

nginx配置文件`default.conf`
```
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```

Dockerfile
``` dockerfile
FROM nginx:stable-alpine
ADD html.tar.gz /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
```

#### 2) nginx-proxy镜像准备
进入nginx-proxy目录
``` bash
cd ~/docker-test/nginx-proxy
```

配置文件`default.conf`
```
server {
    listen 80;
    server_name _;
    
    location / {
    	proxy_pass              http://staticfiles;
        proxy_redirect          off;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size    10m;
        client_body_buffer_size 128k;
        proxy_connect_timeout   90;
        proxy_send_timeout      90;
        proxy_read_timeout      90;
        proxy_buffers           32 4k;
    }
}
```
> `staticfiles`和docker compose yaml文件里面的service名称一致

Dockerfile
``` dockerfile
FROM nginx:stable-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
```

#### 3) 启动容器
进入docker-test目录准备compose文件
``` bash
cd ~/docker-test
```

准备`docker-compose.yml`
``` bash
version: '3'
services:
  staticfiles:
    build: ./staticfiles
    image: staticfiles:latest
    networks:
      - nginx

  nginx-proxy:
    build: ./nginx-proxy
    image: nginx-proxy:latest
    networks:
      - nginx

networks:
  nginx:
```

启动容器
``` bash
docker-compose up -d
```
> 同理，可以制作多个staticfiles，只需要增加nginx-proxy处的nginx配置就可以了
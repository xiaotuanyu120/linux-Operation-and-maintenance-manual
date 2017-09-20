---
title: 1.2.0 基础命令
date: 2017-09-20 15:16:00
categories: virtualization/docker
tags: [docker]
---
### 1.2.0 基础命令

---

### 1. 启动容器
``` bash
docker run -it -d --name <instance_name> --rm container_name[:tag]
```
> 这里的启动时创建一个新的容器实例并启动它  
--rm参数加上后，停止容器时会自动删除容器实例

### 2. 启动/停止容器
``` bash
docker start container_name/container-id
docker stop container_name/container-id
```
> 只有docker ps -a查看出的已经停止的容器实例，才能这样启动

### 3. 删除容器实例
``` bash
docker rm container_name/container-id
```
> 只有run容器时没有加上--rm参数才需要这样删除容器实例，否则的话会在停止容器实例时自动删除

### 4. 查看日志
``` bash
docker logs -f container_name/container-id
```

### 5. 执行命令（正在运行的容器实例中）
``` bash
docker exec container_name/container-id command
```

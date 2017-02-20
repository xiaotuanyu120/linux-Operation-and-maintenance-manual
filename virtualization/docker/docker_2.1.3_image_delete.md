---
title: 2.1.3 镜像-镜像的删除
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 2.1.3 镜像-镜像的删除

---

### 1. 删除镜像
#### 1) 使用tag删除镜像
``` bash
docker rmi tomcat:la
Untagged: tomcat:la

docker images
REPOSITORY          TAG                  IMAGE ID            CREATED             SIZE
tomcat              latest               0335e4e8579b        4 days ago          355 MB
tomcat              7.0.75-jre7-alpine   dc29b990e815        3 weeks ago         146 MB
hello-world         latest               48b5124b2768        5 weeks ago         1.84 kB
# docker在删除多tag镜像时，其实删除的只是一个镜像tag而已
# 但在镜像只有一个tag时，删除的可就是镜像本身了
# 删除镜像本身时，和下载镜像一样，也是分layer删除的
```

#### 2) 删除正在运行的镜像
``` bash
# 运行一个容器
docker run centos echo 'hello! my first docker!'
hello! my first docker!

# 查看运行的容器列表
docker ps -a
CONTAINER ID IMAGE  COMMAND                CREATED        STATUS                    PORTS   NAMES
6d48ad2e17cf centos "echo 'hello! my firs" 21 seconds ago Exited (0) 20 seconds ago         goofy_bell

# 尝试删除镜像（会报错）
docker rmi hello-world:latest
Error response from daemon: conflict: unable to remove repository reference "hello-world:latest" (must force) - container 7fe36705b599 is using its referenced image 48b5124b2768

# 此时我们可以用"docker rmi -f hello-world"来强制删除，但强烈不推荐
# 推荐先删除依赖该镜像的容器，然后再删除镜像
# 首先删除container id：7fe36705b599（id可以缩写，只要保证唯一即可）
docker rm 7fe3
7fe3

# 此时已经没有容器在运行
docker ps -a
CONTAINER ID  IMAGE   COMMAND                  CREATED        STATUS                    PORTS   NAMES

# 使用镜像ID删除镜像
docker rmi hello-world:latest
Untagged: hello-world:latest
Untagged: hello-world@sha256:c5515758d4c5e1e838e9cd307f6c6a0d620b5e07e6f927b07d05f6d12a1ac8d7
Deleted: sha256:48b5124b2768d2b917edcb640435044a97967015485e812545546cbed5cf0233
Deleted: sha256:98c944e98de8d35097100ff70a31083ec57704be0991a92c51700465e4544d08
```

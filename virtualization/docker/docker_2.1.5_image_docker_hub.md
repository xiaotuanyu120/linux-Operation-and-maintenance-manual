---
title: 2.1.5 镜像-镜像的上传
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 2.1.5 镜像-镜像的上传

---

### 1. 镜像上传
``` bash
# 1. 注册docker hub帐号(https://hub.docker.com/）

# 2. 创建tag（格式:username/repo）
docker tag centos:test username/centos:first-image
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              test                dc29b990e815        20 minutes ago      418.9 MB
username/centos     first-image         dc29b990e815        20 minutes ago      418.9 MB
centos              7-x64               8f93c5d4058b        34 minutes ago      418.9 MB

# 3. 登录docker hub
docker login
Username: username
Password:
Login Succeeded

# 4. 上传镜像（网络不好需要尝试多次）
docker push username/centos:first-image
The push refers to a repository [docker.io/username/centos]
dcbeb9645db7: Pushed
58c1d1c66edf: Pushed
f327f2bfb204: Pushed
6e959be46cf0: Pushed
9d55db8cf2e6: Pushed
d7f6d7c1230b: Pushed
da07d9b32b00: Pushed
7cbcbac42c44: Pushed
first-image: digest: sha256:a92b228501b9d74ff932da37df12944807b5c28154c748836cb2fe55c5e21388 size: 1995
```

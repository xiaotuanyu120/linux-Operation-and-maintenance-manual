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
# 创建个新tag（格式必须是你的username/anything）
docker tag centos:test user/test:first-image       # 这是错误的开端，格式不对
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              test                061ebf4e339c        20 minutes ago      418.9 MB
user/test           first-image         061ebf4e339c        20 minutes ago      418.9 MB
centos              7-x64               8f93c5d4058b        34 minutes ago      418.9 MB
# 起初创建的user/test,上传一直出错，然后尝试了换成我的docker hub的用户名，成功了，所以说，上传到docker hub
# 的镜像tag必须有一定格式，如下
docker push centos:test
You cannot push a "root" repository. Please rename your repository to <user>/<repo> (ex: xiaotuanyu/centos)

# 上传到docker hub（需要提前去注册帐号https://hub.docker.com/）
# 登录docker hub
docker login
Username: xiaotuanyu
Password:
Email: zhaopeiwu@outlook.com
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
# 其实直接docker push image会自动提示登录，但是我这边docker push的时候一直报错连接问题，所以提前尝试先登录

# 正确修改格式后上传镜像（网络不好需要尝试多次）
docker push xiaotuanyu/safari:centos7-x64
The push refers to a repository [docker.io/xiaotuanyu/safari] (len: 1)
8f93c5d4058b: Pushed
centos7-x64: digest: sha256:2ab250cab0d96f7d1563e5e73c47cf16b43d8b0bac65564e1c369884414e9208 size: 1206
```

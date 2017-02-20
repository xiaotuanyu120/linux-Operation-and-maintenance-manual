---
title: DOCKER 1.1.0 安装(Centos7)
date: 2015-12-12 16:06:00
categories: virtualization/docker
tags: [docker]
---
### DOCKER 1.1.0 安装(Centos7)

---

[docker安装官方文档](https://docs.docker.com/engine/installation/linux/centos/)
### 0. 环境介绍
``` bash
# 系统版本centos7.2
cat /etc/redhat-release
CentOS Linux release 7.2.1511 (Core)

# 内核版本
uname -r
3.10.0-327.el7.x86_64
```

---

### 1. 删除老版本的docker
``` bash
# 如果曾经在redhat的源中安装过老版的docker，删除它
yum -y remove docker docker-common container-selinux
yum -y remove docker-selinux
```

---

### 2. yum安装docker
``` bash
# 创建docker的yum源
yum install -y yum-utils
yum-config-manager \
    --add-repo \
    https://docs.docker.com/engine/installation/linux/repo_files/centos/docker.repo

# 关闭testing源(默认为关闭)
yum-config-manager --disable docker-testing
********************************

# 安装docker
yum -y install docker-engine
```

---

### 3. 启动docker服务
``` bash
# 启动docker服务
systemctl enable docker
systemctl start docker

# 查看docker版本
docker version
Client:
 Version:      1.13.1
 API version:  1.26
 Go version:   go1.7.5
 Git commit:   092cba3
 Built:        Wed Feb  8 06:38:28 2017
 OS/Arch:      linux/amd64

Server:
 Version:      1.13.1
 API version:  1.26 (minimum version 1.12)
 Go version:   go1.7.5
 Git commit:   092cba3
 Built:        Wed Feb  8 06:38:28 2017
 OS/Arch:      linux/amd64
 Experimental: false
```---### 4. 查看服务是否正常``` bash# 测试docker是否正常docker run hello-worldUnable to find image 'hello-world:latest' locallylatest: Pulling from library/hello-world78445dd45222: Pull completeDigest: sha256:c5515758d4c5e1e838e9cd307f6c6a0d620b5e07e6f927b07d05f6d12a1ac8d7Status: Downloaded newer image for hello-world:latestHello from Docker!This message shows that your installation appears to be working correctly.To generate this message, Docker took the following steps: 1. The Docker client contacted the Docker daemon. 2. The Docker daemon pulled the "hello-world" image from the Docker Hub. 3. The Docker daemon created a new container from that image which runs the    executable that produces the output you are currently reading. 4. The Docker daemon streamed that output to the Docker client, which sent it    to your terminal.To try something more ambitious, you can run an Ubuntu container with: $ docker run -it ubuntu bashShare images, automate workflows, and more with a free Docker ID: https://cloud.docker.com/For more examples and ideas, visit: https://docs.docker.com/engine/userguide/# 查看近期docker进程docker ps -aCONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES7fe36705b599        hello-world         "/hello"            47 seconds ago      Exited (0) 46 seconds ago                       dreamy_einstein```
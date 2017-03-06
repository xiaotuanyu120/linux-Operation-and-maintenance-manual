---
title: 1.1.0 安装(Centos7)
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
    https://download.docker.com/linux/centos/docker-ce.repo

# 关闭testing源(默认为关闭)
yum-config-manager --disable docker-testing

# 安装docker
yum -y install docker-ce
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
```
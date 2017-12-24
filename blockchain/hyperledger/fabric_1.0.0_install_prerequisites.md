---
title: hyperledger fabric: 1.0.0 Install Prerequisites
date: 2017-12-24 11:02:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric: 1.0.0 Install Prerequisites

---

### 0. 环境说明
items|content
---|---
OS|Centos 7
参考链接|https://hyperledger-fabric.readthedocs.io/en/release/

> 准备以下环境是为了使用fabric或在fabric的基础上进行开发

### 1. 环境准备
``` bash
# step 1 install curl
yum install curl

# step 2 install and start docker
yum install -y yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
yum-config-manager --disable docker-testing
yum -y install docker-ce

#启动docker
systemctl enable docker
systemctl start docker

#安装docker-compose
wget https://github.com/docker/compose/releases/download/1.17.1/docker-compose-Linux-x86_64
mv docker-compose-Linux-x86_64 /usr/bin/docker-compose
chmod 755 /usr/bin/docker-compose

# step 3 install GO
wget https://redirector.gvt1.com/edgedl/go/go1.9.2.linux-amd64.tar.gz
tar zxvf go1.9.2.linux-amd64.tar.gz
mv go /usr/local/

#set go env
echo 'export PATH=$PATH:/usr/local/go/bin
export GOPATH=$(go env GOPATH)' > /etc/profile.d/go.sh
source /etc/profile
```

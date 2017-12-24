---
title: hyperledger fabric: 1.1.0 Install Binaries and Docker Images
date: 2017-12-24 11:26:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric: 1.0.0 Install Prerequisites

---

### 0. 环境说明
hyperledger fabric准备了一个脚本，可以帮助我们下载二进制文件和docker镜像。

### 1. 安装二进制文件和docker images
``` bash
mkdir /usr/local/fabric.hyperledger
cd /usr/local/fabric.hyperledger
curl -sSL https://goo.gl/byy2Qj | bash -s 1.0.5
echo 'export PATH=$PATH:/usr/local/fabric.hyperledger/bin' > /etc/profile.d/fabric.sh
source /etc/profile
```
> 这个脚本会在当前目录下创建`bin`目录，并下载以下几个命令到`bin`目录中
- `cryptogen`
- `configtxgen`
- `configtxlator`
- `peer`

> 脚本同时会从dockerhub下载fabric的docker镜像，并给其打上lastest标签。  
下载脚本也在bin目录中，有兴趣可以参考
- `hyperledger/fabric-tools`    
- `hyperledger/fabric-couchdb`  
- `hyperledger/fabric-kafka`    
- `hyperledger/fabric-zookeeper`
- `hyperledger/fabric-orderer`  
- `hyperledger/fabric-peer`     
- `hyperledger/fabric-javaenv`  
- `hyperledger/fabric-ccenv`    
- `hyperledger/fabric-ca`      

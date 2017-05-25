---
title: etcd 1.3.0 搭建discovery服务-systemd
date: 2017-05-25 14:24:00
categories: virtualization/container
tags: [etcd,container,coreos]
---
### etcd 1.3.0 搭建discovery服务-systemd

---

### 0. 背景介绍
#### 1) 参考文档
此文档是沿承上一篇[搭建discovery服务](http://linux.xiao5tech.com/virtualization/container/etcd_1.2.0_discovery.html)，主要区别在于上一篇使用命令行启动服务，本篇需要将参数配置在systemd中。


#### 2) 系统环境
hostname|ip|OS|usage
---|---|---|---
core-01|172.17.8.101|coreos 1353.7.0|discovery service
core-02|172.17.8.102|coreos 1353.7.0|infra0
core-03|172.17.8.103|coreos 1353.7.0|infra1
core-04|172.17.8.104|coreos 1353.7.0|infra2

---

### 1. 使用自建的discovery服务来bootstrap新etcd集群
#### 1) 创建自建的discovery服务
``` bash
systemctl stop etcd2
vim /run/systemd/system/etcd2.service.d/20-cloudinit.conf
**********************************************************************
[Service]
Environment="ETCD_ADVERTISE_CLIENT_URLS=http://172.17.8.101:2379"
Environment="ETCD_LISTEN_CLIENT_URLS=http://172.17.8.101:2379,http://127.0.0.1:2379,http://172.17.8.101:4001"
**********************************************************************
rm -rf /var/lib/etcd2/*
systemctl daemon-reload
systemctl start etcd2

# 在core-01创建一个URL
UUID=$(uuidgen)
curl -X PUT http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/_config/size -d value=3
{"action":"set","node":{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d/_config/size","value":"3","modifiedIndex":50,"createdIndex":50}}
```
> 启动单点etcd2服务的时候，只需要指定`ETCD_ADVERTISE_CLIENT_URLS`和`ETCD_LISTEN_CLIENT_URLS`就好。  
>
> 后面的操作其实就是使用`uuidgen`命令帮助生成一个独一无二的discovery URL用于储存新etcd集群的节点信息，此处的curl命令设定了新etcd集群的节点是3个。

#### 2) 使用discovery URL启动etcd集群
``` bash
# 1. 每个节点(core-{02-04})上执行以下命令，cleanup旧有etcd2数据
systemctl stop etcd2
rm -rf /var/lib/etcd2/*

# 2. 每个节点(core-{02-04})上执行以下命令，配置etcd2服务
# core-{02-04}分别配置
vim /run/systemd/system/etcd2.service.d/20-cloudinit.conf
**********************************************************************
[Service]
Environment="ETCD_ADVERTISE_CLIENT_URLS=http://172.17.8.102:2379"
Environment="ETCD_INITIAL_ADVERTISE_PEER_URLS=http://172.17.8.102:2380"
Environment="ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379,http://0.0.0.0:4001"
Environment="ETCD_LISTEN_PEER_URLS=http://172.17.8.102:2380,http://172.17.8.102:7001"
Environment="ETCD_DISCOVERY=http://172.17.8.101:2379/v2/keys/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d"
**********************************************************************

vim /run/systemd/system/etcd2.service.d/20-cloudinit.conf
**********************************************************************
[Service]
Environment="ETCD_ADVERTISE_CLIENT_URLS=http://172.17.8.103:2379"
Environment="ETCD_INITIAL_ADVERTISE_PEER_URLS=http://172.17.8.103:2380"
Environment="ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379,http://0.0.0.0:4001"
Environment="ETCD_LISTEN_PEER_URLS=http://172.17.8.103:2380,http://172.17.8.103:7001"
Environment="ETCD_DISCOVERY=http://172.17.8.101:2379/v2/keys/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d"
**********************************************************************

vim /run/systemd/system/etcd2.service.d/20-cloudinit.conf
**********************************************************************
[Service]
Environment="ETCD_ADVERTISE_CLIENT_URLS=http://172.17.8.104:2379"
Environment="ETCD_INITIAL_ADVERTISE_PEER_URLS=http://172.17.8.104:2380"
Environment="ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379,http://0.0.0.0:4001"
Environment="ETCD_LISTEN_PEER_URLS=http://172.17.8.104:2380,http://172.17.8.104:7001"
Environment="ETCD_DISCOVERY=http://172.17.8.101:2379/v2/keys/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d"
**********************************************************************

# 3. 每个节点(core-{02-04})上均执行以下命令
systemctl daemon-reload
systemctl start etcd2
```
> systemctl start etcd2在第一和第二个节点上执行时，会卡住在那边，因为是在等待另外的节点，当执行第三个节点时，三台服务的命令都会结束

#### 3) 在core-01检查节点信息
``` bash
curl -X GET http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/_config/size
{"action":"get","node":{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d/_config/size","value":"3","modifiedIndex":50,"createdIndex":50}}

curl -X GET http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/
{"action":"get","node":{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d","dir":true,"nodes":[{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d/4fb7e7cdc5741885","value":"a4cf337962544541b0a249ba2d667f69=http://172.17.8.102:2380","modifiedIndex":135,"createdIndex":135},{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d/f40fad84300f7d1b","value":"4f06aba0bf034894a93fda1329a44a4d=http://172.17.8.103:2380","modifiedIndex":169,"createdIndex":169},{"key":"/_etcd/registry/350ddc0a-f654-4093-9c6f-c53c0cb29c2d/14b783d8062e54d6","value":"c48ec442264249819b0386c8a52de03c=http://172.17.8.104:2380","modifiedIndex":171,"createdIndex":171}],"modifiedIndex":50,"createdIndex":50}}
```

#### 4) 在core-02(或其他两个节点)检查etcd集群信息
``` bash
etcdctl member list
14b783d8062e54d6: name=c48ec442264249819b0386c8a52de03c peerURLs=http://172.17.8.104:2380 clientURLs=http://172.17.8.104:2379 isLeader=true
4fb7e7cdc5741885: name=a4cf337962544541b0a249ba2d667f69 peerURLs=http://172.17.8.102:2380 clientURLs=http://172.17.8.102:2379 isLeader=false
f40fad84300f7d1b: name=4f06aba0bf034894a93fda1329a44a4d peerURLs=http://172.17.8.103:2380 clientURLs=http://172.17.8.103:2379 isLeader=false

etcdctl cluster-health
member 14b783d8062e54d6 is healthy: got healthy result from http://172.17.8.104:2379
member 4fb7e7cdc5741885 is healthy: got healthy result from http://172.17.8.102:2379
member f40fad84300f7d1b is healthy: got healthy result from http://172.17.8.103:2379
cluster is healthy
```

---

### 3. 结语
至此，我们就顺利的创建了一个三节点的etcd集群，并且结合systemd可以方便重启。因为coreos中，etcd2.service为只读，只能将配置写入在/run/systemd/system/etcd2.service.d目录中的配置文件里面了。

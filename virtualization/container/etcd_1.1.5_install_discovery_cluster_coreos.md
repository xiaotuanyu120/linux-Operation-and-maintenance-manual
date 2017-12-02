---
title: etcd 1.1.5 install discovery cluster(coreos)
date: 2017-05-24 11:24:00
categories: virtualization/container
tags: [etcd,container,coreos]
---
### etcd 1.1.5 etcd 1.1.5 install discovery cluster(coreos)

---

### 0. 背景介绍
#### 1) 参考文档
教程主要参考的是[coreos官方文档](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md#etcd-discovery)  
根据文档中执行时报错，提出的[issue](https://github.com/coreos/etcd/issues/7977)(已解决)


#### 2) 系统环境
hostname|ip|OS|usage
---|---|---|---
core-01|172.17.8.101|coreos 1353.7.0|discovery service
core-02|172.17.8.102|coreos 1353.7.0|infra0
core-03|172.17.8.103|coreos 1353.7.0|infra1
core-04|172.17.8.104|coreos 1353.7.0|infra2

#### 3) discovery介绍
etcd的discovery服务只能用于集群引导阶段，不可以用于runtime修改配置或者集群监控中。
一个discovery的URL定义一个独一无二的etcd集群，无法重用于生成另外一个etcd集群。

etcd提供两种discovery服务：  
- 公用etcd discovery服务, 通过访问`https://discovery.etcd.io/new?size=3`获取discovery URL
- 自建etcd discovery服务, 使用现存的etcd服务来生成新etcd集群bootstrap过程需要的discovery URL

---

### 1. 使用自建的discovery服务来bootstrap新etcd集群
#### 1) 创建自建的discovery服务
``` bash
etcd2 --name etc-server \
  --listen-client-urls http://172.17.8.101:2379,http://localhost:2379 \
  --advertise-client-urls http://172.17.8.101:2379

# 在core-01创建一个URL
UUID=$(uuidgen)
curl -X PUT http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/_config/size -d value=3
{"action":"set","node":{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff/_config/size","value":"3","modifiedIndex":2038,"createdIndex":2038}}
```
> 启动单点etcd2服务的时候，只需要指定`--listen-client-urls`和`--advertise-client-urls`就好。  
>
> 后面的操作其实就是使用`uuidgen`命令帮助生成一个独一无二的discovery URL用于储存新etcd集群的节点信息，此处的curl命令设定了新etcd集群的节点是3个。

#### 2) 使用discovery URL启动etcd集群
``` bash
# 在其他三个节点启动etcd2服务
etcd2 --name infra0 --initial-advertise-peer-urls http://172.17.8.102:2380 \
  --listen-peer-urls http://172.17.8.102:2380 \
  --listen-client-urls http://172.17.8.102:2379,http://localhost:2379 \
  --advertise-client-urls http://172.17.8.102:2379 \
  --discovery http://172.17.8.101:2379/v2/keys/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff

etcd2 --name infra1 --initial-advertise-peer-urls http://172.17.8.103:2380 \
  --listen-peer-urls http://172.17.8.103:2380 \
  --listen-client-urls http://172.17.8.103:2379,http://localhost:2379 \
  --advertise-client-urls http://172.17.8.103:2379 \
  --discovery http://172.17.8.101:2379/v2/keys/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff

etcd2 --name infra2 --initial-advertise-peer-urls http://172.17.8.104:2380 \
  --listen-peer-urls http://172.17.8.104:2380 \
  --listen-client-urls http://172.17.8.104:2379,http://localhost:2379 \
  --advertise-client-urls http://172.17.8.104:2379 \
  --discovery http://172.17.8.101:2379/v2/keys/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff
```
> 根据文章开头的issue链接内容所述，官方文档上的命令是有误的，我们应该使用etcd2命令来启动服务。etcd命令是version1版本，没有--listen-peer-urls等这些选项。

#### 3) 在core-01检查节点信息
``` bash
curl -X GET http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/_config/size
{"action":"get","node":{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff/_config/size","value":"3","modifiedIndex":2038,"createdIndex":2038}}

curl -X GET http://172.17.8.101:2379/v2/keys/_etcd/registry/${UUID}/
{"action":"get","node":{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff","dir":true,"nodes":[{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff/325be18af4ccbb60","value":"infra0=http://172.17.8.102:2380","modifiedIndex":2084,"createdIndex":2084},{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff/7187606a0f15cdd1","value":"infra1=http://172.17.8.103:2380","modifiedIndex":2129,"createdIndex":2129},{"key":"/_etcd/registry/6cae8517-12ad-4dd8-a247-02838f82f4ff/82856cded7eb183e","value":"infra2=http://172.17.8.104:2380","modifiedIndex":2135,"createdIndex":2135}],"modifiedIndex":2038,"createdIndex":2038}}
```

#### 4) 在core-02(或其他两个节点)检查etcd集群信息
``` bash
etcdctl member list
325be18af4ccbb60: name=infra0 peerURLs=http://172.17.8.102:2380 clientURLs=http://172.17.8.102:2379 isLeader=false
7187606a0f15cdd1: name=infra1 peerURLs=http://172.17.8.103:2380 clientURLs=http://172.17.8.103:2379 isLeader=true
82856cded7eb183e: name=infra2 peerURLs=http://172.17.8.104:2380 clientURLs=http://172.17.8.104:2379 isLeader=false

etcdctl cluster-health
member 325be18af4ccbb60 is healthy: got healthy result from http://172.17.8.102:2379
member 7187606a0f15cdd1 is healthy: got healthy result from http://172.17.8.103:2379
member 82856cded7eb183e is healthy: got healthy result from http://172.17.8.104:2379
cluster is healthy
```

---

### 3. 结语
至此，我们就顺利的创建了一个三节点的etcd集群，但是显然在生产活动中我们是无法这样启动一个服务的，于是此时我们就需要将这些选项信息转化成etcd的变量名称，然后写在systemd的etcd2.service中，但是因为coreos中，该文件为只读，我们就只能将其写入在/run/systemd/system/etcd2.service.d目录中的配置文件里面了。

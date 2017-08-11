---
title: etcd 1.0.0 etcd static cluster(centos6.5)
date: 2017-08-10 14:35:00
categories: virtualization/container
tags: [etcd]
---
### etcd 1.0.0 etcd static cluster(centos6.5)

---

### 0. 安装etcd集群之前
hostname|ip|OS
---|---|---
etcd01|192.168.86.19|centos6.8
etcd02|192.168.86.20|centos6.8
etcd03|192.168.86.21|centos6.8

> 主要参考文档:[etcd static方法启动集群](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md#static)和[etcd选项官方说明](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md)

> etcd使用的是最新稳定版本3.2.5

---

### 1. 使用static方法启动etcd集群
#### 1) 安装etcd
``` bash
wget https://github.com/coreos/etcd/releases/download/v3.2.5/etcd-v3.2.5-linux-amd64.tar.gz
tar zxvf etcd-v3.2.5-linux-amd64.tar.gz
cp etcd-v3.2.5-linux-amd64/{etcd,etcdctl} /usr/local/bin
echo 'export PATH=$PATH:/usr/local/bin' >> /etc/profile
source /etc/profile
```

> 因为etcd是go语言开发的，只要下载了二进制文件，可以执行就相当于安装完毕了

#### 2) 启动etcd
在各个节点创建新文件`/usr/local/bin/etcdStart`
``` bash
#!/bin/bash

etcd --name infra0 --initial-advertise-peer-urls http://192.168.86.19:2380 \
  --listen-peer-urls http://192.168.86.19:2380 \
  --listen-client-urls http://192.168.86.19:2379,http://127.0.0.1:2379 \
  --advertise-client-urls http://192.168.86.19:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=http://192.168.86.19:2380,infra1=http://192.168.86.20:2380,infra2=http://192.168.86.21:2380 \
  --initial-cluster-state new &
```  

``` bash
#!/bin/bash

etcd --name infra1 --initial-advertise-peer-urls http://192.168.86.20:2380 \
  --listen-peer-urls http://192.168.86.20:2380 \
  --listen-client-urls http://192.168.86.20:2379,http://127.0.0.1:2379 \
  --advertise-client-urls http://192.168.86.20:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=http://192.168.86.19:2380,infra1=http://192.168.86.20:2380,infra2=http://192.168.86.21:2380 \
  --initial-cluster-state new &
```

``` bash
#!/bin/bash

etcd --name infra2 --initial-advertise-peer-urls http://192.168.86.21:2380 \
  --listen-peer-urls http://192.168.86.21:2380 \
  --listen-client-urls http://192.168.86.21:2379,http://127.0.0.1:2379 \
  --advertise-client-urls http://192.168.86.21:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=http://192.168.86.19:2380,infra1=http://192.168.86.20:2380,infra2=http://192.168.86.21:2380 \
  --initial-cluster-state new &
```
> `--listen-client-urls`必须要配置127.0.0.1:2379

在各节点上启动etcd
``` bash
chmod u+x,g+x /usr/local/bin/etcdStart
etcdStart
```

#### 3) 检查etcd状态
查看集群状态
``` bash
ETCDCTL_API=3 etcdctl --endpoints http://192.168.86.20:2379 member list
719ce5a05ef423e, started, infra2, http://192.168.86.21:2380, http://192.168.86.21:2379
90cbb00497c29dbe, started, infra1, http://192.168.86.20:2380, http://192.168.86.20:2379
bead1527d2c2b2c1, started, infra0, http://192.168.86.19:2380, http://192.168.86.19:2379


curl -X GET http://192.168.86.19:2379/v2/members
{"members":[{"id":"719ce5a05ef423e","name":"my-etcd-3","peerURLs":["http://192.168.86.21:2380"],"clientURLs":["http://192.168.86.21:2379"]},{"id":"90cbb00497c29dbe","name":"my-etcd-2","peerURLs":["http://192.168.86.20:2380"],"clientURLs":["http://192.168.86.20:2379"]},{"id":"bead1527d2c2b2c1","name":"my-etcd-1","peerURLs":["http://192.168.86.19:2380"],"clientURLs":["http://192.168.86.19:2379"]}]}
curl -X GET http://192.168.86.19:2379/v2/members/leader
{"id":"bead1527d2c2b2c1","name":"infra0","peerURLs":["http://192.168.86.19:2380"],"clientURLs":["http://192.168.86.19:2379"]}
```
> `ETCDCTL_API=3`变量的作用是让etctl使用etcd3的api语法，默认是etcd2的api语法。

增删改查
``` bash
# 使用etcdctl
ETCDCTL_API=3 etcdctl --endpoints http://192.168.86.20:2379 put /v2/keys/test test
OK
ETCDCTL_API=3 etcdctl --endpoints http://192.168.86.20:2379 get /v2/keys/test
/test
test
ETCDCTL_API=3 etcdctl --endpoints http://192.168.86.20:2379 del /v2/keys/test
1
ETCDCTL_API=3 etcdctl --endpoints http://192.168.86.20:2379 get /v2/keys/test

# 使用http方法（curl工具）
curl -X PUT http://192.168.86.19:2379/v2/keys/test -d value="test"
curl http://192.168.86.19:2379/v2/keys/test
{"action":"get","node":{"key":"/test","value":"","modifiedIndex":11,"createdIndex":11}}
curl -X DELETE http://192.168.86.19:2379/v2/keys/test
curl http://192.168.86.19:2379/v2/keys/test
{"errorCode":100,"message":"Key not found","cause":"/test","index":12}
```

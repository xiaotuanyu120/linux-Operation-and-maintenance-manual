---
title: etcd 1.1.0 搭配confd做配置管理
date: 2017-03-29 14:00:00
categories: virtualization/container
tags: [container,coreos,etcd,confd]
---
### etcd 1.1.0 搭配confd做配置管理

---

### 0. 环境
[confd安装官方文档](https://github.com/kelseyhightower/confd/blob/master/docs/installation.md)  
[confd quick-start-guide](https://github.com/kelseyhightower/confd/blob/master/docs/quick-start-guide.md)  

假设我们已经使用coreos启动了etcd服务
``` bash
# etcd就是coreos开发的一个服务，默认集成在coreos中
systemctl enable etcd
systemctl start etcd

# 检查监听端口
netstat -lnpt|grep etcd
tcp        0      0 172.17.8.101:7001       0.0.0.0:*               LISTEN      1094/etcd2
tcp        0      0 172.17.8.101:2380       0.0.0.0:*               LISTEN      1094/etcd2
tcp6       0      0 :::4001                 :::*                    LISTEN      1094/etcd2
tcp6       0      0 :::2379                 :::*                    LISTEN      1094/etcd2
```

此处我们使用coreos+etcd来提供etcd配置中心服务，然后使用centos+confd来作为客户端

---

### 1. 安装confd
#### 1) 准备confd需要的环境
因为confd是使用go语言开发，所以需要go环境，具体安装参照[go环境安装](https://golang.org/doc/install)和[gb工具安装](https://getgb.io/docs/install/)

#### 2) confd安装
``` bash
wget https://github.com/kelseyhightower/confd/archive/v0.11.0.tar.gz
tar zxf v0.11.0.tar.gz
cd confd-0.11.0
./build
./install
```

#### 3) 创建confd配置模板
``` bash
mkdir -p /etc/confd/{conf.d,templates}

vim /etc/confd/conf.d/myconfig.toml
*************************************
[template]
src = "myconfig.conf.tmpl"
dest = "/tmp/myconfig.conf"
keys = [
    "/test",
]
*************************************

vim /etc/confd/templates/myconfig.conf.tmpl
*************************************
[myconfig]
database_url = \{\{getv "/test"}}
*************************************
```
> 转义符是因为flask使用的jinja模板问题，必须要转义，实际不需要转义符

#### 4) etcd上设置key
``` bash
etcdctl set /test test2
```

#### 5) 使用confd生成配置文件
confd有两种生成配置文件的方式，一种是使用daemon，一种是手动一次性获取，这里为了演示我们使用手动一次性获取方式
``` bash
confd -onetime -backend etcd -node http://172.17.8.101:4001
cat /tmp/myconfig.conf
[myconfig]
database_url = test2
```

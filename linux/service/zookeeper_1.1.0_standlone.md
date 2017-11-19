---
title: zookeeper 1.1.0 standalone 安装部署
date: 2017-03-06 16:09:00
categories: linux/service
tags: [zookeeper]
---
### zookeeper 1.1.0 standalone 安装部署

---

### 0. 环境
OS: centos6.7  
jdk: 1.7.0_79  
zookeeper: 3.4.9  
[zookeeper3.4.9官方文档](http://zookeeper.apache.org/doc/r3.4.9/zookeeperStarted.html)  

---

### 1. zookeeper安装
#### 1) 下载zookeeper
``` bash
wget http://mirror.rise.ph/apache/zookeeper/zookeeper-3.4.9/zookeeper-3.4.9.tar.gz
tar zxvf zookeeper-3.4.9.tar.gz
```

#### 2) 配置zookeeper为standalone
``` bash
cd zookeeper-3.4.9
vim conf/zoo.cfg
*************************************
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
*************************************
mkdir /var/lib/zookeeper
```
> 配置文件的名称是自定义的，不过一般情况下创建为conf/zoo.cfg
- tickTime, zookeeper中的基本时间单元，单位是微秒。被用于心跳功能，最短会话超时时间是两倍的tickTime
- dataDir, 用于存储内存数据库快照，和更新数据库的事务日志，除非另有规定。
- clientPort, 用于客户端连接的端口

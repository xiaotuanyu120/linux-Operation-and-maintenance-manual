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

---

### 2. zookeeperg管理
#### 1) zookeeper启动
``` bash
./bin/zkServer.sh start
ZooKeeper JMX enabled by default
Using config: /usr/local/src/zookeeper-3.4.9/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

#### 2) zookeeper连接
``` bash
bin/zkCli.sh -server 127.0.0.1:2181
[zk: 127.0.0.1:2181(CONNECTED) 0] help
ZooKeeper -server host:port cmd args
        connect host:port
        get path [watch]
        ls path [watch]
        set path data [version]
        rmr path
        delquota [-n|-b] path
        quit
        printwatches on|off
        create [-s] [-e] path data acl
        stat path [watch]
        close
        ls2 path [watch]
        history
        listquota path
        setAcl path acl
        getAcl path
        sync path
        redo cmdno
        addauth scheme auth
        delete path [version]
        setquota -n|-b val path
```
> 更多命令可查看zookeeper官网

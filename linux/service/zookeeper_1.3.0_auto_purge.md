---
title: zookeeper 1.3.0 zookeeper 数据清理
date: 2017-09-15 13:46:00
categories: linux/service
tags: [zookeeper]
---
### zookeeper 1.2.0 replicated 安装部署

---

### 0. 前言
zookeeper在运行一段时间后，会占用大量的磁盘空间存储数据和文档，为了节省磁盘空间，我们可以选择删除过期的数据和日志  
[zookeeper3.4.9高级设定官方文档](https://zookeeper.apache.org/doc/trunk/zookeeperAdmin.html#sc_advancedConfiguration)   

---

### 1. zookeeper 自动清除数据配置
- `autopurge.snapRetainCount`：  
启用后，ZooKeeper自动清除功能将分别保留在dataDir和dataLogDir中的`autopurge.snapRetainCount`个最新快照和相应的事务日志，并删除其余的。 默认为3.最小值为3。

- `autopurge.purgeInterval`：  
清除任务必须触发的时间间隔（以小时为单位）。 设置为正整数（1及以上）以启用自动清除。 默认为0。

配置在`conf/zoo.cfg`中
```
autopurge.snapRetainCount=
autopurge.purgeInterval=
```
配置完成后重启zookeeper服务即可

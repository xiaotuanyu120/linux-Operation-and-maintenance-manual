---
title: redis: 1.1.2 redis-py(sentinel)获取master信息
date: 2017-08-09 13:48:00
categories: database/redis
tags: [redis-py,sentinel]
---
### redis: 1.1.2 redis-py(sentinel)获取master信息

---

### 0. python程序之前
redis的sentinel解决了redis replication的failover问题，但是并没有解决高可用的问题。为了解决高可用的问题，有很多思路可以采用，例如加入keepalive等技术，而本文会从redis的python api出发来尝试找到一个解决方案。
> 主要使用到了[redis-py](https://github.com/andymccurdy/redis-py)

---

### 1. redis-py
#### 1) python环境准备
1. 安装python，可参照[python-2.7安装](http://linux.xiao5tech.com/python/advance/version_1.0_python2.7.html)
2. 安装对应版本的pip，可参照[pip安装](http://linux.xiao5tech.com/python/advance/envtool_1.0_pip.html)
3. 安装redis-py包
``` bash
pip install redis-py
```

#### 2) 获取redis replication的master节点信息
``` python
from redis.sentinel import Sentinel
sentinel = Sentinel([('192.168.33.41', 26379)], socket_timeout=0.1)
master = sentinel.discover_master('mymaster')
```
> 更多详细用法可以参照[redis-py文档](https://github.com/andymccurdy/redis-py)

---
title: redis: 4.2.0 主从遇到的问题
date: 2017-01-06 14:33:00
categories: linux/commonly_services
tags: [redis,replication,linux,key]
---
### redis: 4.2.0 主从遇到的问题

---

### 0. 环境介绍
ITEM|CONTENT
---|---
OS|centos 6 x64
redis|3.2.6(当前稳定最新版本)

redis slave可写配置：`slave-read-only no`

---

### 1. 主从会遇到的问题
#### 1) 查看主从状态
``` bash
## 测试环境下6379为主，6389为从
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=127.0.0.1,port=6389,state=online,offset=43,lag=1
master_repl_offset:43
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:42

127.0.0.1:6389> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:9
master_sync_in_progress:0
slave_repl_offset:140
slave_priority:100
slave_read_only:0
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

#### 2) 从上写入数据，无法在主上看到
``` bash
## 主上写入数据，从上可读
# 主写入
127.0.0.1:6379> set apple apple
OK
127.0.0.1:6379> get apple
"apple"
# 从可读
127.0.0.1:6389> get apple
"apple"

## 从上写入数据，主上不可读
# 从写入
127.0.0.1:6389> set pear pear
OK
127.0.0.1:6389> get pear
"pear"
# 主不可读
127.0.0.1:6379> get pear
(nil)
```
> [redis官方解释了这个问题](https://redis.io/topics/replication#read-only-slave)，大意就是，从上写入的数据，不会同步到主上，当主从之间重新同步数据或从重启后，所有从上写入的数据会丢失。

#### 3) 主上数据设定key过期时间，过期后依然占用从redis内存
``` bash
# 主上设定apple的过期时间是20s
127.0.0.1:6379> expire apple 20
(integer) 1
127.0.0.1:6379> ttl apple
(integer) 15

# 过期后，主上keys列表中无apple这个key
127.0.0.1:6379> ttl apple
(integer) -2
127.0.0.1:6379> keys *
1) "newk"

# 过期后，从上keys列表中依然有apple这个key
127.0.0.1:6389> keys *
1) "newk"
2) "pear"
```
> [redis官方也同样解释了这个问题](https://redis.io/topics/replication#read-only-slave)，大意就是，你可以在适当的场景内使用从可写的主从架构，但是这时会有一个问题，如果你在主上给key设定了过期时间，那么在过期后，该key会泄露，从上虽然无法读取它，但是它还存在于从的内存当中。不过redis已经在4.0 RC3版本之后修复了该问题。
推荐阅读[How Redis replication deals with expires on keys](https://redis.io/topics/replication#read-only-slave)部分，来了解redis是如何处理主从中的key过期时间

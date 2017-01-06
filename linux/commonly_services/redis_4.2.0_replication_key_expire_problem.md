---
title: redis: 4.2.0 主从同时可写时遇到的问题
date: 2017-01-06 14:33:00
categories: linux
tags: [redis,replication,linux,key]
---
### redis: 4.2.0 主从同时可写时遇到的问题

---

### 1. 主从情况下，从上可查询到主上已经过期或删除的key
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

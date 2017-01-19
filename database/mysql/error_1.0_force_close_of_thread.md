---
title: MYSQL-错误: 1.0 force close of thread xxx user: 'someuser'
date: 2017-01-19 14:06:00
categories: database/mysql
tags: [database,mysql,error]
---
### 错误: 1.0 force close of thread xxx user: 'someuser'

---

### 1. 错误现象
数据库被多个线上discuz使用，突然某段时间论坛页面报错database error。  

排查mysql日志，发现大量下面报错
``` bash
# 大量warning
170119 14:04:07 [Warning] IP address '113.10.xxx.xxx' could not be resolved: Temporary failure in name resolution

# 夹杂着以下warning
170118 20:34:54 [Warning] /usr/local/mysql/bin/mysqld: Forcing close of thread 3336563  user: 'someuser'
```

---

### 2. 分析过程
1. 因为未改动过discuz的mysql连接信息，所以排除是连接问题  
2. 手动telnet mysql主机的ip和端口，网络通畅  
3. 根据mysql日志信息：  
第一个warning得到的信息是，未关闭连接主机的name resolve，导致的mysql尝试去resolve主机ip到host name失败  
第二个warning网上查询到，是一个mysql的[bug](https://bugs.mysql.com/bug.php?id=7403)

根据mysql错误日志中的第二个warning，综合网上的信息，得到的结论是，mysql积攒了大量的resolve线程(连接数很大)，导致线程过多得不到释放，造成mysql的假死

---

### 3. 解决办法
``` bash
# 使用skip-name-resolve关闭ip resolve
# (仅限myisam)使用skip-external-locking跳过外部锁(系统锁)，在linux上启动这个外部锁，会很容易导致mysql假死(也许是因为linux的锁机制，可参考官方文档)
vim /etc/my.cnf
*****************************************
[mysqld]
skip-name-resolve
skip-external-locking
*****************************************

# 重启mysql
service mysql restart
```
[--external-locking 参数文档](http://dev.mysql.com/doc/refman/5.7/en/server-options.html#option_mysqld_external-locking)

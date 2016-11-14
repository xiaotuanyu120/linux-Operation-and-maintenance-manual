redis: 持久化-备份及恢复
2016年9月28日
13:16
 
---
title: redis持久化、备份及恢复
date: 2016-09-28 13:22:00
categories: linux
tags: [redis]
---
### 为何要做redis持久化
redis和memcached等都是内存数据库，掉电之后，内存清空，数据也会丢失，所谓的持久化，就是将内存中的数据转存到硬盘上。
 
[redis persistence参考文档](http://redis.io/topics/persistence)
redis的持久化有两种方法RDB和AOF，下面分别来了解
 
<!--more-->
 
### 方法1、rdb快照模式
 
**RDB优点**
- RDB是一种非常紧凑的确切时间点的单文件数据备份。
- RDB特别适合紧急及计划性备份，并在其他主机进行恢复
- RDB可以最大化redis的性能，因为RDB模式下，redis需要做的只是去fork一个子进程，由子进程来进行余下的所有工作，这样父进程就不会承担资源压力或其他。
- RDB相对于AOF来讲，在大数据量时会有更快的重启恢复速度
 
**RDB缺点**
- RDB无法满足在redis崩溃或停止时最小化数据丢失的需求，即使是我们规定5分钟内100个写请求后备份一次，但是也会在崩溃或者停止时丢失最新几分钟的数据。
- RDB需要fork子进程来完成持久化。fork过程在数据量很大的时候需要消耗时间，此时就会影响到正常请求的处理，一般是微秒级甚至是秒级影响，另外CPU的性能可能会被影响到。AOF虽然也需要fork，但你可以调整重写logs的时间间隔来避免对访问的影响。
 
**配置**
``` bash
vim /etc/redis/6379.conf
**********************************
# rdb配置
save 900 1
save 300 10
save 60 10000
# 含义是，若在900s内超过1个key修改，则快照保存
# 若在300s内超过10个key被修改，则快照保存
# 若在60s内超过10000个key被修改，则快照保存
# 若三项配置都被注视，则禁用快照
 
# 默认情况下，后台备份出错时，主进程停止写入
stop-writes-on-bgsave-error yes
 
# 备份文件是否压缩
rdbcompression yes
 
# 导入恢复数据时，是否验证rdb的完整性
rdbchecksum yes
 
# 备份文件名称
dbfilename dump.rdb
 
# 备份文件路径
dir ./
**********************************
```
- RDB模式适用与丢失最近的部分数据也无大碍的状况，否则请用AOF
- 客户端连接服务器，可使用save和bgsave命令来创建RDB备份，但此时就不是fork子进程，而是使用主进程来备份，这样会阻塞所有client请求，不推荐使用
 
 
### 方法2、AOF日志模式
 
**AOF优点**
- AOF模式更耐用：可以使用不同的fsync策略：no fsync，每秒fsync，每个请求fsync。在默认的每秒fsync情况下，redis的写性能依然表现良好(fsync使用了一个后台线程，主线程尽量去在无fsync的时候去处理写请求)
- AOF只是增加log，所以恢复过程中没有搜寻方面的问题，甚至如果log文件的ends拥有一个不完整的命令，redis也可以很容易的恢复它。
- redis可以在AOF备份过大时在后台rewrite它。此rewrite是完全安全的，完美从老的log文件上延续，当这个文件足够大时，redis会rewrite一个新的。
- AOF的log文件包含了所有的操作，此类文件一个接一个，语法十分简单并易于理解。你可以简单的导出AOF文件。举例说明，如果你错误的使用了flushall命令清空了所有数据，如果在此期间没有log的rewrite，你可以迅速的停止服务，然后删除掉这个最新的flushall命令，重启redis即可。
 
**AOF缺点**
- AOF文件通常要比等量dataset的RDB文件大一些
- AOF有时要比RDB慢，程度要看实际的fsync策略。
 
**AOF配置**
``` bash
vim /etc/redis/6379.conf
**********************************
# 是否开启AOF
appendonly no
 
# AOF文件名称
appendfilename "appendonly.aof"
 
# AOF策略
# appendfsync always
appendfsync everysec
# appendfsync no
 
# 在rdb快照保存时，是否关闭AOF备份
no-appendfsync-on-rewrite no
 
# rewrite条件
# aof文件增长百分比为100%时
auto-aof-rewrite-percentage 100
 
# aof文件至少超过64mb时
auto-aof-rewrite-min-size 64mb
**********************************
```
- AOF rewrite是重新把旧的文件重写一个，是一个完整的备份
- AOF和RDB文件会在重启redis服务器时自动载入
 
**演示AOF备份恢复**
``` bash
# 备份原有的aof文件
redis-check-aof --fix
# 使用diff -u去检查备份文件和修复后文件的不同
# 重启redis服务器
```
 
**切换rdb到aof模式**
``` bash
redis-cli config set appendonly yes
redis-cli config set save ""
# 编辑配置文件开启aof，否则会在重启后失效
```
第一步把aof开启，第二步关闭rdb模式，这种情况避免了编辑配置文件重启redis丢失数据问题
 
### 预想备份方案
可结合RDB和AOF备份方式
1、Redis在同时开启AOF和RDB的情况下重启，会使用AOF文件来重建原始数据集，因为通常AOF文件是保存数据最完整的。
2、但为了避免aof出错，故需打开rdb和aof两种方式。
3、rdb模式可5分钟备份一次，保存6个最新备份，以备不时之需
4、aof文件可每分钟备份一次，保存10个最新备份，主要用aof文件来恢复，aof文件备份恢复时不需要手动操作，重启redis会自动使用aof文件恢复，对其的备份是避免aof文件损坏这种最坏的情况发生
5、同时做好slave，用slave来承担读请求。

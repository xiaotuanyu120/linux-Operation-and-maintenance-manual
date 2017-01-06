---
title: redis: 4.1.0 主从配置
date: 2016-09-28 09:14:00
categories: linux/commonly_services
tags: [redis,replication,linux]
---
### redis: 4.1.0 主从配置

---

### 0. redis主从理论知识
- redis采用异步复制，从2.8版本开始，slave会周期性的去在replication流中获取数据
- master可以有多个slave
- slave可以接受其他slave的连接，也就是说可以使用master-slave-slave的架构
- 在master端，redis的主从复制是非阻塞的，也就是说，在一或多个slave在同步的同时，master还可以处理正常的queries。
- 在slave端，redis的是也是非阻塞的，也就是说，在slave同步数据时，也可以用旧有的数据来响应queries，但这必须在redis的配置文件中进行配置。否则，你可以配置redis如果同步数据流down时返回一个error给queries。然而，当redis同步完成后，会删除旧有的dataset，并加载新的dataset，此时slave会阻塞不去接受新的连接直至数据替换完成。
- 主从同时也是可扩展的，可用于创建多个slave，或者简单的用来做数据冗余。
- 主从也可以避免master持久化完成的dataset所造成的硬盘消耗，一个典型的技术方案是，完全关闭master端的数据持久化，而在slave上实时写入所有的数据。但这样处理时一定要小心，当master重启后，它会是一个空的dataset，若此时slave去同步，则slave也会清空自己的dataset。  

[redis 主从参考链接](http://redis.io/topics/replication)

---

### 1. redis软件准备
需要同时在master和slave上执行下面所有操作
#### 1) 安装redis
``` bash
wget http://download.redis.io/releases/redis-2.8.24.tar.gz
tar zxf redis-2.8.24.tar.gz
cd redis-2.8.24
make
make install
```

#### 2) 拷贝redis启动脚本
slave上操作时需要把6379端口换成6380
``` bash
cp utils/redis_init_script /etc/init.d/redis
chmod 755 /etc/init.d/redis
vi /etc/init.d/redis
******************************
# 在第2行添加
#chkconfig: 2345 80 90

# 修改配置文件位置
REDISPORT=6379
EXEC=/usr/local/bin/redis-server
CLIEXEC=/usr/local/bin/redis-cli

PIDFILE=/var/run/redis_${REDISPORT}.pid
CONF="/etc/redis/${REDISPORT}.conf"

# 如果设置了auth的话，需要在关闭时提供密码字符串
# 配置一个自定义变量
AUTH_PASSWORD="customized_pass"
# 在关闭stop case中增加"-a $AUTH_PASSWORD"
$CLIEXEC -p $REDISPORT -a $AUTH_PASSWORD shutdown
******************************
chkconfig redis on
```

#### 3) 配置redis
master上使用6379端口，"bind ip"未配置时默认是监听所有的连接
slave上使用6380端口，下面的6379在slave是统统换成6380
``` bash
mkdir /etc/redis
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf
******************************
daemonize yes
pidfile /var/run/redis_6379.pid
port 6379
******************************
```

---

### 2. 配置主从
#### 1) 主上配置
``` bash
vim /etc/redis/6379.conf
******************************
# 此配置需要去tomcat配置中增加password配置，否则会报错
requirepass customized_pass
******************************
```

#### 2) 从上配置
``` bash
vim /etc/redis/6380.conf
******************************
slaveof 192.168.110.4 6379

# 此配置需要去tomcat配置中增加password配置，否则会报错
masterauth customized_pass
******************************
```

#### 3) 启动主和从上的redis服务
``` bash
service redis start
```

#### 4) 效果查看
``` bash
# master上
redis-cli
# 此语句
127.0.0.1:6379> auth customized_pass
OK
127.0.0.1:6379> set good bad
OK
127.0.0.1:6379> set fork first
OK

# slave上
redis-cli -p 6380
127.0.0.1:6380> get fork
"first"
127.0.0.1:6380> KEYS *
1) "fork"
2) "good"

# master上检查主从状态
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=192.168.110.5,port=6380,state=online,offset=125900,lag=0
master_repl_offset:125900
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:125899
```

#### 5) 从转主的命令
``` bash
127.0.0.1:6380> slaveof no one
OK
127.0.0.1:6380> info replication
# Replication
role:master
connected_slaves:0
master_repl_offset:127944
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

---

### 3. redis常用配置
``` bash
# 只读配置，不可以在此节点写入key-value
slave-read-only yes

# 日志配置
loglevel notice
logfile "/var/log/redis.log"
# loglevel可以是以下几种
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)

# 当slave失去与master的连接，或者正在同步过程中时，以下配置设定了不同的行为
slave-serve-stale-data yes
# 当为yes时，返回旧有数据或者空值
# 当为no时，返回error"SYNC with master in progress"

# 主从条件配置
min-slaves-to-write 3
min-slaves-max-lag 10
# 含义为，最少3个ping间隔在10s以内的slave同时在线时，master才会接受写入的操作，否则则停止接受写入操作。
# 默认情况下，min-slaves-to-write为0，min-slaves-max-lag默认是10，含义是disable此功能
```

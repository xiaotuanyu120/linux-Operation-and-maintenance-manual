---
title: redis: 1.1.0 安装
date: 2016-11-14 13:25:00
categories: database/redis
tags: [database,redis]
---
### redis: 1.1.0 安装

---

### 1. redis源码安装
``` bash
REDIS_VER=2.8.24
wget http://download.redis.io/releases/redis-${REDIS_VER}.tar.gz
tar zxf redis-${REDIS_VER}.tar.gz
cd redis-${REDIS_VER}
make
make install
```

----

### 2. 拷贝redis启动脚本
``` bash
cp utils/redis_init_script /etc/init.d/redis
chmod 755 /etc/init.d/redis
vi /etc/init.d/redis
******************************
# 在第2行添加
#chkconfig: 2345 80 90

# 修改配置文件位置
CONF="/etc/redis/${REDISPORT}.conf"

# 如果设置了auth的话，需要在关闭时提供密码字符串
# 配置一个自定义变量储存密码
AUTH_PASSWORD="123456"
# 在关闭stop case中增加"-a $AUTH_PASSWORD"
$CLIEXEC -p $REDISPORT -a $AUTH_PASSWORD shutdown
******************************
chkconfig redis on
```

----

### 3. 配置redis
``` bash
mkdir /etc/redis
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf
******************************
# 监听ip
bind 0.0.0.0

# 是否将redis以服务的形式启动
daemonize yes
#若指定了yes，则可通过pidfile来指定pid文件
pidfile /var/run/redis.pid

# 指定端口
port 6379

# Close the connection after a client is idle for N seconds (0 to disable)
timeout 0
#注意，此处的timeout是针对client

# 日志level和路径
loglevel notice
logfile ""

# RDB持久化文件名称
dbfilename dump.rdb

# AOF持久化文件名称
#是否开启AOF持久化
appendonly no
appendfilename "appendonly.aof"

# 工作目录，也是持久化文件存放目录（默认是根目录）
dir ./

# 设置密码
requirepass redis
******************************
```

----

### 4. 管理redis服务
``` bash
# 使用启动脚本
serivce redis start/stop

# 使用redis-server命令
redis-server /path/to/config.file
#启动脚本中的配置文件已经在脚本中指定了
```

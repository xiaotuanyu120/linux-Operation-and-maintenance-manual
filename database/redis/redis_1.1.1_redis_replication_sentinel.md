---
title: redis: 1.1.1 redis replication(sentinel集群)
date: 2017-08-08 15:20:00
categories: database/redis
tags: [redis,replication,sentinel]
---
### redis: 1.1.1 redis replication(sentinel集群)

---

### 1. 环境介绍
| hostname | ip | version | OS |
| :---: | :---: | :---: | :---: |
| sentinel01 | 192.168.33.41| 4.0.1 | centos 6.8 x86_64 |
| sentinel02 | 192.168.33.42| 4.0.1 | centos 6.8 x86_64 |
| sentinel03 | 192.168.33.43| 4.0.1 | centos 6.8 x86_64 |
| redis01 | 192.168.33.51| 4.0.1 | centos 6.8 x86_64 |
| redis02 | 192.168.33.52| 4.0.1 | centos 6.8 x86_64 |
| redis03 | 192.168.33.53| 4.0.1 | centos 6.8 x86_64 |

> sentinel集群必须为奇数，redis replication可以为2个节点或者多个节点

---

### 2. 安装并配置redis
所有节点包括sentinel节点都需要安装redis
#### 1) 安装redis
``` bash
wget http://download.redis.io/releases/redis-4.0.1.tar.gz
tar xzf redis-4.0.1.tar.gz
cd redis-4.0.1
make
make install
```

### 3. redis三节点配置
#### 1) 修改redis启动脚本
``` bash
cp utils/redis_init_script /etc/init.d/redis
chmod 755 /etc/init.d/redis
vi /etc/init.d/redis
******************************
# 在第2行添加
#chkconfig: 2345 80 90

# 因为我们配置了auth，需要在关闭时提供密码字符串
# 配置一个自定义变量
AUTH_PASSWORD="123456"
# 在关闭stop case中增加"-a $AUTH_PASSWORD"
$CLIEXEC -p $REDISPORT -a $AUTH_PASSWORD shutdown
******************************
chkconfig redis on
```
> 脚本里面有默认的端口和pid文件配置，如果配置文件中的相应配置改动了，需要在启动脚本相应改动选项

#### 2) 修改redis配置文件
redis节点上全部创建配置目录
``` bash
mkdir /etc/redis
```

redis01主节点修改以下配置
``` bash
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf
******************************
bind 0.0.0.0
daemonize yes
protected-mode no
pidfile /var/run/redis_6379.pid
port 6379
loglevel notice
logfile "/var/log/redis_6379.log"
masterauth 123456
requirepass 123456
******************************
```
> redis01主节点也配置masterauth是因为处理master角色转移后，本节点重新接入集群的情况

redis02和redis03上修改以下配置
``` bash
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf
******************************
bind 0.0.0.0
daemonize yes
protected-mode no
pidfile /var/run/redis_6379.pid
port 6379
loglevel notice
logfile "/var/log/redis_6379.log"
slaveof 192.168.33.51 6379
masterauth 123456
requirepass 123456
******************************
```
> redis02和redis03从节点之所以也配置requirepass，是为了等下redis集群failover功能，密码推荐和主上的密码一致


#### 3) 启动redis-server服务
``` bash
# 在三个redis节点上重启redis
service redis stop
service redis start
```

---

### 3. sentinel节点配置
[sentinel官方文档](http://redis.io/topics/sentinel)

#### 1) 修改sentinel启动脚本
``` bash
cp utils/redis_init_script /etc/init.d/sentinel
chmod 755 /etc/init.d/sentinel
vi /etc/init.d/sentinel
******************************
# 在第2行添加
#chkconfig: 2345 80 90

# 修改以下内容
EXEC=/usr/local/bin/redis-sentinel
REDISPORT=26379
PIDFILE=/var/run/sentinel.pid
CONF="/etc/redis/sentinel.conf"

# 修改启动命令为后台启动
$EXEC $CONF &
sleep 1
echo `ps aux |grep redis-sentinel|grep -v grep|awk '{print $2}'` > $PIDFILE

# 在停止命令后面加上删除pidfile的动作
echo "Redis stopped"
rm -rf $PIDFILE
******************************
chkconfig sentinel on
```

#### 2) 创建sentinel配置文件
``` bash
vi /etc/redis/sentinel.conf
******************************
bind 0.0.0.0
protected-mode no
daemonize yes
port 26379
loglevel notice
logfile "/var/log/sentinel.log"
sentinel monitor mymaster 192.168.33.51 6379 2
sentinel auth-pass mymaster 123456
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 8000
sentinel parallel-syncs mymaster 1
******************************
```
> `sentinel monitor <master-group-name> <ip> <port> <quorum>`  
> master-group-name 是自定义名称  
quorum 此数字代表分布式的sentinel中，最少几个节点侦测到master失败才切换

> `sentinel <option_name> <master_name> <option_value>`  
> sentinel 选项名称 自定义名称 选项值  
down-after-milliseconds 指定了多少ms连接不到该sentinel即认定其失效
其他配置查看官方文档链接

> protected-mode 一定要设置为no，不然的话，仅能localhost访问

#### 2) 启动sentinel服务
所有sentinel节点启动sentinel服务
``` bash
service sentinel start
```

---

### 4. 效果测试
#### 1) 查看redis replication信息
``` bash
# 主节点上执行
redis-cli
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.33.52,port=6379,state=online,offset=173294,lag=1
slave1:ip=192.168.33.53,port=6379,state=online,offset=173435,lag=1
master_replid:4d3fa0623c322feebecb70f7ad5f8525e63c0332
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:173576
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:173576
```
#### 2) 模拟redis01主节点失败
**sentinel日志**
``` bash
redis-cli -a 123456 shutdown

# sentinel01日志
7937:X 09 Aug 03:34:24.679 # +sdown master mymaster 192.168.33.51 6379
7937:X 09 Aug 03:34:24.809 # +new-epoch 1
7937:X 09 Aug 03:34:24.815 # +vote-for-leader 627b4ec63708908fe747117c83a4a87bc30cadad 1
7937:X 09 Aug 03:34:25.778 # +odown master mymaster 192.168.33.51 6379 #quorum 3/2
7937:X 09 Aug 03:34:25.778 # Next failover delay: I will not start a failover before Wed Aug  9 03:34:41 2017
7937:X 09 Aug 03:34:25.929 # +config-update-from sentinel 627b4ec63708908fe747117c83a4a87bc30cadad 192.168.33.43 26379 @ mymaster 192.168.33.51 6379
7937:X 09 Aug 03:34:25.929 # +switch-master mymaster 192.168.33.51 6379 192.168.33.52 6379
7937:X 09 Aug 03:34:25.930 * +slave slave 192.168.33.53:6379 192.168.33.53 6379 @ mymaster 192.168.33.52 6379
7937:X 09 Aug 03:34:25.930 * +slave slave 192.168.33.51:6379 192.168.33.51 6379 @ mymaster 192.168.33.52 6379
7937:X 09 Aug 03:34:30.996 # +sdown slave 192.168.33.51:6379 192.168.33.51 6379 @ mymaster 192.168.33.52 6379
```
> sentinel三个节点日志差不多，大概就是以下步骤:
> - 测试到redis01挂掉，发出sdown事件
> - 接收到其它节点的redis01挂掉信息，会将sdown升级为odown事件
> - 投票新的master，然后执行failover操作(sentinel会重写redis的配置文件)

**此时重新查看redis集群信息，redis02选为新的master，redis03为slave**
``` bash
redis-cli
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=192.168.33.53,port=6379,state=online,offset=206712,lag=0
master_replid:c9a68d6274d26542eb7bef75a0df10f6ce594152
master_replid2:2897700df07f0a75839738cd872ac8fc60a77b83
master_repl_offset:206712
second_repl_offset:27248
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:206712
```


**重新启动redis01，将会以slave身份加入到集群中**
``` bash
redis-cli
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.33.53,port=6379,state=online,offset=250152,lag=1
slave1:ip=192.168.33.51,port=6379,state=online,offset=250152,lag=0
master_replid:c9a68d6274d26542eb7bef75a0df10f6ce594152
master_replid2:2897700df07f0a75839738cd872ac8fc60a77b83
master_repl_offset:250152
second_repl_offset:27248
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:250152
```

---

### 7. sentinel管理
#### 1) 查看master信息
``` bash
# 用redis-cli连接sentinel的端口
redis-cli -p 26379
127.0.0.1:26379> sentinel master mymaster
 1) "name"
 2) "mymaster"
 3) "ip"
 4) "192.168.110.5"
 5) "port"
 6) "6381"
 7) "runid"
 8) "88460abc58aa7d2e159a29a7fe29f2d64aa72033"
 9) "flags"
10) "master"
11) "pending-commands"
12) "0"
13) "last-ping-sent"
14) "0"
15) "last-ok-ping-reply"
16) "404"
17) "last-ping-reply"
18) "404"
19) "down-after-milliseconds"
20) "60000"
21) "info-refresh"
22) "3270"
23) "role-reported"
24) "master"
25) "role-reported-time"
26) "8577307"
27) "config-epoch"
28) "2"
29) "num-slaves"
30) "2"
31) "num-other-sentinels"
32) "2"
33) "quorum"
34) "2"
35) "failover-timeout"
36) "180000"
37) "parallel-syncs"
38) "1"
```
其中"num-other-sentinels"代表了其他的sentinel节点个数  
"num-slaves"代表了slave节点个数  

使用以下两个命令可以看到slaves和sentinels的信息
```
SENTINEL slaves mymaster
SENTINEL sentinels mymaster
```

#### 2) 获取当前master信息
``` bash
127.0.0.1:26379> SENTINEL get-master-addr-by-name mymaster
1) "192.168.110.5"
2) "6381"
```

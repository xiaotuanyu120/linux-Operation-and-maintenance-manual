---
title: redis: 2.2.0 redis集群实现session共享
date: 2016-09-29 10:42:00
categories: linux/commonly_services
tags: [redis,session,tomcat,nginx]
---
### redis: 2.2.0 redis集群实现session共享

---

### 1. 环境介绍
**软件版本**
- nginx: 1.10.1
- tomcat: 6.0.45
- redis: 2.8.24

**软件架构**

| 软件名称 | HOST |
| :---: | :---: |
| nginx | 192.168.110.4|
| tomcat01 | 192.168.110.5|
| tomcat02 | 192.168.110.6|
| redis01 | 192.168.110.5|
| redis02 | 192.168.110.6|
| redis03 | 192.168.110.5|

---

### 2. 安装并配置nginx
在nginx节点执行以下命令
#### 1) 安装nginx
``` bash
yum install epel-release -y
yum install nginx -y
chkconfig nginx on
```
#### 2) 配置nginx
``` bash
# 新建nginx虚拟机配置文件
vim /etc/nginx/conf.d/sstest.conf
******************************
upstream ss {
    server 192.168.110.5:8080;
    server 192.168.110.6:8080;
}

server {
    listen 80;
    server_name 192.168.110.4 default_server;
    location / {
        proxy_pass http://ss;
    }
}
******************************
service nginx restart
```

---

### 3. 安装并配置tomcat
在两台tomcat节点执行以下命令

#### 1) 安装tomcat
``` bash
# 下载并安装jdk1.6
# 需要注册oracle帐号才能在下面下载
http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html
chmod u+x jre-6u45-linux-x64.bin
sh jre-6u45-linux-x64.bin
mv jre1.6.0_45 /usr/local/
ln -s /usr/local/jre1.6.0_45/ /usr/local/jdk
vi /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
source /etc/profile.d/java-env.sh

# 安装tomcat
wget http://mirror.rise.ph/apache/tomcat/tomcat-6/v6.0.45/bin/apache-tomcat-6.0.45.tar.gz
tar zxf apache-tomcat-6.0.45.tar.gz
mv apache-tomcat-6.0.45 /usr/local/tomcat
```


#### 2) 配置tomcat
``` bash
# 配置tomcat虚拟主机
vim /usr/local/tomcat/conf/server.xml
************************
<Host name="localhost"  appBase=""
      unpackWARs="true" autoDeploy="true">
  <Context path="" docBase="/data/webapps" reloadable="true" />
  ......
</Host>
************************

vim /usr/local/tomcat/conf/context.xml
******************************
    <Valve className="com.radiadesign.catalina.session.RedisSessionHandlerValve"/>
    <Manager className="com.radiadesign.catalina.session.RedisSessionManager"
     host="192.168.110.5"
     port="6379"
     password="123456"
     database="0"
     maxInactiveInterval="60"
     sentinelMaster="mymaster"
     sentinels="192.168.110.5:6379,192.168.110.5:6381,192.168.110.6:6380"
    />
******************************
```
[配置详细说明见此链接](https://github.com/jcoleman/tomcat-redis-session-manager)  
Valve要配置在Manager之前  
注意className，网上的都不一样，需要按照自己下载jar包的版本进行调整  
其中maxInactiveInterval，配置的是非活动状态最大持续时间，即用户停止操作多长时间停掉session。  
`password` 对应redis master配置文件中的requirepass配置项配置的密码  
`mymaster` 对应sentinel配置文件中的`sentinel monitor <master-group-name> <ip> <port> <quorum>`中的`<master-group-name>`

#### 3) 编写测试程序
``` bash
# 创建web程序目录
mkdir -p /data/webapps/{WEB-INF,META-INF,classes,lib}
cd /data/webapps

# 编写首页程序
# ss02上把Tomcat01更换成Tomcat02
vim index.jsp
***********************
<%@ page language="java" %>
<html>
  <head><title>Tomcat01</title></head>
  <body>
    <h1><font color="red">Tomcat01.magedu.com</font></h1>
    <table align="centre" border="1">
      <tr>
        <td>Session ID</td>
    <% session.setAttribute("magedu.com","magedu.com"); %>
        <td><%= session.getId() %></td>
      </tr>
      <tr>
        <td>Created on</td>
        <td><%= session.getCreationTime() %></td>
     </tr>
    </table>
  </body>
</html>
***********************
```

---

### 4. 安装并配置redis
在三台redis节点执行以下命令
#### 1) 安装redis
``` bash
wget http://download.redis.io/releases/redis-2.8.24.tar.gz
tar zxf redis-2.8.24.tar.gz
cd redis-2.8.24
make
make install
```

#### 2) 拷贝redis启动脚本
redis02和redis03上需要把下面的所有的6379修改为6380和6381  
另外由于6379和6381在同一台主机上，需要把6381端口的"chkconfig 2345 80 90"中的80和90改为其他不同数值，可以写为81和91
``` bash
cp utils/redis_init_script /etc/init.d/redis-6379
chmod 755 /etc/init.d/redis
vi /etc/init.d/redis
******************************
# 在第2行添加
#chkconfig: 2345 80 90

# 修改配置文件位置
EDISPORT=6379
CONF="/etc/redis/${REDISPORT}.conf"

# 如果设置了auth的话，需要在关闭时提供密码字符串
# 配置一个自定义变量
AUTH_PASSWORD="123456"
# 在关闭stop case中增加"-a $AUTH_PASSWORD"
$CLIEXEC -p $REDISPORT -a $AUTH_PASSWORD shutdown
******************************
chmod a+x /etc/init.d/redis-6379
chkconfig redis-6379 on
```

#### 3) 配置redis
注意不同redis节点配置不同
``` bash
mkdir /etc/redis

# redis01作为主节点，端口为6379
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf
******************************
bind 0.0.0.0
daemonize yes
pidfile /var/run/redis_6379.pid
port 6379
loglevel notice
logfile "/var/log/redis_6379.log"
masterauth 123456
requirepass 123456
******************************

# redis02作为从节点，端口为6380
cp redis.conf /etc/redis/6380.conf
vi /etc/redis/6380.conf
******************************
bind 0.0.0.0
daemonize yes
pidfile /var/run/redis_6380.pid
port 6380
loglevel notice
logfile "/var/log/redis_6380.log"
slaveof 192.168.110.5 6380
masterauth 123456
requirepass 123456
******************************
# 从节点之所以也配置requirepass，是为了等下redis集群failover功能，密码推荐和主上的密码一致

# redis03作为从节点，端口为6381
cp redis.conf /etc/redis/6381.conf
vi /etc/redis/6381.conf
******************************
bind 0.0.0.0
daemonize yes
pidfile /var/run/redis_6381.pid
port 6381
slaveof 192.168.110.5 6381
masterauth 123456
requirepass 123456
******************************
# 从节点之所以也配置requirepass，是为了等下redis集群failover功能，密码推荐和主上的密码一致
```

#### 4) 拷贝jar包到tomcat
``` bash
https://raw.githubusercontent.com/xiaotuanyu120/nginx_tomcat6_redis2.8/master/tomcat-redis-session-manager-1.2.jar
wget https://raw.githubusercontent.com/xiaotuanyu120/nginx_tomcat6_redis2.8/master/jedis-2.1.0.jar
wget https://raw.githubusercontent.com/xiaotuanyu120/nginx_tomcat6_redis2.8/master/commons-pool-1.6.jar

mv tomcat-redis-session-manager-1.2.jar jedis-2.1.0.jar commons-pool-1.6.jar /usr/local/tomcat/lib/
```
根据jdk和tomcat版本,需要的jar包完全不一样,不同的jar包版本对应的tomcat Context配置亦不同  
**错误经历**  
> 按照官方的提示，使用的tomcat-redis-session-manager-1.2-tomcat-6.jar这个发行的包，但是实际使用时，发现主页登录的验证码无法刷出，tomcat报错以下信息：  
RedisSession.setAttribute(RedisSession.java:56，按照作者的解释，是因为原key和新key皆为空，产生了空指针错误。  
> 解决办法：  
jcoleman给发现这个问题的一个哥们单独修改和编译了一个包，因为tomcat6版本太过老旧，作者没有去更新官方的包，https://github.com/jcoleman/tomcat-redis-session-manager/issues/13，换成这个页面上下载的包后，问题得到了完整的解决

#### 5) 启动服务
``` bash
# 在三个redis节点上重启redis
service redis-6379 stop
service redis-6379 start
service redis-6380 stop
service redis-6380 start
service redis-6381 stop
service redis-6381 start


# 在两个tomcat节点上重启tomcat
/usr/local/tomcat/bin/catalina.sh stop
/usr/local/tomcat/bin/catalina.sh start
```

---

### 5. 使用sentinel来实现主从切换功能
每个redis节点，配备一个sentinel，192.168.110.5上有两个节点，即在该主机上布置两个节点

**强烈推荐查看**[sentinel官方文档](http://redis.io/topics/sentinel)

#### 1) 创建sentinel配置文件
每个节点用不同的端口
``` bash
vi /etc/redis/sentinel01.conf
******************************
port 26379
sentinel monitor mymaster 192.168.110.5 6379 2
sentinel auth-pass mymaster 123456
sentinel down-after-milliseconds mymaster 60000
sentinel failover-timeout mymaster 180000
sentinel parallel-syncs mymaster 1
******************************
```
sentinel monitor <master-group-name> <ip> <port> <quorum>
> master-group-name 是自定义名称
quorum 此数字代表分布式的sentinel中，最少几个节点侦测到master失败才切换

sentinel <option_name> <master_name> <option_value>
> sentinel 选项名称 自定义名称 选项值
down-after-milliseconds 指定了多少ms连接不到该sentinel即认定其失效
其他配置查看官方文档链接

#### 2) 启动sentinel服务
``` bash
# 在192.168.110.5上启动1和3
redis-sentinel /etc/redis/sentinel01.conf &
redis-sentinel /etc/redis/sentinel03.conf &

# 在192.168.110.6上启动2
redis-sentinel /etc/redis/sentinel02.conf &
```

---

### 6. 效果测试
``` bash
# 分别访问tomca01和tomcat02
curl -I http://47.90.80.156:8080/
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Set-Cookie: JSESSIONID=7E548773A2181763F25C709490677B41; Path=/
Content-Type: text/html
Content-Length: 370
Date: Tue, 27 Sep 2016 08:32:06 GMT

curl -I http://47.90.80.167:8080/
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Set-Cookie: JSESSIONID=2E10147173A1565E1BAA79D766A29410; Path=/
Content-Type: text/html
Content-Length: 370
Date: Tue, 27 Sep 2016 08:32:29 GMT

# 负载均衡端访问
web端访问，session值统一

# 查看redis集群
redis-cli
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.110.5,port=6381,state=online,offset=30273,lag=1
slave1:ip=192.168.110.6,port=6380,state=online,offset=30273,lag=1
master_repl_offset:30273
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:30272

# 模拟master失败
kill -9 23861

# 6379日志
[24074] 29 Sep 14:02:01.167 # +switch-master mymaster 192.168.110.5 6379 192.168.110.6 6380
[24074] 29 Sep 14:02:01.167 * +slave slave 192.168.110.5:6381 192.168.110.5 6381 @ mymaster 192.168.110.6 6380
[24074] 29 Sep 14:02:01.167 * +slave slave 192.168.110.5:6379 192.168.110.5 6379 @ mymaster 192.168.110.6 6380
[23594] 29 Sep 14:02:02.136 * +slave-reconf-inprog slave 192.168.110.5:6381 192.168.110.5 6381 @ mymaster 192.168.110.5 6379
[23594] 29 Sep 14:02:02.136 * +slave-reconf-done slave 192.168.110.5:6381 192.168.110.5 6381 @ mymaster 192.168.110.5 6379
[23594] 29 Sep 14:02:02.226 # +failover-end master mymaster 192.168.110.5 6379

# 6380日志
[7893] 29 Sep 14:02:00.106 # +vote-for-leader bbacd3808d4ebb2a68c7f4a2912dd1ab749edd1c 1
[7893] 29 Sep 14:02:00.107 # +odown master mymaster 192.168.110.5 6379 #quorum 3/2
[7893] 29 Sep 14:02:00.107 # Next failover delay: I will not start a failover before Thu Sep 29 14:08:00 2016
[8085] 29 Sep 14:02:00.336 * Discarding previously cached master state.
[8085] 29 Sep 14:02:00.336 * MASTER MODE enabled (user request from 'id=2 addr=192.168.110.5:30379 fd=7 name=sentinel-bbacd380-cmd age=297 idle=0 flags=x db=0 sub=0 psub=0 multi=3 qbuf=0 qbuf-free=32768 obl=36 oll=0 omem=0 events=rw cmd=exec')
[8085] 29 Sep 14:02:00.338 # CONFIG REWRITE executed with success.
[7893] 29 Sep 14:02:01.166 # +config-update-from sentinel 192.168.110.5:26381 192.168.110.5 26381 @ mymaster 192.168.110.5 6379
[7893] 29 Sep 14:02:01.166 # +switch-master mymaster 192.168.110.5 6379 192.168.110.6 6380
[7893] 29 Sep 14:02:01.166 * +slave slave 192.168.110.5:6381 192.168.110.5 6381 @ mymaster 192.168.110.6 6380
[7893] 29 Sep 14:02:01.166 * +slave slave 192.168.110.5:6379 192.168.110.5 6379 @ mymaster 192.168.110.6 6380
[8085] 29 Sep 14:02:01.986 * Slave 192.168.110.5:6381 asks for synchronization

# 6381日志
[23880] 29 Sep 14:02:01.167 * SLAVE OF 192.168.110.6:6380 enabled (user request from 'id=3 addr=47.90.80.156:11171 fd=6 name=sentinel-bbacd380-cmd age=351 idle=0 flags=x db=0 sub=0 psub=0 multi=3 qbuf=139 qbuf-free=32629 obl=36 oll=0 omem=0 events=rw cmd=exec')
[23880] 29 Sep 14:02:01.168 # CONFIG REWRITE executed with success.
[23880] 29 Sep 14:02:01.985 * Connecting to MASTER 192.168.110.6:6380
[23880] 29 Sep 14:02:01.985 * MASTER <-> SLAVE sync started
[23880] 29 Sep 14:02:01.986 * Non blocking connect for SYNC fired the event.
[23880] 29 Sep 14:02:01.986 * Master replied to PING, replication can continue...
[23880] 29 Sep 14:02:01.987 * Partial resynchronization not possible (no cached master)
[23880] 29 Sep 14:02:02.007 * Full resync from master: 204067d8253c0ab852414f3f6bef1d708f768485:1

# 当重启6379后，6379作为6380的slave存在
redis-cli -p 6380
127.0.0.1:6380> auth 123456
OK
127.0.0.1:6380> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.110.5,port=6379,state=online,offset=20736,lag=0
slave1:ip=192.168.110.5,port=6381,state=online,offset=20597,lag=1
master_repl_offset:20875
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:20874
```
值得一提的是，当6380接管master身份时，也继承了master的可写配置，也就是说6380由原来的从身份只读状态，转变为了主身份可写状态。而6379在重新启动加入集群时，会默认接管6380原有的身份，也就是从身份只读状态，而这些功能的实现全部是由于sentinel节点提供的，实际是去修改了redis各自的配置文件和sentinel自己的配置文件。

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

---
title: zookeeper 1.4.0 管理（启动脚本）
date: 2017-09-26 14:33:00
categories: linux/service
tags: [zookeeper]
---
### zookeeper 1.4.0 管理（启动脚本）

---

### 1. zookeeperg管理
#### 1) zookeeper启动
``` bash
./bin/zkServer.sh start
ZooKeeper JMX enabled by default
Using config: /usr/local/src/zookeeper-3.4.9/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

#### 2) zookeeper连接
``` bash
bin/zkCli.sh -server 192.168.33.121:2181
[zk: 192.168.33.121:2181(CONNECTED) 0] help
ZooKeeper -server host:port cmd args
	connect host:port
	get path [watch]
	ls path [watch]
	set path data [version]
	rmr path
	delquota [-n|-b] path
	quit
	printwatches on|off
	create [-s] [-e] path data acl
	stat path [watch]
	close
	ls2 path [watch]
	history
	listquota path
	setAcl path acl
	getAcl path
	sync path
	redo cmdno
	addauth scheme auth
	delete path [version]
	setquota -n|-b val path
```
> 更多命令可查看zookeeper官网

---

### 2. zookeeper启动脚本
#### 1) 正确的配置日志位置和JAVA_HOME
默认情况下，zk会在执行启动命令的当前目录去创建一个zookeeper.out的nohup stdout文件当做zk的日志，为了使用启动脚本时方便查看日志，我们需要将日志固定在一个位置
``` bash
ZOOBINDIR=/home/server/zookeeper-3.4.9/bin
mkdir $ZOOBINDIR/../logs
vim $ZOOBINDIR/zkEnv.sh
***************************************
ZOO_LOG_DIR=${ZOOBINDIR}/../logs
ZOO_LOG4J_PROP="INFO,CONSOLE"
JAVA_HOME=/usr/local/java
***************************************
```
> 配置JAVA_HOME是为了避免系统环境中没有JAVA_HOME这个变量

#### 2) 启动脚本
创建启动脚本`/etc/init.d/zookeeper`
``` bash
#!/bin/bash

#chkconfig:2345 20 90
#description:zookeeper
#processname:zookeeper

case $1 in
    start)   /home/server/zookeeper-3.4.9/bin/zkServer.sh start ;;
    stop)    /home/server/zookeeper-3.4.9/bin/zkServer.sh stop ;;
    status)  /home/server/zookeeper-3.4.9/bin/zkServer.sh status ;;
    restart) /home/server/zookeeper-3.4.9/bin/zkServer.sh restart ;;
    *)       echo "require start|stop|status|restart" ;;
esac
```
使用启动脚本`zookeeper`控制zookeeper服务
``` bash
chmod 755 /etc/init.d/zookeeper
chkconfig zookeeper on
service zookeeper start|restart|status|stop
```

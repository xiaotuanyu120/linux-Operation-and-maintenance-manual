---
title: zookeeper 1.2.0 replicated 安装部署
date: 2017-03-06 16:09:00
categories: linux/service
tags: [zookeeper]
---
### zookeeper 1.2.0 replicated 安装部署

---

### 0. 环境
OS: centos6.9  
jdk: 1.7.0_79  
zookeeper: 3.4.9  

角色|ip
---|---
node1|192.168.33.121
node2|192.168.33.122
node3|192.168.33.123

[zookeeper3.4.9官方文档](http://zookeeper.apache.org/doc/r3.4.9/zookeeperStarted.html)  
[IBM中文zookeeper文档](https://www.ibm.com/developerworks/cn/opensource/os-cn-zookeeper/)  

---

### 1. zookeeper安装
#### 1) 下载zookeeper
各个节点均执行以下命令
``` bash
wget http://mirror.rise.ph/apache/zookeeper/zookeeper-3.4.9/zookeeper-3.4.9.tar.gz
tar zxvf zookeeper-3.4.9.tar.gz
```

#### 2) 配置zookeeper为replicated
以node1为例
``` bash
cd zookeeper-3.4.9
vim conf/zoo.cfg
*************************************
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
initLimit=5
syncLimit=2
server.1=192.168.33.121:2888:3888
server.2=192.168.33.122:2888:3888
server.3=192.168.33.123:2888:3888
*************************************
# 当然本机的ip也可以使用127.0.0.1

# 创建数据目录
mkdir /var/lib/zookeeper

# 创建myid文件来让zookeeper识别server身份
vi /var/lib/zookeeper/myid
*************************************
1
*************************************
```
> 配置文件的名称是自定义的，不过一般情况下创建为conf/zoo.cfg
- tickTime, zookeeper中的基本时间单元，单位是微秒。被用于心跳功能，最短会话超时时间是两倍的tickTime
- dataDir, 用于存储内存数据库快照，和更新数据库的事务日志，除非另有规定。
- clientPort, 用于客户端连接的端口
- initLimit：这个配置项是用来配置 Zookeeper 接受客户端（这里所说的客户端不是用户连接 Zookeeper 服务器的客户端，而是 Zookeeper 服务器集群中连接到 Leader 的 Follower 服务器）初始化连接时最长能忍受多少个心跳时间间隔数。当已经超过 10 个心跳的时间（也就是 tickTime）长度后 Zookeeper 服务器还没有收到客户端的返回信息，那么表明这个客户端连接失败。总的时间长度就是 5*2000=10 秒
- syncLimit：这个配置项标识 Leader 与 Follower 之间发送消息，请求和应答时间长度，最长不能超过多少个 tickTime 的时间长度，总的时间长度就是 2*2000=4 秒
- server.A=B：C：D：其中 A 是一个数字，表示这个是第几号服务器；B 是这个服务器的 ip 地址；C 表示的是这个服务器与集群中的 Leader 服务器交换信息的端口；D 表示的是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的 Leader，而这个端口就是用来执行选举时服务器相互通信的端口。如果是伪集群的配置方式，由于 B 都是一样，所以不同的 Zookeeper 实例通信端口号不能一样，所以要给它们分配不同的端口号。

---

### 2. zookeeperg管理
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

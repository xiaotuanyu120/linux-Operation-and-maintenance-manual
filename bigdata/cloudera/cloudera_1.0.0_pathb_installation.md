---
title: cloudera 1.0.0 pathB(生产环境-package) 安装
date: 2017-06-22 11:00:00
categories: bigdata/cloudera
tags: [hadoop,cloudera]
---
### cloudera 1.0.0 pathB(生产环境-package) 安装

---

### 0. 安装之前
#### 1) 什么是cloudera？
cloudera是一家hadoop的商业公司，提供hadoop的商业产品CDH(Cloudera Distribution including Apache Hadoop)。同时cloudera也是apache软件基金会的赞助商。

#### 2) 主机环境
ip|hostname|os|memory|cpu
---|---|---|---|---
192.168.33.60|cloudera-m|centos6.5|4096|2
192.168.33.61|cloudera-n1|centos6.5|2048|2
192.168.33.62|cloudera-n2|centos6.5|2048|2

#### 3) 系统配置(所有节点操作)
- 关闭防火墙
- 关闭selinux
- 将集群所有节点`hostname ip`写在各节点的`/etc/hosts`中，如下
	```
	192.168.33.60 cloudera-m
	192.168.33.61 cloudera-n1
	192.168.33.62 cloudera-n2
	```
- 解决透明大页问题：
  ``` bash
	echo never > /sys/kernel/mm/transparent_hugepage/defrag
	echo never > /sys/kernel/mm/transparent_hugepage/enabled
	```
- 降低虚拟内存需求率：
  ``` bash
	echo "vm.swappiness = 0" > /etc/sysctl.conf;sysctl -p
	```

> 以下操作过程，如果没有特别注明，都是在cloudera-m节点上操作

---

### 1. 安装cloudera manager之前的准备
#### 1) 配置单用户模式(可选)
此模式是针对那些不能用root登录的系统的，因为我们用的centos6可以使用root登录，跳过。
#### 2) centos5和RHEL5，安装py2.6/2.7和psycopg2供Hue使用(可选)
此步骤是针对于centos5和RHEL5的，因为它们自带的python版本太低
#### 3) 安装配置数据库
**安装mysql**
``` bash
# 下载mysql5.7 repo的rpm包
wget http://repo.mysql.com/mysql57-community-release-el6.rpm
# 安装后，会在/etc/yum.repos.d/下面发现多了mysql5.7的repo文件
yum install mysql57-community-release-el6.rpm

# 安装mysql5.7社区版
yum install mysql-community-server
```
**配置mysql**
``` bash
vi /etc/my.cnf
******************************************
[mysqld]
transaction-isolation = READ-COMMITTED
# Disabling symbolic-links is recommended to prevent assorted security risks;
# to do so, uncomment this line:
# symbolic-links = 0

key_buffer_size = 32M
max_allowed_packet = 32M
thread_stack = 256K
thread_cache_size = 64
query_cache_limit = 8M
query_cache_size = 64M
query_cache_type = 1

max_connections = 550
#expire_logs_days = 10
#max_binlog_size = 100M

#log_bin should be on a disk with enough free space. Replace '/var/lib/mysql/mysql_binary_log' with an appropriate path for your system
#and chown the specified folder to the mysql user.
log_bin=/var/lib/mysql/mysql_binary_log

# For MySQL version 5.1.8 or later. For older versions, reference MySQL documentation for configuration help.
binlog_format = mixed
server-id = 0
read_buffer_size = 2M
read_rnd_buffer_size = 16M
sort_buffer_size = 8M
join_buffer_size = 8M

# InnoDB settings
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit  = 2
innodb_log_buffer_size = 64M
innodb_buffer_pool_size = 4G
innodb_thread_concurrency = 8
innodb_flush_method = O_DIRECT
innodb_log_file_size = 512M

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

sql_mode=STRICT_ALL_TABLES
******************************************
```
> 配置要点：
- 配置isolation级别为READ-COMMITTED，避免死锁
- 配置引擎为InnoDB，Cloudera Manager只能使用InnoDB
- 配置innodb_flush_method为O_DIRECT，Cloudera Manager需要高吞吐量
- 根据cluster数量来配置数据库的max_connections
- binlog不是必须要配置的

**启动mysql**
``` bash
chkconfig mysqld on
service mysqld start
```
> 第一次的启动日志中会生成一个临时访问密码`A temporary password is generated for root@localhost: xf3U(yevIHfG`

**配置root密码**
``` bash
mysql_secure_installation
step 1 输入临时root密码
step 2 设定新的root密码(例如："Abc123!@#")
step 3 移除匿名用户
step 4 是否允许root远程访问
step 5 是否删除test库
step 6 是否现在重载权限
```

**安装mysql jdbc driver**  
凡是需要连接数据的组件所在的服务器都需要安装，所以推荐把所有需要连接数据库的组件安装在同一台服务器上
``` bash
wget https://cdn.mysql.com//Downloads/Connector-J/mysql-connector-java-5.1.42.tar.gz
tar zxvf mysql-connector-java-5.1.42.tar.gz
mkdir /usr/share/java -p
cp mysql-connector-java-5.1.42/mysql-connector-java-5.1.42-bin.jar /usr/share/java/mysql-connector-java.jar
```
> 不要使用yum安装，因为yum安装的是openjdk的版本

**创建Cloudera Manager使用的数据库**
``` sql
create database cmf;
use cmf;
grant all privileges on cmf.* to "cmf"@"%" identified by "Cmf5111!@#";
flush privileges;
```

---

### 2. Cloudera Manager
#### 1) 下载repo文件
``` bash
# 下载cm5版本的repo文件，默认采用cm5最新版本的源
wget -O /etc/yum.repos.d/cloudera-manager.repo https://archive.cloudera.com/cm5/redhat/6/x86_64/cm/cloudera-manager.repo

# 如果有需要的话，可以自定义子版本
vim /etc/yum.repos.d/cloudera-manager.repo
******************************************
[cloudera-manager]
# Packages for Cloudera Manager, Version 5, on RedHat or CentOS 6 x86_64           	  
name=Cloudera Manager
baseurl=https://archive.cloudera.com/cm5/redhat/6/x86_64/cm/5.11.1/
gpgkey =https://archive.cloudera.com/cm5/redhat/6/x86_64/cm/RPM-GPG-KEY-cloudera    
gpgcheck = 1
******************************************
```
#### 2) 安装Cloudera Manager
``` bash
yum install oracle-j2sdk1.7
yum install cloudera-manager-daemons cloudera-manager-server
```
> 或者可以使用非生产环境下的手动安装(pathA)
- 下载http://archive.cloudera.com/cm5/redhat/6/x86_64/cm/5.11.1/RPMS/x86_64/下的rpm包安装
- 下载http://archive.cloudera.com/cm5/installer/5.11.1/下的安装二进制文件执行安装  
会自动创建postgresql数据库

#### 3) 配置数据库连接
`vim /etc/cloudera-scm-server/db.properties`
```
# Copyright (c) 2012 Cloudera, Inc. All rights reserved.
#
# This file describes the database connection.
#

# The database type
# Currently 'mysql', 'postgresql' and 'oracle' are valid databases.
com.cloudera.cmf.db.type=mysql

# The database host
# If a non standard port is needed, use 'hostname:port'
com.cloudera.cmf.db.host=localhost

# The database name
com.cloudera.cmf.db.name=cmf

# The database user
com.cloudera.cmf.db.user=cmf

# The database user's password
com.cloudera.cmf.db.password=Cmf5111!@#

# The db setup type
# By default, it is set to INIT
# If scm-server uses Embedded DB then it is set to EMBEDDED
# If scm-server uses External DB then it is set to EXTERNAL
com.cloudera.cmf.db.setupType=EXTERNAL
```

#### 4) 启动Cloudera Manager
``` bash
service cloudera-scm-server start
```
> 启动需要一定时间，日志可查看/var/log/cloudera-scm-server/cloudera-scm-server.log


---

### 3. CDH集群安装
#### 1) 离线准备parcel文件(可选)
因为parcel文件很大，所以避免网络延迟，我们可以提前下载parcel文件在本地，然后再进行安装。  
我们需要安装5.11.1版本，所以我们访问http://archive.cloudera.com/cdh5/parcels/5.11.1/  

这里需要下载以下三个文件
- CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel
- CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha1(需要更名)
- manifest.json

``` bash
cd /opt/cloudera/parcel-repo/
wget http://archive.cloudera.com/cdh5/parcels/5.11.1/CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel
wget -O CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha http://archive.cloudera.com/cdh5/parcels/5.11.1/CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha1
wget http://archive.cloudera.com/cdh5/parcels/5.11.1/manifest.json

ls /opt/cloudera/parcel-repo/
CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel  CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha  manifest.json
```
> 更名CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha1为CDH-5.11.1-1.cdh5.11.1.p0.4-el6.parcel.sha

#### 2) 访问Cloudera Manager
- URL: http://192.168.33.60:7180
- 默认用户: admin
- 默认密码: admin

#### 3) 集群开始安装
1. 选择Cloudera版本  
  Cloudera Express或Cloudera Enterprise Data Hub试用版(60天)

2. SSH授权配置  
  通过查询cluster的ip和指定ssh端口增加cluster节点主机

3. 群集安装
	- step 1 选择Parcel包安装和CDH版本（本例中是5.11.1）
	- step 2 是否安装oracle-jdk（本例中安装）
	- step 3 是否启动单用户模式（本例中不启用）
	- step 4 填写CDH集群中节点主机的root帐号和密码-cloudera manager自动管理ssh
	- step 5 等待安装cloudera manager agent、jdk完毕
	- step 6 等待parcel安装CDH
	- step 7 等待检查主机正确性

4. 群集设置
	- step 1 选择需要安装的CDH5服务
	- step 2 自定义角色配置
	- step 3 数据库设置（提前给各角色创建好不同数据库-详情见[mysql安装配置官文](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_mysql.html)）
	- step 4 审核更改
	- step 5 首次运行各服务
	- step 6

---

### 4. 参考文档
#### 1) 官方英文文档
- [主要参考的官文 pathB](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_install_path_b.html#cmig_topic_6_6_1)
- [mysql 安装配置官文](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_mysql.html)

#### 2) 其他文档
- [CDH5安装指南-图文](http://www.jianshu.com/p/57179e03795f)
- [中国大数据cloudera](http://www.thebigdata.cn/Hadoop/29063.html)
- [老谭linux cloudera](http://cmdschool.blog.51cto.com/2420395/1775398)

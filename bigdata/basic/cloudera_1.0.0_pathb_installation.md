---
title: cloudera 1.0.0 pathB(生产环境-package) 安装
date: 2017-06-22 11:00:00
categories: bigdata/basic
tags: [hadoop,cloudera]
---
### cloudera 1.0.0 pathB(生产环境-package) 安装

---

### 0. 安装之前
#### 1) 什么是cloudera？
cloudera是一家hadoop的商业公司，提供hadoop的商业产品CDH(Cloudera Distribution including Apache Hadoop)。同时cloudera也是apache软件基金会的赞助商。
#### 2) 主机环境
ip|hostname|os
---|---|---
ip1|cloudera-m|centos6.5
ip2|cloudera-n1|centos6.5
#### 3) 系统配置
- 关闭防火墙
- 关闭selinux

---

### 1. 安装cloudera manager之前的准备
#### 1) 配置单用户模式(可选)
此模式是针对那些不能用root登录的系统的，因为我们用的centos6可以使用root登录，跳过。
#### 2) centos5和RHEL5，安装py2.6/2.7和psycopg2供Hue使用(可选)
此步骤是针对于centos5和RHEL5的，因为它们自带的python版本太低
#### 3) 安装配置数据库(在cloudera-m服务器上)
**安装mysql**
``` bash
wget http://repo.mysql.com/mysql57-community-release-el6.rpm
yum install mysql57-community-release-el6.rpm
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
> 第一次的启动日志中会生成一个临时访问密码`A temporary password is generated for root@localhost: lC-q%jPTk5nS`

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
grant all privileges on cmf.* to "cmf"@"localhost" identified by "Cmf5111!@#";
flush privileges;
```

---

### 1. Cloudera Manager
#### 1) 下载repo文件
``` bash
wget -O /etc/yum.repos.d/cloudera-manager.repo https://archive.cloudera.com/cm5/redhat/6/x86_64/cm/cloudera-manager.repo
```
#### 2) 安装Cloudera Manager
``` bash
yum install oracle-j2sdk1.7
yum install cloudera-manager-daemons cloudera-manager-server
```
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

#### 5) 访问Cloudera Manager
URL: http://192.168.33.60:7180
默认用户: admin
默认密码: admin
**集群安装准备工作**
step 1 给cluster其他节点做ssh认证
在cloudera-n1上修改/etc/hosts
```
192.168.33.61   cloudera-n1     cloudera-n1
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
```
**集群开始安装**
step 1 选择Cloudera Express或者Cloudera Enterprise Data Hub试用版(60天)
step 2 为 CDH 群集安装指定主机部分-通过查询cluster的ip和指定ssh端口增加cluster节点主机
step 3 群集安装部分-选择"使用 Parcel (建议)"-"CDH-5.11.1-1.cdh5.11.1.p0.4"
step 4 填写CDH集群中节点主机的root帐号和密码

---

### 2. 参考文档
[主要参考的官文 pathB](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_install_path_b.html#cmig_topic_6_6_1)
[mysql 安装配置官文](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_mysql.html)

---

### 3. 错误
#### 1) 错误1
```
2017-06-22 07:58:21,782 ERROR main:com.cloudera.server.cmf.components.ScmActive: ScmActive: Unable to retrieve non-local non-loopback IP address. Seeing address: cloudera-m/127.0.0.1.
2017-06-22 07:58:21,782 ERROR main:com.cloudera.server.cmf.components.ScmActive: ScmActive failed. Bootup = true
2017-06-22 07:58:21,782 ERROR main:com.cloudera.server.cmf.components.ScmActive: ScmActive was not able to access CM identity to validate it.
2017-06-22 07:58:21,782 ERROR main:com.cloudera.server.cmf.components.ScmActive: ScmActive is deferring the validation to the next run in 15 seconds.
```
解决过程：  
网上说是因为`/etc/hosts`中多了一句`127.0.0.1       cm`，需要注释掉这句。  
我打开自己的"/etc/hosts"
```
127.0.0.1       cloudera-m      cloudera-m
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
```
然后注释掉`127.0.0.1       cloudera-m      cloudera-m`，重新启动后，又遇到另外一个错误：
```
2017-06-22 08:45:39,171 ERROR main:com.cloudera.server.cmf.components.ScmActive: ScmActive:
java.net.UnknownHostException: cloudera-m: cloudera-m
	at java.net.InetAddress.getLocalHost(InetAddress.java:1473)
	at com.cloudera.server.cmf.components.ScmActive.markScmActive(ScmActive.java:184)
	at com.cloudera.server.cmf.bootstrap.EntityManagerFactoryBean.runScmActiveAtBootup(EntityManagerFactoryBean.java:412)
	at com.cloudera.server.cmf.bootstrap.EntityManagerFactoryBean.getObject(EntityManagerFactoryBean.java:129)
	at com.cloudera.server.cmf.bootstrap.EntityManagerFactoryBean.getObject(EntityManagerFactoryBean.java:65)
	at org.springframework.beans.factory.support.FactoryBeanRegistrySupport.doGetObjectFromFactoryBean(FactoryBeanRegistrySupport.java:142)
	at org.springframework.beans.factory.support.FactoryBeanRegistrySupport.getObjectFromFactoryBean(FactoryBeanRegistrySupport.java:102)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getObjectForBeanInstance(AbstractBeanFactory.java:1440)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:247)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:192)
	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:322)
	at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:106)
	at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:616)
	at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:148)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1003)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:907)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:485)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:456)
	at org.springframework.beans.factory.support.AbstractBeanFactory$1.getObject(AbstractBeanFactory.java:293)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:222)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:290)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:192)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingletons(DefaultListableBeanFactory.java:585)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:895)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:425)
	at com.cloudera.server.cmf.Main.bootstrapSpringContext(Main.java:387)
	at com.cloudera.server.cmf.Main.<init>(Main.java:242)
	at com.cloudera.server.cmf.Main.main(Main.java:216)
Caused by: java.net.UnknownHostException: cloudera-m
	at java.net.Inet4AddressImpl.lookupAllHostAddr(Native Method)
	at java.net.InetAddress$1.lookupAllHostAddr(InetAddress.java:901)
	at java.net.InetAddress.getAddressesFromNameService(InetAddress.java:1293)
	at java.net.InetAddress.getLocalHost(InetAddress.java:1469)
	... 27 more
```
这个错误是因为无法解析cloudera-m的ip地址，这简直就是跟上面的错误冲突了，于是我把hosts文件修改成如下
```
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.33.60 cloudera-m
```
结果重新启动竟然成功了

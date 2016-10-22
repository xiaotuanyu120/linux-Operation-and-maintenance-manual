MYSQL: mysql5.5双主配置
2016年9月22日
14:35
 
---
title: MyCat准备之mysql双主配置
date: 2016-09-22 10:15:00
categories: database
tags: [mysql,mycat]
---
### 环境准备
mysql01：192.168.110.129
mysql02：192.168.110.130
 
<!--more-->
 
### Mysql安装
**安装mysql5.5**（使用oneinstack包）
``` bash 
# on mysql01&mysql02
yum -y install wget screen python
wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz
tar xzf oneinstack-full.tar.gz
cd oneinstack
screen -S oneinstack
 
# 官方提示：不要使用sh和bash命令执行下面脚本
./install.sh
# 按照提示选择安装mysql5.5
```
 
### 配置mysql双主
**修改配置文件**
```
# on master01
vi /etc/my.cnf
************************
server-id = 1
binlog-ignore-db = mysql
binlog-ignore-db = information_schema
binlog-ignore-db = performance_schema
binlog-do-db = test
 
replicate-ignore-db = mysql
replicate-ignore-db = information_schema
replicate-ignore-db = performance_schema
replicate-do-db = test
 
auto-increment-increment = 2
auto-increment-offset = 1
************************
service mysqld restart
 
# on master02
vi /etc/my.cnf
************************
server-id = 2
binlog-ignore-db = mysql
binlog-ignore-db = information_schema
binlog-ignore-db = performance_schema
binlog-do-db = test
 
replicate-ignore-db = mysql
replicate-ignore-db = information_schema
replicate-ignore-db = performance_schema
replicate-do-db = test
 
auto-increment-increment = 2
auto-increment-offset = 2
************************
service mysqld restart
```
 
**资料同步及用户授权**
``` bash
# on master01
MySQL [(none)]> grant replication slave on *.* to 'slave'@'192.168.110.130' identified by '123456';
MySQL [(none)]> flush privileges;
MySQL [(none)]> FLUSH TABLES WITH READ LOCK;
 
mysqldump -u root -p test > test.sql
rsync -av ./test.sql root@192.168.110.130:/root/
 
MySQL [(none)]> UNLOCK TABLES;
 
# on master02
mysql -u root -p < test.sql
 
MySQL [(none)]> grant replication slave on *.* to 'slave'@'192.168.110.129' identified by '123456';
MySQL [(none)]> flush privileges;
```
 
**互相做主从**
``` bash
## master02做master01的从
# on master01
MySQL [(none)]> show master status\G
*************************** 1. row ***************************
            File: mysql-bin.000005
        Position: 599
    Binlog_Do_DB: test
Binlog_Ignore_DB: mysql,information_schema,performance_schema
1 row in set (0.00 sec)
 
# on master02
MySQL [(none)]> CHANGE MASTER TO
    -> MASTER_HOST='192.168.110.129',
    -> MASTER_PORT=3306,
    -> MASTER_USER='slave',
    -> MASTER_PASSWORD='123456',
    -> MASTER_LOG_FILE='mysql-bin.000005',
    -> MASTER_LOG_POS=599;
 
## master01做master02的从
# on master02
MySQL [(none)]> show master status\G
*************************** 1. row ***************************
            File: mysql-bin.000009
        Position: 753
    Binlog_Do_DB: test
Binlog_Ignore_DB: mysql,information_schema,performance_schema
 
# on master01
MySQL [(none)]> CHANGE MASTER TO
    -> MASTER_HOST='192.168.110.130',
    -> MASTER_PORT=3306,
    -> MASTER_USER='slave',
    -> MASTER_PASSWORD='123456',
    -> MASTER_LOG_FILE='mysql-bin.000009',
    -> MASTER_LOG_POS=753;
 
## 在两台mysql上都执行以下命令
MySQL [(none)]> start slave;
 
## 查看状态
# on master01
MySQL [(none)]> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.110.130
                  Master_User: slave
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000009
          Read_Master_Log_Pos: 753
               Relay_Log_File: mysql-relay-bin.000002
                Relay_Log_Pos: 253
        Relay_Master_Log_File: mysql-bin.000009
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: test
          Replicate_Ignore_DB: mysql,information_schema,performance_schema
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 753
              Relay_Log_Space: 409
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 2
1 row in set (0.00 sec)
 
# on master02
MySQL [(none)]> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.110.129
                  Master_User: slave
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000005
          Read_Master_Log_Pos: 599
               Relay_Log_File: mysql-relay-bin.000002
                Relay_Log_Pos: 253
        Relay_Master_Log_File: mysql-bin.000005
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: test
          Replicate_Ignore_DB: mysql,information_schema,performance_schema
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 599
              Relay_Log_Space: 409
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
1 row in set (0.00 sec)
```

error: 双主错误1593
2016年9月22日
11:05
 
---
title: MySQL主从错误1593
date: 2016-09-22 11:06:00
categories: database
tags: [mysql,replication,1593]
---
### 错误信息
在公司的某测试服务器上，发现两台mysql主从的测试服务器，ip分别为
103.27.109.19 master
103.27.109.22 slave
 
发现如下错误
 
<!--more-->
 
``` sql
# on master
MySQL [(none)]> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: 
                  Master_Host: 103.27.109.19
                  Master_User: mysync
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000003
          Read_Master_Log_Pos: 546
               Relay_Log_File: mysql-relay-bin.000004
                Relay_Log_Pos: 4
        Relay_Master_Log_File: mysql-bin.000003
             Slave_IO_Running: No
            Slave_SQL_Running: Yes
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 120
              Relay_Log_Space: 120
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
                Last_IO_Errno: 1593
                Last_IO_Error: Fatal error: The slave I/O thread stops because master and slave have equal MySQL server ids; these ids must be different for replication to work (or the --replicate-same-server-id option must be used on slave but this does not always make sense; please check the manual before using it).
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
                  Master_UUID: 
             Master_Info_File: /data/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for the slave I/O thread to update it
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 160913 11:26:39
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
1 row in set (0.00 sec)
 
 
# on slave
MySQL [(none)]> show slave status\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 103.27.109.19
                  Master_User: mysync
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000003
          Read_Master_Log_Pos: 7680761
               Relay_Log_File: mysql-relay-bin.000007
                Relay_Log_Pos: 7680924
        Relay_Master_Log_File: mysql-bin.000003
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: mysql.%,performance_schema.%,information_schema.%
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 7680761
              Relay_Log_Space: 7681260
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
                  Master_UUID: 696a4429-7343-11e6-8279-00155d6c0598
             Master_Info_File: /data/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for the slave I/O thread to update it
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
1 row in set (0.00 sec)
 
```
 
### 分析过程
**错误信息关键字**
``` sql
                Last_IO_Errno: 1593
                Last_IO_Error: Fatal error: The slave I/O thread stops because master and slave have equal MySQL server ids; these ids must be different for replication to work (or the --replicate-same-server-id option must be used on slave but this does not always make sense; please check the manual before using it).
```
 
1、从字面上来看，含义是两台mysql的server-id配置冲突，实际检查结果如下
``` bash
# on master
cat /etc/my.cnf |grep server-id
server-id =1
 
# on slave
cat /etc/my.cnf |grep server-id
server-id =2
```
 
2、谷歌查询报错信息，推荐排查过程如下
``` sql
MySQL [(none)]> show variables like "server_id";
MySQL [(none)]> show variables like "hostname";
MySQL [(none)]> show variables like "port";
MySQL [(none)]> show slave status\G
```
从最终结果中发现，server_id确实不冲突，hostname一致，port皆为3306
hostname的原因吗？以前做主从未修改过默认hostname也未出现error 1593。
仔细查看，发现一个问题，两个show slave status语句中，只有master的出现了1593的错误，而slave上是正常的，如果是因为server_id或hostname，应该两台同时出错，再次仔细排查，发现真正原因所在。
 
原来，是因为master上也错误配置了Master_Host: 103.27.109.19，自己如何来给自己做从啊。
 
### 解决方案
重新在master做从解决
``` bash
# slave做备份
mysqldump -u root -p --master-data bbs > bbs.sql
 
# 传到master上
rsync -av ./bbs.sql root@103.27.109.19:/root/
 
# 停掉master上的slave
MySQL [(none)]> stop slave;
Query OK, 0 rows affected (0.01 sec)
 
# 恢复最新备份
mysql -u root -p < bbs.sql
 
# 重做slave
MySQL [(none)]> change master to
    -> MASTER_HOST="103.27.109.22",
    -> MASTER_PORT=3306,
    -> MASTER_USER="slave",
    -> MASTER_PASSWORD='123456';
Query OK, 0 rows affected, 2 warnings (0.02 sec)
 
MySQL [(none)]> start slave;
Query OK, 0 rows affected (0.01 sec)
 
# 查看结果，一切正常
MySQL [(none)]> show slave status \G
```

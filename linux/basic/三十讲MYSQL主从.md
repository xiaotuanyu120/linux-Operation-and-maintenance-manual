---
title: 三十讲MYSQL主从
date: 2015-1-30 20:33:00
categories: linux/basic
tags:
---
 
本节内容:MYSQL主从配置
 
基础主从配置
1、环境介绍
#web03主机，将作为mysql主配置
[root@web03 ~]# ifconfig|grep -A1 eth1
eth1      Link encap:Ethernet  HWaddr 00:0C:29:24:9E:DD
          inet addr:192.168.0.27  Bcast:192.168.0.255  Mask:255.255.255.0
[root@web03 ~]# mysql -V
mysql  Ver 14.14 Distrib 5.6.22, for linux-glibc2.5 (i686) using  EditLine wrapper
 
#filesbak主机，将作为mysql从配置
[root@filesbak ~]# ifconfig|grep -A1 eth
eth2      Link encap:Ethernet  HWaddr 00:0C:29:6E:D6:11
          inet addr:192.168.0.5  Bcast:192.168.0.255  Mask:255.255.255.0
[root@filesbak ~]# mysql -V
mysql  Ver 14.14 Distrib 5.1.73, for pc-linux-gnu (i686) using  EditLine wrapper
 
2、把mysql主服务器上的discuz库备份并恢复到mysql从服务器上
[root@web03 ~]# mysqldump -u root -p discuz > ~/discuz.20150131.sql
Enter password:
[root@filesbak ~]# mysql -u root -p discuz < discuz.20150131.sql
Enter password:
 
3、配置主mysql
#修改配置文件
[root@web03 etc]# vi /etc/my.cnf
===========================================
#修改内容如下
 log_bin=discuz_log
 server_id = 0
  binlog-do-db=discuz                          #允许主从复制的库
#binlog-ignore-db=db1,db2              #禁止主从复制的库
===========================================
#重启mysql服务
[root@web03 etc]# service mysqld restart
Shutting down MySQL... SUCCESS!
Starting MySQL........... SUCCESS!
#进入mysql，创建slave用户
[root@web03 etc]# mysql -uroot -p
Enter password:
。。。省略。。。
mysql> grant replication slave on *.* to 'slave'@'192.168.0.5' identified by '123456';
Query OK, 0 rows affected (0.04 sec)
 
mysql> flush tables with read lock;
Query OK, 0 rows affected (0.00 sec)
 
mysql> show master status;
+-------------------+----------+--------------+------------------+-------------------+
| File              | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+-------------------+----------+--------------+------------------+-------------------+
| discuz_log.000003 |      120 | discuz       |                  |                   |
+-------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
 
4、配置从mysql
[root@filesbak ~]# vi /etc/my.cnf
===========================================
#log-bin=mysql-bin
server-id       = 1
binlog-do-db=discuz                              #这里的配置是分开关，优先级低于master上的配置
#binlog-ignore-db=db1,db2
===========================================
[root@filesbak ~]# service mysqld restart
Shutting down MySQL. SUCCESS!
Starting MySQL.. SUCCESS!
[root@filesbak ~]# mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
。。。省略。。。
mysql> slave stop;          #先把slave停掉
Query OK, 0 rows affected, 1 warning (0.00 sec)
 
#最核心的主从配置语句，指定master数据库的信息，注意逗号之后有空格！
mysql> change master to master_host='192.168.0.27', master_port=3306, master_user='slave', master_password='123456', master_log_file='discuz_log.000001', master_log_pos=329;
#master_user是我们在master上创建的赋予replication slave权限的账户
#master_port为默认端口3306时可不用指定
#master_log_file和master_log_pos就是在master上show出来的master的状态信息
Query OK, 0 rows affected (0.25 sec)
 
mysql> slave start;
Query OK, 0 rows affected (0.01 sec)
#去主上操作
[root@web03 etc]# mysql -u root -p -e 'unlock tables'
Enter password:
#从上查看状态
mysql> show slave status\G          #从上查看slave状态
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.0.27
                  Master_User: slave
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: discuz_log.000003
          Read_Master_Log_Pos: 120
               Relay_Log_File: filesbak-relay-bin.000002
                Relay_Log_Pos: 266
        Relay_Master_Log_File: discuz_log.000003
             Slave_IO_Running: Yes
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
              Relay_Log_Space: 424
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
1 row in set (0.00 sec)
 
5、错误排查
#报错信息
"mysql> show slave status\G"时报错
             Slave_IO_Running: No
            Slave_SQL_Running: Yes
                Last_IO_Errno: 1236
                Last_IO_Error: Got fatal error 1236 from master when reading data from binary log: 'Slave can not handle replication events with the checksum that master is configured to log; the first event 'discuz_log.000002' '
#解决方案-主mysql修改配置
[root@web03 ~]# vi /etc/my.cnf
=================================
#添加以下语句
binlog_checksum=none
=================================
[root@web03 ~]# service mysqld restart
#总结：既然slave无法搞定master上的checksum 那么，我们便在master上关掉它-"binlog_checksum=none"
 
扩展、如何禁止mysql记录命令记录
把/dev/null做一个软连接到~/.mysql_history即可

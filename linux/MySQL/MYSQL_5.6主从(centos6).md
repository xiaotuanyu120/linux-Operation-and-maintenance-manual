MYSQL: 5.6主从(centos6)
Saturday, November 7, 2015
3:15 PM
 
MYSQL REPLICATION
===================================================
0、selinux&iptables
# vim /etc/selinux/config
*******************************
SELINUX=disabled
*******************************
# setenforce 0
# service iptables stop
# chkconfig iptables off1、master-mysql
## 配置master
# vim /etc/my.cnf
******************************
server_id = 1
log_bin=/data/mysql/bin_log
******************************
# service mysqld restart
 
## 备份master数据库
# mysqldump -uroot -p --all-databases --master-data --flush-logs> masterdump.sql
## 上面的--master-data参数将bin-log的内容同步到了备份中，这样就不用暂停数据库和手动指定binlog的position了
## 如果不想备份所有数据库，可以"--databases db1 db2 ..."
 
# grep CHANGE *sql | head -1
CHANGE MASTER TO MASTER_LOG_FILE='bin_log.000001', MASTER_LOG_POS=120;
 
## 创建slave同步用的user
# mysql -uroot -p
mysql> grant replication slave on *.* to 'slave'@'%' identified by 'sudoslave';
## 上面的'%'意思是，可以用任意的ip来远程访问master mysql2、slave-mysql
## 配置slave
# vim /etc/my.cnf
******************************
server_id = 2
log_bin=/data/mysql/bin_log
******************************
# service mysqld restart
 
## 拷贝master备份数据到slave上
# rsync -av /root/masterdump.sql root@172.16.2.48:/root/
 
## 恢复master备份数据到slave上
# mysql -u root -p < masterdump.sql
 
## 指派master信息
# mysql -u root -p
mysql> CHANGE MASTER TO
    -> MASTER_HOST='172.16.2.47',
    -> MASTER_PORT=3306,
    -> MASTER_USER='slave',
    -> MASTER_PASSWORD='sudoslave';
 
## 开启slave & 查看状态
mysql> start slave;
mysql> show slave status\G
*************************** 1. row ***************************
...以下信息有省略...
               Slave_IO_State: Waiting for master to send event
              Master_Log_File: bin_log.000003
          Read_Master_Log_Pos: 120
               Relay_Log_File: slave-relay-bin.000005
                Relay_Log_Pos: 281
        Relay_Master_Log_File: bin_log.000003
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: d0d980a4-8e30-11e5-acb9-000c290f3e50
             Master_Info_File: /data/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for the slave I/O thread to update it
           Master_Retry_Count: 864003、如何指定哪个库被主从
环境准备
=====================================================
## 主库新建数据库
mysql> create database replication2;
mysql> use replication2
mysql> create table reptab(
    -> id int(5),
    -> name varchar(10));
mysql> insert into reptab
    -> values (1,'first');
## 从库查看
mysql> select * from replication2.reptab;
+------+-------+
| id   | name  |
+------+-------+
|    1 | first |
+------+-------+
1 row in set (0.00 sec)
 
主从指定库配置
======================================================
## master修改配置，指定记录binlog的数据库(无binlog也就意味着无法被同步)
# vim /etc/my.cnf
******************************
binlog-do-db=replication
binlog-ignore-db=replication2
******************************
# service mysqld restart
 
## slave修改配置，指定同步的数据库
# vim /etc/my.cnf
******************************
replicate-do-db=需要复制的数据库名
replicate-ignore-db=不需要复制的数据库名
******************************
# service mysqld restart
 
 
查看状态
======================================================
## 主库修改数据
mysql> use replication2
mysql> insert into reptab
    -> values (2,'second');
mysql> use replication
mysql> insert into replitab
    -> values (6,'six');
## 从库查看数据
mysql> select * from replication2.reptab;
+------+-------+
| id   | name  |
+------+-------+
|    1 | first |
+------+-------+
mysql> select * from replication.replitab;
+------+-------+
| id   | name  |
+------+-------+
|    1 | ONE   |
|    2 | TWO   |
|    3 | THREE |
|    4 | FOUR  |
|    5 | five  |
|    6 | six   |
+------+-------+
## 推测：从库没有再继续同步replication2数据库，但因为已经同步了一点数据，所以在slave status中并没有显示跳过了replication2数据库。
## 为了验证上面的推测，我继续尝试去创建第三个库，再创建之前就去my.cnf中增加了ignore的配置（用逗号间隔库名），重启数据库服务，果然从库不会复制第三个库，但是关闭又重启slave之后，Replicate_Ignore_DB:字段依然是空，证明我上面推测的并不准确。 
MYSQL主从原理

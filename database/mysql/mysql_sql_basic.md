---
title: MYSQL-sql语句：常用操作
date: 2015-01-14 19:04:00
categories: database/mysql
tags: [database,mysql]
---
### MYSQL-sql语句：常用操作

---

### 1. 对数据库进行的操作
#### 1) 查看所有数据库
``` sql
mysql> show databases \G
*************************** 1. row ***************************
Database: information_schema
...
Database: test
*************************** 6. row ***************************
Database: test1
6 rows in set (0.00 sec)
```

#### 2) 查看某个库的表
``` sql
mysql> use mysql;show tables \G
Database changed
*************************** 1. row ***************************
Tables_in_mysql: columns_priv
...
*************************** 23. row ***************************
Tables_in_mysql: user
23 rows in set (0.00 sec)
```

#### 3) 查看表结构
``` sql
mysql> desc user;
+-----------------------+-----------------------------------+------+-----+---------+-------+
| Field                 | Type                              | Null | Key | Default | Extra |
+-----------------------+-----------------------------------+------+-----+---------+-------+
| Host                  | char(60)                          | NO   | PRI |         |       |
| User                  | char(16)                          | NO   | PRI |         |       |
| Password              | char(41)                          | NO   |     |         |       |
| Select_priv           | enum('N','Y')                     | NO   |     | N       |       |
| Insert_priv           | enum('N','Y')                     | NO   |     | N       |       |
...
| x509_subject          | blob                              | NO   |     | NULL    |       |
| max_questions         | int(11) unsigned                  | NO   |     | 0       |       |
| max_updates           | int(11) unsigned                  | NO   |     | 0       |       |
| max_connections       | int(11) unsigned                  | NO   |     | 0       |       |
| max_user_connections  | int(11) unsigned                  | NO   |     | 0       |       |
+-----------------------+-----------------------------------+------+-----+---------+-------+
39 rows in set (0.01 sec)
```

#### 4) 查看建表语句
``` sql
mysql> show create table user \G
*************************** 1. row ***************************
       Table: user
Create Table: CREATE TABLE `user` (
  `Host` char(60) COLLATE utf8_bin NOT NULL DEFAULT '',
  `User` char(16) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Password` char(41) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL DEFAULT '',
  ...
  `max_connections` int(11) unsigned NOT NULL DEFAULT '0',
  `max_user_connections` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`Host`,`User`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and global privileges'
1 row in set (0.00 sec)
```

#### 5) 查看当前用户、数据库、系统版本、mysql状态、正在执行的任务
``` sql
mysql> select user() \G
*************************** 1. row ***************************
user(): root@localhost
1 row in set (0.00 sec)

mysql> select database() \G
*************************** 1. row ***************************
database(): mysql
1 row in set (0.00 sec)

mysql> select version() \G
*************************** 1. row ***************************
version(): 5.1.73-log
1 row in set (0.00 sec)

mysql> show status ;
+----------------------------+----------+
| Variable_name              | Value    |
+----------------------------+----------+
| Aborted_clients            | 0        |
| Aborted_connects           | 1        |
| Binlog_cache_disk_use      | 0        |
| Binlog_cache_use           | 0        |
。。。省略。。。
| Threads_created            | 1        |
| Threads_running            | 1        |
| Uptime                     | 4270     |
| Uptime_since_flush_status  | 4270     |
+----------------------------+----------+
226 rows in set (0.00 sec)

mysql> show processlist;
+----+------+-----------+-------+---------+------+-------+------------------+
| Id | User | Host      | db    | Command | Time | State | Info             |
+----+------+-----------+-------+---------+------+-------+------------------+
|  7 | root | localhost | mysql | Query   |    0 | NULL  | show processlist |
+----+------+-----------+-------+---------+------+-------+------------------+
1 row in set (0.02 sec)
```

#### 6) 查看当前连接数
``` sql
mysql> show status like "Threads_connected";
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Threads_connected | 59    |
+-------------------+-------+
1 row in set (0.00 sec)
```

#### 7) 查看连接请求数(成功和未成功的都算)
``` sql
mysql> show status like "Connections";
+---------------+----------+
| Variable_name | Value    |
+---------------+----------+
| Connections   | 13630617 |
+---------------+----------+
1 row in set (0.00 sec)
```

#### 8) 修改mysql参数
``` sql
mysql> show variables like 'max_conne%';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| max_connect_errors | 10    |
| max_connections    | 151   |
+--------------------+-------+
2 rows in set (0.00 sec)

mysql> set global max_connect_errors=1000;
Query OK, 0 rows affected (0.00 sec)

mysql> show variables like 'max_conne%';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| max_connect_errors | 1000  |
| max_connections    | 151   |
+--------------------+-------+
2 rows in set (0.00 sec)
```

#### 9) 创建库、创建表、删除表、删除库
``` sql
mysql> create database test01;
Query OK, 1 row affected (0.00 sec)

mysql> create table test01_tb (id int(5),name varchar(10));
Query OK, 0 rows affected (0.08 sec)

mysql> drop table test01_tb;
Query OK, 0 rows affected (0.03 sec)

mysql> drop database test01;
Query OK, 0 rows affected (0.03 sec)
```

#### 10) 清空表、修复表
``` sql
-- 清空表
mysql> truncate table test01;
Query OK, 0 rows affected (0.01 sec)
-- 修复表
mysql> repair table tb1 [use frm];
-- http://dev.mysql.com/doc/refman/5.7/en/repair-table.html
-- 此命令只针对MyISAM, ARCHIVE, 和 CSV 表
```

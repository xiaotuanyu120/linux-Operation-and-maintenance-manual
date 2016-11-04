---
title: mysql无法启动排障
date: 2016-11-04 10:37:00
categories: linux/mysql
tags: [mysql,linux,error,innodb,init,auto-extend]
---
### mysql无法启动排障
#### mysql启动报错过程及错误定位
环境介绍:
- 系统：centos6 x86_64
- 数据库：mysql 5.6

线上机器重启后，启动mysql报错
``` bash
service mysqld start
Starting MySQL.The server quit without updating PID file (/var/lib/mysql/tserver.pid).[FAILED]
```

按照经验，原以为是pid文件未在配置文件和启动脚本中指定的原因，但是配置上之后重启错误依旧在  
网上很多不靠谱的答案，例如重装mysql和重新初始化mysql-data，线上机器哪能这样搞，就算可以解决，备份数据和恢复数据也是时间成本  

于是查看mysql错误日志
```
161104 10:26:17 mysqld_safe Starting mysqld daemon with databases from /home/Data/myS
161104 10:26:17 [Note] /usr/local/mysql/bin/mysqld (mysqld 5.5.50-log) starting as process 20659 ...
161104 10:26:17 InnoDB: The InnoDB memory heap is disabled
161104 10:26:17 InnoDB: Mutexes and rw_locks use GCC atomic builtins
161104 10:26:17 InnoDB: Compressed tables use zlib 1.2.3
161104 10:26:17 InnoDB: Using Linux native AIO
161104 10:26:17 InnoDB: Initializing buffer pool, size = 4.0G
161104 10:26:18 InnoDB: Completed initialization of buffer pool
InnoDB: Error: auto-extending data file /home/Data/myS/ibdata1 is of a different size
InnoDB: 1152 pages (rounded down to MB) than specified in the .cnf file:
InnoDB: initial 33536 pages, max 0 (relevant if non-zero) pages!
161104 10:26:18 InnoDB: Could not open or create data files.
161104 10:26:18 InnoDB: If you tried to add new data files, and it failed here,
161104 10:26:18 InnoDB: you should now edit innodb_data_file_path in my.cnf back
161104 10:26:18 InnoDB: to what it was, and remove the new ibdata files InnoDB created
161104 10:26:18 InnoDB: in this failed attempt. InnoDB only wrote those files full of
161104 10:26:18 InnoDB: zeros, but did not yet use them in any way. But be careful: do not
161104 10:26:18 InnoDB: remove old data files which contain your precious data!
161104 10:26:18 [ERROR] Plugin 'InnoDB' init function returned error.
161104 10:26:18 [ERROR] Plugin 'InnoDB' registration as a STORAGE ENGINE failed.
161104 10:26:18 [ERROR] Unknown/unsupported storage engine: InnoDB
161104 10:26:18 [ERROR] Aborting

161104 10:26:18 [Note] /usr/local/mysql/bin/mysqld: Shutdown complete

161104 10:26:18 mysqld_safe mysqld from pid file /usr/local/mysql/var/mysql.pid ended
```

发现错误开始于下面这个错误，直接导致了InnoDB的初始化失败
```
InnoDB: Error: auto-extending data file /home/Data/myS/ibdata1 is of a different size
InnoDB: 1152 pages (rounded down to MB) than specified in the .cnf file:
InnoDB: initial 33536 pages, max 0 (relevant if non-zero) pages!
```

#### 错误解决的知识学习
通过网查，聚焦到以下两个<code>/etc/my.cnf</code>中的配置
```
innodb_log_file_size = 256M
# 指定了redo log的大小
# redo log是一组文件，名称为ib_logfile0和ib_logfile1，用于崩溃时恢复用。

innodb_data_file_path = ibdata1:524M:autoextend
# 指定了innodb的数据文件及其大小
```
官方配置说明：  
- [innodb_log_file_size configuration](https://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html#sysvar_innodb_log_file_size)  
- [redo log file](https://dev.mysql.com/doc/refman/5.6/en/glossary.html#glos_redo_log)  
- [innodb_data_file_path configuration](https://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html#sysvar_innodb_data_file_path)  
- [innodb data file](https://dev.mysql.com/doc/refman/5.6/en/glossary.html#glos_data_files)

参考链接：
- [以上配置修改测试](http://blog.csdn.net/hw_libo/article/details/39215723)
- [错误解决办法参考](http://marvelyu.blog.51cto.com/471030/1353288)

#### 解决过程
1. 按照网查结果，删除mysql数据目录中的redo log文件和datafile，重启错误依旧
2. 因为报错信息跟innodb_data_file_path配置有关，更改其配置中的524M为14M，重启问题解决

思考：
从字面上理解，mysql初始化innodb引擎时去加载数据文件，发现数据文件的大小和配置中的不相符。它说按照配置中的数字比实际的大约小了1152 pages。没怎么理解，但是大体意思是这个配置和实际情况不一样。

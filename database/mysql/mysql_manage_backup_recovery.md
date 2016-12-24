---
title: MYSQL-管理：备份及恢复
date: 2015-01-14 19:04:00
categories: database/mysql
tags: [database,mysql]
---
### MYSQL-管理：备份及恢复

---

### 1. 备份与恢复数据库
#### 1) 备份数据库discuz
``` bash
[root@web02 ~]# mysqldump -uroot -p discuz > discuz_20150116.sql
Enter password:
[root@web02 ~]# ll discuz_20150116.sql
-rw-r--r-- 1 root root 4674702 Jan 16 17:30 discuz_20150116.sql
```

#### 2) 恢复数据库discuz
``` bash
[root@web02 ~]# mysql -uroot -p discuz < discuz_20150116.sql
Enter password:
```

#### 3) 备份单独一个表
``` bash
[root@web02 ~]# mysqldump -u root -p mysql user > mysql_user_20150116.sql
Enter password:
[root@web02 ~]# ll mysql_user_20150116.sql
-rw-r--r-- 1 root root 5430 Jan 16 17:35 mysql_user_20150116.sql
```

#### 4) 备份及恢复时指定字符集
``` bash
# 备份时指定字符集
mysqldump -uroot -p --default-character-set=utf8 db > 1.sql
# 恢复也指定字符集
mysql -uroot -p --default-character-set=utf8 db < 1.sql
# 字符集必须与你创建表的字符集一致
```

#### 5) 强制切换新的binlog文件
``` bash
mysqladmin -u root -p -e "flush logs"
# 其中的flush logs意为强制刷新binlog文件，开新日志；
# mysqldump的时候也可以加来强制更新binlog文件。
```

#### 6) 热备份恢复到某个时间点
``` bash
mysqlbinlog --stop-datetime="时间点" binlog.file | mysql -u -p
# 把数据库用binlog恢复到某个时间点，后面的管道跟mysql -u -p 意为把前面的信息交给数据库执行
# 总结：为了数据库安全，尽量用innodb数据库结构，完全备份mysqldump和增量备份binlog的mysqlbinlog方式备份。
```

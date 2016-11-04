error: 5.6-error-1045
2016年4月21日
10:34
 
## root登录时发现1045错误
# mysql -u root -p -hlocalhost
Enter password: 
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
 
## 解决办法
## skip-grant或者用其他有权限的用户登录进去
mysql> update mysql.user set password=password('dfdH236Fiuk89443gREWGER233OFOIJ') where user='root';
Query OK, 3 rows affected (0.00 sec)
Rows matched: 3  Changed: 3  Warnings: 0
 
mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
 
## root创建用户时1045错误
mysql> select current_user();
+----------------+
| current_user() |
+----------------+
| admin@%        |
+----------------+
1 row in set (0.00 sec)
 
mysql> show grants for 'admin'@'%'\G
*************************** 1. row ***************************
Grants for admin@%: GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, SHUTDOWN, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, SUPER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'admin'@'%' IDENTIFIED BY PASSWORD '*DC272C03782058C9313AC508B08CFE94882C5CAD' WITH GRANT OPTION
1 row in set (0.00 sec)
 
mysql> select user,host from mysql.user;
+----------------+-----------------------+
| user           | host                  |
+----------------+-----------------------+
| admin          | %                     |
| mysql_web_user | 127.0.0.1             |
| root           | 127.0.0.1             |
| mysql_web_user | localhost             |
| root           | localhost             |
| test           | localhost             |
| root           | localhost.localdomain |
+----------------+-----------------------+
7 rows in set (0.00 sec)
 
## 无法grant所有表的所有权限
mysql> grant all privileges on *.* to 'test'@'localhost';
ERROR 1045 (28000): Access denied for user 'admin'@'%' (using password: YES)
 
## 但可以grant部分表的权限
mysql> grant all privileges on some_db.* to 'test'@'localhost';
Query OK, 0 rows affected (0.00 sec)
## 网上有人说这是因为admin本身没有all privileges所以无法授权*.*
 
## 解决办法
mysql> grant all privileges on `%`.* to 'test'@'localhost';
Query OK, 0 rows affected (0.00 sec)

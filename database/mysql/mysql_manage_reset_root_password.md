---
title: MYSQL-管理：忘记root密码
date: 2015-01-14 19:04:00
categories: database/mysql
tags: [database,mysql]
---
### MYSQL-管理：忘记root密码

---

### 1. 修改配置文件
``` bash
# vi /etc/my.cnf
**************************
[mysqld]
#添加下面字段，意思是跳过授权过程，也就是说不需要输入密码登入
skip-grant
**************************
```

---

### 2. 重启mysqld服务
``` bash
# service mysqld restart
Shutting down MySQL. SUCCESS!
Starting MySQL. SUCCESS!
```

---

### 3. 用root无密码登入，然后修改密码退出
``` bash
# mysql -u root
mysql> use mysql;
Database changed

mysql> update user set password=password('sudomysql') where user='root' ;      
Query OK, 2 rows affected (0.03 sec)
Rows matched: 3  Changed: 2  Warnings: 0
#user表里有三个root，分别针对localhost、127.0.0.1、你的hostname，上边命令会更改三个root的密码
#如果只希望更改localhost的，可以增加一个条件"where host ='localhost'"

## 刷新登录授权
mysql> flush privileges;
Query OK, 0 rows affected (0.04 sec)
```

---

### 4. 修改配置文件，重启服务
``` bash
## 注释掉跳过授权配置
# vi /etc/my.cnf
**************************
#skip-grant
**************************
# service mysqld restart
Shutting down MySQL. SUCCESS!
Starting MySQL. SUCCESS!```

---

### 扩展1. root帐号
``` sql
-- 查看root账户信息，有"\G"就不需要";"喽
mysql> select user,host from mysql.user where user = 'root' \G
*************************** 1. row ***************************
user: root
host: 127.0.0.1
*************************** 2. row ***************************
user: root
host: localhost
*************************** 3. row ***************************
user: root
host: web02
3 rows in set (0.00 sec)

-- 这三个用户的区别是：
-- host为localhost的使用unix socket文件连接；
-- host为127.0.0.1（可能还会有ipv6的"::1"）使用tcp登录；
-- host为hostname(web02)的，暂时不知道什么作用。
-- 链接：http://dev.mysql.com/doc/refman/5.7/en/connecting.html
```
MYSQL: 无法通过sock登陆
2016年3月8日
11:28
 
问题：
# mysql -u root -p
Enter password: 
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
 
解决思路：
# ps aux|grep mysql
root      5124  0.0  0.0 106200   660 ?        S     2015   0:00 /bin/sh /usr/local/mysql/bin/mysqld_safe --defaults-file=/usr/local/mysql/3306.cnf
mysql     8091  0.1  0.1 8084188 26468 ?       Sl    2015 281:42 /usr/local/Percona-Server-5.5.33-rel31.1-566.Linux.x86_64/bin/mysqld --defaults-file=/usr/local/mysql/3306.cnf --basedir=/usr/local/Percona-Server-5.5.33-rel31.1-566.Linux.x86_64 --datadir=/data/mysqldb/3306/ --plugin-dir=/usr/local/Percona-Server-5.5.33-rel31.1-566.Linux.x86_64/lib/mysql/plugin --user=mysql --log-error=/data/mysqldb/3306/error.log --open-files-limit=65535 --pid-file=/data/mysqldb/mysql-3306.pid --socket=/tmp/3306.sock --port=3306
mysql    19493  2.3 41.7 11674624 6802544 ?    Sl    2015 3648:52 /usr/local/mysql2/bin/mysqld --defaults-file=/usr/local/mysql2/3307.cnf --basedir=/usr/local/mysql2 --datadir=/data/mysqldb/3307/ --plugin-dir=/usr/local/mysql2/lib/mysql/plugin --user=mysql --log-error=/data/mysqldb/3307/error.log --open-files-limit=65535 --pid-file=/data/mysqldb/mysql-3307.pid --socket=/tmp/3307.sock --port=3307
root     33914  0.0  0.0 103244   884 pts/2    S+   10:35   0:00 grep mysql
root     45309  0.0  0.0 106200     8 ?        S     2015   0:00 /bin/sh /usr/local/mysql2/bin/mysqld_safe --defaults-file=/usr/local/mysql2/3307.cnf
 
## 发现两个mysql进程，原来有两个配置文件，启动的两个mysql实例
 
解决办法：
# mysql -u root -p -S /tmp/3307.sock
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3586780
 
## 通过-S指定sock文件

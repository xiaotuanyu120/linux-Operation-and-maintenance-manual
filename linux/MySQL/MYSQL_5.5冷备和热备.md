MYSQL: 5.5冷备和热备
2015年11月22日 星期日
11:16
 
MySQL冷备（物理备份）
===============================================
1、物理备份前准备工作：
方法1）停止服务
service mysqld stop
/etc/init.d/mysqld stop
方法2）lock表只读
FLUSH TABLES WITH READ LOCK      # flush相关表，使其只能读
2、判断表引擎
mysql> show table status from database\G
## 看对应表的Engine名称
mysql> show engines\G
## 确定了上面的操作后还需要看对应的引擎是否启动
## 只有储存引擎确定是MyISAM时才可以使用mysqlhostcopy工具
3、备份操作
# mysqlhotcopy db_name_1 ... db_name_n /path/to/new_directory
## 如果不是MyISAM只能使用系统命令，cp、scp、rsync、tar等
4、恢复操作
## 拷贝文件到MySQL数据库目录
 
MySQL热备（mysqldump）
================================================
1、备份
## 备份所有数据库
# mysqldump -u root -p --all-databases > dump.sql
## 指定备份的数据库
# mysqldump --databases db1 db2 db3 > dump.sql
## 备份一个数据库中的指定表
# mysqldump test t1 t3 t7 > dump.sql          # test是库，后面是表
## 仅备份数据库表结构
# mysqldump -u root -p --no-data --all-databases > dump_structure.sql
 
## mysqldump会首先对每个数据库执行"CREATE DATABASE"和"USE"语句，这确保了当我们reload这个备份的时候，MySQL会在没有该库的时候自动创建它；
## 如果你希望无论该库是否存在，都去重建它，使用"--add-drop-database"参数，MySQL会在"CREATE DATABASE"语句之前增加"DROP DATABASE"语句。
 
2、恢复
## shell命令
## 恢复全部数据库
# mysql -u root -p < test.sql
# mysqladmin create db1
# mysql db1 < dump.sql
## mysql命令（新数据库，迁移数据备份文件恢复）
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql

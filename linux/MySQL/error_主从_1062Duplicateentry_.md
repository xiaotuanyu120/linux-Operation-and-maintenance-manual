error: 主从"1062 Duplicate entry"
2016年3月10日
14:40
 
问题背景：
给线上数据库做主从；
线上主库版本：5.5.33
线上从库版本：5.5.48
线上备份语句：
# mysqldump -u root --databases dwdb tydb --master-data -p > masterdump.sql
 
错误信息：
mysql> start slave；
mysql> show slave status\G
......
Last_SQL_Error: Error 'Duplicate entry '460156' for key 'PRIMARY'' on query. Default database: 'tydb'. Query: 'insert into operationlogs (action, createtime, loginname, operator, remark) values ('produce bet_month_stat', '2016-01-06 20:07:42', 'sys_auto_exec', 'sys_auto_exec', 'total:3191:succ:3191:fail:0')'
......
 
错误解决1、
## 按字面意思，说一个主键已存在，重复的insert操作，于是我去检查了主库和从库的这个值，确实都只有一条；
## 按照网上的提示，在从上执行
mysql> SET GLOBAL SQL_SLAVE_SKIP_COUNTER=1; START SLAVE; 
mysql> show slave status\G
......
同样的1062错误，但是是另外一条数据
......
 
## 网上还有提示说如果很多这个错误，可以在my.cnf中添加"slave-skip-errors = 1062"来跳过1062错误，但是这样没解决根本问题
 
错误解决2、
## 尝试备份的时候增加--flush-logs，这样会避免有些表被锁的情况
# mysqldump -u root --databases dwdb tydb --master-data --flush-logs -p > flushmasterdump.sql
## 结果依然报错1062
 
错误解决3、
## 尝试配置文件中配置"slave-skip-errors = 1062"
 
扩展：同事提供了一个思路，因为同事在遇到这个问题时，是因为断电之后引起的，所以怀疑是断电引起的表损坏，下次可以尝试去check和repair表试试

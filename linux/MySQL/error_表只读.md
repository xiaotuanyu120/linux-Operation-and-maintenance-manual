error: 表只读
2016年7月15日
15:47
 
错误提示：
mysql> update dede_admin set pwd='c3949ba59abbe56e057f' where userid='admin';
ERROR 1036 (HY000): Table 'dede_admin' is read only
 
解决办法：
1、检查数据库引擎，发现是myisam
2、到数据库文件目录，更改该目录的权限为mysql
3、重启数据库，搞定

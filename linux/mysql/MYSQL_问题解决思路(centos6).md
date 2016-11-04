MYSQL: 问题解决思路(centos6)
2015年11月19日 星期四
15:53
 
问题反馈：
无法远程连接到mysql数据库，不知道root密码
1、修改root密码
#1、修改my.cnf，在[mysqld]下添加skip-grant；
#2、重启mysql
#3、用root无密码登录，运行
update mysql.user set password=password('newpassword') where user='root';
2、用root登录mysql，增加新用户，赋予远程权限，发现错误，access deny
#1、去到mysql的data-dir中，发现mysql目录下user开头的三个文件是555的权限；
#2、给其修改成755权限；
3、用root登录mysql，再次尝试增加新用户，依然报错，信息 基本就是无法创建
#1、select * from mysql.user\G，发现root并没有grant_priv的权限，而且很多权限不全；
#2、仔细查看发现一个admin用户，权限比root还全，有grant_priv的权限；
#3、于是重置admin用户的密码，登录；
4、用admin登录，再次尝试增加，发现跟root报错一致
#1、但是发现admin的Host字段是'%'，于是开开心心的给他用admin远程登录，完事。
 
问题虽然未解决，但是复习了几个常用的命令
1、my.cnf：在[mysqld]下添加skip-grant字段，然后重启服务，可无密码登录；
2、update 数据库.表 set 字段=内容 where 条件
"update mysql.user set password=password('newpassword') where user='root';"
3、flush privileges；（强制刷新用户权限状态）
4、flush tables；（刷新表）
5、grant all privileges on 库.表 to 用户@'%' identified by '密码' （可以远程登录）

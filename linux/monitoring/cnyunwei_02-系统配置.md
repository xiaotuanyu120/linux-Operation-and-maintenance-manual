cnyunwei: 02-系统配置
2015年12月28日 星期一
19:57
 
安装后配置
=============================================================
## 修改密码
1、修改root密码（默认root：www.cnyunwei.com）
# passwd root
2、修改cati密码（默认admin：www.cnyunwei.com）
①、访问http://system_ip/
②、输入默认帐号密码登录
③、console >user management >点击admin >修改密码
## 访问的时候提示连接不上mysql，去机器上启动一下mysql就可以了
3、修改nagios密码（默认nagiosadmin：www.cnyunwei.com）
# /usr/bin/htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin
4、修改nconf密码（默认admin：www.cnyunwei.com）
# vi /var/www/nconf/config/.file_accounts.php 
**********************************
admin::your_password::admin::Administrator::
**********************************
5、mysql的帐号密码（root：www.cnyunwei.com）
mysql> select host,user from mysql.user;
+-----------------------+-----------+
| host                  | user      |
+-----------------------+-----------+
| 127.0.0.1             | root      |
| localhost             |           |
| localhost             | cactiuser |
| localhost             | nconfuser |
| localhost             | root      |
| localhost.localdomain |           |
| localhost.localdomain | root      |
+-----------------------+-----------+
## cacti和nconf都有自己的数据库帐号 
## 配置selinux
# setenforce 0
# vi /etc/selinux/config
************************************
## 修改下行为
SELINUX=disabled
************************************ 

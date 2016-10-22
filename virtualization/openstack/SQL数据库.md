SQL数据库
2016年6月24日
21:06
 
## 为何需要SQL数据库
大部分的openstack服务需要sql数据库储存信息
 
## controller node安装数据库相关包
# yum install mariadb mariadb-server python2-PyMySQL -y
 
## 准备配置文件
# cp /etc/my.cnf.d/mariadb-server.cnf /etc/my.cnf.d/openstack.cnf
# vim /etc/my.cnf.d/openstack.cnf
**************************************
## 在[mysqld]增加以下内容
bind-address = 10.0.0.12
default-storage-engine = innodb
innodb_file_per_table
collation-server = utf8_general_ci
character-set-server = utf8
**************************************
 
## 服务自启动
# systemctl enable mariadb.service
# systemctl start mariadb.service
 
## 数据库初始化
# mysql_secure_installation
 
NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!
 
In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.
 
Enter current password for root (enter for none):
OK, successfully used password, moving on...
 
Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.
 
Set root password? [Y/n] y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!
## 密码设置为mariadb.passwd
 
By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.
 
Remove anonymous users? [Y/n] y
 ... Success!
 
Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.
 
Disallow root login remotely? [Y/n] y
 ... Success!
 
By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.
 
Remove test database and access to it? [Y/n]
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!
 
Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.
 
Reload privilege tables now? [Y/n]
 ... Success!
 
Cleaning up...
 
All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.
 
Thanks for using MariaDB!
 

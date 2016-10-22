zabbix2.0:服务端yum安装配置
2015年11月27日 星期五
20:15
 
1、preparation
## 准备工具
# yum install -y vim wget epel-release
## 安装httpd、mysql、php
# yum install -y httpd  mysql-server mysql mysql-libs php php-mysql php-bcmath php-gd php-mbstring 
2、zabbix installation
## 安装zabbix服务
# yum install -y zabbix20 zabbix20-agent zabbix20-server  zabbix20-server-mysql zabbix20-web zabbix20-web-mysql net-snmp-devel 
3、service start & checking ports
## 启动httpd、mysqld、zabbix服务
# ls /etc/init.d/{zabbix*,httpd,mysqld}|cut -d / -f 4|xargs -i service {} start
Starting httpd: httpd: apr_sockaddr_info_get() failed for nagios.ig.com
httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1 for ServerName
[  OK  ]
Initializing MySQL database:  WARNING: The host 'nagios.ig.com' could not be looked up with resolveip.
This probably means that your libc libraries are not 100 % compatible
with this binary MySQL version. The MySQL daemon, mysqld, should work
normally with the exception that host name resolving will not work.
This means that you should use IP addresses instead of hostnames
when specifying MySQL privileges !
Installing MySQL system tables...
OK
Filling help tables...
OK
 
To start mysqld at boot time you have to copy
support-files/mysql.server to the right place for your system
 
PLEASE REMEMBER TO SET A PASSWORD FOR THE MySQL root USER !
To do so, start the server, then issue the following commands:
 
/usr/bin/mysqladmin -u root password 'new-password'
/usr/bin/mysqladmin -u root -h nagios.ig.com password 'new-password'
 
Alternatively you can run:
/usr/bin/mysql_secure_installation
 
which will also give you the option of removing the test
databases and anonymous user created by default.  This is
strongly recommended for production servers.
 
See the manual for more instructions.
 
You can start the MySQL daemon with:
cd /usr ; /usr/bin/mysqld_safe &
 
You can test the MySQL daemon with mysql-test-run.pl
cd /usr/mysql-test ; perl mysql-test-run.pl
 
Please report any problems with the /usr/bin/mysqlbug script!
 
[  OK  ]
Starting mysqld:  [  OK  ]
Starting Zabbix agent: [  OK  ]
Starting Zabbix server: [  OK  ]
 
## 设置服务开机启动
# ls /etc/init.d/{zabbix*,httpd,mysqld}|cut -d / -f 4|xargs -i chkconfig --add {}
# ls /etc/init.d/{zabbix*,httpd,mysqld}|cut -d / -f 4|xargs -i chkconfig {} on
 
## 检查端口是否监听
# netstat -lnpt |grep -E 'zabbix*|mysqld|httpd'
tcp        0      0 0.0.0.0:10050               0.0.0.0:*                   LISTEN      2002/zabbix
tcp        0      0 0.0.0.0:3306                0.0.0.0:*                   LISTEN      1965/mysqld
tcp        0      0 :::10050                    :::*                        LISTEN      2002/zabbix
tcp        0      0 :::80                       :::*                        LISTEN      1767/httpd 
4、MySQL preparation
## set root password
# mysqladmin -u root password 'new-password'
 
## create database & restore zabbix sql data
# mysql -uroot -p --default-character-set=utf8 zabbix < /usr/share/zabbix-mysql/schema.sql
# mysql -uroot -p --default-character-set=utf8 zabbix < /usr/share/zabbix-mysql/images.sql
# mysql -uroot -p --default-character-set=utf8  zabbix < /usr/share/zabbix-mysql/data.sql
 
## create mysql user for zabbix
# mysql -uroot -p -e "grant all on zabbix.* to 'zabbix'@'localhost' identified by 'sudozabbix'" 
5、selinux & iptables
## 暂时关闭iptables和selinux
# service iptables stop
# chkconfig iptables off
# setenforce 0
# vim /etc/selinux/config
*******************************
SELINUX=disabled
********************************** 
6、配置zabbix
1)局域网内，用浏览器访问http://zabbix-server-ip/zabbix
## 按照错误提示修改timezone
'''
date(): It is not safe to rely on the system's timezone settings. You are *required* to use the date.timezone setting or the date_default_timezone_set() function. In case you used any of those methods and you are still getting this warning, you most likely misspelled the timezone identifier. We selected 'Asia/Chongqing' for 'CST/8.0/no DST' instead [include/page_header.php:186]
'''
# vim /etc/php.ini
***************************************
date.timezone = Asia/Chongqing
***************************************
# service httpd restart
 
 
2)刷新访问页面http://zabbix-server-ip/zabbix
## 点击next，进入check of pre-requisites页面，按照错误提示修改相应项
'''
                                 Current value        Required
PHP option post_max_size                8M           16M                    Fail
PHP option max_execution_time           30           300             Fail
PHP option max_input_time               60           300             Fail
'''
# vim /etc/php.ini
***************************************
post_max_size = 16M
max_execution_time = 300
max_input_time = 300
***************************************
# service httpd restart
 
3)刷新页面，当全部项显示ok状态的时候，点击next
## 输入user和password，记得最后test一下，查看是否返回ok，保证信息输入正确

 
#host填写127.0.0.1

 
#接下来是输入信息的汇总展示

 
#最后是安装完成，并提示你安装过程的配置文件是在"/etc/zabbix/web/zabbix.conf.php"

 
#登录界面，用默认的username:admin, password：zabbix登录

 
4)登陆后界面显示zabbix服务运行状态是no
# vim /etc/zabbix/zabbix_server.conf
***********************************************************
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=your_password
***********************************************************
# service zabbix-server restart
Shutting down Zabbix server:                               [  OK  ]
Starting Zabbix server:                                    [  OK  ]
# service zabbix-agent restart
Shutting down Zabbix agent:                                [  OK  ]
Starting Zabbix agent:                                     [  OK  ]


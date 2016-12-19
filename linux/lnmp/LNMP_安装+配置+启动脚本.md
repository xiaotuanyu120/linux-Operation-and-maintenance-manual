LNMP: 安装+配置+启动脚本
2015年11月30日 星期一
9:51
 
0、系统及软件环境准备
## 系统环境
OS: CENTOS 6
DISKPARTATION:
/boot 200M
/     10000M
/data all free space
swap  2000M
 
## 查看lnmp的版本
## 查看linux版本
# cat /etc/{redhat*,centos*}
cat: /etc/redhat-lsb: Is a directory
CentOS release 5.6 (Final)
cat: /etc/centos*: No such file or directory
 
## 查看nginx版本
# /usr/local/nginx/sbin/nginx -v
nginx: nginx version: nginx/1.0.0
 
## 查看mysql版本
# /usr/local/mysql/bin/mysql -V
/usr/local/mysql/bin/mysql  Ver 14.14 Distrib 5.1.26-rc, for redhat-linux-gnu (i686) using readline 5.1
 
## 查看php版本
# /usr/local/php/bin/php -v
PHP 5.2.6 (cli) (built: Feb 18 2014 14:52:38)
Copyright (c) 1997-2008 The PHP Group
Zend Engine v2.2.0, Copyright (c) 1998-2008 Zend Technologies
    with eAccelerator v0.9.5.3, Copyright (c) 2004-2006 eAccelerator, by eAccelerator
 
## PS 必须要找到相应软件的绝对路径才可以这样查看，如果用yum或者rpm安装可以用
"rpm -qa | grep -E 'nginx|mysql|php'" 
1、MYSQL安装
１、INSTALL PACKAGE NEEDED
# yum install gcc gcc-c++ cmake ncurses-devel -y
# yum groupinstall base "Development Tools" -y 
2、USER
## 创建组及用户（系统用户）
# groupadd mysql
# useradd -r -g mysql mysql
 
## -r参数代表的是mysql用户是一个系统用户，uid小于500
# id mysql
uid=498(mysql) gid=500(mysql) groups=500(mysql) 
3、COMPILE
## 下载源码(版本使用的是和上面环境中相同或相近的版本)
# wget http://cdn.mysql.com/archives/mysql-5.1/mysql-5.1.72.tar.gz
# tar zxvf mysql-5.1.72.tar.gz
 
## 源码编译
# cd mysql-5.1.72
# ./configure --prefix=/data/server/mysql --with-mysqld-user=mysql --with-charset=utf8 --with-extra-charsets=all
# make
# make install
## 编译参数详解
--prefix，指定软件目录
--with-mysqld-user，指定启动脚本mysqld的执行用户
--with-charset，指定默认的编码格式
--with-extra-charset，指定其他的编码格式 
4、BASEDIR & DATADIR
## 修改目录属主属组
# mkdir /data/mysql-data
# chown -R mysql:mysql /data/server/mysql/
# chown -R mysql:mysql /data/mysql-data/ 
5、INITIALIZE DATABASE
## 初始化数据库
# scripts/mysql_install_db --datadir=/data/mysql-data/ --basedir=/data/server/mysql/ --user=mysql 
6、DAEMON & CONFIGURATION
## 拷贝标准启动脚本&配置文件
# cp support-files/mysql.server /etc/init.d/mysqld
# mv /etc/my.cnf /etc/my.cnf.old
# cp support-files/my-medium.cnf /etc/my.cnf
# chmod 755 /etc/init.d/mysqld
 
## 配置启动脚本
# vim /etc/init.d/mysqld
********************************
basedir=/data/server/mysql
datadir=/data/mysql-data
******************************** 
7、ENABLE & START SERVICE
## 设置mysql服务开机启动并启动mysql
# chkconfig mysqld on
# service mysqld start 
8、SET MYSQL PASSWORD
# /data/server/mysql/bin/mysqladmin -u root password 'igamemysql' 
2、PHP安装
0、准备用户及编译环境
# useradd -r -s /sbin/nologin php-fpm
# yum install libxml2-devel libcurl-devel libjpeg-turbo-devel libpng-devel freetype-devel libmcrypt-devel epel-release libevent-devel -y
## 只要基础包+php版本+下面编译参数跟此文档一致，就不会编译错误
 
## 库文件做软连接
# ln -s /usr/lib64/libjpeg.so /usr/lib/libjpeg.so  
# ln -s /usr/lib64/libpng.so /usr/lib/libpng.so 
1、源码编译5.3.3
## 下载php源码
# wget http://museum.php.net/php5/php-5.3.3.tar.gz
# tar zxvf php-5.3.3.tar.gz
 
## tarball安装php
# cd php-5.3.3
# ./configure --prefix=/data/server/php --with-config-file-path=/data/server/php/etc --enable-fpm --with-fpm-user=php-fpm --with-fpm-group=php-fpm --with-mysql=/data/server/mysql --with-mysql-sock=/tmp/mysql.sock --with-libxml-dir --with-gd --with-jpeg-dir --with-png-dir --with-freetype-dir --with-iconv-dir --with-zlib-dir --with-mcrypt --enable-soap --enable-gd-native-ttf --enable-ftp --enable-mbstring --enable-exif --disable-ipv6 --with-curl --with-mysqli=/data/server/mysql/bin/mysql_config
# make test
# make install
 
## 拷贝php配置文件及php-fpm配置文件
# mkdir /data/server/php/etc
# cp php.ini-production /data/server/php/etc/php.ini
# cp /data/server/php/etc/php-fpm.conf.default /data/server/php/etc/php-fpm.conf
## 拷贝php-fpm启动文件
# cp ./sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
# chmod 755 /etc/init.d/php-fpm
## 制作php配置文件软连接
# mkdir /etc/php
# ln -s /data/server/php/etc/php.ini /etc/php/php.ini
# ln -s /data/server/php/etc/php-fpm.conf /etc/php/php-fpm.conf
 
## 服务开机启动
# chkconfig --add php-fpm
# chkconfig php-fpm on 
3、nginx安装
1、用户及环境准备
# groupadd nginx
# useradd -g nginx nginx
# yum install -y pcre-devel openssl openssl-devel 
2、下载源码安装
# wget http://nginx.org/download/nginx-1.8.0.tar.gz
# tar zxvf nginx-1.8.0.tar.gz
# cd nginx-1.8.0
# ./configure --user=nginx --group=nginx --prefix=/data/server/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre  --with-http_realip_module
# make
# make install 
3、启动脚本
# vim /etc/init.d/nginxd
************************************************
#!/bin/bash
# chkconfig: - 30 21
# description: http service.
 
# Source Function Library
. /etc/init.d/functions
 
# Nginx Settings
NGINX_SBIN="/data/server/nginx/sbin/nginx"
NGINX_CONF="/data/server/nginx/conf/nginx.conf"
NGINX_PID="/data/server/nginx/logs/nginx.pid"
RETVAL=0
prog="Nginx"
 
start() {
         echo -n $"Starting $prog: "
         mkdir -p /dev/shm/nginx_temp
         daemon $NGINX_SBIN -c $NGINX_CONF
         RETVAL=$?
         echo
         return $RETVAL
}
 
stop() {
         echo -n $"Stopping $prog: "
         killproc -p $NGINX_PID $NGINX_SBIN -TERM
         rm -rf /dev/shm/nginx_temp
         RETVAL=$?
         echo
         return $RETVAL
}
 
reload(){
         echo -n $"Reloading $prog: "
         killproc -p $NGINX_PID $NGINX_SBIN -HUP
         RETVAL=$?
         echo
         return $RETVAL
}
 
restart(){
         stop
         start
}
 
configtest(){
     $NGINX_SBIN -c $NGINX_CONF -t
     return 0
}
case "$1" in    
   start)
         start
         ;;
   stop)
         stop
         ;;
   reload)
         reload
         ;;
   restart)
         restart
         ;;
   configtest)
         configtest
         ;;
   *)
         echo $"Usage: $0 {start|stop|reload|restart|configtest}"
         RETVAL=1
esac
 
exit $RETVAL
 
**********************************************
# chmod 755 /etc/init.d/nginxd
# chkconfig --add nginxd
# chkconfig nginxd on 
-1、源码编译5.2.6的失败经历记录
1、源码编译安装5.2.6(最后的php-fpm启动脚本有点问题，推荐直接使用5.3.3及以上版本)
## 下载php源码
# wget http://museum.php.net/php5/php-5.2.6.tar.gz
# tar zxvf php-5.2.6.tar.gz
 
## 下载php-fpm源码（5.3.3以后会集成，之前的版本需要自己下载）
# wget http://php-fpm.org/downloads/php-5.2.6-fpm-0.5.9.diff.gz
 
## 安装patch命令，把php-fpm包patch到php中去
# yum install patch -y
# gzip -cd php-5.2.6-fpm-0.5.9.diff.gz | patch -d php-5.2.6 -p1
 
## tarball安装php
# cd php-5.2.6
# ./configure --prefix=/data/server/php --with-config-file-path=/data/server/php/conf --enable-fpm --with-fpm-user=php-fpm --with-fpm-group=php-fpm --with-mysql=/data/server/mysql --with-mysql-sock=/tmp/mysql.sock --with-libxml-dir --with-gd --with-jpeg-dir --with-png-dir --with-freetype-dir --with-iconv-dir --with-zlib-dir --with-mcrypt --enable-soap  --enable-gd-native-ttf   --enable-ftp  --enable-mbstring  --enable-exif    --disable-ipv6     --with-curl
# make
# make install
 
## 拷贝php配置文件及php-fpm配置文件
# cp php.ini-recommended /data/server/php/etc/php.ini
# cp ./sapi/cgi/fpm/conf/php-fpm.conf.in /data/server/php/etc/php-fpm.conf
## 拷贝php-fpm启动文件
# cp ./sapi/cgi/fpm/init.d/php-fpm.in /etc/init.d/php-fpm
# chmod 755 /etc/init.d/php-fpm
## 制作php配置文件软连接
# ln -s /data/server/php/etc/php.ini /etc/php/php.ini
# ln -s /data/server/php/etc/php-fpm.conf /etc/php/php-fpm.conf
 
FAILURE & WARN
======================================================
1）错误libjpeg
错误信息：configure: error: libjpeg.(a|so) not found.
解决方案：# ln -s /usr/lib64/libjpeg.so /usr/lib/
 
2）错误libpng
错误信息：configure: error: libpng.(a|so) not found.
解决方案：# ln -s /usr/lib64/libpng.so /usr/lib/ 
 
3）重点报警
warn信息：
Notice: Following unknown configure options were used:
 
--enable-fpm
--with-fpm-user=php-fpm
--with-fpm-group=php-fpm
warn原因：
查阅官方文档，在"FastCGI Process Manager (FPM)"中会找到答案。
原来只有在php5.3.3中，php才把php-fpm集成到sapi中，以前版本的php是没有集成php-fpm的。
 
详细链接：
http://php.net/manual/en/install.fpm.php
 
4）make错误
报错信息：
/usr/bin/ld: cannot find -lltdl
collect2: ld returned 1 exit status
make: *** [sapi/cgi/php-cgi] Error 1
解决方案：
# yum install libtool-ltdl-devel -y
 
扩展1、如何找到哪个包来安装patch命令
# yum provides /usr/bin/patch
patch-2.6-6.el6.x86_64 : Utility for modifying/upgrading files
Repo        : base
Matched from:
Filename    : /usr/bin/patch
## 在不知道一个命令是什么包里的工具时，除了百度还可以用yum provides命令。

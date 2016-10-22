MYSQL: 5.7.11安装
2016年2月26日
10:14
 
MYSQL安装过程
１、DOWNLOAD
## 下载源码
# wget http://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.11.tar.gz
# tar zxf mysql-5.7.11.tar.gz 
2、USER
## 创建组及用户（系统用户）
# groupadd mysql
# useradd -r -g mysql mysql
 
## -r参数代表的是mysql用户是一个系统用户，uid小于500
# id mysql
uid=498(mysql) gid=500(mysql) groups=500(mysql) 
3、COMPILE
## 源码编译
# yum install cmake ncurses-devel -y
# yum groupinstall base "Development Tools" -y
 
# cd mysql-5.7.11 
# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql -DMYSQL_USER=mysql -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DDOWNLOAD_BOOST=1 -DWITH_BOOST=./boost-download/
## -DCMAKE_INSTALL_PREFIX=*：指定basedir
## -DMYSQL_DATADIR=*：指定datadir
## -DMYSQL_USER=mysql：指定用户
## -DWITH_READLINE=1：是开启readline工具，执行mysql命令时的一些快捷操作
## -DWITH_*_STORAGE_ENGINE=1：是否开启此存储引擎，默认开启innoDB引擎
# make
# make install
 
 
问题
=====================================
错误1：
remove CMakeCache.txt and rerun cmake.On Debian/Ubuntu, package name is libncurses5-dev, on Redhat and derivates it is ncurses-devel.
解决方案：
# yum install ncurses-devel -y
PS:
## 重新cmake前先删除CMakeCache.txt 
# rm CMakeCache.txt
 
错误2（源码安装mysql5.7.11）：
CMake Error at cmake/boost.cmake:81 (MESSAGE):
  You can download it with -DDOWNLOAD_BOOST=1 -DWITH_BOOST=<directory>
 
  This CMake script will look for boost in <directory>.  If it is not there,
  it will download and unpack it (in that directory) for you.
 
  If you are inside a firewall, you may need to use an http proxy:
 
  export http_proxy=http://example.com:80
 
Call Stack (most recent call first):
  cmake/boost.cmake:238 (COULD_NOT_FIND_BOOST)
  CMakeLists.txt:443 (INCLUDE)
解决方案：
# mkdir boost-download
 
## 解决办法1：
## 按照提示增加-DDOWNLOAD_BOOST=1 -DWITH_BOOST=<directory>
# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql -DMYSQL_USER=mysql -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DDOWNLOAD_BOOST=1 -DWITH_BOOST=./boost-download/
## 这样的话cmake会自动帮你下载boost
。。。。。。
-- Downloading boost_1_59_0.tar.gz to /usr/local/src/mysql-5.7.11/boost-download
-- [download 0% complete]
-- [download 1% complete]
-- [download 2% complete]
。。。。。。
## 这样下载是有一个timeout的，如果超时后无法下载完成
 
## 解决办法2：
## 到提示的网址下载，然后用-DWITH_BOOST指定就可以了
# cd boost-download/ 
# wget http://sourceforge.net/projects/boost/files/boost/1.59.0/boost_1_59_0.tar.gz
# cd ..
# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql -DMYSQL_USER=mysql -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DDOWNLOAD_BOOST=1 -DWITH_BOOST=./boost-download/ 
## ps：cmake配置mysql脚本选项详单
http://dev.mysql.com/doc/refman/5.6/en/source-configuration-options.html 
4、BASEDIR & DATADIR
## 修改目录属主属组
# mkdir /data/mysql
# chown -R mysql:mysql /usr/local/mysql
# chown -R mysql:mysql /data/mysql 
5、INITIALIZE DATABASE
## 初始化数据库
# cd /usr/local/mysql
# mysqld --initialize --datadir=/data/mysql --basedir=/usr/local/mysql/ --user=mysql
## 初始化完毕后会告诉你一个初始密码 
6、DAEMON & CONFIGURATION
## 拷贝标准启动脚本&配置文件（需要进入源码目录）
# cp support-files/mysql.server /etc/init.d/mysqld
# mv /etc/my.cnf /etc/my.cnf.old
# cp support-files/my-default.cnf /etc/my.cnf
# chmod 755 /etc/init.d/mysqld
 
## 配置启动脚本&配置文件
# vim /etc/init.d/mysqld
********************************
basedir=/usr/local/mysql
datadir=/data/mysql
mysqld_pid_file_path=/usr/local/mysql/mysql.pid
********************************
# vim /etc/my.cnf
********************************
basedir=/usr/local/mysql
datadir=/data/mysql
******************************** 
7、ENABLE & START SERVICE
## 设置mysql服务开机启动并启动mysql
# chkconfig --add mysqld 
# chkconfig mysqld on
# service mysqld start 
8、SET MYSQL PASSWORD
# vim /etc/profile
********************************
## 在最后添加
export PATH=$PATH:/usr/local/mysql/bin
********************************
# source /etc/profile
# mysql -u root -p
## 直接运行"update mysql.user set password=password('yourpassword') where user='root'"会报错
mysql> set password=password('yourpassword');
mysql> alter user 'root'@'localhost' password expire never;
mysql> flush privileges; 

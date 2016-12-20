MYSQL: 多实例配置+启动脚本
2016年3月9日
10:38
 
## 下载安装mysql5.5.48
# yum install cmake ncurses-devel -y
# yum groupinstall base "Development Tools" -y
# useradd mysql
 
# wget http://cdn.mysql.com//Downloads/MySQL-5.5/mysql-5.5.48.tar.gz
# tar zxvf mysql-5.5.48.tar.gz
 
# cd mysql-5.5.48
# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql/data/ -DMYSQL_USER=mysql -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 -DWITH_READLINE=1
# make & make install 
## 多实例操作及配置
## 删除默认的数据目录
# cd /data/mysql/
# rm -rf data/
 
## 创建使用目录 
# mkdir etc data
# mkdir -p data/330{6,7,8} 
# mkdir -p etc/330{6,7,8}
# chown -R mysql.mysql /data/mysql/
# cd /usr/local/src/mysql-5.5.48
 
## 提供配置文件
# cp support-files/my-small.cnf /data/mysql/etc/3306/my.cnf
# vim /data/mysql/etc/3306/my.cnf
****************************************
[client]
port                = 3306
socket                = /tmp/mysql.sock
[mysqld]
port                = 3306
datadir      = /data/mysql/data/3306
socket                = /data/mysql/etc/3306/mysql.sock
pid-file     = /data/mysql/etc/3306/mysql.pid
skip-external-locking
key_buffer_size = 16K
max_allowed_packet = 1M
table_open_cache = 4
sort_buffer_size = 64K
read_buffer_size = 256K
read_rnd_buffer_size = 256K
net_buffer_length = 2K
thread_stack = 128K
server-id        = 1
[mysqldump]
quick
max_allowed_packet = 16M
[mysql]
no-auto-rehash
[myisamchk]
key_buffer_size = 8M
sort_buffer_size = 8M
[mysqlhotcopy]
interactive-timeout
****************************************
# cp /data/mysql/etc/3306/my.cnf /data/mysql/etc/3307/my.cnf
# cp /data/mysql/etc/3306/my.cnf /data/mysql/etc/3308/my.cnf
## 另外两个配置文件同上，只是粗体位置需要修改端口号
 
## 初始化数据库
# scripts/mysql_install_db --basedir=/usr/local/mysql --datadir=/data/mysql/data/3306 --user=mysql
# scripts/mysql_install_db --basedir=/usr/local/mysql --datadir=/data/mysql/data/3307 --user=mysql
# scripts/mysql_install_db --basedir=/usr/local/mysql --datadir=/data/mysql/data/3308 --user=mysql 
## 管理脚本
## 管理脚本的重点在粗体位置，需和my.cnf中配置相符
# vim /etc/init.d/mysqlmd 
***********************************************
#!/bin/bash
 
. /etc/init.d/functions
 
## Usage correct or not !
[ $# -eq 2 ] || {
    echo ""
    echo "Usage: $0 {start|stop|restart|reload} [PORT]"
    echo ""
    echo "Pls put your conf file to 'BASEDIR/etc/your_port/my.cnf'"
    echo ""
    exit
}
 
## Parse get & Env setting
BASEDIR="/usr/local/mysql"
DATADIR="/data/mysql"
PORT=$2
 
CONF=${DATADIR}/etc/${PORT}/my.cnf
SOCKET=${DATADIR}/etc/${PORT}/mysql.sock
PIDFILE=${DATADIR}/etc/${PORT}/mysql.pid
 
## Test env
[ -e "$BASEDIR/bin/mysqld_safe" ] || {
    action "BASEDIR setting is wrong!" /bin/false
    exit
}
[ -e "$CONF" ] || {
    action "CONF file is not exist!" /bin/false
    exit
}
 
 
function start() {
    [ -e "$SOCKET" ] && {
        action "MySQL $PORT is running" /bin/false
        exit
    } || {
        $BASEDIR/bin/mysqld_safe --defaults-file=$CONF &>/dev/null &
    }
    [ "$?" == 0 ] && {
        action "MySQL $PORT Started" /bin/true
    } || {
        action "MySQL $PORT started wrong" /bin/false
        exit
    }
}
 
 
function stop() {
    PID_M=`pgrep -o -f $PORT -U root`
    PID_P=`pgrep -f $PORT -U mysql`
    if [ $$ == "$PID_M" ] && [ -z "$PID_P" ];
    then
        action "MySQL $PORT is not running" /bin/false;
    elif [ ! $$ == "$PID_M" ];
    then
        kill -9 $PID_M 1>/dev/null 2>&1;
        kill -9 $PID_P 1>/dev/null 2>&1;
    fi
 
    rm -rf $PIDFILE;
    rm -rf $SOCKET;
    action "MySQL $PORT is stoped" /bin/true;
}
 
 
case "$1" in
    start)
        start
    ;;
    stop)
        stop $PORT
    ;;
    restart|reload)
        stop $PORT
        sleep 2
        start
    ;;
    *)
        echo ""
        echo "Usage: $0 {start|stop|restart|reload} [PORT]"
        echo ""
        echo "Pls put your conf file to 'BASEDIR/etc/your_port/my.cnf'"
        echo ""
    ;;
esac
***********************************************
# chmod 755 /etc/init.d/mysqlmd 
## 管理实例
# echo "export PATH=$PATH:/usr/local/mysql/bin" >> /etc/profile
# source /etc/profile
# /etc/init.d/mysqlmd start 3307
# /etc/init.d/mysqlmd start 3306
# /etc/init.d/mysqlmd restart 3306
# /etc/init.d/mysqlmd stop 3306 

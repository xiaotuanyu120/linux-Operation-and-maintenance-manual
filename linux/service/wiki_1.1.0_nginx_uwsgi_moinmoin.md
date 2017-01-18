---
title: WIKI: 1.1.0 nginx+uwsgi部署moinmoin
date: 2016-02-02 16:47:00
categories: linux/service
tags: [linux,service,moinmoin]
---
### WIKI: 1.1.0 nginx+uwsgi部署moinmoin

---

### 1. 安装uwsgi
``` bash
wget http://projects.unbit.it/downloads/uwsgi-2.0.12.tar.gz
tar zxvf uwsgi-2.0.12.tar.gz
mv uwsgi-2.0.12 /data/server/uwsgi
cd /data/server/uwsgi
make
cp uwsgi /usr/local/bin/uwsgi
```

---

### 2. 测试uwsgi
``` bash
vim /root/test.py
**************************************
def application(env, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    return "Hello World"
**************************************

uwsgi --http  :8001 --wsgi-file /root/test.py --daemonize=/root/test.log
curl 127.0.0.1:8001
Hello World```

---

### 3. 安装moinmoin
``` bash
# 方法1（弃用，因为试用了几次都不成功，不能import MoinMoin）
wget https://static.moinmo.in/files/moin-1.9.8.tar.gz
tar zxvf moin-1.9.8.tar.gz
cd moin-1.9.8
python setup.py install --force --prefix /usr/local --record=install.log
# 方法2（成功的方法）
pip install moin
Collecting moin
  Downloading moin-1.9.8.tar.gz (37.1MB)
    100% |████████████████████████████████| 37.1MB 7.6kB/s
Building wheels for collected packages: moin
  Running setup.py bdist_wheel for moin ... done
  Stored in directory: /root/.cache/pip/wheels/34/78/2c/64fccf6482fb6d515ecabf7edb0291e7f88e8a0b7888794b46
Successfully built moin
Installing collected packages: moin
Successfully installed moin-1.9.8```

---

### 4. 准备wiki的uwsgi配置文件
``` bash
cd /usr/local/py27/share/moin
# 创建wiki目录
mkdir mywiki
# 拷贝配置文件到wiki目录
cp -r {data,underlay,server/moin.wsgi,config/wikiconfig.py} mywiki
# 指定python环境
vim mywiki/moin.wsgi
******************************************
## 找到a1、a2，在下面添加以下语句

# a1) Path of the directory where the MoinMoin code package is located.
#     Needed if you installed with --prefix=PREFIX or you didn't use setup.py.
#sys.path.insert(0, 'PREFIX/lib/python2.3/site-packages')
sys.path.insert(0, '/usr/local/py27/lib/python2.7/site-packages')

# a2) Path of the directory where wikiconfig.py / farmconfig.py is located.
#     See wiki/config/... for some sample config files.
sys.path.insert(0, '/usr/local/py27/share/moin/mywiki')

## 关闭moinmoin的静态文件提供功能，让web服务器来提供静态文件（未配置）
#application = make_application(shared=True)
application = make_application(shared=False)
******************************************

# 配置静态文件路径（未配置）
vim mywiki/wikiconfig.py
******************************************
class Config(multiconfig.DefaultConfig):
    url_prefix_static = '/usr/local/share/moin/htdocs'
******************************************```

---

### 5. 配置uwsgi文件
``` bash
# vim mywiki/uwsgi.ini
******************************************
[uwsgi]
uid = nginx
gid = nginx
socket = /tmp/moin.sock
chmod-socket = 660

chdir = /usr/local/py27/share/moin/mywiki
wsgi-file = moin.wsgi
pidfile = /usr/local/py27/share/moin/mywiki/uwsgi.pid

master = true
workers = 3
max-requests = 200

harakiri = 30
die-on-term = true
daemonize = /usr/local/py27/share/moin/mywiki/moin-uwsgi.log
vacuum = true

## 参数解释
harakiri： timeout
daemoinize： run background & log
vacuum： 当服务器退出的时候自动删除unix socket文件和pid文件
******************************************
```

---

### 6. 配置uwsgi启动脚本
``` bash
vim /etc/init.d/uwsgid
******************************************
#! /bin/sh
# chkconfig: 2345 55 25
# For CentOS/Redhat run: 'chkconfig --add uwsgi'

DESC="uwsgi daemon"
NAME=uwsgi
DAEMON=/usr/local/bin/uwsgi
CONFIGFILE=/usr/local/py27/share/moin/mywiki/$NAME.ini
PIDFILE=/usr/local/py27/share/moin/mywiki/$NAME.pid
SCRIPTNAME=/etc/init.d/uwsgid

set -e
[ -x "$DAEMON" ] || exit 0

do_start() {
    $DAEMON $CONFIGFILE || echo -n "uwsgi already running"
}

do_stop() {
    $DAEMON --stop $PIDFILE || echo -n "uwsgi not running"
    rm -f $PIDFILE
    echo "$DAEMON STOPED."
}

do_reload() {
    $DAEMON --reload $PIDFILE || echo -n "uwsgi can't reload"
}

do_status() {
    ps aux|grep $DAEMON
}

case "$1" in
 status)
    echo -en "Status $NAME: \n"
    do_status
 ;;
 start)
    echo -en "Starting $NAME: \n"
    do_start
 ;;
 stop)
    echo -en "Stopping $NAME: \n"
    do_stop
 ;;
 reload|graceful)
    echo -en "Reloading $NAME: \n"
    do_reload
 ;;
 *)
    echo "Usage: $SCRIPTNAME {start|stop|reload}" >&2
    exit 3
 ;;
esac

exit 0
******************************************
# chmod 755 /etc/init.d/uwsgid
# chkconfig --add uwsgid
# chkconfig uwsgid on```

---

### 7. 安装nginx
``` bash
# 安装过程略，记录过太多次
nginx -V
nginx version: nginx/1.8.0
built by gcc 4.4.7 20120313 (Red Hat 4.4.7-16) (GCC)
built with OpenSSL 1.0.1e-fips 11 Feb 2013
TLS SNI support enabled
configure arguments: --user=nginx --group=nginx --prefix=/data/server/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre --with-http_realip_module

# 配置nginx
vim /data/server/nginx/conf/nginx.conf
******************************************
user  nginx;
......
    server \{
        listen       80 default_server;
        server_name  _;

        location / {
            uwsgi_pass unix:/tmp/moin.sock;
            include uwsgi_params;
        }
******************************************
# 配置wiki目录权限让nginx可以访问
chown -R nginx:nginx /usr/local/py27/share
```

---

### 8. 如何用命令行启动uwsgi服务
``` bash
uwsgi -s 127.0.0.1:9003 -M -t 30 -A 4 -p 2 -d /data/logs/moin-uwsgi.log /data/server/moin/ /data/server/moin/wiki/moin.wsgi
## 参数（标注配置项的都可以写入配置文件）
# -s socket(配置项) bind to the specified UNIX/TCP socket using default protocol
# -M master(配置项) enable master process
# -t harakiri(配置项) set harakiri timeout
# -A sharedarea(配置项) create a raw shared memory area of specified pages (note: it supports keyval too)
# -p workers(配置项) spawn the specified number of workers/processes
# -d daemonize(配置项) daemonize uWSGI
# "/data/server/moin" pythonpath add directory (or glob) to pythonpath
# "/data/server/moin/wiki/moin.wsgi" wsgi-file load .wsgi file
```

---

### 9. 遇到的问题
#### 1) 报错
``` bash
uwsgi -s 127.0.0.1:9003 -M -t 30 -A 4 -p 2 -d /data/logs/moin-uwsgi.log --pythonpath /data/server/moin/ --wsgi-file /data/server/moin/wiki/moin.wsgi
/usr/bin/uwsgi:4:in 'exec': No such file or directory - /etc/uwsgi/ext/uwsgi/uwsgi.ruby (Errno::ENOENT)
    from /usr/bin/uwsgi:4
```

#### 2) 解决方案
``` bash
yum install -y ruby-devel
mkdir -p /usr/local/ext/uwsgi
cd /usr/local/ext/uwsgi/
ruby /data/server/uwsgi/ext/uwsgi/extconf.rb
# extconf.rb需要根据你服务器文件的实际位置来定，可以find找出```
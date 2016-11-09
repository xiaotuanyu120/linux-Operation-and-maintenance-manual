---
title: sersync 基于inotify和rsync的实时同步工具
date: 2016-11-09 15:44:00
categories: linux/commonly_services
tags: [linux,inotify,rsync,sersync]
---
### sersync 基于inotify和rsync的实时同步工具

----

#### 测试环境
服务器名称|角色|ip|系统
---|---|---|---
服务器A|主服务器|192.168.33.101|centos6 x86_64
服务器B|备服务器|192.168.33.102|centos6 x86_64

架构介绍：  
服务器A-安装rsync、inotify、sersync  
服务器B-安装rsync  

----

#### 服务器B
部署用于接收文件的rsync

**安装rsync**
``` bash
# 编译安装rsync
wget https://download.samba.org/pub/rsync/src/rsync-3.1.2.tar.gz
tar zxf rsync-3.1.2.tar.gz
cd rsync-3.1.2
./configure
make && make install
```

**配置rsync daemon**  
服务器A上的sersync会与此daemon对接同步文件
``` bash
# 1. 编写rsync daemon的配置文件
vim /etc/rsyncd.conf
*********************************
uid=root
gid=root
max connections=36000
use chroot=no
log file=/var/log/rsyncd.log
pid file=/var/run/rsyncd.pid
lock file=/var/run/rsyncd.lock

[website]
path=/home/website
comment  = markdream website
ignore errors = yes
read only = no
hosts allow =  192.168.33.101/32
hosts deny = *
auth users = userB
secrets file = /etc/rsyncd.pass
*********************************

# 2. 编写rsync daemon的用户密码文件
vim /etc/rsyncd.pass
*********************************
userB:passwordB
*********************************
```

**启动rsync daemon**
``` bash
rsync --daemon
# 会默认使用/etc/rsyncd.conf，可使用--config自定义
```

----

#### 服务器A
部署rsync、inotify、sersync

**安装 rsync**
``` bash
# 安装同服务器B
```

**安装inotify**
``` bash
wget https://github.com/downloads/rvoicilas/inotify-tools/inotify-tools-3.14.tar.gz
tar zxf inotify-tools-3.14.tar.gz
cd inotify-tools-3.14
./configure
make && make install
```

**安装sersync**
``` bash
wget https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/sersync/sersync2.5.4_64bit_binary_stable_final.tar.gz
tar zxf sersync2.5.4_64bit_binary_stable_final.tar.gz
mv GNU-Linux-x86/ /usr/local/sersync
```

**配置sersync**
``` bash
cd /usr/local/sersync/
vim confxml.xml
*********************************
...
<sersync>
        <localpath watch="/home/webserver">
            <remote ip="192.168.33.102" name="website"/>
        </localpath>
        <rsync>
            <commonParams params="-artuz"/>
            <auth start="true" users="userB" passwordfile="/usr/local/sersync/user.pass"/>
            <userDefinedPort start="false" port="874"/><!-- port=874 -->
            <timeout start="false" time="100"/><!-- timeout=100 -->
            <ssh start="false"/>
        </rsync>
        ...
        <crontab start="false" schedule="600"><!--600mins-->
            <crontabfilter start="false">
                <exclude expression="*.php"></exclude>
                <exclude expression="info/*"></exclude>
            </crontabfilter>
        </crontab>
        ...
</sersync>
...
*********************************
# 在sersync中配置localpath,其中watch为服务器A上需要备份的目录
# 在sersync中配置remote ip,其中ip为服务器B的ip,name对应服务器B的rsync daemon中配置的项目
# 在sersync的rsync配置块中配置auth,start设置为true，user指定服务器B上配置的userB,passwordfile指定密码文件
# 在sersync中的crontab配置块中,也可以配置crontab的频率
```

**配置密码文件**  
此文件用于通过服务器B的rsync daemon认证
``` bash
vim /usr/local/sersync/user.pass
*********************************
passwordB
*********************************

# 修改密码文件权限
chmod 600 /usr/local/sersync/user.pass
```

**启动sersync**
``` bash
cd /usr/local/sersync
./sersync2 -r -d -o confxml.xml
set the system param
execute：echo 50000000 > /proc/sys/fs/inotify/max_user_watches
execute：echo 327679 > /proc/sys/fs/inotify/max_queued_events
parse the command param
option: -r      rsync all the local files to the remote servers before the sersync work
option: -d      run as a daemon
option: -o      config xml name：  confxml.xml
daemon thread num: 10
parse xml config file
host ip : localhost     host port: 8008
daemon start，sersync run behind the console
use rsync password-file :
user is userB
passwordfile is         /usr/local/sersync/user.pass
config xml parse success
please set /etc/rsyncd.conf max connections=0 Manually
sersync working thread 12  = 1(primary thread) + 1(fail retry thread) + 10(daemon sub threads)
Max threads numbers is: 22 = 12(Thread pool nums) + 10(Sub threads)
please according your cpu ，use -n param to adjust the cpu rate
------------------------------------------
rsync the directory recursivly to the remote servers once
working please wait...
execute command: cd /home/webserver && rsync -artuz -R --delete ./ userB@192.168.33.102::website --password-file=/usr/local/sersync/user.pass >/dev/null 2>&1
run the sersync:
watch path is: /home/webserver

# 从启动输出中可以看出,其实sersync调用的就是rsync命令
```

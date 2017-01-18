---
title: vnc: 1.1.0 centos 7 安装
date: 2017-01-18 11:41:00
categories: linux/service
tags: [linux,service,vnc]
---
### vnc: 1.1.0 centos 7 安装

---

### 1. 安装过程
``` bash
# 安装服务
yum install tigervnc-server

# 准备连接vnc的用户
useradd <vnc_user>

# centos7 中和centos6(/etc/sysconfig/vncservers)不一样，需要我们手动拷贝配置文件
cp /lib/systemd/system/vncserver@.service /etc/systemd/system/vncserver@:1.service

# 修改配置，主要是将<USER>修改成我们创建的用户
vim /etc/systemd/system/vncserver@:1.service
*************************************
[...]

[Service]
Type=forking
# Clean any existing files in /tmp/.X11-unix environment
ExecStartPre=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'
#ExecStart=/usr/sbin/runuser -l <USER> -c "/usr/bin/vncserver %i"
ExecStart=/usr/sbin/runuser -l <vnc_user> -c "/usr/bin/vncserver %i"
#PIDFile=/home/<USER>/.vnc/%H%i.pid
PIDFile=/home/<vnc_user>/.vnc/%H%i.pid
ExecStop=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'

[...]
*************************************
```

---

### 2. 启动过程
``` bash
# 切换到vnc用户，然后启动服务
su - <vnc_user>
vncserver

# 查看端口
netstat -lnpt|grep vnc
```

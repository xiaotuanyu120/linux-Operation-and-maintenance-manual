---
title: 时间同步: centos7-ntp-chrony
date: 2016年4月6日
categories: 16:14
---
 
一、CHRONY
===============================================
1、安装chrony服务并设置其开机启动
# yum install -y epel-release
# yum install -y chrony
# systemctl enable chronyd
# systemctl start chronyd
 
2、设置ntp服务器
## 设置ntp开启
# timedatectl set-ntp true
 
## 修改配置文件里的ntp服务器地址，并重启chronyd服务
# vim /etc/chrony.conf
*************************************
 server classroom.example.com iburst
*************************************
# systemctl restart chronyd
 
## 使用chronyc工具来手动同步
# chronyc
>waitsync
 
## 查看和修改时区
# timedatectl list-timezones
# timedatectl set-timezone Asia/Shanghai
 
## 查看结果
# timedatectl
 
二、NTP
=================================================
# yum install -y ntp
# systemctl enable ntpd
# systemctl start ntpd
# ntpq -p
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
*chobi.paina.jp  131.112.181.48   2 u    1   64    1   60.707    0.450   0.086
+ntp-ext.cosng.n 146.213.3.181    2 u    2   64    1  328.942   -9.352   0.151
+wktk-sub.tk     103.1.106.69     2 u    3   64    1   72.538    2.706   0.341
-ns2.bvc-cloud.d 109.75.188.245   3 u    1   64    1  355.614    4.681   0.206
# vim /etc/ntp.conf
*********************************
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
## 可自行设置其他地区的ntp服务器或本地时间服务器
*********************************
 

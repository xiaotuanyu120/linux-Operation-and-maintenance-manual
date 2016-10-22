---
title: SELINUX: 基础操作
date: 2016年3月29日
categories: 9:50
---
 
semanage命令安装：
yum install -y policycoreutils-python
 
查看服务状态：
getenforce
 
修改服务状态：
setenforce 0/1
 
查看文件上下文状态
# ls -Z
-rw-------. root root system_u:object_r:admin_home_t:s0 anaconda-ks.cfg
 
修改文件上下文(-a add；-t type)
semanage fcontext -a -t samba_share_t '/common(/.*)?'
semanage fcontext -a -t httpd_sys_content_t '/var/www/virtual(/.*)?'
 
 
重建文件上下文(-v 过程；-F force；-R recursively)
restorecon -vFR /common/
 
修改端口上下文(给http的tcp协议增加8908端口)
semanage port -a -t http_port_t -p tcp 8908

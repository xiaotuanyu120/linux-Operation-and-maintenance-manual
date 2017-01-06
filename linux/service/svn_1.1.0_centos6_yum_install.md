---
title: svn: 1.1.0 centos6下yum安装
date: 2015-11-2 14:09:00
categories: linux/service
tags: [linux,svn]
---
### svn: 1.0 centos6下yum安装

---

### 1. 安装环境
OS：|Centos 6 x64位
---|---
网段：|172.168.2.x/24

---

### 2. Install and configure apache
#### Step 1 " 安装apache
``` bash
yum install httpd
```
#### Step 2 " 配置apache:配置文件"/etc/httpd/conf/httpd.conf"
``` bash
vim /etc/httpd/conf/httpd.conf
===================================
#ServerName www.example.com:80
ServerName 172.16.2.58:80
===================================
```
#### Step 3 " 开启 apache 服务
``` bash
# service httpd start
# chkconfig --levels 235 httpd on
用浏览器或者curl命令来查看是否可以访问上面的ip（这一步并未测试）

Disable firewall ( Iptables ) &selinux
## Disable iptables
# service iptables stop
# chkconfig iptables off
## Disable Selinux
# vim /etc/selinux/config
***************************
SELINUX=disabled
***************************
# setenforce 0```

---

### 3. Install and configure svn server
#### Step 4 " 安装svn软件包
``` bash
yum install subversion mod_dav_svn
```
#### Step 5 " 创建一个新的svn仓库目录
``` bash
mkdir /data/svn
```
#### Step 6 " 创建svn仓库
``` bash
cd /data/svn
svnadmin create demo
svnadmin create test
```
#### Step 7 " 修改svn仓库目录权限
``` bash
chown -R apache:apache /data/svn/
```
#### Step 8 " 创建密码文件"cp.users"并创建用户
``` bash
htpasswd -c /data/svn/svn.users admin
htpasswd -m /data/svn/svn.users test
# 相当于这个用户是记录在这个密码文件上的
# 增加一个用户
# htpasswd -m /data/svn/cp.users username
```

#### Step 9 " 配置SVN apache配置文件( /etc/httpd/conf.d/subversion.conf )
``` bash
vim /etc/httpd/conf.d/subversion.conf
==========================================
LoadModule dav_svn_module     modules/mod_dav_svn.so
LoadModule authz_svn_module   modules/mod_authz_svn.so

<Location /repos>
   DAV svn
   SVNParentPath /data/svn
   AuthType Basic
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/svn.users
   AuthzSVNAccessFile /data/svn/svn.authz
   Require valid-user
</Location>
===========================================
# 上面指定的SVNParentPath是多个项目共同的父目录
# 然后可以通过/repos/repo_name来访问多个项目
```
#### Step 10 " 重启 apache service
``` bash
service httpd restart
```
#### Step 11 " 在浏览器中打开svn的网络路径
- "http://172.16.2.58/repos/demo"
- "http://172.16.2.58/repos/test"
[ip]/[subversion中配置的location]/[repo_name]> 后续Step >>可以在windows上安装tortoisesvn来管理
---

### 4. 权限访问
#### Step 1 Configure firewall ( Iptables )
``` bash
# 考虑到svn服务器的安全性，可以指定一台svn控制台，绑定mac地址
vim /etc/sysconfig/iptables
增加以下两条规则
===========================================
-A INPUT -p tcp --dport 80 -m mac --mac-source your_mac_address -j DROP
-A INPUT -p tcp --dport 22 -m mac --mac-source your_mac_address -j DROP
===========================================
mac地址的格式必须为XX:XX:XX:...
service iptables restart```
#### Step 2 Configure httpd
用apache虚拟主机来管控主机访问权限（针对主机访问）
``` bash
cat /etc/httpd/conf.d/svn.conf
<VirtualHost *:80>
        ServerName 172.16.2.58
        DocumentRoot "/data/svn"

        <Directory "/data/svn/demo">
                Order deny,allow
                Deny from all
                Allow from 172.16.2.28
        </Directory>

        <Directory "/data/svn/test">
                Order deny,allow
                Deny from all
                Allow from 10.10.180.17 10.10.180.14 10.10.190.4
        </Directory>
</VirtualHost>
```

官方配置引导：
link：http://svnbook.red-bean.com/en/1.7/index.html

#### step 3 增加访问控制
``` bash
## 修改subversion.conf
vim /etc/httpd/conf.d/subversion.conf
===========================================
LoadModule dav_svn_module     modules/mod_dav_svn.so
LoadModule authz_svn_module   modules/mod_authz_svn.so

<Location /repos>
   DAV svn
   SVNParentPath /data/svn
   AuthType Basic
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/svn.users
   # 增加AuthzSVNAccessFile配置
   AuthzSVNAccessFile /data/svn/svn.authz
   Require valid-user
</Location>
===========================================

## 创建权限控制文件
cat /data/svn/svn.authz
===========================================
[groups]
group1 = admin
group2 = test,admin

[/]
* = r

[demo:/css]
@group1 = rw

[test:/js]
@group2 = rw
===========================================
[groups]指定组及其user
[path]指定所有repos的路径的访问权限
[repo_name:path]被指定repo的路径的访问权限
```

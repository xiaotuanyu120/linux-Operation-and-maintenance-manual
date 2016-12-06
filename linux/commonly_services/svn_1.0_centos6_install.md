---
title: svn: 1.0 centos6下yum安装
date: 2015-11-2 14:09:00
categories: linux/commonly_services
tags: [linux,svn]
---
### svn: 1.0 centos6下yum安装

---

### 1. 安装环境：
OS：|Centos 6 x64位
---|---
网段：|172.168.2.x/24

### 2. Install and configure apache
#### Step 1 " 安装apache
``` bash
yum install httpd
```
#### Step 2 " 配置apache:配置文件"/etc/httpd/conf/httpd.conf"
若选择用虚拟主机来处理请求，此步需跳过
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
svnadmin create cp
```
#### Step 7 " 修改svn仓库目录权限
``` bash
chown -R apache:apache /data/svn/
```
#### Step 8 " 创建密码文件"cp.users"并创建用户"levi"
``` bash
htpasswd -cm /data/svn/cp.users levi
# 相当于这个用户是记录在这个密码文件上的
# 增加一个用户
# htpasswd -m /data/svn/cp.users username
```

#### Step 9 " 配置SVN apache配置文件( /etc/httpd/conf.d/subversion.conf )
``` bash
# vim /etc/httpd/conf.d/subversion.conf
==========================================
<Location /repos>
   DAV svn
   SVNParentPath /data/svn                     # svn仓库目录
   AuthType Basic                               # 认证类型
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/cp.users             # 指定密码文件
   Require valid-user
</Location>
===========================================
```
#### Step 10 " 重启 apache service
``` bash
service httpd restart
```
#### Step 11 " 在浏览器中打开svn的网络路径"http://172.16.2.58/repos/cp"

#### 后续Step >>可以在windows上安装tortoisesvn来管理
---

### 4. 权限访问
#### Step 1 Configure firewall ( Iptables )
配置iptables
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

用apache虚拟主机来管控访问权限
``` bash
cat /etc/httpd/conf.d/svn.conf
<VirtualHost *:80>
        ServerName 172.16.2.58
        DocumentRoot "/data/svn/cp"
        <Directory "/data/svn/cp">
                Order deny,allow
                Deny from all
                Allow from 172.16.2.28
        </Directory>
</VirtualHost>
```
ps：之前就想用apache本身来控制访问权限，但因为错误的把Directory这个directive放在了svn的conf里面，后来采用了自建虚拟主机的方式（上面的写法）才得以生效

官方配置引导：
link：http://svnbook.red-bean.com/en/1.7/index.html
---

### 5. HTTPD+SVN多项目管理
``` bash
# 环境
# svn项目父目录：/data/svn/seo
# svn项目创建：
cd /data/svn/seo
svnadmin create tech1-igamejybapp
svnadmin create tech2-ccs
svnadmin create tech3-igamejybservice

# svn的repos配置
vim /etc/httpd/conf.d/subversion.conf
===========================================
<Location /seo/tech1>
   DAV svn
   SVNParentPath /data/svn/seo
   AuthType Basic
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/seo/tech1-igamejybapp.users
   Require valid-user
</Location>

<Location /seo/tech2>
   DAV svn
   SVNParentPath /data/svn/seo
   AuthType Basic
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/seo/tech2-ccs.users
   Require valid-user
</Location>

 <Location /seo/tech3>
   DAV svn
   SVNParentPath /data/svn/seo
   AuthType Basic
   AuthName "Authorization Realm"
   AuthUserFile /data/svn/seo/tech3-igamejybservice.users
   Require valid-user
</Location>
===========================================

# apache httpd的控制配置
vim /etc/httpd/conf.d/svn.conf
===========================================
<VirtualHost *:80>
        ServerName 10.10.210.21
        DocumentRoot "/data/svn/seo/"

        <Directory "/data/svn/seo/tech1-igamejybapp">
                Order deny,allow
                Deny from all
                Allow from 10.10.180.17 10.10.180.14 10.10.190.4
        </Directory>

        <Directory "/data/svn/seo/tech2-ccs">
                Order deny,allow
                Deny from all
               Allow from 10.10.180.19 10.10.180.15 10.10.190.4
        </Directory>

        <Directory "/data/svn/seo/tech3-igamejybservice">
                Order deny,allow
                Deny from all
                Allow from 10.10.180.18 10.10.190.4
        </Directory>
</VirtualHost>
===========================================
```
访问url  
http://10.10.210.21/seo/tech1/tech1-igamejybapp/  
http://10.10.210.21/seo/tech2/tech2-ccs/  
http://10.10.210.21/seo/tech3/tech3-igamejybservice/  

[ip]/[subversion中配置的location]/[directory最后一段]

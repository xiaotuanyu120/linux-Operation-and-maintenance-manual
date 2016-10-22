GIT: 本地服务器web界面
Friday, 26 August 2016
10:50 AM
 
---
title: git本地服务器web界面
date: 2016-08-26 10:52:00
categories: devops
tags: [devops,git]
---
## 使用apache+cgi方式来运行gitweb
**安装gitweb**
``` bash
# 下载git源码，里面有gitweb软件包
git clone git://git.kernel.org/pub/scm/git/git.git
cd git/
make GITWEB_PROJECTROOT="/data/git" prefix=/usr gitweb     
    SUBDIR gitweb
    SUBDIR ../
make[2]: `GIT-VERSION-FILE' is up to date.
    GEN gitweb.cgi
    GEN static/gitweb.js
cp -Rf gitweb /var/www/
```
 
<!--more-->
 
**配置apache**
``` bash
vim /etc/httpd/conf.d/web.git.conf
******************************
<VirtualHost *:80>
    ServerName web.gitserver
    DocumentRoot /var/www/gitweb
    <Directory /var/www/gitweb>
        Options ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
        AllowOverride All
        order allow,deny
        Allow from all
        AddHandler cgi-script cgi
        DirectoryIndex gitweb.cgi
    </Directory>
</VirtualHost>
******************************
```
 
**测试访问**
![057-测试访问](http://blog.xiao5tech.com/uploads/057.png)

 
## 错误解决
错误信息：
```
Can't locate CGI.pm in @INC (@INC contains: /usr/local/lib64/perl5 /usr/local/share/perl5 /usr/lib64/perl5/vendor_perl /usr/share/perl5/vendor_perl /usr/lib64/perl5 /usr/share/perl5 .) at /var/www/gitweb/gitweb.cgi line 13.
```
 
解决办法：
``` bash
yum install perl-CGI
```
 
错误信息：
```
Can't locate Time/HiRes.pm in @INC (@INC contains: /usr/local/lib64/perl5 /usr/local/share/perl5 /usr/lib64/perl5/vendor_perl /usr/share/perl5/vendor_perl /usr/lib64/perl5 /usr/share/perl5 .) at /var/www/gitweb/gitweb.cgi line 20.
BEGIN failed--compilation aborted at /var/www/gitweb/gitweb.cgi line 20.
```
 
解决办法：
``` bash
yum install perl-Time-HiRes
```

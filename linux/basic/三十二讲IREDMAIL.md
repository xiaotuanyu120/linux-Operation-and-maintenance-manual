---
title: 三十二讲IREDMAIL
date: 2015-2-5 8:23:00
categories: linux/basic
tags:
---
 
邮件基础知识
常见的电子邮件协议有以下几种(这几种协议都是由TCP/IP协议族定义的)：
SMTP（Simple Mail Transfer Protocol）：发送邮件协议，端口25。
POP（Post Office Protocol）：POP3是接收邮件协议，端口110。
IMAP（Internet Message Access Protocol）：
IMAP4，是POP3的一种替代协议
邮件摘要检索功能，无需下载即可查看标题摘要等信息
邮件离线处理，在脱机状态的操作过程记录，在下一次打开网络连接的时候会自动执行。
端口143
HTTP(S)：通过浏览器使用邮件服务时使用，端口80。
 
常用缩写简介
MTA:(mail transfer agent)邮件传输代理,发邮件的(sendmail,postfix)
MRA:(mail retravial agent)邮件检索代理,收邮件(dovecot)
MDA:(mail delivery agent)邮件投递代理,帮助投递邮件(maildrop) 
MUA:(mail user agent)邮件用户代理,个人主机上的收发代理软件(outlook，foxmail)
 
iredmail简介
iredmail是一套电子邮件解决方案,组件均为linux开源工具
组件包含:
* Postfix: SMTP service
* Dovecot: POP3/POP3S, IMAP/IMAPS, Managesieve service
* Apache: Web server
* MySQL/MariaDB/PostgreSQL: Storing application data and/or mail accounts
* OpenLDAP: Storing mail accounts
* Cluebringer: Postfix policy server
* Amavisd: An interface between Postfix and SpamAssassin, ClamAV. Used for spam and virus scanning.
* SpamAssassin: content-based spam scanner.
* ClamAV: virus scanner.
* Roundcube: Webmail
* Awstats: Apache and Postfix log analyzer
* Fail2ban: scans log files (e.g. /var/log/maillog) and bans IPs that show the malicious signs -- too many password failures, seeking for exploits, etc.
 
安装过程
1、安装准备
#修改hostname
[root@mail ~]# hostname mail.san01.com
[root@mail ~]# vi /etc/hosts
=========================================================================================
127.0.0.1 mail.san01.com localhost.localdomain localhost localhost4.localdomain4 localhost4
=========================================================================================
[root@mail ~]# vi /etc/sysconfig/network
=========================
#将HOSTNAME字段修改如下
HOSTNAME="mail.san01.com"
=========================
 
#下载安装包、解压并根据自身服务器情况修改相应文件
[root@ser01 src]# wget https://bitbucket.org/zhb/iredmail/downloads/iRedMail-0.9.0.tar.bz2
[root@ser01 src]# tar jxvf iRedMail-0.9.0.tar.bz2
#以下两处修改需要根据自身情况来定
[root@ser01 src]# cd iRedMail-0.9.0/pkgs/
[root@mail pkgs]# vi get_all.sh
=================================================================================================
#将以下语句
mirrorlist=https://mirrors.fedoraproject.org/metalink?repo=epel-${DISTRO_VERSION}&arch=\$basearch
#改为
mirrorlist=http://mirrors.fedoraproject.org/metalink?repo=epel-${DISTRO_VERSION}&arch=\$basearch
#有些朋友会因为https的原因在安装包的时候出现错误，但我本身没有遇到
=================================================================================================
[root@mail pkgs]# sed -i 's/iredmail.org/106.187.51.47/g' get_all.sh
#如果服务器在中国大陆境内，则需要把iredmail的域名更改为公网IP，因为大陆无法访问此域名
[root@mail pkgs]# cd ..
 
2、安装过程
[root@mail iRedMail-0.9.0]# sh iRedMail.sh
 
......
 
#会在iredmail官网获取相关包
< INFO > + 1 of 3: http://iredmail.org/yum/misc/iRedAdmin-0.4.1.tar.bz2
< INFO > + 2 of 3: http://iredmail.org/yum/misc/iRedAPD-1.4.4.tar.bz2
< INFO > + 3 of 3: http://iredmail.org/yum/misc/roundcubemail-1.0.4.tar.gz
 
......
 
#中间会安装dialog，这是一个对话式互动的小程序，用以启动后面对话式的安装过程
< INFO > Installing package(s): dialog
 
......
 
#启动dialog驱动的iredmail安装过程

 
#设定邮箱目录

 
#指定默认的web server

 
#选择邮箱账户存储程序

 
#设定mysql root密码（费解！如果我们已经有了mysql，这样设置密码会不会让我们丢失原来的？）

 
#指定第一个虚拟domain名称

 
#设定邮箱管理员账户密码

 
#选择组件

 
......
 
#账户密码信息文件
*************************************************************************
***************************** WARNING ***********************************
*************************************************************************
*                                                                       *
* Below file contains sensitive infomation (username/password), please  *
* do remember to *MOVE* it to a safe place after installation.          *
*                                                                       *
*   * /usr/local/src/iRedMail-0.9.0/config
*                                                                       *
*************************************************************************
 
......
 
#安装上面设定好的包
Install     136 Package(s)
Upgrade       9 Package(s)
 
Total download size: 167 M
 
......
 
#配置iredmail的相关组件
********************************************************************
* Start iRedMail Configurations
********************************************************************
 
......
 
#提示关闭selinux和卸载sendmail
< INFO > Disable SELinux in /etc/selinux/config.
< Question > Would you like to *REMOVE* sendmail now? [Y|n]y
< INFO > Removing package(s): sendmail
 
......
 
#询问是否启用iptables
< Question > Would you like to use firewall rules provided by iRedMail?
< Question > File: /etc/sysconfig/iptables, with SSHD port: 22. [Y|n]n
< INFO > Skip firewall rules.
#询问是否加载mysql的配置文件
< Question > Would you like to use MySQL configuration file shipped within iRedMail now?
< Question > File: /etc/my.cnf. [Y|n]y
 
......
 
#告诉你webmail登录地址和你的管理员帐号密码
********************************************************************
* URLs of installed web applications:
*
* - Webmail:
*   o Roundcube webmail://mail.san01.com/mail/
*
* - Web admin panel (iRedAdmin): httpS://mail.san01.com/iredadmin/
*
* You can login to above links with same credential:
*
*   o Username: postmaster@san01.com
*   o Password: your password here
*
*
********************************************************************
#最后告诉你一些tips，这个文件里包含我们安装组件的配置文件具体位置
* Congratulations, mail server setup completed successfully. Please
* read below file for more information:
*
*   - /usr/local/src/iRedMail-0.9.0/iRedMail.tips
*
* And it's sent to your mail account postmaster@san01.com.  #好贴心，还发到我们管理员邮箱里了
*
* Please reboot your system to enable mail services.
*
********************************************************************
 
@后续内容待补充
原因是我这台vps之前有配置lnmp环境，而iredmail默认是给我们安装新的mysql和apache或nginx的，所以产生了错误，由于时间原因，后续会补上此内容

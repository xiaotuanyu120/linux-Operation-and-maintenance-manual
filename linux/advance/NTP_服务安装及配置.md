---
title: NTP: 服务安装及配置
date: 2016年1月17日
categories: 19:08
---
 
## 安装ntp
# yum install ntp -y
 
## 访问下面的url，查看可配置的ntp server pool，可点击下面的zone修改大洲
http://www.pool.ntp.org/zone/asia
*************************************
   server 0.asia.pool.ntp.org
   server 1.asia.pool.ntp.org
   server 2.asia.pool.ntp.org
   server 3.asia.pool.ntp.org
*************************************
 
## 配置ntp
# vim /etc/ntp.conf
**************************************
## 注释默认的centos时间，添加实际需要的时间服务器
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
server 0.asia.pool.ntp.org
server 1.asia.pool.ntp.org
server 2.asia.pool.ntp.org
server 3.asia.pool.ntp.org
 
## 配置客户端访问权限
restrict 172.16.2.0 mask 255.255.255.0 nomodify notrap
## nomodify和notrap，是用来禁止客户端修改服务端配置或禁止其成为新的时间同步节点
 
## 配置日志
logfile /var/log/ntp.log
**************************************
## 防火墙设置
## ntp使用udp 123，属于osi第四层
# vim /etc/sysconfig/iptables
****************************************
## 在22端口之下加入下面一行
-A INPUT -m state --state NEW -m udp -p udp --dport 123 -j ACCEPT
****************************************
# service iptables restart
 
## 开启ntp服务
# chkconfig --add ntpd
# chkconfig ntpd on
# service ntpd start
 
## 检查ntpd服务是否运行
# ntpq  -p
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
*x.ns.gin.ntt.ne 103.1.106.69     2 u   38   64    7   60.220   -4.754   3.816
+time.iqnet.com  62.201.207.162   2 u  109   64    2  418.066    2.268   0.000
 218.189.210.4   .STEP.          16 u    -   64    0    0.000    0.000   0.000
+nipper.paina.jp 103.1.106.69     2 u   38   64    7  119.961   24.706   5.179
## 命令列出了连接的时间服务器，和展示了连接的相关信息，具体字段解释如下：
* remote and refid: remote NTP server, and its NTP server
* st: stratum of server
* t: type of server (local, unicast, multicast, or broadcast)
* poll: how frequently to query server (in seconds)
* when: how long since last poll (in seconds)
* reach: octal bitmask of success or failure of last 8 queries (left-shifted); 377 = 11111111 = all recent queries were successful; 257 = 10101111 = 4 most recent were successful, 5 and 7 failed
* delay: network round trip time (in milliseconds)
* offset: difference between local clock and remote clock (in milliseconds)
* jitter: difference of successive time values from server (high jitter could be due to an unstable clock or, more likely, poor network performance) 
 
## 若只是想简单看一下服务运行情况，也可以用以下命令
# ntpstat
unsynchronised
   polling server every 64 s
 
 

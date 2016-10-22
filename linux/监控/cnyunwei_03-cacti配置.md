cnyunwei: 03-cacti配置
2015年12月28日 星期一
19:57
 
CACTI配置及使用
=============================================================
## 监控服务端SNMP配置
## snmp配置
# vim /etc/snmp/snmpd.conf
**********************************
## 修改下面一行为新的内容
##view    systemview    included   .1.3.6.1.2.1.1
view    systemview    included   .1.3.6.1.2.1
## 修改下面一行为新的内容
## com2sec notConfigUser  127.0.0.1        public
com2sec notConfigUser 58.64.214.61        public
**********************************
 
## 测试一下snmp的连接
# snmpnetstat -v 2c -c public -Ca -Cp tcp localhost
Active Internet (tcp) Connections (including servers)
Proto Local Address          Remote Address         (state)
tcp   *.ssh                  *.*                   LISTEN
tcp   *.mysql                *.*                   LISTEN
tcp   *.5668                 *.*                   LISTEN
tcp   58.64.214.61.ssh       61.14.162.11.60403    ESTABLISHED
tcp   localhost.smtp         *.*                   LISTEN
tcp   localhost.smux         *.*                   LISTEN
tcp   localhost.5668         localhost.45809       ESTABLISHED
tcp   localhost.45809        localhost.5668        ESTABLISHED
 
## 验证收集数据的php
# php /var/www/html/poller.php 
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
OK u:0.01 s:0.00 r:2.06
。。。。。。
## poller.php是主要的信息收集程序
  

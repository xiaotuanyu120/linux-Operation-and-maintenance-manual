cnyunwei: 04-被监控端配置
2015年12月28日 星期一
19:57
 
添加监控
=============================================================
## 监控本机
console>device>localhost(或127.0.0.1)
点击后保证下面几个设置
snmp version： version2
## 如果希望添加监控的图形，可以点击右上角的"为这个主机添加图形"
## 然后把图形添加进图形树 
## 监控远程主机（被监控端配置）
## 安装snmp
# yum install -y net-snmp net-snmp-utils net-snmp-libs
 
## 修改配置文件
# vim /etc/snmp/snmpd.conf 
******************************************
## 修改下面两行
com2sec notConfigUser 58.64.214.61        public
view    systemview    included   .1.3.6.1.2.1
******************************************
 
## 启动snmp服务
# chkconfig snmpd on
# service snmpd start
Starting snmpd:                                            [  OK  ]
 
## 开放防火墙端口
# vim /etc/sysconfig/iptables
****************************************
## 注意是udp
-A INPUT -p udp -m udp --dport 161 -j ACCEPT
****************************************
# service iptables restart 
## 监控服务端测试
# snmpnetstat -v 2c -c public -Can -Cp tcp 59.188.30.50
Active Internet (tcp) Connections (including servers)
Proto Local Address          Remote Address         (state)
tcp   *.22                   *.*                   LISTEN
tcp   *.80                   *.*                   LISTEN
tcp   *.3306                 *.*                   LISTEN
tcp   59.188.30.50.22        61.14.162.7.61106     ESTABLISHED
tcp   59.188.30.50.22        61.14.162.11.51034    ESTABLISHED
tcp   127.0.0.1.25           *.*                   LISTEN
tcp   127.0.0.1.199          *.*                   LISTEN
tcp   127.0.0.1.9000         *.*                   LISTEN
You have new mail in /var/spool/mail/root 
## web页面设定
## 添加主机
console-device-add
## 填写以下字段
description： 主机名称
hostname： ip地址
host template： 主机模版
是否监控：勾选
然后保存
## 成功以后你会发现下面会出现snmp采集数据正在进行
 
## 添加图形
## 添加阀值
## 把主机添加到图形树 

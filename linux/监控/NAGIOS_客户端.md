NAGIOS: 客户端
2016年3月3日
16:21
 
一键安装包安装教程
==================================
 
## 下载链接
链接: http://pan.baidu.com/s/1dEuq6GD 密码: nz83
 
## 安装包中内容
# ll nagiosinstall
total 2524
-rw-r--r--.  1 root   root       692 Oct 21  2010 check_conntrack
-rw-r--r--.  1 root   root      7116 Sep  1  2010 check_iftraffic_nrpe.pl
-rw-r--r--.  1 root   root      1206 Oct 21  2010 check_io
-rw-r--r--.  1 root   root      2872 Sep 16  2010 check_iostat
-rw-r--r--.  1 root   root      8282 Sep  1  2010 check_mem.pl
-rw-r--r--.  1 root   root       672 Sep 27  2010 check_openfile
-rw-r--r--.  1 root   root     17427 Sep  1  2010 check_traffic.sh
-rw-r--r--.  1 root   root      1128 Jul  4  2012 install.sh
-rw-r--r--.  1 root   root       420 Sep 25  2010 ip_conn
drwxrwxrwx. 16 nagios root      4096 Sep 22 14:29 nagios-plugins-1.4.15
-rw-r--r--.  1 root   root   2095419 Jul 28  2010 nagios-plugins-1.4.15.tar.gz
drwxrwxr-x.  7 nagios nagios    4096 Sep 22 14:29 nrpe-2.12
-rw-r--r--.  1 root   root    405725 Mar 11  2008 nrpe-2.12.tar.gz
-rw-r--r--.  1 root   root      1972 May 20  2015 nrpe.cfg
## 内容详解
1、check开头的，都是命令
2、install.sh是安装脚本
3、tar.gz结尾的是nagios的安装包，同名的是解压出来的目录
4、cfg结尾的，是配置文件
 
## 解压安装包
# tar zxvf nagiosinstall.tar.gz
 
## 执行安装脚本
# cd nagiosinstall
# sh install.sh
 
## 配置nagios监控服务端ip
# vim /usr/local/nagios/etc/nrpe.cfg
*******************************
## 修改下面一项为监控服务端的ip
allowed_hosts=***.***.***.***
*******************************
 
## 重启服务
# ps aux |grep nrpe |grep nagios|sed -r 's/ +/ /g'|cut -d ' ' -f 2| xargs -i kill -HUP {}
 
## 配置iptables
# vim /etc/sysconfig/iptables
********************************
## 在合适的位置增加下面内容
-A INPUT -s 监控服务端ip/掩码 -p tcp -m state --state NEW -m tcp --dport 端口  -j ACCEPT
********************************

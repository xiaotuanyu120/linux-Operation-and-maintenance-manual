zabbix:客户端安装配置
2015年11月28日 星期六
17:06
 
1、源码安装客户端
# wget http://netix.dl.sourceforge.net/project/zabbix/ZABBIX%20Release%20Candidates/2.0.15rc1/zabbix-2.0.15rc1.tar.gz
# tar zxvf zabbix-2.0.15rc1.tar.gz
# cd zabbix-2.0.15rc1
# ./configure --prefix=/usr/local/zabbix20/ --enable-agent
Configuration:
 
  Detected OS:           linux-gnu
  Install path:          /usr/local/zabbix20
  Compilation arch:      linux
 
  Compiler:              gcc
  Compiler flags:        -g -O2
 
  Enable server:         no
 
  Enable proxy:          no
 
  Enable agent:          yes
  Agent details:
    Linker flags:          -rdynamic
    Libraries:             -lm  -lresolv
 
  Enable Java gateway:   no
 
  LDAP support:          no
  IPv6 support:          no
 
***********************************************************
*            Now run 'make install'                       *
*                                                         *
*            Thank you for using Zabbix!                  *
*              <http://www.zabbix.com>                    *
***********************************************************
# make
# make install 
2、客户端配置
# vim /usr/local/zabbix20/etc/zabbix_agentd.conf
*********************************
Server=172.16.2.26    # 172.16.2.26是zabbix服务端的地址
ServerActive=172.16.2.26
Hostname=nagios.ig.com
********************************* 
3、用户创建
# groupadd zabbix
# useradd -g zabbix zabbix 
4、启动服务&开机启动
# /usr/local/zabbix20/sbin/zabbix_agentd
# echo /usr/local/zabbix20/sbin/zabbix_agentd >> /etc/rc.local
 
错误1
============================================
错误信息：
Starting zabbix_agentd: /usr/local/zabbix/sbin/zabbix_agentd: error while loading shared libraries: libiconv.so.2: cannot open shared object file: No such fileor directory
解决方案：
# echo /usr/local/lib/ >> /etc/ld.so.conf
# ldconfig 
5、firewalld
# firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address="172.16.2.26" port port=10050 protocol=tcp accept'
# firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address="172.16.2.26" port port=10050 protocol=udp accept'
# firewall-cmd --reload 

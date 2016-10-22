nagios: 07-被监控端部署nrpe
2016年6月8日
22:24
 
0，被监控端安装nrpe
=============================================
## 创建nagios用户
# useradd nagios
# passwd nagios
 
## 下载并安装nagios plugin
# cd /usr/local/src/
# wget https://nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz
# tar zxf nagios-plugins-2.1.1.tar.gz
# cd nagios-plugins-2.1.1
# ./configure --prefix=/usr/local/nagios
# make
# make install
# chown -R nagios:nagios /usr/local/nagios
 
## 安装xinetd
# yum install xinetd
 
## 下载并安装nrpe
# wget http://superb-sea2.dl.sourceforge.net/project/nagios/nrpe-2.x/nrpe-2.15/nrpe-2.15.tar.gz
# tar zxvf nrpe-2.15.tar.gz
# cd nrpe-2.15
# yum install openssl-devel openssl -y
# ./configure --enable-ssl --with-ssl-lib
# make all
# make install-plugin
# make install-daemon
# make install-daemon-config
# make install-xinetd
 
## 配置nrpe daemon的监控端ip地址
# vim /usr/local/nagios/etc/nrpe.cfg
**********************************************
allowed_hosts=127.0.0.1,10.10.180.11
## ip地址是监控端服务器的ip，这里是逗号间隔
**********************************************
# vim /etc/xinetd.d/nrpe
**********************************************
only_from       = 127.0.0.1 10.10.180.11
## ip地址是监控端服务器的ip，这里是空格间隔
**********************************************
 
## 配置nrpe daemon的端口
# vim /etc/services
***********************************************
nrpe            5666/tcp
***********************************************
 
## 重启xinted服务
# service xinetd restart
 
## 检查连接
# /usr/local/nagios/libexec/check_nrpe -H localhost
CHECK_NRPE: Error - Could not complete SSL handshake.
## 原来是因为并没有把localhost写进nrpe的两个配置文件中，添加localhost，并重启xinetd服务后可成功得到返回结果
# /usr/local/nagios/libexec/check_nrpe -H localhost
NRPE v2.15
 
 
# /usr/local/nagios/libexec/check_nrpe -H 127.0.0.1
NRPE v2.15
  

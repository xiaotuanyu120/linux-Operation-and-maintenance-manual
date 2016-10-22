nagios: 08-监控服务端部署nrpe
2016年6月8日
22:24
 
0，监控端安装nrpe
=============================================
## 下载并安装nrpe
# cd /usr/local/src/
# tar zxf nrpe-2.15.tar.gz
# cd nrpe-2.15
# yum install openssl-devel openssl -y
# ./configure --enable-ssl --with-ssl-lib
# make all
# make install-plugin
 
## 检查连接
# /usr/local/nagios/libexec/check_nrpe -H 10.10.180.17
NRPE v2.15
 
## 配置nrpe命令
# vim /usr/local/nagios/etc/objects/commands.cfg
*********************************************
define command{
        command_name check_nrpe
        command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
        }
*********************************************
 
## 编辑原来的service配置文件
# vim /usr/local/nagios/etc/selfconf/services.cfg
*********************************************
check_command           check_nrpe!check_http
## 将check_http传给check_nrpe来执行
*********************************************
 
错误1
错误信息：
后来web页面检查的时候，此命令运行失败，报错：NRPE: Command 'check_http' not defined 
原因：
原来是被监控端的nrpe.cfg中没有定义check_http
解决方案：
## 被监控端，确保check_http命令存在
# ls /usr/local/nagios/libexec/check_http
## 配置nrpe.cfg
# vim /usr/local/nagios/etc/nrpe.cfg
*********************************************
command[check_http]=/usr/local/nagios/libexec/check_http -I 127.0.0.1
*********************************************
# service xinetd restart
# /usr/local/nagios/libexec/check_nrpe -H localhost -c check_http
HTTP OK: HTTP/1.1 200 OK - 844 bytes in 0.010 second response time |time=0.010375s;;;0.000000 size=844B;;;0 

nagios: 05-配置服务
2016年6月8日
22:24
 
0，创建一个自定义服务
=============================================
# vi /usr/local/nagios/etc/selfconf/services.cfg
************************************************
define service{
        use                     generic-service
        host_name               remotehost
        service_description     HTTP
        check_command           check_http
        }
************************************************
 
## use：
指定继承哪一个模版的配置
配置在/usr/local/nagios/etc/objects/templates.cfg中
## hostname：主机名称
## service_description：服务描述
## check_command：使用命令的名称
 
## 检查一下check_http命令
# vi /usr/local/nagios/etc/objects/commands.cfg
************************************************
define command{
        command_name    check_http
        command_line    $USER1$/check_http -I $HOSTADDRESS$ $ARG1$
        }
************************************************
 
## 通过下面的扩展链接，可以看到还有FTP\SMTP\IMAP\POP3\SSH等服务的检查，当然通过自己写命令脚本，还可以扩展很多服务 

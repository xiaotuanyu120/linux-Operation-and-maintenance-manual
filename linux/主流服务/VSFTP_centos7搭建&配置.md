VSFTP: centos7搭建&配置
2015年11月17日 星期二
17:36
 
Centos7版
1、service
# yum install vsftpd libdb4-utils -y 
# systemctl enable vsftpd
 
2、user
# useradd vsftpd-u -s /sbin/nologin
 
3、userlist&userlist-db
# vim /etc/vsftpd/vsftpd_userlist
*************************************
ftp01
ftpuser01
ftp02
ftpuser02
ftp03
ftpuser03
ftp04
ftpuser04
ftp05
ftpuser05
*************************************
# chmod 600 /etc/vsftpd/vsftpd_userlist
# db_load -T -t hash -f /etc/vsftpd/vsftpd_userlist /etc/vsftpd/vsftpd_userlist.db
# chmod 600 /etc/vsftpd/vsftpd_userlist.db
 
4、authorization
# vim /etc/pam.d/vsftpd
**********************************************
## 最开头添加
auth       sufficient   /lib64/security/pam_userdb.so db=/etc/vsftpd/vsftpd_userlist
account    sufficient   /lib64/security/pam_userdb.so db=/etc/vsftpd/vsftpd_userlist
**************************************************
 
5、global configuration
# vim /etc/vsftpd/vsftpd.conf
***************************************************
## 修改以下几行
anonymous_enable=NO
anon_upload_enable=NO
anon_mkdir_write_enable=NO
chroot_local_user=YES
## 添加以下几行
guest_enable=YES
guest_username=vsftpd-u
virtual_use_local_privs=YES
user_config_dir=/etc/vsftpd/vsftpd_user_conf
***************************************************
 
6、private configuration
# mkdir /etc/vsftpd/vsftpd_user_conf
# vim /etc/vsftpd/vsftpd_user_conf/ftp01
********************************************************
local_root=/home/vsftpd-u/ftp01
anonymous_enable=NO
write_enable=YES                           # 注意，此行的配置会覆盖主配文件配置
local_umask=022
anon_upload_enable=NO
anon_mkdir_write_enable=NO
idle_session_timeout=600
data_connection_timeout=120
local_max_rate=50000
********************************************************
# mkdir /home/vsftpd-u/ftp0{1,2,3,4,5}
# chown -R vsftpd-u:vsftpd-u /home/vsftpd-u/
 
7、selinux & firewalld
# setsebool -P allow_ftpd_full_access 1
 
## firewalld的两种写法
## 写法1：开放给所有用户
# firewall-cmd --permanent --add-service=ftp
## 写法2：开放给某个网段
# firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.0.0/24" service name="ftp" accept'
# firewall-cmd --reload
## PS：如果希望删除已经增加的规则，去修改public zone的配置文件，重新加载即可
# vim /etc/firewalld/zones/public.xml
# firewall-cmd --reload
 
 
8、配置访问控制
需求1：
ftp-W,可以写入，不可读取，无法修改ftp文件内容及名称；
ftp-R，可以读取，不可写入，无法修改ftp文件内容及名称。
配置：
ftp-W
# vim /etc/vsftpd/vsftpd.conf
*********************************************
## 增加下面两行（行1：无法修改ftp文件；行2：无法下载）
cmds_denied=DELE,RMD,RNFR,RNTO,MKD
download_enable=NO
*********************************************
 
ftp-R
# vim /etc/vsftpd/vsftpd.conf
*********************************************
## 修改以下行
write_enable=NO
## 增加以下行
cmds_denied=DELE,RMD,RNFR,RNTO,MKD
*********************************************
 
需求2：
两个ftp服务器都需要配置特定的ip段和ip地址才可访问，因为上面NO.7里已经使用firewalld可以控制访问的ip段，这里我们只要控制ip地址的访问即可
配置：
# vim /etc/vsftpd/vsftpd.conf
*********************************************
## 确保tcp_wrappers是YES状态
tcp_wrappers=YES
*********************************************
 
# vim /etc/hosts.allow
*********************************************
## 添加以下字段，允许1个ip(也可以"192.168.0."指定ip段)
vsftpd:192.168.0.167
*********************************************
 
# vim /etc/hosts.deny
*********************************************
## 添加以下字段，拒绝所有，但不限制上面allow的部分
vsftpd:All
*********************************************
 
 
 
问题：
=============================================
1、500 oops： vsftpd：refusing to run with writable root inside chroot（）
# vim /etc/vsftpd/vsftpd.conf
*************************************
## 增加下面一行
allow_writeable_chroot=YES
*************************************
 
2、421 service not available
# vim /etc/hosts.allow
*************************************
## 增加下面一行(没有最后一段代表网段控制)
vsftpd:10.10.180.
*************************************

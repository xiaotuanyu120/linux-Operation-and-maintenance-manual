RHCE考试答案
2015年9月19日
11:31
 
考试环境部署：
=========================================
1、优盘根目录执行以下命令(classroom)
# yum install -y ./examrhce-0.0.1-1.el7.x86_64.rpm
 
2、server/desktop执行以下命令(server/desktop)
# lab examrhce setup
 
3、评分命令
# lab examrhce grade
 
考题答案
 
第1题：SELINUX配置(server&desktop)
=====================================================
1、##修改配置
# vi /etc/sysconfig/selinux
***********************************
SELINUX=enforcing
***********************************
 
2、##修改目前状态
# setenforce 1
 
3、##查看状态
# getenforce
 
第2题：配置防火墙对SSH的限制(server&desktop)
=====================================================
1、关闭iptables/ip6tables/ebtables
# systemctl mask iptables
# systemctl mask ip6tables
# systemctl mask ebtables
 
2、开启firewalld并设为开机启动
# systemctl enable firewalld
# systemctl start firewalld
 
3、 创建规则
## 允许ssh服务
# firewall-cmd --permanent --add-service=ssh
## 禁止特定域(ip段)访问ssh
# firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=172.17.0.0/24 service name=ssh reject'
 
4、 重新加载规则使其生效
# firewall-cmd --reload
 
5、 检查规则
# firewall-cmd --list-all
 
第3题：配置ipv6地址(server&desktop)
=====================================================
1、图形界面改ipv6
# nm-connection-editor
 
2、reload配置和重启网卡
# nmcli con reload
# nmcli con down eth0
# nmcli con up eth0
 
3、查看ip
# ip a
# ping ip address  (互相ping一下)
 
第4题：配置链路聚合(server&desktop)
=====================================================
1、查看网卡链路
# ip link
 
2、创建team类型的网卡，连接别名是team0，使用的模式是activebackup
# nmcli con add type team con-name team0 ifname team0 config '{"runner":{"name":"activebackup"}}'
 
3、给team0网卡设置ip
# nmcli con mod team0 ipv4.addresses '192.168.0.101/24'
# nmcli con mod team0 ipv4.method manual
 
4、给team0网卡指定从接口
# nmcli con add type team-slave con-name team0-port1 ifname eth1 master team0
# nmcli con add type team-slave con-name team0-port2 ifname eth2 master team0
 
5、检查效果
# teamdctl team0 state
# ping 192.168.0.254
 
第5题：自定义用户环境(server&desktop)
=====================================================
1、在/etc/bashrc最后添加以下
# vim /etc/bashrc
********************************
alias qstat='/bin/ps -Ao pid,tt,user,fname,rsz'
********************************
 
2、新开终端检查
# which qstat
 
第6题：配置本地邮件服务(server&desktop)
=====================================================
1、启动postfix服务
# systemctl enable postfix
# systemctl restart postfix
 
2、配置postfix
# postconf -e "inet_interfaces = loopback-only"  # 配置网卡
# postconf -e "myorigin = example.com"           # 配置邮件来源
# postconf -e "relayhost = [classroom.example.com]" # 配置邮件下一跳地址
# postconf -e "mydestination = "                 # 为空表示不接受任何外网邮件
# postconf -e "local_transport = error: local delivery disabled"
# postconf -e "mynetworks = 127.0.0.1/8, [::1]/128"  # 允许本地ip来访问
 
3、重启postfix服务
# systemctl restart postfix
 
4、发送测试邮件
# mail -s "server0 null client" student@classroom.example.com
null client test                     # 此处为输入内容
.                                    # 此处为输入内容
EOT
 
5、检查邮件
浏览器输入"classroom.exam.com/cgi-bin/recevied_mail"检查邮件
 
## 如果没有发送成功，可以检查发送队列
# mailq
 
第7题：配置端口转发(server)
=====================================================
1、配置防火墙规则
# firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=172.25.0.0/24 forward-port port=5423 protocol=tcp to-port=80'
 
2、重载规则
# firewall-cmd --reload
 
第8题：配置samba服务(server)
=====================================================
1、安装samba
# yum install samba samba-client -y
 
2、建立目录和用户(创建之前检查是否已存在)
# mkdir /common
# useradd -s /sbin/nologin rob
# useradd -s /sbin/nologin brian
 
3、将用户加入到samba里，并设置密码
# smbpasswd -a rob
# smbpasswd -a brian
 
4、更改目标目录权限
# chown :brian /common/
# chmod 2775 /common/
# ll -d /common/
 
5、更改selinux的安全
# semanage fcontext -a -t samba_share_t '/common(/.*)?'
# restorecon -vFR /common/
 
6、更改samba配置文件
# vim /etc/samba/smb.conf
*****************************************
## 修改
workgroup = STAFF
security = user
## 增加
[common]
path=/common
write list = brian
browseable = yes
hosts allow = 172.25.0.                               # 172网段
*****************************************
 
7、启动服务
# systemctl enable smb nmb
# systemctl start smb nmb
 
8、防火墙放行samba
# firewall-cmd --permanent --add-service=samba
# firewall-cmd --reload
 
第9题：配置多用户samba挂载(client)
=====================================================
1、安装cifs-tuils包
# yum install cifs-utils -y
 
2、创建挂载目录
# mkdir /mnt/multiuser
 
3、创建配置文件
# echo 'username=brian' > /root/smb-multiuser.txt              # 名称自定义
# echo 'password=redhat' >> /root/smb-multiuser.txt          # 注意配置文件名称保持一致
 
4、把挂载信息添加到fstab
# vi /etc/fstab
**********************************
//server0.example.com/common /mnt/multiuser cifs credentials=/root/smb-multiuser.txt,multiuser,sec=ntlmssp 0 0
**********************************
 
5、挂载
# mount -a               # 把fstab里的所有挂载配置挂载
# df -h                     # 检查挂载结果
 
6、检查client上是否有brian和rob，如不存在则创建
# id rob
# id brian
 
7、多用户环境的credentials管理
# su - brian
# cifscreds add server0
Password:
## 检查brian用户是否可读写
 
# su - rob
# cifscreds add server0
Password:
## 检查rob用户是否是只读
 
第10题：配置NFS服务(server)
=====================================================
1、服务
* 安装nfs软件包
# yum install -y nfs-utils
# systemctl enable nfs-server
# systemctl start nfs-server
 
2、目录
* 创建未加密共享目录
# mkdir /public
# chown nfsnobody /public
* 创建kerberos加密共享目录
# mkdir /protected/project -p
# chown ldapuser0:ldapuser0 /protected/project
 
3、配置文件
* exports配置
# vi /etc/exports
**************************************
/protected *.example.com(rw,sec=krb5p)# krb的必须放首位，并且域要和其他的规则一致
/public *.example.com(ro)
**************************************
# exportfs -r
# exportfs
* nfs全局配置
# vi /etc/sysconfig/nfs
***********************************
RPCNFSDRAGS="-V 4.2"
***********************************
 
4、防火墙配置
# firewall-cmd --permanent --add-service=nfs
# firewall-cmd --permanent --reload
 
5、下载并部署密钥
# wget -O /etc/krb5.keytab http://classroom.example.com/pub/keytabs/server0.keytab
 
6、开启加密nfs服务
# systemctl enable nfs-secure-server.service
# systemctl start nfs-secure-server.serivce
 
 
 
第11题：挂载一个NFS共享(client)
=====================================================
1、创建挂载目录
# mkdir /mnt/nfsmount
# mkdir /mnt/nfssecure
 
2、配置/etc/fstab完成开机自动挂载
# vi /etc/fstab
*****************************************
## 增加
server0.example.com:/public /mnt/nfsmount nfs defaults 0 0
server0.example.com:/protected /mnt/nfssecure nfs defaults,sec=krb5p 0 0
*****************************************
 
3、完成krb5认证挂载的key下载
# wget -O /etc/krb5.keytab http://classroom.example.com/pub/keytabs/desktop0.keytab
# systemctl enable nfs-secure
# systemctl start nfs-secure
 
4、挂载
# mount -a
# df -h
 
5、验证krb5认证是否生效
# ssh ldapuser0@localhost            # password是：kerberos
# cd进/mnt/nfssecure/project做个文件检查下是否可读写
 
第12题：实现一个web服务器(server)
=====================================================
1、安装apache包
# yum install -y httpd
# systemctl enable httpd
# systemctl start httpd
 
2、配置防火墙
# firewall-cmd --permanent --add-service=http
# firewall-cmd --reload
 
3、创建vhost配置文件
# vi /etc/httpd/conf.d/vhost-server0.conf
*******************************************
<VirtualHost *:80>
ServerName server0.example.com
DocumentRoot "/var/www/html"
CustomLog "logs/server0_vhost_log" combined
<Directory "/var/www/html">
<RequireAll>
Require all granted
Require not host .my133t.org
</RequireAll>
</Directory>
</VirtualHost>
*******************************************
 
4、下载首页
# wget -O /var/www/html/index.html http://classroom.example.com/materials/station.html
 
5、重启服务&查看端口状态
# systemctl restart httpd
# lsof -i:80 -n
 
第13题：配置安全web服务(server)
=====================================================
1、安装ssl包
# yum install -y mod_ssl
 
2、添加防火墙规则
# firewall-cmd --permanent --add-service=https
# firewall-cmd --reload
 
3、下载网站证书
# wget -O /etc/pki/tls/certs/server0.crt http://classroom.example.com/pub/tls/certs/server0.crt
# wget -O /etc/pki/tls/private/server0.key http://classroom.example.com/pub/tls/private/server0.key
# wget -O /etc/pki/tls/certs/example-ca.crt http://classroom.example.com/pub/example-ca.crt
 
4、修改ssl配置文件
# vi /etc/httpd/conf.d/ssl.conf
*************************************************
## 在<VirtualHost _default_:443>块下添加
ServerName server0.example.com
DocumentRoot "/var/www/html"
 
## 修改如下证书路径
SSLCertificateFile /etc/pki/tls/certs/server0.crt
SSLCertificateKeyFile /etc/pki/tls/private/server0.key
SSLCACertificateFile /etc/pki/tls/certs/example-ca.crt
 
## 添加访问控制
</Directory "/var/www/html">
<RequireAll>
Require all granted
Require not host .my133t.org
</RequireAll>
</Directory>
*************************************************
# systemctl restart httpd
 
5、用浏览器访问http和https版本的域名检查
 
第14题：配置虚拟主机(server)
=====================================================
1、服务安装启动\防火墙规则（其实前面已经做过）
# yum install -y httpd
# systemctl enable httpd
# systemctl start httpd
# firewall-cmd --permanent --add-service=http
# firewall-cmd --reload
 
2、添加虚拟主机配置文件
# vi /etc/httpd/conf.d/vhost-www0.conf
*******************************************
<VirtualHost *:80>
ServerName www0.example.com
DocumentRoot "/var/www/virtual"
CustomLog "logs/www0_virtual_log" combined
<Directory "/var/www/virtual">
Require all granted
</Directory>
</VirtualHost>
*******************************************
 
3、创建虚拟机目录&下载主页文件
# mkdir -p /var/www/virtual
# wget -O /var/www/virtual/index.html http://classroom.example.com/materials/www.html
 
4、selinux上下文设置
# semanage fcontext -a -t httpd_sys_content_t '/var/www/virtual(/.*)?'
# restorecon -vFR /var/www/virtual
 
5、创建用户
# useradd floyd
# setfacl -m user:floyd:rwx /var/www/virtual
 
第15题：配置web内容的访问(server)
=====================================================
1、创建虚拟主机目录
# mkdir /var/www/virtual/private
# wget -O /var/www/virtual/private/index.html http://classroom.example.com/materials/private.html
 
2、修改配置文件
# vi /etc/httpd/conf.d/vhost-www0.conf
*********************************************
## 在<VirtualHost>中添加如下代码
<Directory "/var/www/html/private">
Require all denied
Require local
</Directory>
*********************************************
 
3、重启服务
# systemctl restart httpd
 
4、测试结果
# curl http://www0.example.com/private
 
第16题：实现动态web内容(server)--新版题库无此题
=====================================================
1、安装apache动态模块
# yum install -y mod-wsgi
 
2、创建目录及下载文件
# mkdir /var/www/webapp
# wget -O /var/www/webapp/webinfo.wsgi http://classroom.example.com/materials/webinfo.wsgi
# semanage fcontext -a -t httpd_sys_content_t '/var/www/webapp(/.*)?'
# restorecon -vFR /var/www/webapp
      
3、添加配置文件
# vi /etc/httpd/conf.d/vhost-webapp0.conf
********************************************
Listen 8908
<VirtualHost *:8908>
ServerName webapp0.example.com
DocumentRoot "/var/www/webapp"
CustomLog "logs/webapp0_vhost_log" combined
<Directory "/var/www/webapp">
Require all granted
</Directory>
 
WSGIScriptAlias / /var/www/webapp/webinfo.wsgi
 
</VirtualHost>
********************************************
 
4、配置selinux和firewall
# semanage port -a -t http_port_t -p tcp 8908
# firewall-cmd --permanent --add-rich-rule 'rule family=ipv4 source address=172.25.0.0/24 port port=8908 protocol=tcp accept'
# firewall-cmd --reload
 
5、重启服务
# systemctl restart httpd
 
6、检查效果
# curl http://webapp0.example.com:8908
 
第17题：创建一个脚本(server)
=====================================================
1、编写脚本
# vi /root/foo.sh
**********************************
#!/bin/bash
 
case $1 in
redhat)
echo "fedora"
;;
fedora)
echo "redhat"
;;
*)
echo "/root/foo.sh redhat|fedora"
;;
esac
**********************************
 
2、配置执行权限
# chmod 755 /root/foo.sh
 
第18题：创建一个添加用户的脚本(server)
=====================================================
1、编写脚本
# vi /root/batchusers
***********************************************
#!/bin/bash
 
if [ $# -eq 1 ];then
         if [ -f "$1" ];then
          while read username;do
                 useradd -s /bin/false $username &> /dev/null
             done < $1
      else
                echo "Input file not found"
             exit 1
     fi
else
      echo "Usage: /root/batchusers userfile"
       exit 2
fi
***********************************************
 
2、配置执行权限
# chmod 755 /root/batchusers
 
3、下载userlist
# wget -O /root/userlist http://classroom.example.com/materials/userlist
 
4、执行脚本
# /root/batchusers /root/userlist
 
5、检查结果
# tail -4 /etc/passwd
 
第19题：配置ISCSI服务端(server)
=====================================================
1、安装targetcli
# yum install targetcli -y
# systemctl enable target
# systemctl start target
 
2、firewall添加端口
# firewall-cmd --permanent --add-port=3260/tcp
# firewall-cmd --reload
 
3、新建硬盘分区
# lsblk
# fdisk /dev/sdb
Command (m for help): n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): 
Using default response p
Partition number (1-4, default 1): 
First sector (2048-20971519, default 2048): 
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-20971519, default 20971519): +4G
Partition 1 of type Linux and of size 4 GiB is set

Command (m for help): t
Selected partition 1
Hex code (type L to list all codes): 8e
Changed type of partition 'Linux' to 'Linux LVM'
 
Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
 
 
## 把分区创建为物理卷
# pvcreate /dev/sdb1
 
## 创建虚拟卷组
# vgcreate iSCSI_vg /dev/sdb1
 
## 创建虚拟卷
# lvcreate -n iscsi_store -L 3G iSCSI_vg
 
## 查看结果
# lvs
 
4、创建ISCSI服务
# targetcli
> cd /scsi
> create iqn.2014-11.com.example:server0
> iqn.2014-11.com.example:server0/tgp1/portals create 172.25.0.11 3260
 
## 绑定一个后端卷
> cd /
> backstores/block create name=server0.iscsi_store dev=/dev/iSCSI_vg/iscsi_store
> iscsi/iqn.2014-11.com.example:server0/tpg1/luns create /backstores/block/server0.iscsi_store
 
## 做访问控制
> iscsi/iqn.2014-11.com.example:server0/tpg1/acls create iqn.2014-11.com.example:desktop0
## 关闭密码验证的访问控制
> iscsi/iqn.2014-11.com.example:server0/tpg1/ set attribute authentication=0
## 使上面的访问控制生效
> iscsi/iqn.2014-11.com.example:server0/tpg1/ set attribute generate_node_acls=0
 
## 保存并退出
> saveconfig
> exit
 
5、查看设置结果
# targetcli
> ls
 
第20题：配置ISCSI的客户端(client)
=====================================================
1、安装iscsi客户端
# yum install iscsi-initiator-utils -y
 
2、配置iscsi文件中的客户端名称
# vi /etc/iscsi/initiatorname.iscsi
************************************
InitiatorName=iqn.2014-11.com.example:desktop0
************************************
 
3、启动客户端服务
# systemctl enable iscsi
# systemctl start iscsi
 
4、配置自动发现服务端并连接
# iscsiadm -m discovery -t st -p 172.25.0.11
# iscsiadm -m node -l
 
5、创建iscsi硬盘分区并格式化     
# lsblk                                       # 会发现多了一个硬盘
# fdisk /dev/sdc
n
p
1
+2100M
w
 
## 格式化
# mkfs.ext4 /dev/sdc1
 
6、挂载iscsi硬盘分区
# mkdir /mnt/data
 
## 获取分区UUID
# blkid /dev/sdc1
 
# vi /etc/fstab
**************************************************
UUID_HERE /mnt/data ext4 defaults,_netdev 0 0
**************************************************
 
# mount -a
 
## 检查挂载结果
# df -h
 
第21题：安装MariaDB数据库(server)
=====================================================
1、安装数据库包
# yum groupinstall mariadb mariadb-client -y
 
2、启动mariadb服务
# systemctl enable mariadb
# systemctl start mariadb
 
3、数据库初始化
# mysql_secure_installation
密码是空
y
输入新密码
再次输入新密码
y
y
y
y
 
4、下载数据库备份文件
# wget -O /root/mariadb.dump http://classroom.example.com/content/courses/rhce/rhel7.0/materials/mariadb/mariadb.dump
 
5、创建数据库
# mysql -uroot -p
> create database legacy;
> use legacy;
> source /root/mariadb.dump
> show tables;show databases;
 
6、创建用户并分配权限
> grant select on legacy.* to mary@'localhost' identified by 'mary_password';
> grant select,insert,update,delete on legacy.* to legacy@'localhost' identified by 'legacy_password';
> grant select on legacy.* to report@'localhost' identified by 'report_password';
 
第22题：数据查询填空(server)
=====================================================
# mysql -uroot -p
> use legacy;
> desc product;
>  select id from product where name='RT-AC68U';
> select count(product.id) from category,product where category.name='Servers' and category.id=product.id_category;
 
 
 
 
 
 
 

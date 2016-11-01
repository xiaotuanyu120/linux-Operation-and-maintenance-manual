---
title: 二十七讲NFS\FTP
date: 2015年1月22日	 下午 2:54:00
---
 
本节内容：NFS文件分享、FTP服务器搭建
 
NFS简介
* NFS是一个通过网络来分享文件的工具；
* NFS的学习重点在于权限、用户身份、RPC程序的理解。
组成部分：
* NFS：Network File System
可以通过网络，让不同设备、不同操作系统，可以彼此分享文件
* RPC：Remote Procedure Call
指定每个NFS功能的端口号，并且通知用户端，来保证用户可以连接到正确的端口。RPC之所以能知道正确的端口号，是因为NFS在启动时会随机选取几个端口号，并主动向RPC注册此端口号，并且RPC是使用111端口来接受此信息。
相关文件：
* 配置文件：/etc/exports
* 分享目录完整权限文件：/var/lib/nfs/etab
* 连接NFS服务器用户端资料文件：/var/lib/nfs/xtab
 
2、NFS的安装与配置
1、NFS的安装
[root@web03 nfs]# yum install nfs-utils #若rpcbind未安装，则自动安装rpcbind
#
2、分享目录配置
[root@web03 nfs]# vi /etc/exports
[要分享的目录]         [ip或ip网段]      [权限及登录身份等]
/tmp/sharefolder 192.168.0.1/24(rw,all_squash,anonuid=501,anongid=501)
 
#ip段可以写成主机名，主机名可以用通配符"*"，来匹配域用户
#共享目录之后，可以跟多个ip段，用空格分开
 
3、权限及登录身份段可用参数
rw(read & write) ;
ro(read only)   
#是否可读写，除了此处必须设置外，还限制在分享的文件或目录本身的权限
sync(内存和硬盘同步写入) ; 
async(暂存于内存，而不是直接写入硬盘);
no_root_squash(如使用NFS的是root用户，则保留文档的root权限)；
root_squash(如使用NFS的是root用户，会把root更改成nfsnobody用户，安全性比较好);
all_squash(不论使用NFS的是谁，都会把其更改为nfsnobody用户);
anonuid(指定取代root_squash或all_squash所使用匿名用户的uid);
anongid(指定取代root_squash或all_squash所使用匿名用户的gid)。
#指定的uid和gid必须是本机系统里所存在的
 
扩展、nfsnobody
[root@web03 ~]# cat /etc/passwd|grep nfsnobody
nfsnobody:x:65534:65534:Anonymous NFS User:/var/lib/nfs:/sbin/nologin       #专门的匿名NFS用户 
3、NFS的启动与相关命令
1、NFS和RPC的启动
[root@web03 ~]# service rpcbind start
Starting rpcbind:                                          [  OK  ]
[root@web03 ~]# service nfs start
Starting NFS services:                                     [  OK  ]
Starting NFS mountd:                                       [  OK  ]
Starting NFS daemon:                                       [  OK  ]
Starting RPC idmapd:                                       [  OK  ]
2、如何让设定好的共享目录启动
#挂载全部共享目录
[root@web03 ~]# exportfs -arv  
#exportfs是挂载及卸载共享目录的命令 
#-a是挂载或卸载全部/etc/exports中设定的目录
#-r重新挂载/etc/exports中设定的目录，并刷新/var/lib/nfs/xtab中的内容
#-v显示共享目录的信息
exporting 192.168.0.1/24:/tmp/sharefolder
#
#卸载全部共享目录
[root@web03 ~]# exportfs -auv
[root@web03 ~]# showmount -e localhost
#showmount是查看NFS共享目录的命令
#-e显示指定主机的NFS共享目录状态
Export list for localhost:    #因为我们卸载掉了NFS共享目录，所以结果为空
#
#重新挂载后查看
[root@web03 ~]# exportfs -arv
exporting 192.168.0.1/24:/tmp/sharefolder
[root@web03 ~]# showmount -e localhost
Export list for localhost:
/tmp/sharefolder 192.168.0.1/24 
4、客户端使用NFS
1、客户端也必须安装NFS和RPC
[root@filesbak ~]# showmount -e 192.168.0.26
Export list for 192.168.0.26:
/tmp/sharefolder 192.168.0.1/24
[root@filesbak ~]# mount -t nfs 192.168.0.26:/tmp/sharefolder /mnt/nfs     
 #挂载为nfs格式
[root@filesbak nfs]# touch test
[root@filesbak nfs]# ll
total 3
-rw-r--r-- 1 zpw  zpw  0 Jan 22 15:21 good   #用uid501创建的新文件
 
2、共享目录的权限必须是777
#在server端更改共享目录权限为766，没有执行权限
[root@web03 ~]# chmod 766 /tmp/sharefolder/
#
#在用户端创建文件
[root@filesbak nfs]# touch test2
touch: cannot touch `test2': Permission denied
[root@filesbak nfs]# ls
ls: cannot access test: Permission denied
ls: cannot access good: Permission denied
good  test
 
#在server端更改共享目录权限为755，没有写权限
[root@web03 ~]# chmod 755 /tmp/sharefolder/
#
#在用户端创建文件
[root@filesbak nfs]# touch test2
touch: cannot touch `test2': Permission denied 
FTP介绍
文件传输协议（英文：File Transfer Protocol，缩写：FTP）是用于在网络上进行文件传输的一套标准协议。
使用端口：
命令通道-port 21
数据传输-port 20
ftp缺点
1、明文传输（被sftp改善）
2、防火墙存在时的响应困难（被主动被动模式的区分改善）
3、稳定性差，传大量小文件时易断线，需要工具支持才能断点续传
 
ftp协议的工具一：pure-ftpd
1、编译安装
[root@web03 ~]# cd /usr/local/src
[root@web03 src]# wget http://download.pureftpd.org/pub/pure-ftpd/releases/pure-ftpd-1.0.36.tar.gz
[root@web03 src]# tar -zxvf pure-ftpd-1.0.36.tar.gz
[root@web03 src]# cd pure-ftpd-1.0.36
[root@web03 pure-ftpd-1.0.36]# ./configure   --prefix=/usr/local/pureftpd   --without-inetd   --with-altlog   --with-puredb   --with-throttling   --with-peruserlimits   --with-tls
[root@web03 pure-ftpd-1.0.36]# make
[root@web03 pure-ftpd-1.0.36]# make install
 
2、准备配置文件与启动命令脚本
[root@web03 pure-ftpd-1.0.36]# cd configuration-file
[root@web03 configuration-file]# cp pure-ftpd.conf /usr/local/pureftpd/etc/pure-ftpd.conf
[root@web03 configuration-file]# cp pure-config.pl /usr/local/pureftpd/sbin/pure-config.pl
[root@web03 configuration-file]# chmod 755 /usr/local/pureftpd/sbin/pure-config.pl
 
3、编辑配置文件
[root@web03 configuration-file]# vim /usr/local/pureftpd/etc/pure-ftpd.conf
============================================================================
ChrootEveryone              yes
BrokenClientsCompatibility  no
MaxClientsNumber            50
Daemonize                   yes
MaxClientsPerIP             8
VerboseLog                  no
DisplayDotFiles             yes
AnonymousOnly               no
NoAnonymous                 no
SyslogFacility              ftp
DontResolve                 yes
MaxIdleTime                 15
PureDB                        /usr/local/pureftpd/etc/pureftpd.pdb   #这个就是pure-pw mkdb生成的文件
LimitRecursion              3136 8
AnonymousCanCreateDirs      no
MaxLoad                     4
AntiWarez                   yes
Umask                       133:022
MinUID                      100
AllowUserFXP                no
AllowAnonymousFXP           no
ProhibitDotFilesWrite       no
ProhibitDotFilesRead        no
AutoRename                  no
AnonymousCantUpload         no
PIDFile                     /usr/local/pureftpd/var/run/pure-ftpd.pid
MaxDiskUsage               99
CustomerProof              yes
============================================================================
 
4、创建ftp目录、ftp依赖的系统用户、ftp的虚拟登录用户及其密码数据库
[root@web03 src]# mkdir /data/ftp
[root@web03 data]# useradd pureftp -s /sbin/nologin
[root@web03 data]# /usr/local/pureftpd/bin/pure-pw useradd ftp01 -u pureftp -d /data/ftp
Password:                      #此命令生成的文件在/usr/local/pureftpd/etc/pureftpd.passwd
Enter it again:
[root@web03 data]# /usr/local/pureftpd/bin/pure-pw mkdb        #生成密码库文件
[root@web03 data]# /usr/local/pureftpd/bin/pure-pw list
ftp01               /data/ftp/./
[root@web03 data]# /usr/local/pureftpd/bin/pure-pw userdel ftp02
 
5、启动pure-ftpd
[root@web03 data]# /usr/local/pureftpd/sbin/pure-config.pl /usr/local/pureftpd/etc/pure-ftpd.conf
Running: /usr/local/pureftpd/sbin/pure-ftpd -A -c50 -B -C8 -D -fftp -H -I15 -lpuredb:/usr/local/pureftpd/etc/pureftpd.pdb -L3136:8 -m4 -s -U133:022 -u100 -g/usr/local/pureftpd/var/run/pure-ftpd.pid -k99 -Z
 
6、用户端lftp命令访问ftp server
#安装lftp
[root@filesbak ~]# yum install lftp -y
#登录ftp server
[root@filesbak ~]# lftp ftp01@192.168.0.26
Password:
 
7、查看、创建、上传、下载
lftp ftp01@192.168.0.26:~> help                                                   #显示帮助信息
lftp ftp01@192.168.0.26:~> put 1.log                                    #上传当前目录文件
24 bytes transferred
lftp ftp01@192.168.0.26:/> put ./fugai/pass                     #上传其他目录的文件
1531 bytes transferred  
lftp ftp01@192.168.0.26:/> mkdir ftptest                             #创建目录
mkdir ok, `ftptest' created
lftp ftp01@192.168.0.26:/> mv 1.log ./ftptest/111.log   #移动和重命名
rename successful
lftp ftp01@192.168.0.26:/> get ./ftptest/111.log        #下载，默认是下载到本目录
24 bytes transferred
lftp ftp01@192.168.0.26:/> get ./pass -o ./aa           #下载到指定目录
1531 bytes transferred 
ftp协议工具二：vsftp
1、安装vsftp及其依赖包
[root@web03 data]# yum install -y vsftpd db4-utils
 
2、准备vsftp使用的用户及密码文件
[root@web03 data]# useradd vsftpd-u -s /sbin/nologin
[root@web03 data]# vi /etc/vsftpd/vsftpd_login
===========================================================
ftpa1                     #奇数行为用户名
*passwd1*                 #偶数行为密码
ftpa2
*passwd2*
===========================================================
[root@web03 data]# chmod 600 /etc/vsftpd/vsftpd_login        #保证安全性，设为只有root可读写
 
3、db_load命令来创建密码库文件
[root@web03 data]# db_load -T -t hash -f /etc/vsftpd/vsftpd_login /etc/vsftpd/vsftpd_login.db
#db_load工具是由db4-utils提供的
#-T参数，让db_load将文本文件转换为db文件
#-t参数，指定db库文件类型，此处指定为hash（哈希）
#-f参数，指定input文件
#语法：db_load -T -t <库类型> -f <input file> <output file>
[root@web03 data]# chmod 600 /etc/vsftpd/vsftpd_login.db       #保证安全性，设为只有root可读写
 
4、配置/etc/pam.d/vsftpd和/etc/vsftpd/vsftpd.conf（全局设定）
[root@web03 data]# vi /etc/pam.d/vsftpd
===========================================
# 将下面两行添加到最开头
auth sufficient /lib/security/pam_userdb.so db=/etc/vsftpd/vsftpd_login #64系统是lib64，下同
account sufficient /lib/security/pam_userdb.so db=/etc/vsftpd/vsftpd_login
......省略......
===========================================
[root@web03 data]# vi /etc/vsftpd/vsftpd.conf
===========================================
#修改原内容
anonymous_enable=NO
anon_upload_enable=NO
anon_mkdir_write_enable=NO
#增加新内容
chroot_local_user=YES
guest_enable=YES
guest_username=virftp
virtual_use_local_privs=YES
user_config_dir=/etc/vsftpd/vsftpd_user_conf
===========================================
 
5、建立虚拟账户目录及独立配置文件（独立设定）
[root@web03 data]# mkdir /etc/vsftpd/vsftpd_user_conf
[root@web03 data]# cd /etc/vsftpd/vsftpd_user_conf/
[root@web03 vsftpd_user_conf]# vim ftpa1
===========================================
local_root=/home/vsftpd-u/ftpa1    #目录写错了，各种错误折腾了好久
anonymous_enable=NO
write_enable=YES
local_umask=022
anon_upload_enable=NO
anon_mkdir_write_enable=NO
idle_session_timeout=600
data_connection_timeout=120
max_clients=10
max_per_ip=5
local_max_rate=50000
===========================================
[root@web03 vsftpd_user_conf]# chown -R vsftpd-u:vsftpd-u /home/vsftpd-u
 
6、启动vsftpd服务
[root@web03 ~]# service vsftpd start
Starting vsftpd for vsftpd:                                [  OK  ]
#启动失败的话，请注意端口是否被占用，若被占用，kill掉那个占用的进程即可 
curl -e参数 指定refer地址，可用来测试防盗链
1、nginx的www.301r.com虚拟域名的配置文件
========================================================location ~* ^.+\.(gif|jpe?g|png|bmp|swf|rar|zip|flv|xls|bz2|gz|doc)$
        {
                valid_referers none blocked server_names .*301r.com;
                if ($invalid_referer)
                {
                        return 403;
                }
        }
========================================================
2、错误排除及成功执行
上面的配置在官网对比过，语法没有错误，但是用curl -e指定一些乱七八糟的refer来访问论坛png图片时，居然全部可以正常"200 ok"，百思不得其解后，才发现我在防盗链的配置前面，配置过png图片的缓存和不记录log，当我尝试把防盗链的配置剪切到图片缓存和关闭log的前面时，成功出现以下结果：
[root@web03 ~]# curl -I -xlocalhost:80 -e "http://www.302r.com/fdsfds" "http://www.301r.com/static/image/common/logo.png"
HTTP/1.1 403 Forbidden
Server: nginx/1.6.2
Date: Sun, 25 Jan 2015 02:04:55 GMT
Content-Type: text/html
Content-Length: 168
Connection: keep-alive
这让我们思考，其实铭哥的授课上曾经就遇到过这个问题，当时也是在vhost的配置文件中先写了php解析，然后又对某个php文件进行auth认证，就是用调换顺序把auth认证写在了php解析的前面才成功了的，所以，nginx和apache配置文件的逻辑，应该与iptables类似，只要满足前面的规则就可以执行了。 

---
title: RHCSA考试答案
date: 2015年6月19日
categories: 19:50
---
 
第1题：破解root密码
==================================================
1、grub进入系统界面时按下"e"键编辑
2、在"linux16"行最后加入"rd.break console=tty0"
3、同时按下ctrl和x键启动
4、进入switch-root#界面，输入以下命令
#mount -o remount,rw /sysroot      #重新挂载系统，可读写模式
#chroot /sysroot                   #将根挂载到/sysroot，进入硬盘系统
#passwd                            #按考试要求修改密码
#touch /.autorelabel               #创建此文件来使selinux重新建立索引
#exit                              #退出硬盘系统
#exit                              #重启
5、重启后用root登录即可看到后续题目
 
设置主机名
====================================================
#hostnamectl set-hostname hostname
 
设置网络
====================================================
#nm-connection-editor
 
第2题SELINUX配置
=====================================================
1、##修改配置
#vi /etc/sysconfig/selinux
 
2、##修改目前状态
#setenforce 0
 
3、##查看状态
#getenforce
 
第3题配置YUM源
======================================================
1、##添加源链接
#yum-config-manager --add-repo=""
 
2、##查看源列表
#yum repolist
 
3、##修改配置关闭检查认证
#vim /etc/yum.repos.d/classroom.example.com_content_rhel7.0_x86_64_dvd.repo
**************************************
gpgcheck=0                              #关闭检查认证
**************************************
 
 
第4题：lvm卷管理
=======================================================
1、##查看lvm卷容量
# lvs
  LV   VG   Attr       LSize   Pool Origin Data%  Move Log Cpy%Sync Convert
  lvm1 vg1  -wi-ao---- 256.00m  
 
2、##扩展lvm卷容量
##lvextend -L 容量 设备路径
##"-L"参数指定容量
# lvextend -L 770M /dev/vg1/lvm1 
  Rounding size to boundary between physical extents: 772.00 MiB
  Extending logical volume lvm1 to 772.00 MiB
  Insufficient free space: 129 extents needed, but only 63 available    #提示卷组容量不足无法扩容
 
3、##查看卷组容量
# vgs
  VG   #PV #LV #SN Attr   VSize   VFree  
  vg1    1   1   0 wz--n- 508.00m 252.00m       #卷组容量只有508M，需要先对卷组扩容
 
##查看卷组对应的硬盘分区
# pvs
  PV         VG   Fmt  Attr PSize   PFree  
  /dev/sdb1  vg1  lvm2 a--  508.00m 252.00m
##对应此卷组的硬盘分区是sdb1
 
4、##在物理硬盘创建分区
# fdisk /dev/sdb
新建过程略过（n新建-p主分区-起始柱面-尾柱面）
......
Command (m for help): p
......
 
   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1            2048     1050623      524288   8e  Linux LVM
/dev/sdb2         1050624     2074623      512000   83  Linux
 
##注意要把分区类型更改一下
Command (m for help): t
Partition number (1,2, default 2): 
Hex code (type L to list all codes): 8e
Changed type of partition 'Linux' to 'Linux LVM'
 
##最后记得保存
Command (m for help): w
The partition table has been altered!
 
5、##按照提示同步硬盘信息，使新分区生效
# partx -a /dev/sdb
partx: /dev/sdb: error adding partition 1
# ll /dev/sdb2
brw-rw----. 1 root disk 8, 18 Jun 22 23:44 /dev/sdb2
 
6、##将新建分区加入到卷组
# pvcreate /dev/sdb2
  Physical volume "/dev/sdb2" successfully created
# pvs
  PV         VG   Fmt  Attr PSize   PFree  
  /dev/sdb1  vg1  lvm2 a--  508.00m 252.00m
  /dev/sdb2          lvm2 a--  500.00m 500.00m
# vgextend vg1 /dev/sdb2
  Volume group "vg1" successfully extended
# vgs
  VG   #PV #LV #SN Attr   VSize    VFree  
  vg1    2   1   0 wz--n- 1004.00m 748.00m
 
7、##重新扩展卷容量
# lvextend -L 770M /dev/vg1/lvm1 
  Rounding size to boundary between physical extents: 772.00 MiB
  Extending logical volume lvm1 to 772.00 MiB
  Logical volume lvm1 successfully resized
 
８、##更新逻辑卷
##查看卷组类型
# blkid
/dev/sdb1: UUID="cFC3s5-Pz40-oo1o-4URG-ljTe-f2ce-nwIJoW" TYPE="LVM2_member" 
/dev/sdb2: UUID="MqYVpJ-cq4R-9VUZ-D8pg-DQ7a-81sr-TY2mJU" TYPE="LVM2_member" 
/dev/sda1: UUID="9bf6b9f7-92ad-441b-848e-0257cbb883d1" TYPE="xfs" 
/dev/mapper/vg1-lvm1: UUID="33c82160-c610-47c9-b03c-7974438afd77" TYPE="xfs"         #xfs类型
 
##查看挂载目录
# df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1              10G  3.1G  7.0G  31% /
devtmpfs              475M     0  475M   0% /dev
tmpfs                 490M  140K  490M   1% /dev/shm
tmpfs                 490M   14M  477M   3% /run
tmpfs                 490M     0  490M   0% /sys/fs/cgroup
/dev/mapper/vg1-lvm1  253M   13M  240M   6% /vg1/lvm1             #此时容量还是253M
 
##更新卷组
# xfs_growfs /vg1/lvm1
meta-data=/dev/mapper/vg1-lvm1   isize=256    agcount=4, agsize=16384 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=0
data     =                       bsize=4096   blocks=65536, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=0
log      =internal               bsize=4096   blocks=853, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
data blocks changed from 65536 to 197632
*****************************************
##如果卷组类型是ext4的话，执行以下命令
#resize2fs 设备路径
*****************************************
 
 
##查新查看卷容量
# lvs
  LV   VG   Attr       LSize   Pool Origin Data%  Move Log Cpy%Sync Convert
  lvm1 vg1  -wi-ao---- 772.00m                                             
# df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1              10G  3.1G  7.0G  31% /
devtmpfs              475M     0  475M   0% /dev
tmpfs                 490M  140K  490M   1% /dev/shm
tmpfs                 490M   14M  477M   3% /run
tmpfs                 490M     0  490M   0% /sys/fs/cgroup
/dev/mapper/vg1-lvm1  769M   14M  756M   2% /vg1/lvm1
 
 
第5题：用户管理
======================================================
# groupadd -g 40000 adminuser
# useradd -G adminuser natasha
# useradd -G adminuser harry
# useradd -s /sbin/nologin sarah
# echo "glegunge" | passwd --stdin natasha
Changing password for user natasha.
passwd: all authentication tokens updated successfully.
# echo "glegunge" | passwd --stdin harry
Changing password for user harry.
passwd: all authentication tokens updated successfully.
# echo "glegunge" | passwd --stdin sarah
Changing password for user sarah.
passwd: all authentication tokens updated successfully.
 
第6题：权限管理
=======================================================
# cp /etc/fstab /var/tmp/
# chown root:root /var/tmp/fstab 
# chmod u-x,g-x,o-x /var/tmp/fstab
# setfacl -m user:natasha:rw-,harry:---,other::r-- /var/tmp/fstab
# getfacl /var/tmp/fstab 
getfacl: Removing leading '/' from absolute path names
# file: var/tmp/fstab
# owner: root
# group: root
user::rw-
user:natasha:rw-
user:harry:---
group::r--
mask::rw-
other::r--
 
第7题：CRONTAB命令创建计划
=======================================================
# systemctl enable crond                                  #开机启动crond服务
# systemctl is-enabled crond                            #检查
enabled
# crontab -u natasha -e                                      #对natasha用户创建计划
********************************
23 14 * * * /bin/echo "rhcsa"
********************************
no crontab for natasha - using an empty one
crontab: installing new crontab
# crontab -u natasha -l                                      #检查
23 14 * * * /bin/echo "rhcsa"
 
第8题：特殊权限管理
======================================================
# mkdir /home/admins
# chown :adminuser /home/admins
# chmod g=rwx,o=--- /home/admins/
# ll -d /home/admins
drwxrwx---. 2 root adminuser 6 Jun 23 20:42 /home/admins
# chmod g+s /home/admins/
# touch /home/admins/test.txt
# ll /home/admins/test.txt
-rw-r--r--. 1 root adminuser 0 Jun 23 20:46 /home/admins/test.txt
 
第9题：内核升级（RPM包安装）
=======================================================
##查看当前内核版本
#uname -r                                                  
 
##安装内核的rpm包
#rpm -ivh http://content.example.com/rhel7.0/x86_64/errata/Packages/kernel-3.10.0-123.1.2.el7.x86_64.rpm
 
第10题：配置LDAP客户端
========================================================
##安装客户端
#yum install sssd authconfig-gtk krb5-workstation -y
 
##配置客户端
#authconfig-gtk         #输入此命令后会启动GUI工具来按照题目要求录入信息
 
##验证结果（考试时会给验证帐号密码，这里是ldapuser0：kerberos）
#getent passwd ldapuser0
 
 
第11题：LDAP用户家目录自动挂载
=====================================================
##1、安装自动挂载服务并设置开机启动
#yum install autofs -y
#systemctl enable autofs
#systemctl start autofs
 
##2、编写配置文件
#vim /etc/auto.master
*********************************************************
#目标目录 配置文件
/home/guests /etc/auto.master.d/ldapusers.autofs          #文件随意命名
#意味当有用户访问此目录时，会按照配置文件里的内容进行挂载
*********************************************************
 
#vim /etc/auto.master.d/ldapusers.autofs         #文件名跟上面配置文件中一致
*********************************************************
 * -rw classroom.example.com:/home/guests/&
*********************************************************
 
##3、创建目标目录与重启autofs服务
#mkdir /home/guests/
#chmod o+w /home/guests
#systemclt restart autofs
 
##4、验证
#ssh ldapuser0@localhost
#mount
 
第12题：同步时间
===================================================
1、安装chrony服务并设置其开机启动
#yum install -y chrony
#systemctl enable chronyd
#systemctl start chronyd
 
2、设置ntp服务器
##设置ntp开启
#timedatectl set-ntp true
 
##修改配置文件里的ntp服务器地址，并重启chronyd服务
#vim /etc/chrony.conf
*******************************************************
 #
 #
 #
 server classroom.example.com iburst
*******************************************************
#systemctl restart chronyd
 
##使用chronyc工具来手动同步
#chronyc
>waitsync
 
##查看结果
#timedatectl
 
第13题：打包文件
===================================================
# tar jcvf /root/sysconfig.tar.bz2 /etc/sysconfig
 
第14题：创建用户
===================================================
# useradd -u 3456 alex
# echo 'glegunge'|passwd --stdin alex
Changing password for user alex.
passwd: all authentication tokens updated successfully.
 
第15题：创建swap分区
===================================================
1、创建新分区
# fdisk /dev/sdb
Command (m for help): n
Select (default p): p
Partition number (3,4, default 3): 
First sector (2074624-20971519, default 2074624): 
Last sector, +sectors or +size{K,M,G} (2074624-20971519, default 20971519): +512M
 
Command (m for help): t
Partition number (1-3, default 3): 3
Hex code (type L to list all codes): 82
Changed type of partition 'Linux' to 'Linux swap / Solaris'
 
Command (m for help): w
 
2、重新map硬盘分区表
# partx -a /dev/sdb
partx: /dev/sdb: error adding partitions 1-2
 
3、格式化为swap
# mkswap /dev/sdb3
Setting up swapspace version 1, size = 524284 KiB
no label, UUID=a7a5bf54-ad80-4152-bac5-2f230b75c557
 
4、设置自动挂载
# vi /etc/fstab 
*******************************************
#增加下面一行
UUID=a7a5bf54-ad80-4152-bac5-2f230b75c557 swap  swap defaults 0 0 
*******************************************
 
##刷新swap分区挂载
# swapon -a
 
第16题：查找文件
===================================================
1、创建文件夹
# mkdir findfiles
 
2、查找并复制文件
# find / -user ira -exec cp -a {} /root/findfiles/ \;
find: '/proc/4434/task/4434/fd/6': No such file or directory
find: '/proc/4434/task/4434/fdinfo/6': No such file or directory
find: '/proc/4434/fd/6': No such file or directory
find: '/proc/4434/fdinfo/6': No such file or directory
 
3、验证
# ll /root/findfiles/
total 12
-rw-r--r--. 1 ira root 46 Jul 26 11:56 abcfile
-rw-r--r--. 1 ira root 46 Jul 26 11:56 ifile
-rw-rw----. 1 ira mail  0 Jul 26 11:56 ira
-rw-r--r--. 1 ira root 46 Jul 26 11:56 tmpfile
 
第17题：查找文件
===================================================
# grep seismic /usr/share/dict/words > /root/wordlist
 
第18题：创建逻辑卷
===================================================
1、查看硬盘情况
# lsblk
NAME         MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
fd0            2:0    1    4K  0 disk 
sda            8:0    0   10G  0 disk 
└─sda1         8:1    0   10G  0 part /
sdb            8:16   0   10G  0 disk 
├─sdb1         8:17   0  512M  0 part 
│ └─vg1-lvm1 253:0    0  772M  0 lvm  /vg1/lvm1
├─sdb2         8:18   0  500M  0 part 
│ └─vg1-lvm1 253:0    0  772M  0 lvm  /vg1/lvm1
└─sdb3         8:19   0  512M  0 part [SWAP]
sr0           11:0    1 1024M  0 rom 
#发现sdb（考试环境为vdb）还有很大空间
 
2、创建新分区
# fdisk /dev/sdb
Command (m for help): n
Select (default e): p
Selected partition 4
First sector (3123200-20971519, default 3123200): 
Using default value 3123200
Last sector, +sectors or +size{K,M,G} (3123200-20971519, default 20971519): 
Using default value 20971519
Partition 4 of type Linux and of size 8.5 GiB is set
 
Command (m for help): t
Partition number (1-4, default 4): 4
Hex code (type L to list all codes): 8e
Changed type of partition 'Linux' to 'Linux LVM'
 
Command (m for help): w
 
##重新map分区表
# partx -a /dev/sdb
partx: /dev/sdb: error adding partitions 1-3
 
3、创建新pv
# pvcreate /dev/sdb4
  Physical volume "/dev/sdb4" successfully created
# pvs
  PV         VG   Fmt  Attr PSize   PFree  
  /dev/sdb1  vg1  lvm2 a--  508.00m      0 
  /dev/sdb2  vg1  lvm2 a--  496.00m 232.00m
  /dev/sdb4       lvm2 a--    8.51g   8.51g
 
4、创建新vg
# vgcreate -s 16M exam /dev/sdb4
  Volume group "exam" successfully created
# vgs
  VG   #PV #LV #SN Attr   VSize    VFree  
  exam   1   0   0 wz--n-    8.50g   8.50g
  vg1    2   1   0 wz--n- 1004.00m 232.00m
##检查创建结果
# vgdisplay exam
  --- Volume group ---
  VG Name               exam
  ......
  PE Size               16.00 MiB
    ......
 
5、创建新lvm
# lvcreate -l 8 -n lvm2 exam
  Logical volume "lvm2" created
# lvs
  LV   VG   Attr       LSize   Pool Origin Data%  Move Log Cpy%Sync Convert
  lvm2 exam -wi-a----- 128.00m                                             
  lvm1 vg1  -wi-ao---- 772.00m 
##检查创建结果
#
# lvdisplay /dev/exam/lvm2
  --- Logical volume ---
  LV Path                /dev/exam/lvm2
  LV Name                lvm2
  VG Name                exam
  LV UUID                SQXK4K-Qspm-AU9A-BfTt-cnyT-pvnt-iiK2Ye
  LV Write Access        read/write
  LV Creation host, time server0.example.com, 2015-07-26 15:52:47 +0800
  LV Status              available
  # open                 0
  LV Size                128.00 MiB
  Current LE             8
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:1
 
6、格式化lvm
# mkfs.xfs /dev/exam/lvm2
meta-data=/dev/exam/lvm2         isize=256    agcount=4, agsize=8192 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=0
data     =                       bsize=4096   blocks=32768, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=0
log      =internal log           bsize=4096   blocks=853, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
 
7、设置自动挂载
##创建目录
# mkdir -p /exam/lvm2
 
##通过blkid命令查看复制uuid把它设置到fstab里面实现开机自动挂载
# vi /etc/fstab
*************************************
#增加下面一行
UUID="19695ba0-a322-46b3-9d17-fd782b3295f5" /exam/lvm2 xfs defaults 0 0 
*************************************
 
 
 
 

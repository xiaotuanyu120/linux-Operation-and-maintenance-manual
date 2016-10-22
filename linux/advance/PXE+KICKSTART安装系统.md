---
title: PXE+KICKSTART安装系统
date: Wednesday, 15 April 2015
categories: 1:31 PM
---
 
1)PXE
 
PREPARE SYSTEM INSTALL FILE FROM CD TO APACHE
===============================================================
#安装web服务器，并把安装光盘内容复制到web服务器的网站目录
[root@filesbak ~]# yum install -y httpd
[root@filesbak ~]# mount /dev/cdrom /mnt
[root@filesbak ~]# cp -rf /mnt/* /var/www/html
 
INSTALL "TFTP" & START SERVICE "XINETD"
===============================================================
[root@filesbak ~]# yum -y install tftp tftp-server
[root@filesbak ~]# vi /etc/xinetd.d/tftp
*****************************************************************
# default: off
# description: The tftp server serves files using the trivial file transfer \
#       protocol.  The tftp protocol is often used to boot diskless \
#       workstations, download configuration files to network-aware printers, \
#       and to start the installation process for some operating systems.
service tftp
{
        socket_type             = dgram
        protocol                = udp
        wait                    = yes
        user                    = root
        server                  = /usr/sbin/in.tftpd
        server_args             = -s /tftpboot          #change directory to /tftpboot
        disable                 = no                              #change "yes" to "no"
        per_source              = 11
        cps                     = 100 2
        flags                   = IPv4
}
*****************************************************************
[root@filesbak ~]# service xinetd restart
Stopping xinetd:                                           [FAILED]
Starting xinetd:                                           [  OK  ]
 
PREPARE PXE BOOT DIRECTORY
=============================================================
#install syslinux first
[root@filesbak ~]# yum -y install syslinux
 
#copy file to tftpboot directory
[root@filesbak ~]# cp /usr/share/syslinux/pxelinux.0 /tftpboot/
#某些教程是/usr/lib/syslinux/pxelinux.0具体情况可以利用find来查询
[root@filesbak ~]# cp /data/www/images/pxeboot/{initrd.img,vmlinuz} /tftpboot/
#每个版本的pxeboot里的内容可能会有些微的不同，请根据自己实际情况复制
[root@filesbak ~]# cp /data/www/isolinux/boot.msg /tftpboot/
[root@filesbak ~]# mkdir /tftpboot/pxelinux.cfg
[root@filesbak ~]# cd /tftpboot/pxelinux.cfg/
[root@filesbak pxelinux.cfg]# cp /data/www/isolinux/isolinux.cfg /tftpboot/pxelinux.cfg/default
 
DHCP
=============================================================
[root@filesbak pxelinux.cfg]# yum -y install dhcp
[root@filesbak pxelinux.cfg]# cp /usr/share/doc/dhcp-4.1.1/dhcpd.conf.sample /etc/dhcpd.conf

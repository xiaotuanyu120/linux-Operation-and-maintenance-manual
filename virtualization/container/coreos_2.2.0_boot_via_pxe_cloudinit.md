---
title: coreos 2.2.0 pxe引导coreos启动
date: 2017-04-28 13:08:00
categories: virtualization/container
tags: [container,coreos,pxe]
---
### coreos 2.2.0 pxe引导coreos启动

---

### 1. 安装PXE
准备一台centos6的机器
#### 0) 安装nginx,DHCP,tftp-server和syslinux
``` bash
yum install epel-release -y
yum install tftp-server dhcp syslinux nginx -y
```

#### 1) 配置DHCP
``` bash
vim /etc/dhcp/dhcpd.conf
*************************************************
allow booting;
allow bootp;
ddns-update-style interim;
ignore client-updates;
subnet 192.168.33.0 netmask 255.255.255.0 {
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.33.255;
    range dynamic-bootp 192.168.33.200 192.168.33.240;
    next-server 192.168.33.50;
    filename "pxelinux.0";
}
*************************************************
```
> centos6本机ip为192.168.33.50  
dhcp ip范围为192.168.33.200-192.168.33.240

#### 2) tftp-server准备文件
``` bash
cd /var/lib/tftpboot
cp /usr/share/syslinux/pxelinux.0 .
wget https://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe.vmlinuz
wget https://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe_image.cpio.gz
```
> 采用的是stable分支，目前版本是1353.7.0  

#### 3) 配置pxe
``` bash
cd /var/lib/tftpboot
mkdir pxelinux.cfg
vim pxelinux.cfg/default
*************************************************
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
  menu default
  kernel coreos_production_pxe.vmlinuz
  initrd coreos_production_pxe_image.cpio.gz
  append cloud-config-url=http://192.168.33.50/cloud-configs/default.yml
*************************************************
```
> 使用nginx提供cloudinit的yaml文件，配置sshkey认证信息

#### 4) 准备nginx提供的文件
``` bash
mkdir /usr/share/nginx/html/cloud-configs
vim /usr/share/nginx/html/cloud-configs/default.yml
*************************************************
#cloud-config

# include one or more SSH public keys
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAv7OFDK4GK+3yNW ...
*************************************************
```
> 默认的yaml文件配置sshkey信息

#### 5) 启动dhcp、xinetd、tftp
``` bash
service dhcpd start
service xinetd start
chkconfig tftp on
service nginx start
```
> 接下来就可以从pxe启动机器了，启动完毕就会是coreos的登陆界面  
我们可以使用ssh core@ip连接coreos进行操作了

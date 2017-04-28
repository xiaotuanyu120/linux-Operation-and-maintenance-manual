---
title: coreos 2.2.0 ignition+pxe安装coreos集群
date: 2017-04-28 13:08:00
categories: virtualization/container
tags: [container,coreos,ignition，pxe]
---
### coreos 2.2.0 ignition+pxe安装coreos集群

---

### 1. 安装PXE
准备一台centos6的机器
#### 0) 安装DHCP,tftp-server,syslinux和nginx
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
subnet 172.17.8.0 netmask 255.255.255.0 {
    option subnet-mask 255.255.255.0;
    option broadcast-address 172.17.8.255;
    range dynamic-bootp 172.17.8.200 172.17.8.240;
    next-server 172.17.8.10;
    filename "pxelinux.0";
}
*************************************************
```
> centos6本机ip为172.17.8.10  
dhcp ip范围为172.17.8.200-172.17.8.240

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
  append coreos.first_boot=1 coreos.config.url=http://172.17.8.10/pxe-config.ign
*************************************************
```
> coreos.config.url配置项里的文件是ignition文件，后面会提到

#### 4) 配置ignition
``` bash
vim /usr/share/nginx/html/pxe-config.ign
*************************************************
{
  "ignition": {
    "version": "2.0.0",
    "config": {}
  },
  "storage": {},
  "systemd": {
    "units": [
      {
        "name": "etcd2.service",
        "enable": true
      }
    ]
  },
  "networkd": {},
  "passwd": {
    "users": [
      {
        "name": "core",
        "sshAuthorizedKeys": [
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDGdByTgSVHq..."
        ]
      }
    ]
  }
}
*************************************************
```
> 配置了etcd2服务和core用户的ssh认证，其中key信息请提供ssh公钥内容

#### 5) 启动nginx、dhcp、xinetd、tftp
``` bash
service dhcpd start
service xinetd start
chkconfig tftp on
service nginx start
```

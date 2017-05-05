---
title: coreos 2.2.2 pxe引导coreos启动并安装到硬盘
date: 2017-05-04 09:27:00
categories: virtualization/container
tags: [container,coreos,pxe]
---
### coreos 2.2.2 pxe引导coreos启动并安装到硬盘

---

### 0. 背景介绍
目的：通过[pxe引导](http://linux.xiao5tech.com/virtualization/container/coreos_2.2.1_boot_via_pxe_ignition.html)进入coreos，然后在coreos执行安装脚本将系统安装到硬盘

思路：
- pxe引导的coreos自带coreos-install脚本
- 在另外一台局域网内的机器上提供nginx服务提供系统镜像和yaml文件
- 执行coreos-install时，使用-b参数指定下载的url，-c参数指定提前下载好的yaml文件，-d参数指定系统安装的磁盘，-V指定需要安装的版本

参考资料
- https://github.com/k8sp/bootstrapper
- coreos-install脚本内容

---

### 1. nginx内容准备
#### 1) 文件类型
- yaml文件
- coreos-install脚本需要下载的版本文件

#### 2) nginx内容目录结构
``` bash
# nginx目录结构
.
├── 1353.7.0
│   ├── coreos_production_image.bin.bz2
│   └── coreos_production_image.bin.bz2.sig
└── cloud-configs
    ├── 08:00:27:56:a4:22.yml
    ├── default.yml
    └── install.sh
```
> 1353.7.0是coreos的系统版本号  
08:00:27:56:a4:22.yml是目标机器网卡mac地址增加上yml后缀名

#### 3) yaml文件内容示例
08:00:27:56:a4:22.yml文件内容
``` yaml
#cloud-config

# include one or more SSH public keys
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAv7O ...
```
> 公钥内容省略部分，实际情况应该很长

#### 4) 自动安装脚本内容
install.sh的内容
```
#!/bin/sh

image_url=http://192.168.33.50

mac_addr=`ifconfig | grep -A2 'broadcast' | grep -o '..:..:..:..:..:..'`
wget ${image_url}/cloud-configs/${mac_addr}.yml
sudo coreos-install -d /dev/sda -V 1353.7.0 -c ${mac_addr}.yml -b ${image_url}
sudo reboot
```

---

### 2. pxe文件配置
`/var/lib/tftpboot/pxelinux.cfg/default`内容
``` bash
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
  menu default
  kernel coreos_production_pxe.vmlinuz
  initrd coreos_production_pxe_image.cpio.gz
  append cloud-config-url=http://192.168.33.50/cloud-configs/install.sh
```

---

### 3. 开始安装
仅需要在配置好pxe和准备好nginx中的文件后，重启目标机器，机器会从pxe启动，然后执行安装脚本，安装完成后会自动重启(记得配置硬盘第一启动项，网络启动第二启动项)

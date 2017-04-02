---
title: network: vmware克隆Centos6后的网络设置
date: 2015-11-06 10:28:00
categories: linux/advance
tags: [vmware,network]
---
### network: vmware克隆Centos6后的网络设置

---

### 1. 修改网卡设备名称
``` bash
vi /etc/udev/rules.d/70-persistent-net.rules
*********************************
## 注释下面这一条
# SUBSYSTEM=="net", ACTION=="add", DRIVERS=="?*", ATTR{address}=="00:0c:29:a1:18:72", ATTR{type}=="1", KERNEL=="eth*", NAME="eth0"
## 修改下面这一条（eth1->eth0, 复制mac地址，粘贴到网卡配置文件中）
SUBSYSTEM=="net", ACTION=="add", DRIVERS=="?*", ATTR{address}=="00:0c:29:9e:d7:dc", ATTR{type}=="1", KERNEL=="eth*", NAME="eth0"
*********************************

## 修改网卡配置
vi /etc/sysconfig/network-scripts/ifcfg-eth0
*********************************
## 修改以下字段
HWADDR=00:0C:29:9e:d7:dc
IPADDR=172.16.2.51
*********************************

## 修改hostname
vi /etc/sysconfig/network
*********************************
## 修改以下字段
HOSTNAME=ftp-read-out.ig
*********************************

## 重启机器即可
init 6
```

---

### 问题
#### 1) 问题描述
发现70-persistent-net.rules文件不存在，自己创建也无法重命名网卡名称

#### 2) 解决办法
`ntsysv`打开`udev-post`服务，重启后该服务会自动创建此文件
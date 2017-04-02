---
title: network: Centos7 没有可用的网络设备
date: 2015-06-18 13:55:00
categories: linux/advance
tags: [linux,network,centos7]
---
### network: Centos7 没有可用的网络设备

---

### 1. 问题描述
一个朋友新安装了centos7，发现无网卡配置文件，另外network服务是failed状态。

---

### 2. 尝试解决方法
- 方案1、关闭NetworkManager，自己创建ifcfg-eth0配置文件，但错误依旧
- 方案2、去vmware里查找了网卡的mac地址，然后在配置文件中添加HWADDR字段，错误依旧

---

### 3. 排查过程
实在无法解决，于是推荐朋友重装，并在重装的时候记得看网络情况，果然朋友在安装界面上遇到了问题，提示没有可用的网络设备。

重新检查虚拟机硬件配置也没有问题。百思不得其解。

后来我决定自己尝试一下给朋友创建虚拟机，终于发现问题所在

---

### 4. 问题原因：
原来朋友下载的Centos7镜像是64位，但是在vmware创建虚拟机界面选择系统版本的时候错选成了centos 而不是centos 64位，导致了无法启动网卡设备。

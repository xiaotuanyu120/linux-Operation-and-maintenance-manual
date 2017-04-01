---
title: KVM 1.2.1 创建VM(vnc-windows)
date: 2016-03-30 17:04:00
categories: virtualization/kvm
tags: [kvm,vnc,windows]
---
### KVM 1.2.1 创建VM(vnc-windows)

---

### 1. 创建虚拟机磁盘镜像
``` bash
# 使用qemu-img工具创建虚拟磁盘镜像
# 语法：qemu-img create [-q] [-f fmt] [-o options] filename [size]
qemu-img create -f qcow2 /data/kvm/images/vm3-win.img 15G
Formatting '/data/kvm/images/vm3-win.img', fmt=qcow2 size=16106127360 encryption=off cluster_size=65536 lazy_refcounts=off

# 查看镜像信息
qemu-img info /data/kvm/images/vm3-win.img
image: /data/kvm/images/vm3-win.img
file format: qcow2
virtual size: 15G (16106127360 bytes)
disk size: 196K
cluster_size: 65536
Format specific information:
    compat: 1.1
    lazy refcounts: false
```

---

### 2. 创建windows虚拟机
``` bash
virt-install \
--name vm3-win \
--memory 2048 --vcpus=2 \
--disk path=/data/kvm/images/vm3-win.img,format=qcow2,bus=ide \
--network bridge=br0 \
--graphics vnc,port=5992,listen=0.0.0.0 \
--cdrom /data/iso/cn_windows_server_2008_r2_standard_enterprise_datacenter_and_web_with_sp1_x64_dvd_617598.iso \
--autostart
# 可以查看virt-install的man页面查看每个参数的含义
# 因为不需要--extra-args，所以这次采用的--cdrom指定iso文件的方式
```

---

### 3. vnc连接，并执行windows安装
自己下载vnc客户端连接配置的ip:port来连接虚拟机，并进行windows的安装  
> ...安装过程省略...

---

### 4. 连接虚拟机
- 虚拟机配置  
给虚拟机配上ip，做好远程连接设置
- 远程连接虚拟机
  - 在windows系统下使用windows的mstsc远程连接
  - 在linux系统下，请自行搜索rdesktop图形工具进行远程连接

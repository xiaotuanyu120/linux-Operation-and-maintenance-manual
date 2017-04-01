---
title: KVM 1.4.0 kvm错误汇总
date: 2016-04-05 14:54:00
categories: virtualization/kvm
tags: [kvm]
---
### KVM 1.4.0 kvm错误汇总

---

### 1. VM复制启动报错
#### 1) 错误信息：
```
error: unsupported configuration: Unable to find security driver for model selinux
```
#### 2) 解决办法：
``` bash
virsh edit domain
**************************
# 删掉selinux设定
<seclabel type='dynamic' model='selinux' relabel='yes'/>
**************************
```

---

### 2. VM启动报错
#### 1) 错误信息：
``` bash
virsh start compute-node01
error: Failed to start domain compute-node01
error: internal error: process exited \while connecting to monitor: 2016-04-07T09:06:59.054829Z qemu-kvm: -chardev socket,id=charchannel0,path=/var/lib/libvirt/qemu/channel/target/domain-controller/org.qemu.guest_agent.0,server,nowait: Failed to bind socket: Permission denied
2016-04-07T09:06:59.054904Z qemu-kvm: -chardev socket,id=charchannel0,path=/var/lib/libvirt/qemu/channel/target/domain-controller/org.qemu.guest_agent.0,server,nowait: chardev: opening backend "socket" failed
```

#### 2) 问题分析：
看报错信息，知道是权限错误，具体的权限是/var/lib/libvirt/qemu下的权限不对
网上查到信息，/etc/libvirt/qemu.conf中默认是qemu用户的权限，我的这个新虚机是拷贝原有的虚机而来，现在两台都无法启动
把配置文件中的用户修改成root，依然无法启动

#### 3) 解决办法：
后来发现原来虚机也有seclable配置，会使用selinux来防护权限  
关闭selinux，保证qemu.conf中配置的用户和/var/lib/libvirt/qemu目录权限一致即可启动虚机

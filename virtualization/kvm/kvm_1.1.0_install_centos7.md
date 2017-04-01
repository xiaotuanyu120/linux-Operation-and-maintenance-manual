---
tilte: KVM 1.1.0 安装(centos7)
date: 2015-03-22 23:25:00
categories: virtualization/kvm
tags: [kvm,centos]
---
### KVM 1.1.0 安装(centos7)

---

### 0. 理论知识
安装包|作用
---|---
qemu-kvm|模拟处理器的自由软件,和kvm搭配使用python-virtinst|创建虚拟机所需要的命令行工具和程序库virt-manager|GUI虚拟机管理工具virt-top|虚拟机统计命令virt-viewer|GUI连接程序，连接到已配置好的虚拟机libvirt|C语言工具包，提供libvirt服务libvirt-client|为虚拟客户机提供的C语言工具包virt-install|基于libvirt服务的虚拟机创建命令bridge-utils|创建和管理桥接设备的工具
扩展资料：
- [centos kvm wiki](http://wiki.centos.org/zh/HowTos/KVM)  
- [techlinux kvm centos7文档](http://techlinux.net/2014/09/kvm-centos-7/)  
- [server world centos7 kvm文档](http://www.server-world.info/en/note?os=CentOS_7&p=kvm&f=2)  

---

### 1. 安装kvm模块
``` bash
# 安装基础包
yum groupinstall base "Development tools"
yum install qemu-kvm libvirt virt-install bridge-utils
# 如果提示没有qemu-kvm，可能是因为并不是64位系统

# 安装acpid来支持virsh shutdown等操作命令，因为它们都是基于acpi信号
yum install acpid -y
systemctl start acpid
systemctl enable acpid


# 查看是否加载kvm模块
lsmod | grep kvm
kvm_intel             148081  3
kvm                   461126  1 kvm_intel
# 如果没有这两条，可以用"modprobe kvm"加载；
# 相关命令"insmod;rmmod;modinfo"

# 启动libvirtd
systemctl start libvirtd
systemctl enable libvirtd

# 检查服务开机启动配置
systemctl list-unit-files | grep libvirtd
libvirtd.service                            enabled
```

---

### 2. 网络配置
``` bash
# 关闭NetworkManager(简称NM)服务：
systemctl stop NetworkManager
systemctl mask NetworkManager
# 当你手动修改了网卡文件后，需要重启NM服务来重新接管网络配置
# 网卡配置文件和NM配置冲突时解决方案:｛1、重启NM;2、关闭NM｝
# 这里我们不适用NM服务，我们选择手动配置

# 修改原网卡文件
cd /etc/sysconfig/network-scripts/
vim ifcfg-enp2s0f0  
*************************************************
DEVICE=enp2s0f0
TYPE=Ethernet
BOOTPROTO=static
ONBOOT=yes
NM_CONTROLLED=no
BRIDGE=br0
*************************************************
# 这里不需要配ip


# 新建网桥文件ifcfg-br0(网桥名称）
vi ifcfg-br0
*************************************************
DEVICE=br0
TYPE=Bridge
ONBOOT=yes
BOOTPROTO=static
NM_CONTROLLED=no
DELAY=0
STP=yes
IPADDR=172.16.2.111
NETMASK=255.255.255.0
GATEWAY=172.16.2.1
# 大小写敏感，所以必须是Bridge
# STP是生成树协议
*************************************************

# 重启network服务：
systemctl restart network

# 查看桥接网络状态
ip addr show br0
3: br0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP
    link/ether c0:3f:d5:f3:f1:d9 brd ff:ff:ff:ff:ff:ff
    inet 172.16.2.111/24 brd 172.16.2.255 scope global br0
       valid_lft forever preferred_lft forever
    inet6 fe80::c23f:d5ff:fef3:f1d9/64 scope link
       valid_lft forever preferred_lft forever

# 查看网桥连接
brctl show
bridge name     bridge id               STP enabled     interfaces
br0             8000.c03fd5f3f1d9       yes             enp2s0f0
```

---

### 3. SELINUX & iptables 配置
``` bash
# 可以选择关闭selinux，也可以如下面一样配置selinux
setenforce 0
vi /etc/selinux/config
******************************************
SELINUX=disabled
******************************************

# 查看默认目录的上下文信息
ls -Zd /var/lib/libvirt/images/
drwx--x--x. root root system_u:object_r:virt_image_t:s0 /var/lib/libvirt/images/

# 拷贝默认目录的上下文信息到自定义的images目录
chcon --reference /var/lib/libvirt/images /data/kvm/images
ls -Zd /data/kvm/images/
drwxr-xr-x. root root system_u:object_r:virt_image_t:s0 /data/kvm/images/
```

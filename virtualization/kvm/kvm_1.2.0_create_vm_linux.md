---
title: KVM 1.2.0 创建VM(linux)
date: 2016-03-29 16:38:00
categories: virtualization/kvm
tags: [kvm,centos]
---
### KVM 1.2.0 创建VM(linux)

---
### 0. 扩展资料
[server-world kvm 虚拟机教程](http://www.server-world.info/en/note?os=CentOS_7&p=kvm&f=2)

---

### 1. 创建虚拟机磁盘镜像目录
``` bash
mkdir -p /data/kvm/images
```
> 每个虚拟机主要有两个文件，镜像文件和xml配置文件。  
镜像目录可手动管理，xml虚拟机配置文件默认是在/etc/libvirt/qemu下

---

### 2. 准备镜像文件
这里我使用的是挂载windows共享文件(cifs)，也可以用nfs，cdrom挂载等其他方式  
无论使用什么方式，只要能把镜像上传到kvm宿主机就好
``` bash
# 挂载windows共享文件夹
mount -t cifs -o iocharset=utf8,username=desktop-zack,password=password,uid=0,dir_mode=0777,file_mode=0777,rw //172.16.2.4/zack-imagefile /mnt/
cp /mnt/*.iso /data/iso/
```


---

### 3. 安装虚拟机
#### 1) 文本模式安装虚拟机(centos6以后，文本模式不可手动分区)
``` bash
virt-install \
--name vm1 \
--ram=1024 --vcpus=1 \
--network bridge:br0 \
--disk path=/data/kvm/images/vm1.img,size=10 \
--graphics none \
--location /data/iso/CentOS-6.5-x86_64-bin-DVD1.iso \
--extra-args="console=tty0 console=ttyS0,115200"
```
> 详细每个参数的意义可以查看扩展资料

>> 如果需要双网卡的话就增加一个--network,相应的你需要在创建一个桥接网络  

>> 除了--location=光盘挂载路径，还可以选择用--cdrom /path/to/centos**.iso  
但不用--location时不可使用--extra-args，所以还是推荐--localtion=光盘镜像或挂载路径的方式；--extra-args主要是传递给linux kernel一些参数

> 如果安装时卡在了escape(Escape character is '^]'.)符号处，可以检查kvm模块是否加载，或者是否增加了--extra-args参数

#### 2) 图形模式安装虚拟机
``` bash
virt-install \
--name web01-115 \
--ram=1024 --vcpus=1 \
--network bridge:br0 \
--disk path=/data/kvm/images/web01-115.img,size=10 \
--graphics vnc,port=5993,listen=0.0.0.0 \
--cdrom /data/iso/CentOS-6.5-x86_64-bin-DVD1.iso
```
> 注意vnc的port不要和其他的虚机重复

---

### 4. 连接虚拟机
``` bash
# 1. console连接
virsh console vm-name
# 在Escape character is '^]'.处按下enter键才会出现登陆界面

# 2. vnc
# 自行下载vnc客户端，按照宿主机ip+port的方式连接
```

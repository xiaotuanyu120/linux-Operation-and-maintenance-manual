KVM: 创建VM(vnc-windows)
2016年3月30日
17:04
 
## 创建虚拟机磁盘镜像
## 语法：qemu-img create [-q] [-f fmt] [-o options] filename [size]
# qemu-img create -f qcow2 /data/kvm/images/vm3-win.img 15G
Formatting '/data/kvm/images/vm3-win.img', fmt=qcow2 size=16106127360 encryption=off cluster_size=65536 lazy_refcounts=off
# qemu-img info /data/kvm/images/vm3-win.img
image: /data/kvm/images/vm3-win.img
file format: qcow2
virtual size: 15G (16106127360 bytes)
disk size: 196K
cluster_size: 65536
Format specific information:
    compat: 1.1
    lazy refcounts: false
 
## 创建虚拟机
# virt-install --name vm3-win --memory 2048 --vcpus=2 --cdrom /data/iso/cn_windows_server_2008_r2_standard_enterprise_datacenter_and_web_with_sp1_x64_dvd_617598.iso --disk path=/data/kvm/images/vm3-win.img,format=qcow2,bus=ide --network bridge=br0 --graphics vnc,port=5992,listen=0.0.0.0 --autostart 
## 可以查看virt-install的man页面查看每个参数的含义
## 这次采用的--cdrom的方式
 
## vnc连接

 
## 开始安装过程

 
。。。后续安装过程省略。。。
 
 
## 后续工作
1、给虚拟机配上ip，做好远程连接设置，mstsc远程连接吧

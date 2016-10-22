KVM: VM-克隆
2016年4月2日
10:12
 
## 关闭待克隆虚机
# virsh shutdown vm3-win
Domain vm3-win is being shutdown
# virsh list --all
 Id    Name                           State
----------------------------------------------------
 20    vm1-squid                      running
 23    web01-115                      running
 -     vm3-win                        shut off
 
## 默认连接下克隆虚机，指定虚机名称、磁盘文件和mac地址
# virt-clone --original vm3-win --name vm3-win-clone --file /data/kvm/images/vm3-win-clone.img --mac 52:54:00:34:11:57
WARNING  Setting the graphics device port to autoport, in order to avoid conflicting.
Allocating 'vm3-win-clone.img'                           |  15 GB     02:10
 
Clone 'vm3-win-clone' created successfully.
# ls /data/kvm/images/vm3-win-clone.img
/data/kvm/images/vm3-win-clone.img
# ls /etc/libvirt/qemu/vm3-win-clone.xml
/etc/libvirt/qemu/vm3-win-clone.xml
 
## 修改vnc port，避免冲突
# vim /etc/libvirt/qemu/vm3-win-clone.xml
**************************************************
    <graphics type='vnc' port='5900' autoport='yes' listen='0.0.0.0'>
**************************************************
## 也可以修改一下uuid，可以用"uuidgen"命令自动生成uuid值
 
## 使用virt-edit来修改img镜像内的文件
命令安装：yum install libguestfs-tools-c -y
若是linux系统，记得去修改ifcfg-eth0网卡文件：
o 修改HWADDR为和"--mac 52:54:00:34:11:57"一致
o 修改IPADDR避免ip冲突
 
## 因为这里是windows，启动vnc连接上去设置一下网络就好了

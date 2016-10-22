KVM: 创建VM(linux)
2016年3月29日
16:38
 
KVM 创建VM
## 创建虚拟机磁盘镜像目录
# mkdir -p /data/kvm/images
 
## 准备镜像文件（下面我使用的是挂载cifs，也可以用nfs，cdrom挂载等其他方式）
## 挂载windows共享文件夹
# mount -t cifs -o iocharset=utf8,username=desktop-zack,password=password,uid=0,dir_mode=0777,file_mode=0777,rw //172.16.2.4/zack-imagefile /mnt/
# cp /mnt/*.iso /data/iso/
 
## 文本模式安装虚拟机(centos6以后，文本模式不可手动分区)
# virt-install --name vm1 --ram=1024 --vcpus=1 --network bridge:br0 --disk path=/data/kvm/images/vm1.img,size=10 --graphics none --location /data/iso/CentOS-6.5-x86_64-bin-DVD1.iso --extra-args="console=tty0 console=ttyS0,115200"
## 详细每个参数的意义可以查看扩展资料
## 如果需要双网卡的话就增加一个--network
## 除了--location=光盘挂载路径，还可以选择用--cdrom /path/to/centos**.iso，但不用--location的话就不能使用--extra-args了，所以还是推荐--localtion=光盘挂载路径的方式
 
## 图形模式安装虚拟机
# virt-install --name web01-115 --ram=1024 --vcpus=1 --network bridge:br0 --disk path=/data/kvm/images/web01-115.img,size=10 --graphics vnc,port=5993,listen=0.0.0.0 --cdrom /data/iso/CentOS-6.5-x86_64-bin-DVD1.iso
## 注意vnc的port不要和其他的虚机重复
 
## 后续工作
1、给虚拟机配上ip，做好ssh key，远程连接吧
2、创建虚拟机完毕后，会自动生成host.xml文件(里面是虚拟机的网络、硬件等配置)
# ls /etc/libvirt/qemu/vm1.xml
/etc/libvirt/qemu/vm1.xml
 
## 扩展资料
http://www.server-world.info/en/note?os=CentOS_7&p=kvm&f=2

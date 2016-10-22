KVM: VM-快照
2016年3月30日
16:30
 
KVM VM 快照
## 创建快照
# virsh snapshot-create-as vm1 pure-installed
Domain snapshot pure-installed created
 
## 快照文件位置
# find / -name *pure-installed*
/var/lib/libvirt/qemu/snapshot/vm1/pure-installed.xml
 
## 查看虚机快照信息
# virsh snapshot-list vm1
 Name                 Creation Time             State
------------------------------------------------------------
 pure-installed       2016-03-30 16:33:35 +0800 running
 
## 连接到虚机上安装vim
~~~~~~~~~~~~~~~~~~~虚机环境vm1~~~~~~~~~~~~~~~~~~~
 
# vim
-bash: vim: command not found
# yum install -y vim
# which vim
/usr/bin/vim
 
~~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~~~~~
 
## 恢复虚机快照
# virsh snapshot-revert vm1 pure-installed
 
## 再次连接到虚机上执行vim
~~~~~~~~~~~~~~~~~~~虚机环境vm1~~~~~~~~~~~~~~~~~~~
 
# vim
-bash: vim: command not found
 
~~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~~~~~
 
## 删除虚机快照
# virsh snapshot-list vm1
 Name                 Creation Time             State
------------------------------------------------------------
 pure-installed       2016-03-30 16:33:35 +0800 running
 
# virsh snapshot-delete vm1 pure-installed
Domain snapshot pure-installed deleted
 
# virsh snapshot-list vm1
 Name                 Creation Time             State
------------------------------------------------------------
 

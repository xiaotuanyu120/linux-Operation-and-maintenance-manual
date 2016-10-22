KVM: 管理VM-基础
2016年3月29日
16:43
 
KVM 管理VM 基础
## 如何进入和退出虚拟机
## 退出当前虚拟机终端，回到宿主终端
push Ctrl + ]
 
## 在宿主终端连接虚拟机
# virsh console vm1
Connected to domain www
Escape character is ^]
## 不知道为何，每次到这里都需要按下Ctrl + c，才会到正常的虚拟机界面
 
## 当然，更方便的是配置vm的网络，然后ssh上去
 
## 查看目前虚拟机状态
# virsh -c qemu:///system list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running
## "-c" 代表connect，qemu:///system代表本机的qemu和kvm虚拟机，如果是连接本机，可以忽略此参数
 
## 简写（连接本机的虚拟机）
# virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running
 
## 列出所有主机（事先关闭了vm1）
# virsh list --all
 Id    Name                           State
----------------------------------------------------
 -     vm1                            shut off
 
## 列出vm的vnc端口
# virsh vncdisplay tomcat7
:103
 
 
## 控制虚拟机开关机和重启
## 虚拟机的基础操作需要acpid包的支持
# virsh shutdown vm1
Domain vm1 is being shutdown
## 用优雅的方式关机，需要等待一段时间，但并不确保能够关机成功
 
# virsh start vm1
 
## 强制关机，相当于拔电源
# virsh destroy vm1
 
# virsh reboot vm1
 
## 虚拟机挂起与恢复
## 虚拟机挂起
# virsh suspend vm1
Domain vm1 suspended
# virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            paused
 
## 虚拟机恢复
# virsh resume vm1
Domain vm1 resumed
# virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running
 
 
## 删除虚拟机（先强制关机，然后undefine）
# virsh destroy vm1
Domain vm1 destroyed
# virsh undefine vm1
Domain vm1 has been undefined
 
# virsh list
 Id    Name                           State
----------------------------------------------------
## 虚拟机img文件还在，但是虚拟机的xml文件会被删除
 
## 虚拟机改名
https://www.redhat.com/archives/libvirt-users/2010-October/msg00072.html
 
## 虚拟机开机启动
## 确保libvirtd服务是开启的
# systemctl enable libvirtd
 
## 配置虚机开机启动
# virsh autostart tomcat7
Domain tomcat7 marked as autostarted
 
# virsh autostart mysql-zhudan
Domain mysql-zhudan marked as autostarted
 
# virsh autostart mysql-main
Domain mysql-main marked as autostarted
 
## 查看autostart目录
# ll /etc/libvirt/qemu/autostart/
total 0
lrwxrwxrwx 1 root root 32 May  5 16:05 mysql-main.xml -> /etc/libvirt/qemu/mysql-main.xml
lrwxrwxrwx 1 root root 34 May  5 16:05 mysql-zhudan.xml -> /etc/libvirt/qemu/mysql-zhudan.xml
lrwxrwxrwx 1 root root 29 May  5 16:05 tomcat7.xml -> /etc/libvirt/qemu/tomcat7.xml
 

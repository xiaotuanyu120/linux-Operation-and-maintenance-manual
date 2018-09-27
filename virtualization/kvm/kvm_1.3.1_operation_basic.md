---
title: KVM 1.3.1 kvm管理-basic
date: 2016-03-29 16:43:00
categories: virtualization/kvm
tags: [kvm]
---
### KVM 1.3.1 kvm管理-basic

---

### 1. KVM 管理VM 基础
#### 1) 如何进入和退出虚拟机
``` bash
# 在宿主终端连接虚拟机
virsh console vm1
Connected to domain www
Escape character is ^]
# 在Escape character is '^]'.处按下enter键才会出现登陆界面

# 退出当前虚拟机终端，回到宿主终端
push Ctrl + ]
```
> 当然，更方便的是配置vm的网络，然后ssh上去

#### 2) 查看目前虚拟机状态
``` bash
# 1. 完整写法
virsh -c qemu:///system list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running
# "-c" 代表connect，qemu:///system代表本机的qemu和kvm虚拟机，如果是连接本机，可以忽略此参数

# 2. 简写（连接本机的虚拟机）
virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running

# 3. 列出所有主机（事先关闭了vm1）
virsh list --all
 Id    Name                           State
----------------------------------------------------
 -     vm1                            shut off
```

#### 3) 查看虚拟机vnc端口
``` bash
virsh vncdisplay tomcat7
:103
```

#### 4) 虚拟机开关机和重启
虚拟机的基础操作需要acpid包的支持
``` bash
# 1. 关机
# 用优雅的方式关机，需要等待一段时间，但并不确保能够关机成功
virsh shutdown vm1
Domain vm1 is being shutdown
# 强制关机，相当于拔电源
virsh destroy vm1

# 2. 开机
virsh start vm1

# 3. 重启
virsh reboot vm1

# 4. 虚拟机挂起与恢复
# 虚拟机挂起
virsh suspend vm1
Domain vm1 suspended

virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            paused

# 虚拟机恢复
virsh resume vm1
Domain vm1 resumed

virsh list
 Id    Name                           State
----------------------------------------------------
 3     vm1                            running

# 5. 连接虚拟机
virsh console vm1
# 如果连接时卡在了escape(Escape character is '^]'.)符号处，按下回车键即可进入登录界面

# 6. 退出虚拟机console
# 同时按下crtl+]
```

#### 5) 删除虚拟机（先强制关机，然后undefine）
``` bash
virsh destroy vm1
Domain vm1 destroyed

virsh undefine vm1
Domain vm1 has been undefined

virsh list
 Id    Name                           State
----------------------------------------------------
# 虚拟机img文件还在，但是虚拟机的xml文件会被删除
```

#### 6) 虚拟机改名
``` bash
# 1. dump配置文件
virsh dumpxml myvm > foo.xml
# 2. 修改虚拟机名称
<edit foo.xml, change the name>
# 3. 销毁原虚拟机配置文件
virsh undefine myvm
# 4. 加载新的配置文件
virsh define foo.xml
```
> 根据邮件列表中的讨论，目前还不支持虚拟机改名，但是我们可以通过dump配置文件，然后重新define这个配置文件的这种方式来改变虚拟机名称  
[kvm虚拟机改名参考文档](https://www.redhat.com/archives/libvirt-users/2010-October/msg00072.html)

#### 7) 虚拟机开机启动
``` bash
# 确保libvirtd服务是开启的
systemctl enable libvirtd

# 配置虚机开机启动
virsh autostart tomcat7
Domain tomcat7 marked as autostarted

virsh autostart mysql-zhudan
Domain mysql-zhudan marked as autostarted

virsh autostart mysql-main
Domain mysql-main marked as autostarted

# 查看autostart目录
ll /etc/libvirt/qemu/autostart/
total 0
lrwxrwxrwx 1 root root 32 May  5 16:05 mysql-main.xml -> /etc/libvirt/qemu/mysql-main.xml
lrwxrwxrwx 1 root root 34 May  5 16:05 mysql-zhudan.xml -> /etc/libvirt/qemu/mysql-zhudan.xml
lrwxrwxrwx 1 root root 29 May  5 16:05 tomcat7.xml -> /etc/libvirt/qemu/tomcat7.xml
```

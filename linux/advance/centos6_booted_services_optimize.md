---
title: centos6 开机服务优化
date: 2016-08-22 16:40:00
categories: linux/advance
tags: [linux,centos]
---
### centos6 开机服务优化

---

### 1. 优化服务
系统服务开启越少，越稳定，所以我们选择最小化安装系统之后，将非必要的开机服务取消
``` bash
# 最小化安装Centos6.5后，runlevel 3 默认开启如下服务
chkconfig --list|grep 3:on|awk '{print $1}'
abrt-ccpp
abrt-oops
abrtd
acpid
atd
auditd
blk-availability
cpuspeed
crond
haldaemon
ip6tables
irqbalance
lvm2-monitor
mdmonitor
messagebus
netfs
network
postfix
rsyslog
sshd
sysstat
udev-post
```

#### 1) 可关闭服务
- abrt，是Automatic Bug Reporting Tool的缩写，用户bug反馈。扩展见[fedora-abrt介绍](https://docs.fedoraproject.org/en-US/Fedora_Draft_Documentation/0.1/html/System_Administrators_Guide/ch-abrt.html)
- acpid，是Advanced Configuration and PowerInterface缩写，充当了内核与应用程序之间的接口，负责将内核的电源管理事件转发给应用程序。扩展见[fedora-acpi介绍](https://docs.fedoraproject.org/en-US/Fedora/18/html/Power_Management_Guide/acpid.html)
- atd，at命令的daemon，类似于crond。扩展见[鸟哥-atd](http://linux.vbird.org/linux_basic/0430cron.php#whatiscron_type)
- auditd，实现linux的审计功能的一个工具。
- blk-avalibility & lvm2-monitor，lvm2相关
- cpuspeed，笔记本专用，调节cpu速度
- haldaemon，桌面环境依赖，监控硬件改变。扩展见[haldaemon](https://www.hscripts.com/tutorials/linux-services/haldaemon.html)
- ip6tables，ipv6的iptables
- mdmonitor，软raid监控器
- netfs，系统启动时自动挂载网络中共享的nfs，samba等
- postfix，邮件服务

#### 2) 可开启也可关闭的服务
- irqbalance，用于均衡的分配cpu interupt到各cpu上，提升效能，减低能耗，有争议，单个人觉得服务器上关闭。扩展[irqbalance详测](http://blog.yufeng.info/archives/2422)
- sysstat，系统工具集sar,iostat,mpstat,sa1,sa2等

#### 3) 建议开启的服务
- crond，定时任务服务
- network，网络服务
- iptables，防火墙
- sshd，必开服务
- rsyslog，系统日志服务
- udev-post，设备即插即用

#### 4) ntsysv工具管理开机服务
ntsysv是一个字符图形化工具，可用来管理开机服务

---
title: rhel7查看硬盘设备详情
date: 2015年6月22日
categories: 23:52
---
 
##查看本机硬盘设备详情
==========================================================
# lsblk 
NAME         MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
fd0            2:0    1    4K  0 disk 
sda            8:0    0   10G  0 disk 
└─sda1         8:1    0   10G  0 part /
sdb            8:16   0   10G  0 disk 
├─sdb1         8:17   0  512M  0 part 
│ └─vg1-lvm1 253:0    0  256M  0 lvm  /vg1/lvm1
└─sdb2         8:18   0  500M  0 part 
sr0           11:0    1 1024M  0 rom 

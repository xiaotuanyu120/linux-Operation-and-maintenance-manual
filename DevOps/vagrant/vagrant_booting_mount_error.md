error: vagrant开机挂载错误
2016年10月3日
13:04
 
---
title: vagrant开机挂载错误
date: 2016-10-03 13:09:00
categories: devops
tags: [devops,vagrant]
---
### 错误提示
``` bash
# 开机时提示
/sbin/mount.vboxsf: mounting failed with the error: No such device
```
发现登录到虚机里面，/vagrant目录没有内容
 
<!--more-->
 
### 解决办法
``` bash
cd /opt/VBoxGuestAdditions-5.0.26/init
sudo ./vboxadd setup
```
然后在host中执行"vagrant reload"即可

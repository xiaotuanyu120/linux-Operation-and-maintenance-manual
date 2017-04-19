---
title: vagrant: 5.0.0 开机挂载错误
date: 2016-10-03 13:09:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 5.0.0 开机挂载错误

---

### 1. 错误提示
``` bash
# 开机时提示
/sbin/mount.vboxsf: mounting failed with the error: No such device
```
> 发现登录到虚机里面，/vagrant目录没有内容

---

### 2. 解决办法
``` bash
yum install gcc make kernel-devel kernel-headers
cd /opt/VBoxGuestAdditions-5.0.26/init
sudo ./vboxadd setup
```
> 然后在host中执行"vagrant reload"即可

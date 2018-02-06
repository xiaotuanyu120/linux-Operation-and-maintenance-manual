---
title: vagrant: 5.1.0 开机挂载错误
date: 2018-02-06 17:53:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 5.0.0 开机挂载错误

---

### 1. 错误提示
``` bash
# vagrant up 提示
default: No guest additions were detected on the base box for this VM! Guest
default: additions are required for forwarded ports, shared folders, host only
default: networking, and more. If SSH fails on this machine, please install
default: the guest additions and repackage the box to continue.
```

### 2. 解决办法-安装guest additions
``` bash
vagrant plugin install vagrant-vbguest
```

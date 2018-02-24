---
title: vagrant: 5.2.0 using rsync instead of mount
date: 2018-02-24 10:44:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 5.2.0 using rsync instead of mount

---

### 1. 错误信息
每次vagrant启动时，默认的挂载Vagrantfile目录到/vagrant的动作，被rsync替代

### 2. 解决办法
参考链接: [github issue](https://github.com/hashicorp/vagrant/issues/7157)
``` ruby
# 增加如下配置到Vagrantfile中
config.vm.synced_folder ".", "/vagrant", type: "virtualbox"
```

---
title: vagrant: 3.1.0 基础操作命令
date: 2016-09-30 15:40:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 3.1.0 基础操作命令

---

### 0. 参考资料
参考url  
- https://segmentfault.com/a/1190000000264347
- https://www.vultr.com/docs/how-to-install-vagrant-on-centos-6

---

### 1. 各发行版box文件下载
可以去各大发行版网站搜索vagrant的box镜像  
下载链接：
- https://github.com/chef/bento
- https://atlas.hashicorp.com/boxes/search?utm_source=vagrantcloud.com&vagrantcloud=1

---

### 2. 基本操作命令
#### 1) box命令
``` bash
# 查看box列表
vagrant box list

# 增加本地box
vagrant box add boxname /path/to/boxfile

# 移除本地box
vagrant box remove boxname
```

#### 2) 虚拟机管理命令
``` bash
# 初始化box
vagrant init bento/centos-6.7
# vagrant会在当前目录下生成一个Vagrantfile

# 启动
vagrant up --provider virtualbox
# 此时vagrant会自动去下载我们指定的centos-6.7的box

# 连接虚拟机
vagrant ssh
# 默认帐号密码是vagrant:vagrant

# 查看虚拟机ssh配置信息
vagrant ssh-config
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2201
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile D:/vmware-data/vagrant/centos02/.vagrant/machines/default/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL

# 虚拟机挂起和关机
vagrant suspend
vagrant halt

# 重启box
vagrant reload

# 打包正在运行的虚机为box
vagrant package --base virutalhostname --output boxfilename
# --base 指定虚拟机名称，不指定是默认打包当前目录的虚机
# --output 指定输出box文件的名称

# 摧毁虚拟机
vagrant destroy
```

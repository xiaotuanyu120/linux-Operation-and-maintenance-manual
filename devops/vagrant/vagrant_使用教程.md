vagrant: 使用教程
Saturday, 27 August 2016
3:39 PM
 
---
title: vagrant使用教程
date: 2016-09-30 15:40:00
categories: devops
tags: [devops,vagrant]
---
 
参考url  
https://segmentfault.com/a/1190000000264347
https://www.vultr.com/docs/how-to-install-vagrant-on-centos-6
 
## 添加vagrant box
可以去各大发行版网站搜索vagrant的box镜像
下载链接：
https://github.com/chef/bento
https://atlas.hashicorp.com/boxes/search?utm_source=vagrantcloud.com&vagrantcloud=1
 
<!--more-->
 
**基本操作**
``` bash
# 初始化box
vagrant init bento/centos-6.7
# vagrant会在当前目录下生成一个Vagrantfile
 
# 启动
vagrant up --provider virtualbox
# 此时vagrant会自动去下载我们指定的centos-6.7的box
# 若不想在线下载，可以提前下载好，并使用以下命令来添加
vagrant box add anyname /path/to/yourbox
 
# 连接box
vagrant ssh
# 默认帐号密码是vagrant:vagrant
 
# box挂起和关机
vagrant suspend
vagrant halt
 
# 重启box
vagrant reload
 
# 打包正在运行的虚机为box
vagrant package --base virutalhostname --output boxfilename
# --base 指定虚拟机名称，不指定是默认打包当前目录的虚机
# --output 指定输出box文件的名称
 
# 摧毁box
vagrant destroy
```
 
**基本配置**
``` bash
# hostname配置
config.vm.hostname = "hostname"
 
# 网络配置
config.vm.network: private_network, ip: "11.11.11.11"
 
# 同步目录
# 默认把host机器的Vagrantfile所在目录和虚机的/vagrant自动同步
config.vm.synced_folder "d:/local/dir", "/vm/dir/"
```

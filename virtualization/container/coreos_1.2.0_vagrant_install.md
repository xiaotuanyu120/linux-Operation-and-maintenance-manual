---
title: coreos 1.2.0 系统安装-vagrant
date: 2017-03-29 13:38:00
categories: virtualization/container
tags: [container,coreos,vagrant]
---
### coreos 1.2.0 系统安装-vagrant

---

### 0. 环境
[coreos vagrant平台官方文档](https://coreos.com/os/docs/latest/booting-on-vagrant.html)

---

### 1. 安装过程
``` bash
# 1. clone vagrant的repo
git clone https://github.com/coreos/coreos-vagrant.git
cd coreos-vagrant

# 2. 修改vagrant的coreos配置
cp config.rb.sample config.rb
cp user-data.sample user-data
# 因为我是windows，使用记事本打开config.rb
******************************************
# 指定需要开几个coreos系统
$num_instances=1
# 使用alpha版本，还是stable版本
$update_channel='alpha'
******************************************
# user-data中其实就是coreos安装时候的cloud-config.yaml文件的内容，不过当执行
# vagrant up操作的时候，vagrant会自动更新此文件的内容

# 3. 启动coreos
vagrant up
```

### 2. windows下如何ssh到vagrant coreos中
``` bash
# 在windows的cmd中执行(在coreos-vagrant目录下)
vagrant ssh-config
Host core-01
  HostName 127.0.0.1
  User core
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile C:/Users/zackzhao/.vagrant.d/insecure_private_key
  IdentitiesOnly yes
  LogLevel FATAL
  ForwardAgent yes
```
我们可以看到key和port的信息，然后可以使用putty或者xshell导入对应的key来连接  
其中putty需要使用puttygen工具将key转换成自己独有的key方式  
而xshell可以直接使用该key

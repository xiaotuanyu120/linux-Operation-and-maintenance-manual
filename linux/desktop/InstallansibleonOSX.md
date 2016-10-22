Install ansible on OS X
Wednesday, 17 August 2016
9:10 PM
 
---
title: Install Ansible on OS X
date: 2016-08-17 21:30:00
categories: ansible
tags: [mac,ansible]
---
**Install ansible on OS X**
``` bash
# 切换到root用户
sudo su -
 
# 安装pip
easy_install pip
 
# 安装virtualenv
pip install virtualenv
virtualenv venv
source ./venv/bin/activate
 
# 安装ansible
pip install ansible
# 如果不是在virtualenv环境中安装ansible，在OS X系统中，会出现以下报错，网查是因为环境包版本问题，所以推荐尽量使用virtualenv环境
ansible --version
[WARNING]: Optional dependency 'cryptography' raised an exception, falling back to 'Crypto'
 
ansible 2.1.1.0
  config file = 
  configured module search path = Default w/o overrides
```

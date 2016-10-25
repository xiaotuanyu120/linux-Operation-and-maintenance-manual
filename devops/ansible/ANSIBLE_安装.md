ANSIBLE: 安装
2016年3月25日
15:32
 
---
title: how to install ansible
date: 2016-10-19 22:42:00
categories: devops/ansible
---
### yum 安装
``` bash
yum install -y epel-release
yum install -y ansible
yum install gcc libffi-devel python-devel openssl-devel
```
 
### 源码安装
``` bash
git clone git://github.com/ansible/ansible.git --recursive
cd ansible/
source hacking/env-setup
```
 
### py环境
``` bash
pip install paramiko PyYAML Jinja2 httplib2 six
```

vagrant: 安装
Saturday, 27 August 2016
2:04 PM
 
---
title: vagrant多平台安装
date: 2016-09-30 14:05:00
categories: devops
tags: [devops,vagrant]
---
## mac上安装vagrant
``` bash
# 安装wget
sudo brew install wget
 
# 下载vagrant
wget https://releases.hashicorp.com/vagrant/1.8.5/vagrant_1.8.5.dmg
 
# 挂载dmg镜像
hdiutil attach vagrant_1.8.5.dmg
 
# 安装vagrant
cd /Volumes/Vagrant/
sudo installer -package ./Vagrant.pkg -target /
installer: Package name is Vagrant
installer: Installing at base path /
installer: The install was successful.
 
# 检查安装结果
vagrant -v
Vagrant 1.8.5
which vagrant
/usr/local/bin/vagrant
 
# 卸载dmg镜像
hdiutil detach /Volumes/Vagrant/
```
 
<!--more-->
 
 
## 在centos上安装vagrant
``` bash
# 安装环境包
yum upgrade
yum install wget epel-release
yum install kernel-devel-`uname -r`
 
# 安装virtualbox
cd /etc/yum.repos.d
wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo
# 安装DKMS（Dynamic Kernel Module Support）
yum --enablerepo=epel install dkms -y
yum install VirtualBox-5.1 -y
 
# 下载vagrant
wget https://releases.hashicorp.com/vagrant/1.8.5/vagrant_1.8.5_x86_64.rpm
 
# 安装vagrant
rpm -ivh vagrant_1.8.5_x86_64.rpm
 
# 查看vagrant状态
vagrant -v
Vagrant 1.8.5
which vagrant
/usr/bin/vagrant
```
 
## windows上安装
直接去官网下载exe文件安装，此处不赘述

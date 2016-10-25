ANSIBLE: 简介
2016年3月25日
15:10
 
---
title: ansible brief introduction
date: 2016-10-19 22:38:00
categories: devops/ansible
---
### 会安装些什么?
它不依赖数据库
它不会运行一个daemon
它不会在客户端服务器上运行程序或者安装程序
它只通过SSH来管理客户端服务器
 
### 控制端依赖什么?
依赖安装了python2.6或python2.7的系统（不包括windows）
包括redhat、debian、centos、os X、BSDs等
 
### 被控制节点依赖什么?
首先，一个正常的ssh(默认使用sftp传输模块，可以在主配"ansible.cfg"中改为scp)
其次，python2.4及其以上版本
若运行python2.5以下版本，你还需要python-simplejson
若启用了selinux，还需要libselinux-python，否则copy/file/template会受到影响

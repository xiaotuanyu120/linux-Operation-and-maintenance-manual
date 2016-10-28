---
title: ansible: host&group vars
date: 2016-10-14 13:32:00
categories: devops/ansible
tags:
---

### ansible-playbook中的group和host变量
**概要**
若需要使用ansible-playbook，变量需要创建两个目录，分别为host_vars和group_vars
变量储存文件与host及group同名

**组织形式**
例如：在hosts文件中，有一个主机名为fileserver01，两个组分别为web和database
则可以用以下形式来组织变量文件
```
tree .
.
├── group_vars
│   └── web
│   └── database
├── host_vars
│   └── fileserver01
├── hosts
├── main.yml
└── roles
......
```
另外，若某一组的变量，用一个文件储存太过巨大，我们可以在group_vars下面创建与组同名的目录，在该目录下的所有文件都会被ansible读取变量内容
例如：
```
group_vars/web/hk_server_setting
group_vars/web/mainland_server_setting
```

**变量文件内容格式**
指定ssh port
```
---
ansible_port: 222
```

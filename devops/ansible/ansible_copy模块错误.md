---
title: ansible copy模块错误
date: 2016-09-23 17:01:00
categories: devops/ansible
tags: [ansible,copy,libselinux-python]
---
### 错误信息：
Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!" ansible

### 手动操作：在对方节点上安装libselinux-python
``` bash
yum install epel-release
yum install libselinux-python
```

### ansible任务：在执行copy之前添加下面的task
```
- name: env prepare
  yum: name={{ item }} state=latest
  with_items:
    - epel-release
    - libselinux-python
```

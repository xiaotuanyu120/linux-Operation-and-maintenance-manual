---
title: rsync 1.2.0 chown chmod
date: 2017-06-28 11:26:00
categories: linux/advance
tags: [rsync,chown,chmod]
---
### rsync 1.2.0 chown chmod

---

### 1. 属主和权限问题
我们常用-a参数的archive模式来使用rsync命令，但是-a参数中的-o,-p,-g这三个保持属主属组和权限的参数有时候会造成属主属组和权限混乱的结果，为了明确目标文件的属主属组和权限，我们就需要这两个好用的参数--chmod和--chown了，使用这两个参数可以手动指定目标文件的属主属组和权限。
> --chown只在rsync3.1及之后的版本中有，目前centos和rhel中都没有达到3.1这个版本。

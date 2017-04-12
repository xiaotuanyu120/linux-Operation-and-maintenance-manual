---
title: git: 1.4.0 删除文件
date: 2016-03-24 15:58:00
categories: devops/git
tags: [git]
---
### git: 1.4.0 删除文件

---

### 1. 删除仓库中不需要的文件
若不小心暂存了不想添加的文件，或者希望删除无用的文件，可以做以下操作
``` bash
git rm *.pyc
rm 'ssh_key_dispense/keygen_ssh.pyc'
rm 'ssh_key_dispense/main.pyc'
```
> 删除之后记得重新commit和push，值得注意的是，这样操作这个文件在磁盘上也会被删除

---

### 2. 若希望取消暂存，但是不想在硬盘上删除它
``` bash
git rm -r --cached src/db.sqlite3
```

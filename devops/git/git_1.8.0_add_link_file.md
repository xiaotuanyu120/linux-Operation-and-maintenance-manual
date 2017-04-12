---
title: git: 1.8.0 添加链接文件
date: 2016-10-06 09:37:00
categories: devops/git
tags: [devops,git]
---
### git: 1.8.0 添加链接文件

---

### 1. 使用git track链接文件
#### 1) 默认情况下会报错
``` bash
git add bin/python
error: readlink("bin/python"): Function not implemented
error: unable to index file bin/python
fatal: updating files failed

# 发现原来出错的文件都是软连接
ls -l bin/python
lrwxrwxrwx 1 zackzhao 1049089 9 十月  5 17:48 bin/python -> python2.7
```

#### 2) 打开git的软连接配置
``` bash
git config core.symlinks true
```
> 打开此配置之后，再去添加链接文件就ok了

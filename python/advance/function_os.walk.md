---
title: 函数: 使用os的walk方法遍历目录下的文件
date: 2016-12-09 20:17:00
categories: python/advance
tags: [python,os,walk]
---
### 函数: 使用os的walk方法遍历目录下的文件

---

### 1. docstring of os.walk
``` python
>>> import os
>>> help(os.walk)

Help on function walk in module os:

walk(top, topdown=True, onerror=None, followlinks=False)
    Directory tree generator.

    For each directory in the directory tree rooted at top (including top
    itself, but excluding '.' and '..'), yields a 3-tuple

        dirpath, dirnames, filenames

    dirpath is a string, the path to the directory.  dirnames is a list of
    the names of the subdirectories in dirpath (excluding '.' and '..').
    filenames is a list of the names of the non-directory files in dirpath.
    Note that the names in the lists are just names, with no path components.
    To get a full path (which begins with top) to a file or directory in
    dirpath, do os.path.join(dirpath, name).
...
```
> 迭代返回包含3个元素的tuple，(dirpath, dirnames, filenames)，其中dirpath是str类型，后两个是list类型

---

### 2. os.walk示例
``` python
# 遍历目录中的所有文件（非目录）
>>> import os
>>> for root,sub_dirs,files in os.walk("/vagrant/mk2html/test"):
...     for file in files:
...         print "%s/%s" % (root, file)
...
/vagrant/mk2html/test/file1
/vagrant/mk2html/test/file2
/vagrant/mk2html/test/dir1/dir1_f1
/vagrant/mk2html/test/dir2/dir2_1/dir2_1_f1
```

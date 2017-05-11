---
title: django error: 1.1.0 "No module named _sqlite3"
date: 2016-09-30 18:08:00
categories: python/django
tags: [python,django]
---
### django error: 1.1.0 "No module named \_sqlite3"

---

### 1. 无法导入sqlite3情况1
#### 1) 问题描述
centos6.5自带python2.6.6，安装py2.7，然后用virtualenv创建虚拟环境，使用虚拟环境安装django后发现报错"No module named \_sqlite3"

#### 2) 尝试方法
``` bash
yum install python-sqlite
yum install sqlite-devel
pip install pysqlite
```

#### 3) 解决办法
```
find / -name _sqlite3.so
/usr/lib64/python2.6/lib-dynload/_sqlite3.so
cp /usr/lib64/python2.6/lib-dynload/_sqlite3.so /root/venv27/lib/python2.7/lib-dynload/
```
> 原因是因为目前的虚拟python环境缺少了_ssqlite3.so这个文件

---

### 2. 无法导入sqlite3情况2
#### 1) 报错信息
``` bash
python manage.py migrate
...
ImportError: No module named _sqlite3
...
```

#### 2) 解决方案
``` bash
yum install sqlite-devel
# 然后重新编译 Python.
```

error: _sqlite3导入错误
2016年9月30日
17:58
 
---
title: Django错误"No module named _sqlite3"
date: 2016-09-30 18:08:00
categories: python
tags: [python,django]
---
### 问题描述
centos6.5自带python2.6.6，安装py2.7，然后用virtualenv创建虚拟环境，使用虚拟环境安装django后发现报错"No module named _sqlite3"
 
### 解决过程
**尝试方法**
``` bash
yum install python-sqlite
yum install sqlite-devel
pip install pysqlite
```
 
**解决办法**
```
find / -name _sqlite3.so
/usr/lib64/python2.6/lib-dynload/_sqlite3.so
cp /usr/lib64/python2.6/lib-dynload/_sqlite3.so /root/venv27/lib/python2.7/lib-dynload/
```
原因是因为目前的虚拟python环境缺少了_ssqlite3.so这个文件

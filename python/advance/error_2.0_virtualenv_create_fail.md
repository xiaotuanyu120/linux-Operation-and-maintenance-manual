---
title: 错误: 2.0 virtualenv在多py版本环境下报错
date: 2016-02-11 17:36:00
categories: python/advance
tags: [python,virtualenv,error]
---
### 错误: 2.0 virtualenv在多py版本环境下报错

---

### 1. 安装多版本python遇到的问题
#### 1) 安装环境
centos6.5默认自带 python2.6.6  
pip  
virtualenv  
#### 2) 编译安装python2.7.10
``` bash
# 提前下载解压python2.7.10
./configure
make
make install
```

---

### 2. virtualenv 报错zlib
#### 1) 错误信息
``` bash
virtualenv --python=python2.7 mypy2.7
ImportError: no module named zlib
```
#### 2) 解决方案：
``` bash
yum install zlib-devel -y
# 重新编译安装python
./configure
make clean
make
make install
```

---

### 3. virtualenv 报错HTTPSHandler
#### 1) 错误信息
``` bash
virtualenv --python=python2.7 mypy2.7
Running virtualenv with interpreter /usr/local/bin/python2.7
New python executable in mypy2.7/bin/python2.7
Also creating executable in mypy2.7/bin/python
Installing setuptools, pip, wheel...
  。。。。。。
ImportError: cannot import name HTTPSHandler
----------------------------------------
...Installing setuptools, pip, wheel...done.
Traceback (most recent call last):
 。。。。。
OSError: Command /root/mypy2.7/bin/python2.7 -c "import sys, pip; sys...d\"] + sys.argv[1:]))" setuptools pip wheel failed with error code 1
```
#### 2) 分析过程
``` bash
pip -V
pip 7.1.2 from /usr/lib/python2.6/site-packages (python 2.6)
# 推测是因为pip是2.6版本，用来制定virtualenv的时候用了2.7，所以报错
```
#### 3) 解决方案
``` bash
用python2.7来重装pip
# 错误2.1
# python2.7 get-pip.py
ImportError: cannot import name HTTPSHandler

# 错误2.1解决方案：
yum install openssl openssl-devel -y
# 重新编译python2.7      
make clean
make
make install

# 再次尝试重装pip
python2.7 get-pip.py
pip -V
pip 7.1.2 from /usr/local/lib/python2.7/site-packages (python 2.7)
pip install virtualenv
```

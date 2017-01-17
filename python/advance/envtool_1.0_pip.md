---
title: 工具: 1.0 pip-包管理工具
date: 2016-09-23 16:12:00
categories: python/advance
tags: [python,python2.7]
---
### 工具：1.0 pip-包管理工具

---

### 1. 安装PIP
``` bash
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
```
若此处报错,请参照PY2.7安装，重新编译安装python（主要是zlib和openssl）

---

### 2. pip使用方法
``` bash
# 示例安装ipython
pip install ipython
```

---

### 3. 查看已安装的包
``` bash
pip freeze
Django==1.9.2
wheel==0.29.0
```

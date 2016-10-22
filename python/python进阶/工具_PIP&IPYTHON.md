工具: PIP&IPYTHON
2016年1月18日
16:49
 
---
title: python初始化之安装pip
date: 2016-09-23 16:12:00
categories: python
tags: [python,python2.7]
---
### 安装PIP
``` bash
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
```
若此处报错,请参照PY2.7安装，重新编译安装python（主要是zlib和openssl）
 
<!--more-->
 
### pip使用方法
``` bash
# 示例安装ipython
pip install ipython
```
 
### 查看已安装的包
pip freeze
Django==1.9.2
wheel==0.29.0

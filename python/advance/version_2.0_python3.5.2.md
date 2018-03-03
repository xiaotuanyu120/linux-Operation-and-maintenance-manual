---
title: 版本: 2.0 python3.5.2:安装
date: 2016-08-11 21:11:00
categories: python/advance
tags: [python]
---
### 版本: 2.0 python3.5.2:安装

---

### 1. 安装python3
``` bash
yum install epel-release -y
yum install gcc gcc-c++ python-devel openssl-devel -y

PY_VER=3.5.2
wget https://www.python.org/ftp/python/${PY_VER}/Python-${PY_VER}.tar.xz
tar -Jxf Python-${PY_VER}.tar.xz
cd Python-${PY_VER}
./configure --prefix=/usr/local/python3
make && make install
```
> 会自动安装pip和setuptools等包

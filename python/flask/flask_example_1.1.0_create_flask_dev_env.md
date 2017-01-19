---
title: flask实战: 1.1.0 如何创建一个flask开发环境
date: 2017-01-19 13:09:00
categories: python/flask
tags: [python,flask]
---
### flask_env: 1.1.0 如何创建一个flask环境

---

### 0. 背景介绍
这个文档是记录创建本站时，搭建flask开发环境的过程。

---

### 1. 开发环境
#### 1) system info
I use <code>Centos 6.8 x86_64</code>, if you have some familiar distribution, you can replace centos to it, if not, follow this.

#### 2) virtual tools
virtual host: vagrant + virtualbox, also you can use vmware-workstation.

---

### 2. System Preparation
#### 1) upgrade System
``` bash
yum install epel-release -y
yum upgrade -y
yum groupinstall base "Development tools" -y
```

#### 2) Install Python2.7 Virtual Environment
``` bash
yum install gcc gcc-c++ zip zip-devel openssl openssl-devel sqlite-devel -y

# download python2.7
wget https://www.python.org/ftp/python/2.7.11/Python-2.7.11.tgz
tar zxf Python-2.7.11.tgz
cd Python-2.7.11

# compile python2.7
./configure --prefix=/usr/local/py27/
sed -i 's/#.*zlib zlibmodule.c/zlib zlibmodule.c/g' Modules/Setup
make
make install

# install pip
wget https://bootstrap.pypa.io/get-pip.py
/usr/local/py27/bin/python2.7 get-pip.py

# install virtualenv
pip install virtualenv
mkdir /vagrant/flask_blog
cd /vagrant/flask_blog
virtualenv . -p /usr/local/py2.7/bin/python2.7

# activate virtualenv
source /vagrant/flask_blog/bin/activate

# install flask
pip install Flask
```
now we have a virtual python2.7 environment and flask installed

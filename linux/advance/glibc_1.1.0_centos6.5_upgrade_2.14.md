---
title: glibc 1.1.0 centos6升级到2.14
date: 2017-08-08 10:21:00
categories: linux/advance
tags: [glibc]
---
### glibc 1.1.0 centos6升级到2.14

---

### 1. 什么是glibc？
glibc是GNU/linux核心的c语言库，是系统环境很重要的一个库。centos6默认使用的是2.12，而很多软件编译时需要2.14。
``` bash
strings /lib64/libc.so.6 |grep GLIBC
GLIBC_2.2.5
GLIBC_2.2.6
GLIBC_2.3
GLIBC_2.3.2
GLIBC_2.3.3
GLIBC_2.3.4
GLIBC_2.4
GLIBC_2.5
GLIBC_2.6
GLIBC_2.7
GLIBC_2.8
GLIBC_2.9
GLIBC_2.10
GLIBC_2.11
GLIBC_2.12
GLIBC_PRIVATE
```

---

### 2. 编译安装glibc2.14
``` bash
# 下载glibc2.14
wget http://ftp.gnu.org/gnu/glibc/glibc-2.14.tar.gz
tar zxvf glibc-2.14.tar.gz

# 编译安装
cd glibc-2.14
mkdir build
cd build
../configure --prefix=/usr/local/glibc-2.14
make -j4
make install
```
> 我们不可以直接使用rpm包去安装glibc，那样很危险，这样把glibc编译到一个独立目录是个妥当的办法。

---

### 3. 关于如何使用新版本的glibc
一般使用有两种办法，一种是更新`/lib64/libc.so.6`这个软连接到新的glibc文件，但是强烈不推荐这样做，因为很多系统组件会依赖旧的glibc版本。推荐使用下面的方法，如果你编译其他软件有依赖高版本的glibc，只需要在编译前修改环境变量指向新的glibc就好，这样影响的就只是我们此时登录的session，而不是整个系统。
``` bash
export LD_LIBRARY_PATH=/usr/local/glibc-2.14/lib
# 然后执行你的编译命令
```

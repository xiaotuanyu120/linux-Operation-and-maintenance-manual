---
title: tomcat 1.3.0 优化-apr模式
date: 2017-02-03 15:18:00
categories: linux/java_env
tags: [linux,java_env,tomcat,apr]
---
### tomcat 1.3.0 优化-apr模式

---

### 0. tomcat的三种connector模式
[官方对这三种connector的解析和对比](https://tomcat.apache.org/tomcat-6.0-doc/config/http.html)
- BIO, 阻塞io
- NIO, 非阻塞io
- APR, 原生改善tomcat的io

---

### 0. apr环境需求
[官方文档](https://tomcat.apache.org/tomcat-6.0-doc/apr.html#Introduction)
- APR library -APR 1.2+ development headers (libapr1-dev package)
- JNI wrappers for APR used by Tomcat (libtcnative) - JNI headers from Java compatible JDK 1.4+
- OpenSSL libraries - OpenSSL 0.9.7+ development headers (libssl-dev package)
- GNU development environment (gcc, make)

---

### 1. 编译安装apr(centos6)
#### 1) 检查环境
``` bash
# 检查openssl-devel版本,官网提示大于0.9.7，但是实际运行需要1.0.2以上
rpm -qa |grep openssl-devel
openssl-devel-1.0.1e-48.el6_8.3.x86_64
wget https://www.openssl.org/source/openssl-1.0.2k.tar.gz
tar zxf openssl-1.0.2k.tar.gz
cd openssl-1.0.2k
# 编译参数要增加shared或者-fPIC(两种说法)，不然会报错
./config -fPIC shared
make
make test
make install
# 备份老版本
mv /usr/bin/openssl /root
ln -s /usr/local/ssl/bin/openssl /usr/bin/openssl
# 检查版本
openssl version
OpenSSL 1.0.2k  26 Jan 2017

# 确保你可以执行configure和make
yum groupinstall "Development tools"
```

#### 2) 安装APR library
``` bash
wget http://mirror.rise.ph/apache//apr/apr-1.5.2.tar.gz
tar zxvf apr-1.5.2.tar.gz
cd apr-1.5.2
./configure
make
make install
# 默认安装在/usr/local/apr
```

#### 3) 安装APR util(选做-推荐安装)
[apr-util简介](https://apr.apache.org/)
``` bash
wget http://mirror.rise.ph/apache//apr/apr-util-1.5.4.tar.gz
tar -xjf apr-util-1.5.4.tar.bz2
cd apr-util-1.5.4
./configure --with-apr=/usr/local/apr
make
make install
```

#### 4) 为APR安装JNI Wrapper，以供tomcat使用
``` bash
# 进入tomcat的bin目录
cd /usr/local/tomcat6/bin
tar zxf tomcat-native.tar.gz
cd tomcat-native-1.2.10-src/native
./configure --with-apr=/usr/local/apr --with-java-home=/usr/local/jdk1.6.0_45 --with-ssl=/usr/local/ssl
make
make install
```

#### 5) 为tomcat配置apr
``` bash
vim /usr/local/tomcat6/bin/catalina.sh
*******************************************************
CATALINA_OPTS="-Djava.library.path=/usr/local/apr/lib"
*******************************************************

vim /etc/profile
*******************************************************
# 在最后添加
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/apr/lib
*******************************************************
source /etc/profile
```

#### 6) 重启tomcat
``` bash
/usr/local/tomcat6/bin/catalina.sh start

# 查看catalina.out日志，发现以下几条即为成功
03-Feb-2017 08:43:05 org.apache.catalina.core.AprLifecycleListener init
INFO: Loaded APR based Apache Tomcat Native library 1.2.10 using APR version 1.5.2.
03-Feb-2017 08:43:05 org.apache.catalina.core.AprLifecycleListener init
INFO: APR capabilities: IPv6 [true], sendfile [true], accept filters [false], random [true].
03-Feb-2017 08:43:06 org.apache.catalina.core.AprLifecycleListener initializeSSL
INFO: OpenSSL successfully initialized with version OpenSSL 1.0.2k  26 Jan 2017
```

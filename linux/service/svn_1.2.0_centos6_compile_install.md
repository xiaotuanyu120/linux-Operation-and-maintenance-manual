---
title: svn: 1.2.0 centos6下源码安装svn1.6.19
date: 2016-10-28 15:49:00
categories: linux/service
tags: [svn]
---
### svn: 1.2.0 centos6下源码安装svn1.6.19

---

### 0. svn的安装
公司的svn是使用源码安装，使用svnserve命令启动，和我以前使用httpd+svn的方式有所不同，重新搞一次加深印象

---

### 1. 环境准备
``` bash
yum install epel-release -y
yum groupinstall base "Development tools" -y
# 为了解决"/usr/bin/ld: cannot find -lexpat"问题
yum install expat-devel
```

---

### 2. 安装apr
版本号会更新，要根据安装时间来定
``` bash
wget http://mirror.rise.ph/apache//apr/apr-1.5.2.tar.gz
tar zxf apr-1.5.2.tar.gz
cd apr-1.5.2
./configure --prefix=/usr/local/apr
make && make install
```

---

### 3. 安装apr-iconv
版本号会更新，要根据安装时间来定
``` bash
wget http://mirror.rise.ph/apache//apr/apr-iconv-1.2.1.tar.gz
tar zxf apr-iconv-1.2.1.tar.gz
cd apr-iconv-1.2.1
./configure --prefix=/usr/local/apr-iconv --with-apr=/usr/local/apr
make && make install
```

---

### 4. 安装apr-util
版本号会更新，要根据安装时间来定
``` bash
wget http://mirror.rise.ph/apache//apr/apr-util-1.5.4.tar.gz
tar zxf apr-util-1.5.4.tar.gz
cd ../apr-util-1.5.4
./configure --prefix=/usr/local/apr-util --with-apr=/usr/local/apr --with-apr-iconv=/usr/local/apr-iconv/bin/apriconv
make && make install
```

---

### 5. 安装zlib
``` bash
wget http://nchc.dl.sourceforge.net/project/libpng/zlib/1.2.8/zlib-1.2.8.tar.gz
tar zxf zlib-1.2.8.tar.gz
cd zlib-1.2.8
./configure --prefix=/usr/local/zlib
make && make install
```

---

### 6. 拷贝sqlite3.c文件
``` bash
# 为了解决sqlite3缺少的问题，提前拷贝sqlite3.c到svn源码中
wget http://www.sqlite.org/2016/sqlite-amalgamation-3150000.zip
wget http://archive.apache.org/dist/subversion/subversion-1.6.19.tar.gz
unzip sqlite-amalgamation-3150000.zip
tar zxf subversion-1.6.19.tar.gz
mkdir subversion-1.6.19/sqlite-amalgamation
cp sqlite-amalgamation-3150000/sqlite3.c subversion-1.6.19/sqlite-amalgamation
```

---

### 7. 安装svn1.6.19
``` bash
cd subversion-1.6.19
./configure --prefix=/usr/local/svn --with-apr=/usr/local/apr --with-apr-util=/usr/local/apr-util --with-zlib=/usr/local/zlib
make && make install
```

---

### 8. svn的相关配置文件
#### 1) 创建项目目录命令
``` bash
svnadmin create svndata
```

#### 2) 启动SVN命令
``` bash
svnserve -d -r /var/svn/repos
```

#### 3) svn配置说明
执行创建项目命令之后，会在svndata(举例项目目录为svndata)中产生初始化的相应文件，配置说明见[配置svn](http://linux.xiao5tech.com/linux/service/svn_1.3.0_configuration_basic.html)

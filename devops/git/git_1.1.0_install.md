---
title: git: 1.1.0 安装
date: 2015-08-07 11:22:00
categories: devops/git
tags: [git]
---
### git: 1.1.0 安装

---

### 1. git安装
centos/RHEL系统上安装
``` bash
yum install git-all
```
> 源码或者其他系统安装方式见[文档](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

源码安装
``` bash
yum install -y epel-release
yum install -y dh-autoreconf curl-devel expat-devel gettext-devel \
  openssl-devel perl-devel zlib-devel
yum install -y install asciidoc xmlto docbook2X
yum install gnu-getopt -y
ln -s /usr/bin/db2x_docbook2texi /usr/bin/docbook2x-texi

wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-1.8.4.5.tar.gz
tar zxvf git-1.8.4.5.tar.gz
cd git-1.8.4.5/
make configure
./configure --prefix=/usr
make all doc info
make install install-doc install-html install-info
```
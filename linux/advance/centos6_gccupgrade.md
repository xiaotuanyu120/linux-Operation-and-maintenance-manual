---
title: centos6: gcc upgrade
date: 2016年8月10日
categories: 9:59
---
 
---
title: centos6升级gcc版本-devtoolset
date: 2016-08-10 10:37:00
categories: linux
tags: [linux,gcc,devtoolset]
---
## 什么是devtoolset？
Red Hat Developer Toolset is distributed as a collection of RPM packages that can be installed, updated, uninstalled, and inspected by using the standard package management tools that are included in Red Hat Enterprise Linux. Note that a valid subscription that provides access to the Red Hat Software Collections content set is required in order to install Red Hat Developer Toolset on your system.
 
<!--more-->
 
## gcc 4.9.2(devtoolset-3)安装方法
``` bash
# 检查系统版本和gcc版本
cat /etc/centos-release
CentOS release 6.5 (Final)
 
gcc --version
gcc (GCC) 4.4.7 20120313 (Red Hat 4.4.7-16)
Copyright (C) 2010 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 
# 安装软件源和devtoolset-3版本的gcc和gcc-c++
yum install centos-release-scl
yum install devtoolset-3-gcc  devtoolset-3-gcc-c++
 
# 初始化devtoolset-3(需要每次登录后执行一遍初始化)，查看gcc版本
source /opt/rh/devtoolset-3/enable
gcc --version
gcc (GCC) 4.9.2 20150212 (Red Hat 4.9.2-6)
Copyright (C) 2014 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
 
## gcc4.8.2(devtoolset-2)安装
``` bash
# 导入软件包证书
rpm --import http://ftp.scientificlinux.org/linux/scientific/5x/x86_64/RPM-GPG-KEYs/RPM-GPG-KEY-cern
 
# 下载源配置文件
wget -O /etc/yum.repos.d/slc6-devtoolset.repo http://linuxsoft.cern.ch/cern/devtoolset/slc6-devtoolset.repo
 
# 安装gcc软件
yum install devtoolset-2-gcc*
 
# 初始化devtoolset-2(需要每次登录后执行一遍初始化)，查看gcc版本
source /opt/rh/devtoolset-2/enable
gcc --version
gcc (GCC) 4.8.2 20140120 (Red Hat 4.8.2-15)
Copyright (C) 2013 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
 
参考链接：
- [devtoolset-3官方指引](https://www.softwarecollections.org/en/scls/rhscl/devtoolset-3/)
- [devtoolset各版本安装总结](http://www.ie-lab.cn/page289?article_id=536)
- [devtoolset-2安装指引](https://gist.github.com/stephenturner/e3bc5cfacc2dc67eca8b)
- [devtoolset redhat基础介绍](https://access.redhat.com/documentation/en-US/Red_Hat_Developer_Toolset/3/html/User_Guide/sect-Red_Hat_Developer_Toolset-Install.html)

---
title: svn: 1.2.1 svn-tools
date: 2017-06-15 15:10:00
categories: linux/service
tags: [svn,svnauthz-validate,svnauthz]
---
### svn: 1.2.1 svn-tools

---

### 0. svn tools
公司安装svn后，使用svnserve启动，使用authz文件认证，但是由于authz被人不小心改动了，检查错误废了半天劲。  
后来查到有个svn的tools叫做svnauthz-validate命令，可以检查authz文件的语法错误。但是由于此命令当初编译的时候没有编译上所以需要重新编译安装上这个工具

---

### 1. 编译安装svntools
主要就是最后一句`make install-tools`
``` bash
./configure
make
make install
make install-tools
```
> ./configure命令处需要增加很多选项，这里主要是演示`make install-tools`所以就简写了，详细参阅上(一篇文章)[http://linux.xiao5tech.com/linux/service/svn_1.2.0_centos6_compile_install.html]

---

### 2. 测试svnauthz-validate
``` bash
# 故意将authz文件中一个存在的组(ssc_manage)注释掉
svnauthz-validate authz
svnauthz-validate: An authz rule refers to group '@ssc_manage', which is undefined
```
> 由于ssc_manage组未定义，但是下面却给这个组分配权限，这种语法错误就被检查出来了  
在svn1.8版本以后svnauthz-validate命令改名为svnauthz

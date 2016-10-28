---
title: python: 安装cryptography出现error
date: 2016-10-03 17:31:00
categories: devops/ansible
tags:
---

---
title: 安装paramiko时报crytography安装错误
date: 2016-10-03 17:33:00
categories: python
tags: [python,parser,cryptography,paramiko,ansible]
---

### 错误信息
**发现错误过程**
用vagrant搭建虚拟机，安装ansible需要安装paramiko支持，可是无论是centos6还是centos7都会在安装paramiko时出错，报错信息如下

**报错内容**
``` bash
Failed cleaning build dir for cryptography
...
AssertionError: sorry, but this version only supports 100 named groups
```

**排查过程**
网上查询了大量的文档，发现这个是对python一个re正则模块的限制
尝试过去报错py文件中禁掉100 groups检查，会引出更多的错误
尝试安装过各种底包都不可以
最终在github的issue中找到这样一个[147issue](https://github.com/eliben/pycparser/issues/147)，里面提到了pypi的官方源中python的c语言语法检查器wheel包有问题，于是找到了源码的[下载地址](https://pypi.python.org/pypi/pycparser/2.14)，下载了tar.gz的源码

**解决方法**
``` bash
tar zxf pycparser-2.14.tar.gz
cd pycparser-2.14
python setup.py  install
```
编译安装后，再次执行安装paramiko，安装成功

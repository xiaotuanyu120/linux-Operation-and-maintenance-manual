---
title: 工具: 1.1.0 切换目录-z武器
date: 2017-06-03 15:49:00
categories: linux/advance
tags: [cd,z]
---
### 工具: 1.1.0 切换目录-z武器

---

### 1. 什么是z武器？
[github源码](https://github.com/rupa/z)  
z是一个快速跳转的工具，可以记录一个冗长路径的别名，然后下次快速到达改路径。

---

### 2. z武器安装
``` bash
# 下载z武器源码
cd ~
wget https://raw.githubusercontent.com/rupa/z/master/z.sh

# 增加z武器到环境变量中
vim .bash_profile
*******************************
# 增加下面内容
source $HOME/z.sh
*******************************

source .bash_profile
```

---

### 3. z武器使用
``` bash
# 按照平常一样cd切换目录
cd /etc/sysconfig/network-scripts/
cd ~

# z会自动记录你cd过的目录，并帮你记录，当你希望到达近期去过的目录时，你只需要输入"z 目录名称"即可
z network-scripts
pwd
/etc/sysconfig/network-scripts

# 当然你也可以用缩写
z net
z script
pwd
/etc/sysconfig/network-scripts
```
> 使用缩写的时候必须保证唯一

---
title: node.js: 3.0 nvm简介
date: 2017-01-19 13:34:00
categories: javascript/node.js
tags: [node.js]
---
### node.js: 3.0 nvm简介

---

### 1. 什么是nvm？
nvm全称为Node Version Manager，类似于python的virtualenv，可以管理多个node版本，并在其间切换

---

### 2. nvm安装
``` bash
wget https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh
sh install.sh
# 该脚本会clone nvm的repository到~/.nvm下

# 在.bash_profile中增加以下内容
vim ~/.bash_profile
**********************************
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
**********************************
source ~/.bash_profile
```

---

### 3. nvm使用
``` bash
# 查看可以安装什么版本
nvm ls-remote

# 安装最新的稳定版本(v7.4.0)
nvm install stable

# 切换版本
nvm install v5.0.0
nvm use v5.0.0
node -v
v5.0.0

# 安装多个版本时，设定一个默认版本
nvm alias default v7.4.0
# 删除alias
nvm unalias some_alias

# 查看alias和node版本
nvm list

# 卸载node特定版本
nvm uninstall v5.0.0

# 查看某版本的目录
nvm which 7.4
# or
nvm which v7.4.0

# 取消nvm安装的node激活，恢复系统环境
which node
/root/.nvm/versions/node/v5.0.0/bin/node

nvm deactivate
/root/.nvm/*/bin removed from $PATH
/root/.nvm/*/share/man removed from $MANPATH

which node
/usr/bin/which: no node in (/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/python27/bin:/root/bin:/root/bin)

# 使用特定版本运行node命令或者文件
nvm run v7.4.0 --version
Running node v7.4.0 (npm v4.0.5)
v7.4.0
```

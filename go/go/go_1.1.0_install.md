---
title: GO 1.1.0 在centos上安装
date: 2017-03-28 13:40:00
categories: go/go
tags: [go,centos]
---
### GO 1.1.0 在centos上安装

---

### 0. 环境
OS: centos 6.8  
[官方文档](https://golang.org/doc/install)

### 1. 下载并安装go语言
``` bash
# 1. 下载go语言源码包
wget https://storage.googleapis.com/golang/go1.8.linux-amd64.tar.gz

# 2. 解压源码包
tar -C /usr/local -xzf go1.8.linux-amd64.tar.gz

# 3. 配置环境变量
vim /etc/profile
****************************************
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$(go env GOPATH)
****************************************
```
> go默认使用/usr/local/go作为GOROOT变量的值  
也可以自定义go的路径，但是相应的要修改环境变量  
```
****************************************
export GOROOT=$HOME/go1.X
export PATH=$PATH:$GOROOT/bin
export GOPATH=$(go env GOPATH)
****************************************
```

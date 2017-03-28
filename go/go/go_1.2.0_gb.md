---
title: go 1.2.0 build tools-gb
date: 2017-03-28 14:21:00
categories: go/go
tags: [go,gb]
---
### go 1.2.0 build tools-gb

---

### 0. 什么是gb？
A project based build tool for the Go programming language.  
[官方安装文档](https://getgb.io/docs/install/)

---

### 1. 如何安装gb？
``` bash
# 需要git命令
yum install git -y

# 安装gb
go get github.com/constabulary/gb/...

# 升级gb
go get -u github.com/constabulary/gb/...
```
> 默认go get命令会安装project在[GOPATH](https://golang.org/cmd/go/#hdr-GOPATH_environment_variable)下面  
如果没有设定GOPATH，默认会采用~/go为GOPATH的值  
因此，我们需要设定gb的命令位置如下
```
export PATH=$PATH:$GOPATH/bin:$GOROOT/bin
```

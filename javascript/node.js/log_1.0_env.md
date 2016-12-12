---
title: weblog: 1.0 env
date: 2016-12-06 21:00:00
categories: javascript/node.js
tags: [node.js,socket.io,express,jquery,redis]
---
### log: 1.0 env

---
### 0. 目的
实现用web页面来查看日志内容
- 使用express和node.js来做web服务器
- 使用socket.io+redis来实现实时数据传输
- 使用jquery和html来实现前端的特效和页面展示

---

### 1. 环境准备

#### 1) npm initial
``` bash
vim package.json
=======================
{
  "name": "my log reporter",
  "version": "0.0.1",
  "dependencies":
  {
    "socket.io": "1.7.1",
    "express": "4.14.0",
    "redis": "2.6.3"
    "jquery": "3.1.1"
  }
}
=======================
## 软件版本查看
# npm info socket.io version
## 还可以自动生成此文件
# npm init
```

#### 2) 安装软件包
``` bash
npm install
## vagrant中的软件包安装
# npm install --no-bin-links
# 否则会报错
```

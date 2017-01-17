---
title: 错误: 1.0 ipython无法tab补全
date: 2016-01-18 19:09:00
categories: python/advance
tags: [python,error]
---
### 错误: 1.0 ipython无法tab补全

---

### 0. 问题背景
安装完ipython，发现进去以后无法使用tab补全

---

### 1. 解决办法
``` bash
yum install ncurses-devel patch -y
pip install readline
```

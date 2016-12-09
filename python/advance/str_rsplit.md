---
title: str: rsplit的用法
date: 2016-12-09 21:10:00
categories: python/advance
tags: [python,str,rsplit]
---
### str: rsplit的用法

---

### 1. 设定分割次数
``` python
>>> test = "a.b.c.d"
>>> test.split(".")
['a', 'b', 'c', 'd']

>>> test.split(".", 1)
['a', 'b.c.d']
```

---

### 2. 使用rsplit从右向左分割
``` python
>>> test.rsplit(".", 1)
['a.b.c', 'd']
```

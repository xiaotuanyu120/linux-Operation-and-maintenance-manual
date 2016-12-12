---
title: django中如何将多行string转换成list
date: 2016-11-03 16:36:00
categories: django/devops
tags: [django,split,splitlines]
---
### django中如何使用splitlines
#### python中如何将多行string转换成list
``` python
>>> a = """good
... morning
... everyone"""
>>> a.split("\n")
['good', 'morning', 'everyone']
>>> a.splitlines()
['good', 'morning', 'everyone']
```
python中可以这样写，但是在django的views中，split("\n")不可行
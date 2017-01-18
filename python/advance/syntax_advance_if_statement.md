---
title: 语法: 简易if语句
date: 2016-12-09 19:00:00
categories: python/advance
tags: [python,if]
---
### if: 简单if语句

---

### 1. 判断变量是否为空，若为空，则赋值默认变量
``` python
# 标准写法
default_var = "default"
if var1:
    var = var1
else:
    var = default_var

# 简单写法
var = var1 or default_var
```

---

### 2. 条件和赋值的变量非同一个时
``` python
# 标准写法
default_var = "default"
if var2:
    var = var1
else:
    var = default_var

# 简单写法
var = var1 if var2 else default_var
```

---
title: 函数: isinstance
date: 2016-06-08 09:28:00
categories: python/advance
tags: [python,isinstance]
---
### 函数: isinstance

---

### 1. docstring
``` python
Docstring:
isinstance(object, class-or-type-or-tuple) -> bool

Return whether an object is an instance of a class or of a subclass thereof.
With a type as second argument, return whether that is the object's type.
The form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for
isinstance(x, A) or isinstance(x, B) or ... (etc.).
Type:      builtin_function_or_method
```

---

### 2. 示例用法
``` python
>>> a = {1:1}

>>> isinstance(a, dict)
True

>>> isinstance(a, str)
False
```

---

### 3. 对比其他用法
``` python
>>> a = {1,1}

>>> type(a)
set

>>> type(a) is set
True

>>> type(a) == set
True

# 对比速度
>>> timeit type(a) is set
The slowest run took 24.82 times longer than the fastest. This could mean that an intermediate result is being cached.
10000000 loops, best of 3: 76.9 ns per loop

timeit type(a) == set
The slowest run took 24.83 times longer than the fastest. This could mean that an intermediate result is being cached.
10000000 loops, best of 3: 86.4 ns per loop

>>> timeit isinstance(a, set)
10000000 loops, best of 3: 73.5 ns per loop
# 显然isinstance速度更快，耗时更平均
```

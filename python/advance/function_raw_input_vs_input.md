---
title: 函数: raw_input() vs input()
date: 2015-04-29 21:40:00
categories: python/advance
tags: [python,function]
---
### 函数: raw_input() vs input()

---

### 1. raw_input
#### 1) docstring of raw_input()
```
raw_input(...)
    raw_input([prompt]) -> string

    Read a string from standard input.  The trailing newline is stripped.
    If the user hits EOF (Unix: Ctl-D, Windows: Ctl-Z+Return), raise EOFError.
    On Unix, GNU readline is used if enabled.  The prompt string, if given,
    is printed without a trailing newline before reading.
```
> PS:无论输入内容是int还是string都转换成string

#### 2) 示例
``` python
#!/usr/bin/env python
name = raw_input("Input your name please:")
age = int(raw_input("How old are you:"))
sex = raw_input("Input your gender please:")
dep = raw_input("Which department you belong:")

message = '''
name: %s
age : %d
sex : %s
dep : %s
''' % (name,age,sex,dep)
print message
```---### 2. input
#### 1) docstring of input
```
help(input)
input(...)
    input([prompt]) -> value

    Equivalent to eval(raw_input(prompt)).
```
> PS：会保留输入内容的原格式

#### 2) 示例
``` python
# 输入int
>>> a=input()
100
>>> print type(a),a
<type 'int'> 100

# 输入string
>>> a=input()
'100'
>>> print type(a),a
<type 'str'> 100```
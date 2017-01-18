---
title: 脚本: 替换字符串
date: 2016-08-16 10:52:00
categories: python/advance
tags: python
---
### 脚本: 替换字符串

---

### 0. 脚本目标及使用函数
希望把a.txt中的所有"hello"字符串替换成为"byebye"  
其实使用shell的sed更方便，一条命令的事情，这里仅就函数的运用做锻炼

脚本使用函数
- `open` 打开文件
- `os.path.isfile` 判断文件是否存在
- `os.remove` 删除文件
- `str.replace` 替换字符串内容

---

### 1. 脚本内容
``` python
import os

with open('a.txt', 'r') as f:
    if os.path.isfile('a.replace'):
        os.remove('a.replace')
    with open('a.replace', 'a') as f_r:
        for line in f.readlines():
            if 'hello' in line:
                line = line.replace('hello', 'byebye')
            f_r.write(line)
```

---

### 2. 脚本效果
``` bash
python str_replace.py
cat a.txt | grep world | head
hello world
hello world
hello world
hello world
hello world
hello world
hello world
hello world
hello world
hello world

cat a.replace | grep world | head
byebye world
byebye world
byebye world
byebye world
byebye world
byebye world
byebye world
byebye world
byebye world
byebye world
```

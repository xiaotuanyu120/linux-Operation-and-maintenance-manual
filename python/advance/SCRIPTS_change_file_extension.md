---
title: how to change file extension by using shell and python
date: 2016-10-22 22:46:00
categories: python/advance
---
### python script's content
**MODULE USED:**
- os
- subprocess.call

``` python
import os

from subprocess import call

old_ext = 'txt'
new_ext = 'md'
dir_path = '.'

for i in os.listdir(dir_path):
    if i.split('.')[-1] == old_ext:
        old_name = i
        new_name = '.'.join(i.split('.')[:-1])
        new_name = ''.join(new_name.split(' ')) + '.' + new_ext
        cmd = ['mv', old_name, new_name]
        call(cmd)
```

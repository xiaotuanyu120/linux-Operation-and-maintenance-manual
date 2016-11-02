---
title: 如何在python程序中执行"cd"命令
date: 2016-11-02 13:40:00
categories: python/advance
tags: [python, cd]
---
### 如何在python程序中执行"cd"命令
#### os.chdir()
``` python
# 使用os模块中的chdir()来达到执行"cd"命令的效果
import os
os.chdir('/home')

# 虽然我们也可以用subprocess模块的Popen()和check_output()来执行命令和获取命令的stdout
# 但是我们直接执行Popen(['cd', '/home'])或check_output("cd /home")会报错

# 检查当前目录
import subprocess
subprocess.check_output("pwd")
'/home\n'
```
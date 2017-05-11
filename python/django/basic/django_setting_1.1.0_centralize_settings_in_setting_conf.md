---
title: django settings: 1.1.0 集中所有项目配置到settings中
date: 2016-11-11 11:43:00
categories: python/django
tags: [python,django,settings]
---
### django settings: 1.1.0 集中所有项目配置到settings中

---

### 0. 问题背景
views中编写功能时，有时候需要写一些固定的配置，基于配置统一存放的思路，我们希望views可以引用settings.py中的配置，而我们只需要把所有的配置都配在settings.py中即可。  
这样就达到了集中配置的目地。

---

#### views中引用全局settings  
提前在`settings.py`中配置`"ANSIBLE_DIR = /home/ansible"`
``` python
# 导入模块
from django.conf import settings

# 使用变量
ansible_dir = settings.ANSIBLE_DIR
```

---
title: views: 1.1 装饰器login_required
date: 2016-11-10 09:23:00
categories: python/django
tags: [python,django,decorators]
---
### 1.1 装饰器login_required的使用

----

#### 为何需要使用login_required?  
当我们启动一个django项目时，我们有时会需要部分views功能只有登录的用户可用，一个方法是在此功能的代码中加入login与否的判断，但是此方法容易产生代码重复。在我们动念头自己去写一个函数之前，django其实已经帮我们准备了login_required函数。  

作用:  
- 如果用户未登录，跳转到登录页面(settings.LOGIN_URL)，同时会传送用户希望登录后的url到登录url中，例如"/accounts/login/?next=/polls/3/"
- 如果用户已经登录，正常执行该views功能

[django login_required文档](https://docs.djangoproject.com/en/1.10/topics/auth/default/#django.contrib.auth.decorators.login_required)

----

#### 使用示例
**代码示例**
``` python
# 导入模块
from django.contrib.auth.decorators import login_required

# login_required作为装饰器使用
@login_required
def host_list(request):
    ...
```

**LOGIN_URL配置**
配置文件: <code>settings.py</code>  
``` python
LOGIN_URL = '/login'
```
做了此配置后用户访问需要登录的views时，若是未登录状态，返回此url去登录。
不过需要注意的是，此url必须是我们有效的登录url才可以

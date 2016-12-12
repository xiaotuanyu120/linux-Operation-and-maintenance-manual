---
title: csrf: 1.0 为views去除csrf认证
date: 2016-12-01 11:02:00
categories: django/devops
tags: [python,django,csrf]
---
### 1.0 为views去除csrf认证

---

### 1. django的views中为某函数去除csrf认证
若django添加了csrf的中间件（默认是添加过），post到django中的views默认是要经过csrf的认证的。这样的话，我们就必须在post时解决csrf token的问题，目前我是想写一个api，有一个服务器上的客户端post json数据给django，查找了很多文档，没有解决有效的传递csrf token的办法，于是换了解决方案，干脆取消此函数的csrf的认证，具体写法如下
``` python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def bbs_backup_api(request):
    pass
```

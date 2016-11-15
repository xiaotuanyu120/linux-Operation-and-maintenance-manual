---
title: views: 2.0 获取用户ip
date: 2016-11-15 16:16:00
categories: python/django
tags: [python,django,views,ip]
---
### 2.0 如何获取用户的ip
---
### 1. 在views中获取用户ip
`views.py`
``` python
def user_ip(request):
    try:
        return request.META.get('HTTP_X_FORWARDED_FOR').split(',')[0]
    except:
        return request.META.get('REMOTE_ADDR')
```

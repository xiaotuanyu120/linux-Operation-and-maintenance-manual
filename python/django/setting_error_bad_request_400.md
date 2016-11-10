---
title: settings: DEBUG=False(bad_request_400错误)
date: 2016-11-10 16:07:00
categories: python/django
tags: [python,django]
---
### 当设置DEBUG为False时，访问页面出现bad request 400错误

----

#### 解决办法
原因: 没有在<code>settings.py</code>中配置<code>ALLOWED_HOSTS</code>

简单粗暴的解决方法就是配置成所有主机可访问:
``` python
DEBUG = False

ALLOWED_HOSTS = ['*']
```

> 详细配置参看：
>  
> [django documents](https://docs.djangoproject.com/el/1.10/ref/settings/#allowed-hosts)  
[stackoverflow answer](http://stackoverflow.com/questions/19875789/django-gives-bad-request-400-when-debug-false)

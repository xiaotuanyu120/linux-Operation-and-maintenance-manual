---
title: settings 1.1.0 template配置
date: 2017-09-19 16:10:00
categories: python/django
tags: [python,django]
---
### settings 1.1.0 template配置

---

### 1. 前言
在settings.py中，可以配置TEMPLATES。通过配置TEMPLATES，我们可以提供html模板的访问。
```
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            # ... some options here ...
        },
    },
]
```

> 配置解释:
> - BACKEND，配置template引擎
> - DIRS，配置TEMPLATES根目录，可配置多个，按照顺序搜索模板文件
> - APP_DIRS，如果配置为True，则会在所有安装的应用中搜索模板文件

> 官方文档：[django templates docs](https://docs.djangoproject.com/en/1.11/topics/templates/)

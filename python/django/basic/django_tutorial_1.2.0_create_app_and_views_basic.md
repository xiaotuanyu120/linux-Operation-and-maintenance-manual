---
title: django tutorial: 1.2.0 创建APP及views基础
date: 2016-02-05 19:00:00
categories: python/django
tags: [python,django]
---
### django tutorial 1.2.0 创建APP及views基础

---

### 1. 创建APP
``` bash
python manage.py startapp asset
tree .
.                              # 根目录是项目容器，无实际意义
├── asset                      # APP目录，和业务直接相关
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations             # 每修改一次model，相应创建一个文件去记录数据库改变
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── firstsite                  # 项目目录，负责整个项目的设置
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py                  # 命令行工具
```

---

### 2. 把APP加入到项目中
`firstsite/settings.py`
``` python
## 把asset加入到INSTALLED_APPS列表中，上面都是默认的django应用
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'asset',
]
```

---

### 3. 创建APP的views
views就是处理http请求的函数集合
`asset/views.py`
``` python
# coding:utf-8
from django.http import HttpResponse


def index(request):
    print request
    return HttpResponse('hello world!')
```
> 函数index会打印出request，然后返回字符串"hello world!"

---

### 4. 创建url与views中函数的映射
配置用户的请求到来时，用什么函数来响应它
`firstsite/urls.py`
``` python
import asset.views

urlpatterns = [
    url(r'^$', asset.views.index),
    url(r'^admin/', admin.site.urls),
]
```
> 如果你在asset中也创建了一个urls来处理，可以用url(r'', include(asset.urls))

---

### 5. 启动项目和APP
``` bash
python manage.py runserver 0.0.0.0:8000
```
> 当我们访问根路径的时候，返回的就是index函数的字符串'hello world!'  
另外终端处随着我们的访问会输出:  
`<WSGIRequest: GET '/'>`  
`[05/Feb/2016 11:53:01] "GET / HTTP/1.1" 200 12`  
其中第一行就是我们函数中的"print request"
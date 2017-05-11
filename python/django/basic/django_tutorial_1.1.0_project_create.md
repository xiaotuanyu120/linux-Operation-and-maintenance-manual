---
title: django tutorial: 1.1.0 项目环境及创建项目
date: 2016-01-31 21:42:00
categories: python/django
tags: [python,django,basic]
---
### django basic: 1.1.0 项目环境及创建项目

---

### 1. 准备项目环境
``` bash
# 进入项目根目录
cd /root/django/

# virtualenv创建项目python环境
virtualenv .
source ./bin/activate
```

---

### 2. 安装django
``` bash
pip install Django
```

---

### 3. 创建Django项目
``` bash
# 项目名称不要和python的内置组件重名，例如django、test等
django-admin startproject firstsite
mv firstsite src

# 查看项目目录结构
tree src
src
├── firstsite
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py

1 directory, 5 files
```
> 目录功能简介:
- 外层的firstsite(改名为src)
  * 此目录只是一个项目容器，它的名称并不会影响django，可以随意重命名
- manage.py
  * 是一个命令行工具，和django-admin一样
  * 会把项目的包添加到sys.path
  * 设置DJANGO_SETTINGS_MODULE环境变量，来让它指向你项目的setting.py
  * 使用方法对比:
        $ django-admin <command> [options]
        $ manage.py <command> [options]
        $ python -m django <command> [options]
- 里层的firstsite/ 此
  * 目录是实际项目的python包，它的名字会在import这个包的时候用到
  * 例如import firstsite.urls
- firstsite/__init__.py
  * 用来标识此目录是一个python包
- firstsite/settings.py django项目的配置文件
  * 可以这样来指定用哪个配置文件
        django-admin runserver --settings=mysite.settings
- firstsite/urls.py
  * 项目的url声明文件，用来匹配url与函数之间的关系
- firstsite/wsgi.py
  * wsgi webserver的入口
---

### 4. 启动项目
``` bash
# 启用django自带的轻量级webserver（端口8000，监听所有ip）
python manage.py runserver 0.0.0.0:8000
```
> 如果访问不了，请检查selinux和防火墙

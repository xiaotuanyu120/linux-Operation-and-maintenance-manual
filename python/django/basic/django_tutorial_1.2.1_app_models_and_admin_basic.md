---
title: django tutorial: 1.2.1 APP之models基础和admin基础
date: 2016-02-05 20:20:00
categories: python/django
tags: [python,django,models]
---
### django tutorial: 1.2.1 APP之models基础和admin基础

---

### 1. models.py基本介绍
每个app创建之后都会有一个models.py，配置好之后就相当于拥有了一个天然的CMS系统
#### 1. 配置models.py
`asset/models.py`
``` python
# coding:utf-8

from django.db import models


class Host(models.Model):
    STATUS_ITEMS = (
        (1, "空闲"),
        (2, "使用中"),
        (3, "报废"),
    )
    ip = models.GenericIPAddressField(verbose_name="主机IP")
    open_port = models.CharField(max_length=1000, verbose_name="开放端口")
    status = models.IntegerField(choices=STATUS_ITEMS, verbose_name="主机状态")
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name_plural = "主机"
```

#### 2) 生成并查看sql文件
``` bash
# 生成sql文件
python manage.py makemigrations
Migrations for 'asset':
  0001_initial.py:
    - Create model Host
# 其实是在app下生成了一个文件，这个py文件把你的配置转换成了和数据库对接的文件

# 查看生成的sql文件
ls asset/migrations/
0001_initial.py  __init__.py

# 查看对应app的sql文件(指定序号)
python manage.py sqlmigrate asset 0001
BEGIN;
--
-- Create model Host
--
CREATE TABLE `asset_host` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `ip` char(39) NOT NULL, `open_port` varchar(1000) NOT NULL, `status` integer NOT NULL, `created_time` datetime(6) NOT NULL, `update_time` datetime(6) NOT NULL);

COMMIT;
```

#### 3) 配置数据库mysql连接
``` bash
# 安装必须的包
yum install python-devel -y
pip install mysql-python

# 配置项目中的数据库设置
vim firstsite/settings.py
********************************
DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.sqlite3',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'firstsite_db',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'sudomysql',
    }
}
********************************
# 默认使用的sqlite3数据库

# mysql -u root -p
mysql> create database firstsite_db;
```

#### 4) 创建数据表
``` bash
python manage.py migrate
```
> 根据makemigrations中生成的sql文件来创建数据库表

---

### 2. admin.py基本介绍
#### 1) 配置admin.py
将models.py中的表配置到`asset/admin.py`
``` python
# coding:utf-8
from django.contrib import admin

## same with from asset.models import Host
from .models import Host


class HostAdmin(admin.ModelAdmin):
    list_display = ('ip', 'open_port', 'status', 'update_time', 'created_time')


admin.site.register(Host, HostAdmin)
# 这一句是把model中的Host和admin中的HostAdmin注册进admin中
```

#### 2) 创建超级用户
``` bash
python manage.py createsuperuser
```
> 用来登录admin页面

#### 3) 修改admin页面显示语言
`firstsite/settings.py`
``` python
# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'zh-Hans'
TIME_ZONE = 'UTC'
USE_I18N = True
```
> [i18n国家代码列表](http://www.i18nguy.com/unicode/language-identifiers.html)  
其中zh-Hans代表简体中文，zh-Hant代表繁体中文
---

### 3. 问题
#### 1) 报错
``` bash
python manage.py makemigrations
......
You are trying to add a non-nullable field 'location' to server_room without a default; we can\'t do that (the database needs something to populate existing rows).
......
```

#### 2) 解决方案
``` bash
# 修改了字段名称，所以需要给这个字段加上null=True，或者default="**"选项
vim asset/models.py
****************************************************************
location = models.IntegerField(choices=LOCATION_ITEMS, verbose_name="位置", null=True)
****************************************************************

python manage.py makemigrations
Migrations for 'asset':
  0003_auto_20160224_0302.py:
    - Remove field status from server_room
    - Add field location to server_room
# 提示把我原来的status段删除，重建了一个location
```

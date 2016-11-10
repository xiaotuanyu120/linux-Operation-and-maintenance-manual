---
title: model：数据导入及导出
date: 2016-11-04 13:00:00
categories: python/django
tags: [python,django,model]
---
### django如何在改动model后平滑迁移数据

----

#### 问题背景
在开发django项目的过程中，有时候需要不定时的去更改model.py中的字段，此时需要重新migrate数据库，但是migrate是不会去更改已存在的table的。
若不migrate，运行django就会出错。有一个解决办法是删掉库重建，但是此方法费时费事。所以就需要找到一种方法来平滑的迁移数据。

----

#### 迁移过程
[stackoverflow 参考](http://stackoverflow.com/questions/1985383/update-django-database-to-reflect-changes-in-existing-models)
``` bash
# 版本>=django1.5

# 备份当前数据库数据(不指定备份类型时默认是json格式备份)，并清空已存在的table
python manage.py dumpdata <your_app> > temp_data.json
python manage.py sqlclear <your_app> | python manage.py dbshell

# 此处执行model.py文件的更改

# 执行migrate，重建table
python manage.py migrate

# 导入备份的数据
python manage.py loaddata temp_data.json
```
[django document](https://docs.djangoproject.com/es/1.10/ref/django-admin/)

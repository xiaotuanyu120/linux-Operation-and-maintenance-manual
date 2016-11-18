---
title: models: 1.2 查询字段-基础
date: 2016-11-17 11:36:00
categories: python/django
tags: [python,django,models]
---
### 1.2 models中的数据，如何实现数据库中的select语句
----
### 1. views中实现models数据查询
#### 1) 精确匹配
sql: `select from table where field = "filter"`
``` python
YOURMODELS.objects.filter(field = "filter")
```

#### 2) 首部匹配
sql: `select from table where field like "%filter"`
``` python
YOURMODELS.objects.filter(field__startswith = "filter")
# 忽略大小写可以用istartswith
```

#### 3) 尾部匹配
sql: `select from table where field like "filter%"`
``` python
YOURMODELS.objects.filter(field__endswith = "filter")
# 忽略大小写可以用iendwith
```

#### 4) 中部匹配
sql: `select from table where field like "%filter%"`
``` python
YOURMODELS.objects.filter(field__contains = "filter")
# 忽略大小写可以用icontains
```
----
### 2. 如何实现filter()中的field和filter的外部传参
``` python
my_filter = {}
my_filter[my_keyword] = my_filter_value
my_object = MyModel.objects.filter(**my_filter)
```

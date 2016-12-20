---
title: models: 3.0 字段不可重复
date: 2016-11-04 13:15:00
categories: python/django
tags: [python,django,models]
---
### 3.0 如何在model中创建不可重复的字段

----

#### 使用unique=True来保证字段内容不重复
``` python
# model.py中的内容
*******************************
class Getdata(models.Model):
    title = models.CharField(max_length=255, unique=True)
    state = models.CharField(max_length=2, choices=STATE, default="0")
    name = models.ForeignKey(School)
    created_by = models.ForeignKey(profile)
*******************************
# 其中title是不会重复的
```
[stackoverflow answer](http://stackoverflow.com/questions/3052975/django-models-avoid-duplicates)

----

#### 在Meta元类中使用unique_together来保证字段组合不重复
``` python
class Getdata(models.Model):
    title = models.CharField(max_length=255)
    state = models.CharField(max_length=2, choices=STATE, default="0")
    name = models.ForeignKey(School)
    created_by = models.ForeignKey(profile)
    class Meta:
        unique_together = ["title", "state", "name"]
```
[unique_together django document](https://docs.djangoproject.com/en/dev/ref/models/options/#unique-together)

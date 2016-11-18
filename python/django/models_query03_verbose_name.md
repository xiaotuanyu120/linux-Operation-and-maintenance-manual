---
title: models: 1.3 查询verbose_name
date: 2016-11-18 14:49:00
categories: python/django
tags: [python,django,models,verbose_name]
---
### 1.3 在views中获取models中字段的verbose_name
---
#### 1. models中配置verbose_name
``` python
class Record(models.Model):
    action_list = {
        ('TR', 'tomcat_restart'),
    }
    user = models.CharField(max_length=20, verbose_name="用户")
    brand = models.CharField(max_length=20, verbose_name="品牌")
    from_ip = models.GenericIPAddressField(verbose_name="IP")
    cmd = models.CharField(max_length=50, verbose_name="命令")
    action = models.CharField(max_length=5, choices=action_list, verbose_name="动作")
    action_time = models.DateTimeField(auto_now_add=True, auto_now=False, verbose_name="执行时间")
```
---
#### 2. views中获取
``` python
# 核心用法就是YOURMODELS._meta.get_fields()获取fields列表，然后field.verbose_name获得该属性
from .models import Record
{f.verbose_name: f.name for f in Record._meta.get_fields() \
          if f.verbose_name.encode('utf-8') not in ['ID', '命令', '动作']}
# 后面的if语句是筛选不需要的field
# 之所以储存成一个dict，是为了好调用name属性
```

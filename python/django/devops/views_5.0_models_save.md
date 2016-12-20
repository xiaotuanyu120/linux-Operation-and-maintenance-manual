---
title: views: 5.0 调用models，保存数据
date: 2016-12-01 09:40:00
categories: python/django
tags: [python,django,models,views]
---
### 5.0 views调用models，保存数据
`views.py`
``` python
from .models import Record

record = Record(user=record_list['user'],
                  brand=record_list['brand'],
                  from_ip=record_list['from_ip'],
                  cmd=record_list['cmd'],
                  action=record_list['action'])
record.save()
```
只要传递字段内容到Record中创建一个实例，然后调用该model的save方法即可

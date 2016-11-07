---
title: 通过model的查询操作，来获取某一个字段内容
date: 2016-11-07 11:49:00
categories: python/django
tags: [python,django,model]
---
### 通过model的查询操作，来获取某一个字段内容

----

#### 问题背景
我们知道django中的model对应的是数据库的设计，所以通过对model操作，我们就可以操纵数据库。
举例，我们有如下一个model类：
``` python
class Brand(models.Model):
    name = models.CharField(max_length=20, null=True, default="default_name")
    brand = models.CharField(max_length=20, unique=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name
```
**获得所有内容**  
sql语句：<code>select * from devops_brand</code>  
django terminal演示(<code>python manage.py shell</code>):
``` python
In [1]: from devops.models import Brand

In [2]: Brand.objects.all()
Out[2]: [<Brand: 千亿>, <Brand: 龙8>, <Brand: 亚虎pt777>, <Brand: E68>, <Brand: 优发>, <Brand: 优乐>, <Brand: 武松>, <Brand: 齐乐>]
```

**筛选部分内容**  
sql语句：<code>select * from devops_brand where name like "优%"</code>  
django terminal演示(<code>python manage.py shell</code>):
``` python
In [3]: Brand.objects.filter(name__startswith="优")
Out[3]: [<Brand: 优发>, <Brand: 优乐>]
```

但是遇到了一个问题，我希望通过name字段去做筛选条件，然后筛选出来的结果再取得其brand字段的值。  
相当于需要解决的问题是：同一个model中，使用其中一个字段筛选，获得另外一个字段内容

----

#### 解决问题过程
**model类的values方法**
``` python
# 通过dir(Brand.objects)列出所有属性，然后找到一个values方法
In [5]: Brand.objects.filter(name="千亿").values()
Out[5]: [{'brand': u'qy8', 'created': datetime.datetime(2016, 11, 2, 5, 1, 38, 783000, tzinfo=<UTC>), 'updated': datetime.datetime(2016, 11, 4, 5, 27, 28, 91000, tzinfo=<UTC>), u'id': 1, 'name': u'\u5343\u4ebf'}]

# 发现values方法的输出是一个包含dict的list
In [6]: Brand.objects.filter(name="千亿").values()[0]['brand']
Out[6]: u'qy8'
```

通过在django的terminal终端中调试，发现values方法，通过分析其返回值，顺利的拿到了需要的字段内容

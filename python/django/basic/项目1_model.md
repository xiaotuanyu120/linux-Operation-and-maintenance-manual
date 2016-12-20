项目1: model
2016年3月17日
10:56
 
## 创建新app
# python manage.py startapp routine 
## 配置model基本字段
## routine/model.py内容(粉色字体部分是基本字段)
## 我们创建了task、create_time、update_time三个基本字段，其他会在下面详细讲述
***************************************************
# coding:utf-8
from __future__ import unicode_literals
 
from django.db import models
from crum import get_current_user
 
 
class RoutineTask(models.Model):
    STATUS_CHOICES = (
        ('f', '已完成'),
        ('n', '未完成'),
        ('p', '已发布'),
    )
    task = models.CharField(max_length=40, verbose_name="任务")
    create_time = models.DateTimeField(auto_now=False, auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True, auto_now_add=False)
    create_by = models.ForeignKey('auth.User', blank=True, null=True,
                                    default=None, related_name='+',
                                    verbose_name="创建人")
    assigned_to = models.ForeignKey('auth.User', blank=True, null=True,
                                    default=None, related_name='+',
                                    verbose_name="执行人")
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="p")
 
    class Meta:
        verbose_name_plural = '项目'
 
    def save(self, *args, **kwargs):
        self.create_by = get_current_user()
        super(RoutineTask, self).save(*args, **kwargs)
 
    def __str__(self):
        return self.task
 
    def __unicode__(self):
        return self.task
# 这里的__unicode__或__str__会显示在admin的页面上，如果没有admin中的list_display的话
*************************************************** 
## 在model中获取用户信息
## 添加两个ForeignKey，related_name是用来防止两个'auth.User'外键重复的错误
***************************************************
create_by = models.ForeignKey('auth.User', blank=True, null=True,
                                    default=None, related_name='+',
                                    verbose_name="创建人")
assigned_to = models.ForeignKey('auth.User', blank=True, null=True,
                                    default=None, related_name='+',
                                    verbose_name="执行人")
***************************************************
 
## 重写model的save方法，用来自动保存created_by为当前用户
***************************************************
    def save(self, *args, **kwargs):
        self.create_by = get_current_user()
        super(RoutineTask, self).save(*args, **kwargs)
*************************************************** 
## 在model中配置任务状态
## 先创建一个元组套元组
## 在创建一个字段内嵌参数choices
## 在model中做这个配置只是为了给admin.py中的action做准备，并不像task那些基本字段一样是用来展示和让用户填写的
***************************************************
    STATUS_CHOICES = (
        ('f', '已完成'),
        ('n', '未完成'),
        ('p', '已发布'),
    )
......
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="p")
*************************************************** 

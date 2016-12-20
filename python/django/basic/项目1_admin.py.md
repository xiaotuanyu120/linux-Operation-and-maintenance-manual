项目1: admin.py
2016年3月17日
11:46
 
## routine/admin.py内容
*********************************************************
# coding:utf-8
from django.contrib import admin
 
from .forms import RoutineTaskForm
from .models import RoutineTask
 
 
def make_finished(modeladmin, request, queryset):
    queryset.update(status='f')
make_finished.short_description = "修改选择的项目为已完成"
 
 
class RoutineTaskAdmin(admin.ModelAdmin):
    list_display = ('task', 'create_by', 'assigned_to', 'create_time',
                    'update_time', 'status')
    actions = [make_finished]
    form = RoutineTaskForm
 
 
admin.site.register(RoutineTask, RoutineTaskAdmin)
********************************************************* 

DJANGO: jquery+ajax实现级联动态式for
2016年10月17日
10:10
 
---
title: django+jquery+ajax实现级联动态式form
date: 2016-10-13 15:54:00
categories: python
tags: [python,django,jquery,ajax]
---
### 背景介绍
使用django创建一个自动化运维系统，希望在页面上创建两个select标签，实现级联的效果，
即第二个select中的内容是由第一个select标签的选择所决定的。
 
**可参照选择省份，然后在选择城市的那种级联效果**
 
[github地址](https://github.com/xiaotuanyu120/django-devops)
 
最终使用的解决方案是：
（此处以brand和host为例，每个brand有多个host）
- django的models来创建form
- django的views来从models的form中获取brand，并渲染到第一个select中供用户选择
- 当用户选择了brand后，jquery+ajax动态的把用户的选择发送到views中处理，并获取返回数据，并将其渲染到第二个select中
 
<!--more-->
 
### django的models.py内容
``` python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
 
 
class Brand(models.Model):
    brand = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)
 
    def __str__(self):
        return self.brand
 
    def __unicode__(self):
        return self.brand
 
 
class Host(models.Model):
    service_type_list = {
        ('web', "web"),
        ('ser', "service"),
    }
    host = models.GenericIPAddressField()
    hosttag = models.CharField(max_length=20)
    brand = models.ForeignKey(Brand)
    service_type = models.CharField(max_length=3, choices=service_type_list, default='web')
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)
 
    def __str__(self):
        return self.host
 
    def __unicode__(self):
        return self.host
 
    def save(self, *args, **kwargs):
        self.hosttag = self.host + '_' + self.brand.brand + '_' + self.service_type
        print self.hosttag
        super(Host, self).save(*args, **kwargs)
 
# Host类中的brand设定为外键，对象是Brand类
# Host类重写了save方法，用来自动生成hosttag
```
 
### django的views.py相关内容
``` python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, render_to_response
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_protect
from subprocess import check_output
from .models import Host, Brand
import json
 
 
# ...省略非相关函数及模块导入...
 
 
def dashboard(request):
    if not request.user.is_authenticated():
        return render(request, "devops/login.html")
 
    # username for main.html
    user_login_name = request.user.username
 
    # initial hosts and brands for selection form
    hosts = Host.objects.all()
    brands = ["请选择产品品牌"]
    for brand in Brand.objects.all():
        if not brand in brands:
            brands.append(brand)
    context = {
        'user_login_name': user_login_name,
        "hosts": hosts,
        "brands": brands,
    }
 
    # function for command running
    if request.POST:
        if(request.POST.get("run")):
            # strip去两边空格，split+join去除中间重复空格，然后split转换字符串为list
            cmd = ' '.join(request.POST.get('cmd').strip().split()).split()
            print cmd
            try:
                stdout = check_output(cmd)
            except:
                stdout = "CMD:" + str(cmd) + " CMD error:" + str(sys.exc_info())
            context = {
                'user_login_name': user_login_name,
                "hosts": hosts,
                "stdout": stdout,
                "brands": brands,
            }
 
        # runner = AnsibleRunner()
        # runner.init_inventory(host_list='localhost')
        # runner.init_play(hosts='localhost', module='shell', args='ls')
        # result = runner.run_it()
 
    return render(request, "devops/dashboard.html", context)
 
 
@csrf_protect
@login_required
def form_interaction(request):
    if request.POST:
        selected_brand = request.POST.get('selbrand')
        host_list = []
        filtered_host = Host.objects.filter(brand__brand=selected_brand)
        for brand_item in filtered_host:
            if host_list.count(brand_item) == 0:
                brand_item = str(brand_item)
                host_list.append(brand_item)
        host = json.dumps(host_list)
        return HttpResponse(host, content_type="application/json")
 
## dashboard函数用来响应dashboard页面的访问请求
# 其中处理了brand的<select>的初始化
 
## from_interaction函数用来响应ajax的请求，用来返回第二个<select>的内容
# 需要注意的是，filtered_host = Host.objects.filter(brand__brand=selected_brand)
# 一般的字段获取我们只要Host.objects.filter(host='something')，但是因为brand作为
# Host类的外键，所以需要brand__接Brand类中的brand字段名称，即"brand__brand"才可以
 
## brand_item = str(brand_item)
# 此举的意义是避免json.dumps()报错。
```
 
### 前端页面内容
``` html
<!--head部分-->
<link rel="stylesheet" type="text/css" href="{% static 'devops/css/bootstrap.min.css' %}" />
<link rel="stylesheet" type="text/css" href="{% static 'devops/css/dashboard.css' %}" />
<link rel="stylesheet" type="text/css" href="{% static 'devops/css/customized.css' %}" />
<!-- <link href="{% static 'devops/css/simple-sidebar.css' %}" rel="stylesheet"> -->
<!-- jQuery library -->
<script src={% static "devops/js/jquery.min.js" %}></script>
<!-- Latest compiled JavaScript -->
<script src={% static "devops/js/bootstrap.min.js" %}></script>
 
 
<!--form 部分-->
<div class="container-fluid">
  <div class="row">
 
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1>TOMCAT HANDLER</h1>
      <form method="POST" action="">
        {% csrf_token %}
 
        <div class="form-group">
          <label class="control-label" for="selbrand">Brand</label>
          <select class="form-control" id="selbrand" name="selbrand">
            {% for brand in brands %}
            <option>{{ brand }}</option>
            {% endfor %}
          </select>
        </div>
 
        <div class="form-group">
          <label class="control-label" for="selhost">Host</label>
          <select class="form-control" id="selhost" name="selhost">
            <option>select brand first</option>
          </select>
          <p id="test_p"></p>
        </div>
 
        <div class="form-group">
          <label class="control-label" for="cmd">Command</label>
          <input type="text" class="form-control" id="cmd" placeholder="Enter cmd" name="cmd" value=''>
        </div>
 
        <button type="submit" class="btn btn-primary" name="run" value="Click">run</button>
      </form>
      {{ stdout }}
    </div>
 
  </div>
</div>
<!--这部分重点注意id和class，这是html元素的身份标识-->
```
 
### jquery & ajax
这部分代码也是在前端页面中
``` javascript
//jquery & ajax 部分
<script type="text/javascript">
$(document).ready(function(){
  $.ajaxSetup({
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     }
});
 
  $("#selbrand").change(function(){
    selbrand = $("#selbrand").val();
    data = {selbrand: selbrand};
 
    $.ajax({
            url: "/form_interaction/",
            data: data,
            type: 'post',
            success: function(host){
              $("#selhost").empty();
              $("#selhost").append("<option>"+"请选择主机"+"</option>");
              $.each(host,function(i){
                  $("#selhost").append("<option>"+host[i]+"</option>")
                })
            }
    })
  });
});
</script>
 
// 此部分最为核心
// $(document).ready(function(){}含义是等待整个页面文档加载完成之后再去执行function
//
// $.ajaxSetup()含义是ajax的预配置，此段代码解决了csrf_token(django的中间件)认证的问题，否则ajax的post会报403
//
// $("#selbrand").change(function(){$.ajax()}含义是当id为selbrand的部分发生了改变(第一个select发生改变)，
// 则执行()之内的函数。
//   首先，取得selbrand的值，组合成dict数据形式，用ajax POST到"/form_interaction/"。
//   然后，success: function(host){}，含义为当post的结果是success(服务端未发生任何错误)时，执行{}内命令
//     其中的host为传入的参数，名称和views中的form_interaction函数return的值一致
//     首先ajax清空selhost(第二个select)的内容，然后再增加一条"<option>请选择主机</option>"
//     最后，$.each(host,function(i){}，含义为传入host，用each进行循环执行function()，i为每次拿出的变量，
//       实际含义即把返回的host列表，每一项都以"<option>host[i]</option>"增加到<select>中
```
 
### django的urls.py内容
用来实现url访问时，映射到哪个views的函数的效果
``` python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls import url
from . import views
 
urlpatterns = [
    ...省略其他url配置...
    url(r'^form_interaction/$', views.form_interaction, name='form_interaction'),
]
 
# 当访问/from_interaction/时，把请求发送给views.py的form_interaction
```

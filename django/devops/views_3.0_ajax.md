---
title: views: 3.0 ajax + views
date: 2016-11-15 16:56:00
categories: django/devops
tags: [python,django,ajax,views]
---
### 3.0 views与ajax间的数据沟通
---
### 1. ajax传json数据给views，然后views传数据给ajax
#### 1) `JS`内容
``` javascript
<script>
$(document).ready(function(){
  //为了防止django的csrf中间层返回403，在发送ajax数据之前处理一下
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

  //当id为"btn1"的button发生click事件时，使用ajax发送数据
  //发送到"/run/"
  //发送方法"post"
  //发送数据是json格式
  //success后面跟着的function中的redata是自定义的一个变量，代表了views.py中返回的数据

  $("#btn1").click(function(){
    data = {test: 'content'}
    $.ajax({
      url: '/run/',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(redata) {
        alert(redata);
      }
    });
  });
});
</script>
```
#### 2) `url`内容
``` python
from django.conf.urls import url

urlpatterns = [
    ...
    url(r'^run/$', views.execute, name='run'),
]
```

#### 3) `views.py`内容
``` python
import json
from django.http import *


def execute(request):
    if request.method == 'POST' and request.is_ajax():
        data = request.POST['test']
        return HttpResponse(json.dumps(data), content_type = "application/json")
    return HttpResponseNotFound('<h1>Page not found</h1>')
```

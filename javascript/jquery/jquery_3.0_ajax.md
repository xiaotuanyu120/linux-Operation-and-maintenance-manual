---
title: jquery: 3.0 ajax
date: 2016-11-16 16:05:00
categories: javascript/jquery
tags: [django,javascript,jquery,ajax]
---
### jquery: 3.0 ajax

----

### 1. $.ajaxSetup()
可用于设定$.ajax()默认值，语法:`jQuery.ajaxSetup( options )`
``` javascript
$.ajaxSetup({
  url: "ping.php"
});

$.ajax({
  // url not set here; uses ping.php
  data: { "name": "Dan" }
});
```
> ajaxSetup用于设定ajax的设定的默认值，可用于在编写多个ajax代码时缩短代码长度。

> 参照jquery的[ajaxSetup文档](http://api.jquery.com/jQuery.ajaxSetup/)

---

### 2. $.ajax()
执行异步HTTP（Ajax）请求，语法：`jQuery.ajax( url [, settings ] )`
> 必备的参数是url，其他参数可选，详细参见[ajax文档](http://api.jquery.com/jQuery.ajax/)。


---

### 3. ajax与django的csrf
``` javascript
//使用beforeSend，在ajax发送之前，获得csrf的认证
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
```
> 详细信息参照[django-csrf-ajax文档](https://docs.djangoproject.com/en/1.11/ref/csrf/#ajax)。

#### 2) ajax执行
``` javascript
$("#btn1").click(function(){
    data = {selbrand: $("#selbrand").val(),
            sertype: $("#sertype").val(),
            user: $(this).attr("user"),
    };
    $.ajax({
      url: '/run/',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(redata) {
        for (i=0;i<redata.length;i++) {
          $("#terminal-output").append(redata[i] + "<br>");
        }
      }
    });
  });
//可以在ajax发送完成之后，无论成功还是失败，执行一些动作
$( document ).ajaxComplete(function(event, request, settings ) {
  $("#some").attr("hidden", "True");
});
```

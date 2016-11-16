---
title: jquery: 1.0 基础知识
date: 2016-11-16 16:05:00
categories: python/django
tags: [django,javascript,jquery]
---
### 1.0 jquery和ajax积累的基础用法
----
### 1. jquery
#### 1) 等待全部页面元素加载完毕才执行js
``` javascript
$(document).ready(function(){
  some_action();
})

//或者

$(function(){
  some_action();
})
```

#### 2) 获取某class的元素值
``` javascript
//html
<select class="form-control" id="selbrand" name="selbrand">
  <option>商品1</option>
  <option>商品2</option>
</select>

//jquery
selbrand = $("#selbrand").val();
```

#### 3) 删除和增加属性
``` javascript
//增加属性
$("#some").attr("attr_name", "attr_value")
$("#some").attr("attr_name")
$("#some").prop("attr_name", true)

//删除属性
$("#some").removeAttr("attr_name")
$("#some").prop("attr_name", false)
```

#### 4) 选择元素
``` javascript
//选择id
$("#some_id")

//选择类
$(".some_class")

//选择当前元素
$(this)

//选择多个元素
$("selection1, selection2, selection3 ...")
```

#### 5) 传递django的变量值给jquery
``` javascript
//html
<button type="submit" class="btn btn-primary" value='Click' id="btn2" user={{ request.user.username }}>
test
</button>

//javascript
$("#btn2").click(function(){
  alert($(this).attr("user"));
});
```
----
### 2. ajax
#### 1) ajax与django的csrf
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

    // 我们可以在这里执行一些操作，例如隐藏元素或者禁用button
    $("#some_label").removeAttr("hidden");
    $("#some_button").attr("disabled", "true");
  }
});
```

#### 2) ajax执行完毕之后
``` javascript
//可以在ajax发送完成之后，无论成功还是失败，执行一些动作
$( document ).ajaxComplete(function(event, request, settings ) {
  $("#some").attr("hidden", "True");
});
```

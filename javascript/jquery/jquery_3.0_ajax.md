---
title: jquery: 3.0 ajax-csrf/ajax执行完毕后的动作
date: 2016-11-16 16:05:00
categories: javascript/jquery
tags: [django,javascript,jquery,ajax]
---
### jquery: 3.0 ajax-csrf/ajax执行完毕后的动作

----

### 1. ajax
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

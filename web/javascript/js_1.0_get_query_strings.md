---
title: js: 1.0 获取query string中的值
date: 2016-12-07 21:47:00
categories: web/js
tags: [javascript]
---
### js: 1.0 获取query string中的值

---

### 1. 获取query string的函数
``` javascript
// parse url query strings
function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
```

---

### 2. 使用方法
``` javascript
// 举例，获取http://somedomain.com/?host=test中的host变量值
var host = getParameterByName('host')
```

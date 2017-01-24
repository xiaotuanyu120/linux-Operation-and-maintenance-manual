---
title: object: 1.0 location-获取url
date: 2016-11-16 16:05:00
categories: javascript/basic
tags: [javascript,jquery,location]
---
### object: 1.0 location-获取url

---

### 1. location
[location](http://www.w3schools.com/jsref/obj_location.asp)对象包含了当前url的信息

---

### 2. 获取当前的url
``` javascript
location.href
//返回http://www.somedomain.com/home.html?good
```

---

### 3. 使用实例
``` javascript
$(".navbar").find(".active").removeClass("active");
var url = window.location.pathname.split( '/' )[1];
$('ul.nav a[href="/'+ url +'"]').parent().addClass('active');
```
这个是将top nav bar中的元素自动跟随点击而切换active

最开始我的url变量等于`window.location.pathname`,当pathname是/linux这种时，没问题,但是当pathname是/linux/basic/xx.html时，则不会有active效果，因为根据第三行代码，js找不到`ul.nav a[href="/linux/basic/xx.html"]`这个元素。所以按照上面的代码修改之后，将url split，然后拿到我们需要的值即可。

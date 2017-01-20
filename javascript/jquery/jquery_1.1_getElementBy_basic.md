---
title: jquery: 1.1 基础知识-getElementBy*
date: 2017-01-20 11:25:00
categories: javascript/jquery
tags: [django,javascript,jquery]
---
### jquery: 1.1 基础知识-getElementBy*

---

### 1. getElementBy* 简介
getElementBy*是一系列DOM的[document](http://www.w3schools.com/js/js_htmldom_document.asp)的方法，顾名思义，肯定是根据条件来得到元素本身  
举例说明，我们可以根据类名称，id名称等获得元素

#### 1) 根据class获取元素集合
``` javascript
document.getElementsByClassName("fruit");
```

#### 2) 根据ID获取元素
``` javascript
show_ul = document.getElementById("redapple")
```

#### 3) 根据tag获取元素集合
``` javascript
show_ul = document.getElementsByTagName("shandong")
```
> 对于获取到的元素，我们就可以对它们进行一系列操作了，例如  
``` javascript
element.className += " active";
element.style.display = "block";
```

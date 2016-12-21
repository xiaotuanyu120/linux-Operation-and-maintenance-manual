---
title: jquery: 2.0 动态active
date: 2016-11-17 14:37:00
categories: javascript/jquery
tags: [django,javascript,jquery]
---
### 2.0 使用jquery实现list的动态active效果

---

### 1. 需求背景
当`ul`的`li`元素上增加`active`类时，该`li`会拥有底色，拥有`li`被选中的效果。  
但是，我们不能实时手动去更改它，那如何实现当我们点击之后动态的激活`li`的类呢？  

---

### 2. 代码实现
1. 在我们选中一个`li`元素时，jquery寻找该元素的父元素，既`ul`元素。  
2. 然后使用`find()`方法找到拥有`active`类的元素，并去除`active`类。  
3. 最后，将选中的`li`元素上增加`active`类。

``` javascript
$(function() {
  $(this).parent().find(".active").removeClass("active");
  var url = window.location.pathname;
  $('ul.nav a[href="'+ url +'"]').parent().addClass('active');
});
```

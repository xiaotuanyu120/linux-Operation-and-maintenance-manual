---
title: ajax: 1.0 什么是ajax？
date: 2017-09-22 11:00:00
categories: javascript/basic
tags: [javascript,ajax]
---
### ajax: 1.0 什么是ajax？

---

### 0. 参照文档
主要参照w3shcool的[ajax介绍文档](https://www.w3schools.com/js/js_ajax_intro.asp)。

---

### 1. 什么是ajax？
AJAX(Asynchronous JavaScript And XML)不是一门编程语言。

AJAX是以下技术的组合：
- 浏览器内嵌 XMLHttpRequest 对象 (从web服务器获取数据)
- JavaScript 和 HTML DOM (对数据的展示和使用)

AJAX允许通过与幕后的Web服务器交换数据来异步地更新网页。 这意味着可以更新网页的部分，而无需重新加载整个页面。

---

### 2. ajax执行过程
1. web页面发生动作 (加载页面, 点击按钮)
2. 一个XMLHttpRequest对象被JavaScript创建
3. XMLHttpRequest对象想web服务器发送请求
4. 服务器处理请求
5. 服务器发送响应数据给web页面
6. JavaScript读取响应数据
7. JavaScript执行适当的动作(例如页面更新)

---

### 3. XMLHttpRequest
AJAX的基石是XMLHttpRequest对象。因为有了XMLHttpRequest，AJAX才能实现更新网页的部分，而无需重新加载整个页面。

---
title: node.js: 1.0 introduction
date: 2016-12-07 11:20:00
categories: javascript/node.js
tags: [node.js]
---
### node.js: 1.0 introduction

---

### 1. 什么是node.js？
node.js是一个服务器端的javascript代码解释器。它使用Google的V8引擎。

特性：
- node.js与其他编程语言的一个很大不同是，它并不是面向对象的，而是面向事件的。举例说明，一个连接的创建算是一个事件，一个数据传输算是一个事件...
- 传统服务器语言PHP,JAVA等处理web请求经典的做法是为该连接创建一个进程或者线程去，这就意味着服务器的tcp并发成为一个瓶颈，而node.js宣称，基于事件与异步的编程方式，使得node.js轻松的可以达到上万并发。

---

### 2. 什么是V8引擎？
V8 JavaScript 引擎是 Google 用于其 Chrome 浏览器的底层 JavaScript 引擎。是Google使用C++编写，速度很快。它有一个特性是，我们可以将V8引擎嵌入到任何应用程序中，node.js就是将V8重建在服务器端来使用。

---

### 3. 精品文章
[ibm node.js introduction](https://www.ibm.com/developerworks/cn/opensource/os-nodejs/)  
[infoq node.js introduction](http://www.infoq.com/cn/articles/what-is-nodejs)

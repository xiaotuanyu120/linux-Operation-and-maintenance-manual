---
title: 语法: 2.0 javascript的try catch finally语句
date: 2018-04-05 15:08:00
categories: javascript/basic
tags: [javascript]
---
### 语法: 2.0 javascript的try catch finally语句

---

### 1. 说明
可以用try catch finally去捕获一些有可能报错的命令。这样就会避免有些错误发生时，程序就卡住在报错信息处不再继续执行的问题。

---

### 2. 语法
``` javascript
try {
    try_command;  // 判断是否会报错的命令
}
catch(err) {
    alert(err);
    command_if_error_catched; // 如果报错了，执行的命令
}
finally {
    final_command; // 无论 try / catch 结果如何都会执行的代码块
}
```
> 可以搭配`throw`使用  
``` javascript
throw exception;
```
异常可以是 JavaScript 字符串、数字、逻辑值或对象。

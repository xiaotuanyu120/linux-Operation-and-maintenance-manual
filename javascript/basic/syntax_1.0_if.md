---
title: 语法: 1.0 javascript的if语句
date: 2016-11-07 13:47:00
categories: javascript/basic
tags: [javascript]
---
### 语法: 1.0 javascript的if语句

----

### 1. if语句
``` javascript
if (condition1) {
    block of code to be executed if condition1 is true
} else if (condition2) {
    block of code to be executed if the condition1 is false and condition2 is true
} else {
    block of code to be executed if the condition1 is false and condition2 is false
}
```
> 扩展：如何判断一个字符串为空或者null
``` javascript
x = ""
if (!x) {
  alert("string is empty");
}
```

---

### 2. 与或标识符
- 与：`conditionA && conditionB`
- 或：`conditionA || conditionB`
- 与或混合：`(conditionA && conditionB) || conditionC`

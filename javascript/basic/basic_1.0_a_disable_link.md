---
title: 基础: 1.0 禁用a标签的link属性
date: 2017-05-17 11:00:00
categories: javascript/basic
tags: [javascript]
---
### 基础: 1.0 禁用a标签的link属性

---

### 1. 实现方法
有时候我们需要a标签，却不需要其link属性，此时我们可使用如下方法
``` html
<a class="drop" href="" id="dropdownMenuLearn" style="pointer-events: none; cursor: default;">
  some string
</a>
```

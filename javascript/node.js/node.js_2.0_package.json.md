---
title: node.js: 2.0 package.json
date: 2016-12-07 11:52:00
categories: javascript/node.js
tags: [node.js]
---
### node.js: 2.0 package.json

---

### 1. 什么是package.json？
package.json是一个app或者模块的meta信息文件，特别是记录了该app的依赖包信息，可以被`npm install`使用。    
听起来特别像python的包管理工具pip的requirement.txt(名称不固定，使用-r指定)

---

### 2. package.json示例
``` json
{
  "name": "my log reporter",
  "version": "0.0.1",
  "dependencies":
  {
    "socket.io": "1.7.1",
    "express": "4.14.0",
    "redis": "2.6.3"
    "jquery": "3.1.1"
  }
}
```

---

### 3. 字段详解

字段名称|含义
---|---
name|(必包含)名称和版本组合成一个唯一的标识
version|(必包含)名称和版本组合成一个唯一的标识
description|描述(字符串)，会在执行`npm search`时列出
keywords|关键字(数组)，会在执行`npm search`时列出
homepage|主页的url
dependencies|依赖包


依赖包用法示例
``` json
{ "dependencies" :
  { "foo" : "1.0.0 - 2.9999.9999"
  , "bar" : ">=1.0.2 <2.1.2"
  , "baz" : ">1.0.2 <=2.3.4"
  , "boo" : "2.0.1"
  , "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0"
  , "asd" : "http://asdf.com/asdf.tar.gz"
  , "til" : "~1.2"
  , "elf" : "~1.2.3"
  , "two" : "2.x"
  , "thr" : "3.3.x"
  , "lat" : "latest"
  , "dyl" : "file:../dyl"
  }
}
```

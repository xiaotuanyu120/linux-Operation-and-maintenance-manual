---
title: fluentd 1.0.0 读“fluentd官方文档”笔记
date: 2017-11-27 15:59:00
categories: linux/service
tags: [fluentd]
---
### fluentd 1.0.0 读“fluentd官方文档”笔记

---

### 1. 什么是fluentd？
fluentd是一个日志收集器，支持很多日志源和后端存储。核心代码由c语言编写，性能较快，使用ruby封装，增强了其扩展性，目前有很多插件支持。主要的竞品有logstash。

### 2. fluentd-event
每一个fluentd的event包含三个元素"tag,time,record"，tag是fluentd内部用来对此event进行路由的一个标识，time是event的发生时间，record是日志内容，json格式；

### 3. event的生命周期
可以简要用fluentd的组件将event的生命周期描述为：`source-filter-match`  
> 其中source是日志如何进入；filter是日志如何处理，可选；match是日志如何出去  
可指定多个source；  
match中通过tag pattern来匹配，顺序是按照配置文件中的上下顺序；  
如果希望match匹配的同一个时间有多个输出，需要使用type:`out_copy`；  

### 4. 其他
- fluentd中还有`system-label-@include`配置，可参阅官方文档详细了解；  
- fluentd中有很多in 和 out的插件，这部分是重点

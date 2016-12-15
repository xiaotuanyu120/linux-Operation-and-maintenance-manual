JVM: 内存区域
2016年8月9日
15:07
 
---
title: JVM中的内存区域
date: 2016-08-09 16:59:00
categories: java
tags: [java,jvm,memory]
---
## 前言
每当执行一个java程序的时候，系统会分配一个单独的内存区域给jvm。虽然并不是必须要懂得，但是了解一些JVM的内存只是，会有利于做性能优化。
 
## JVM中的内存区域结构
JVM中一般分为以下几种内存区域
- 堆内存(Heap area)
- 方法区(Method area and runtime constant pool)
- 虚拟机栈(JVM stack)
- 本地方法栈(Native method stack)
- 程序计数器(PC registers)
其中，**堆内存**和**方法区内存**是在JVM启动的时候分配的，在JVM退出时会被销毁，而**栈内存**、**本地方法栈**和**程序计数器**都是随着线程的启动而创建，线程的结束而销毁。
 
### 堆内存
堆内存为JVM共享，分配给类实例和数组。
 
-Xms参数设置最小值
-Xmx参数设置最大值
若-Xms=-Xmx，则可避免自动扩展
 
堆内存剩余空间不足以满足分配请求时，JVM抛出OutOfMemoryError
 
-XX:+HeapDumpOnOutOfMemoryError参数可以让JVM在出现内存溢出时dump出当前的内存堆转储快照
 
### 方法区
方法区内存为JVM共享，别名永久带(Permanent Generation，两者并不等同)，用于存储类信息、常量池、方法数据、方法代码等。
 
-XX:MaxPermSize参数设置永久带上限
-XX:PermSize参数设置永久带最小值
 
方法内存剩余空间不足以满足分配请求时，JVM抛出OutOfMemoryError
 
### 虚拟机栈内存
栈内存为线程私有，描述的是java方法执行的内存模型：每个方法在执行的同时多会创建一个栈帧用于存储局部变量表、操作数栈、动态链表、方法出口等信息
 
-Xss参数设置栈容量
 
### 本地方法栈
同虚拟机栈，只不过此栈会让JVM使用到native方法。sun hotspot虚拟机把本地方法栈和虚拟机栈合二为一，只是在概念上进行区分。
 
### 程序计数器
线程私有，独立存储。代表当前线程所执行字节码的行号指示器。
 
## 参考链接
[深入理解java虚拟机（一）：java内存区域（内存结构划分）](http://blog.csdn.net/chaofanwei/article/details/19418753)
[JVM Memory Model / Structure and Components](http://howtodoinjava.com/core-java/garbage-collection/jvm-memory-model-structure-and-components/#pc_register)

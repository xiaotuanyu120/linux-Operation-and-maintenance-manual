JVM: 堆、栈及常量池
2016年8月8日
9:03
 
---
title: JVM中的堆、栈及常量池概念
date: 2016-08-09 13:40:00
categories: java
tags: [java,jvm]
---
## 什么是堆(heap)？
heap在java中是用来存储实例对象和数组的内存区域，这里的heap并不是数据结构意义上的那个堆[引用:堆-一种有序的树](https://en.wikipedia.org/wiki/Heap_(data_structure))，而是动态内存分配意义上的堆--用于管理动态生命周期的内存区域。
 
**堆的特点**
- 堆会被同一个java实例中的所有线程所共享，由垃圾回收机制(GC:garbage collection)管理回收。
- 而如果是堆内存没有可用的空间存储生成的对象，JVM会抛出java.lang.OutOfMemoryError。
 
## 什么是栈(stack)？
栈是一种后进先出的结构，用来存储局部变量和方法调用。
 
**栈的特点**
- 在java中，每个线程有自己独立的JVM栈，也就是java方法的调用栈[引用:每个线程一个栈的官方介绍](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.5.2)。同时JVM规范为了允许native代码可以调用Java代码，以及允许Java代码调用native方法，还规定每个Java线程拥有自己的独立的native方法栈。但这并不意味着每个java线程拥有两个栈，两个栈只是概念上区分，其实实际这两个方法调用栈是混在一起的。
- 如果栈内存没有可用的空间存储方法调用和局部变量，JVM会抛出java.lang.StackOverFlowError。
 
## 什么是常量池
常量池是为了避免频繁的创建和销毁对象而影响系统性能而分配的一个内存区域。
 
**常量池特点**
- class文件中的常量池，class文件中保存了常量池信息，用于存放编译期生成的各种字面量(literal)和符号引用量(Symbolic References),这部分内容将在类加载后进入方法区的运行时常量池中存放
- 方法区中的运行时常量池，与class文件常量池的区别在于，它具备动态性。
- 常量池可节省内存(例如：会把相同的字符串常量合并)，可节省运行时间(例如，比较字符串时，==只对比两个引用是否一致，不需要去比较内容)

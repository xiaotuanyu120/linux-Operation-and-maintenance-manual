---
title: 系统信息：1.1.0 cpuinfo 超线程引起的争吵
date: 2017-01-23 11:51:00
categories: linux/advance
tags: [linux,cpuinfo,hyper-threading]
---
### 系统信息：1.1.0 cpuinfo 超线程引起的争吵

---

### 1. 事件背景
在IDC机房租了两台服务器，同是L5630*2，但是发现cpuinfo信息不同，1个是16processor，1个是8processor，但是cpu其他信息是一致的。  
于是找IDC机房询问情况，得到的答案是设备配置是一样的，于是网上查了查这个cpu的详细信息，发现了超线程这个说法。

---

### 2. 什么是超线程？
“超线程（Hyper-Threading，简称“HT”）”技术。超线程技术就是利用特殊的硬件指令，把两个逻辑内核模拟成两个物理芯片，让单个处理器都能使用线程级并行计算，进而兼容多线程操作系统和软件，减少了CPU的闲置时间，提高的CPU的运行效率。

超线程技术是在一颗CPU同时执行多个程序而共同分享一颗CPU内的资源，理论上要像两颗CPU一样在同一时间执行两个线程，虽然采用超线程技术能同时执行两个线程，但它并不象两个真正的CPU那样，每个CPU都具有独立的资源。当两个线程都同时需要某一个资源时，其中一个要暂时停止，并让出资源，直到这些资源闲置后才能继续。因此超线程的性能并不等于两颗CPU的性能。

---

### 3. cpuinfo在开启超线程前后的信息差别
``` bash
# 未开启超线程
cat /proc/cpuinfo | grep -e "cpu cores"  -e "siblings" | sort | uniq
cpu cores	: 4
siblings	: 4

cat /proc/cpuinfo | grep processor
processor	: 0
processor	: 1
processor	: 2
processor	: 3
processor	: 4
processor	: 5
processor	: 6
processor	: 7

# 开启超线程
cat /proc/cpuinfo | grep -e "cpu cores"  -e "siblings" | sort | uniq
cpu cores	: 4
siblings	: 8

cat /proc/cpuinfo | grep processor
processor	: 0
processor	: 1
processor	: 2
processor	: 3
processor	: 4
processor	: 5
processor	: 6
processor	: 7
processor	: 8
processor	: 9
processor	: 10
processor	: 11
processor	: 12
processor	: 13
processor	: 14
processor	: 15
```

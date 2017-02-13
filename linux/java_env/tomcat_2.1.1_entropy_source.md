---
title: tomcat 2.1.1 问题-tomcat7启动安全-熵池
date: 2017-02-13 13:03:00
categories: linux/java_env
tags: [linux,java_env,tomcat，entropy]
---
### tomcat 2.1.1 问题-tomcat7启动安全-熵池

---

### 0. 前言
最近线上开始升级tomcat6到tomcat7，遇到了几个启动方面的问题，在同事的共同努力下，顺利解决。在这个过程中新接触了一个概念：熵池，本着知其然，更要知其所以然的态度，网上搜罗了不少资料，在这里做个简要的总结。  
主要的参考：
- [IBM 对于随机数与熵池的介绍](https://www.ibm.com/developerworks/cn/linux/1404_caobb_kvmrandom/)
- [tomcat对tomcat7启动速度的优化的wiki](https://wiki.apache.org/tomcat/HowTo/FasterStartUp)

---

### 1. 什么是熵池，它的作用是什么？
Linux 内核采用熵来描述数据的随机性，熵（entropy）是描述系统混乱无序程度的物理量，一个系统的熵越大则说明该系统的有序性越差，即不确定性越大。内核维护了一个熵池用来收集来自设备驱动程序和其它来源的环境噪音。理论上，熵池中的数据是完全随机的，可以实现产生真随机数序列。为跟踪熵池中数据的随机性，内核在将数据加入池的时候将估算数据的随机性，这个过程称作熵估算。熵估算值描述池中包含的随机数位数，其值越大表示池中数据的随机性越好。  
上面的定义摘自IBM的链接，抛开其他不谈，我们主要谈论熵池对于随机数产生的作用，内核中随机数发生器 PRNG 为一个字符设备 random，该设备实现了一系列接口函数用于获取系统环境的噪声数据，并加入熵池。系统环境的噪声数据包括设备两次中断间的间隔，输入设备的操作时间间隔，连续磁盘操作的时间间隔等。  
random 设备了提供了 2 个字符设备供用户态进程使用——/dev/random 和/dev/urandom：
- /dev/random 适用于对随机数质量要求比较高的请求，/dev/random 可生成高随机性的公钥或一次性密码本。但是如果熵池空了，对/dev/random 的读操作将会被阻塞，直到收集到了足够的环境噪声为止。
- /dev/urandom，非阻塞的随机数发生器，它会重复使用熵池中的数据以产生伪随机数据。这表示对/dev/urandom 的读取操作不会产生阻塞，但其输出的熵可能小于/dev/random 的。它可以作为生成较低强度密码的伪随机数生成器，对大多数应用来说，随机性是可以接受的。

---

### 2. tomcat7与熵池的关系
tomcat7会重度的依赖SecureRandom这个类来产生随机数，用于session id和其它地方的随机数需要。默认的情况，tomcat7使用的是/dev/random这个设备，所以在熵池数值过低时，导致阻塞，则会拖慢tomcat7的启动速度。

---

### 3. 如何修改随机数设备
#### 1) 方法一：rng-tools系统层面修改
[rng-tools](https://wiki.archlinux.org/index.php/Rng-tools)可以通过使用硬件随机数生成器TRNG来加快熵增，以加快/dev/random获得随机数的速度。或者，我们可以通过配置使用/dev/urandom来增快随机数获得速度
``` bash
yum -y install rng-tools
echo 'EXTRAOPTIONS="--rng-device /dev/urandom"' >/etc/sysconfig/rngd
service rngd start
chkconfig rngd on
cat /proc/sys/kernel/random/entropy_avail
```
#### 2) 方法二：tomcat7程序中的java参数修改
``` bash
vim $CATALINA_BASE/bin/catalina.sh
*************************************************
# 增加以下参数
CATALINA_OPTS="$CATALINA_OPTS -Djava.security.egd=file:/dev/./urandom"
*************************************************
```

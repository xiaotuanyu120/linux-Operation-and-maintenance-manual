---
title:
date: 2016-12-05 10:46:00
categories: linux/java
tags: [linux,java,stat]
---
以下为jdk1.6中的命令
### 1. jinfo
简介：jinfo - Configuration Info
语法：
- `jinfo [ option ] pid`
- `jinfo [ option ] executable core`
- `jinfo [ option ] [server-id@]remote-hostname-or-IP`

常用用法:
``` bash
# 查看永久代最大可用内存
jinfo -flag MaxPermSize 14391
-XX:MaxPermSize=85983232

# 查看永久代初始化内存
jinfo -flag PermSize 14391
-XX:PermSize=21757952

# 查看堆内存初始化大小
jinfo -flag InitialHeapSize 14391
-XX:InitialHeapSize=8031104

# 查看堆内存最大空间大小
jinfo -flag MaxHeapSize 14391
-XX:MaxHeapSize=132120576

# 查看线程堆栈大小(Kb)
jinfo -flag ThreadStackSize 14391
-XX:ThreadStackSize=1024
```
[flag list and intro](http://jvm-options.tech.xebia.fr/)

### 2. jstat
简介：jstat - Java Virtual Machine Statistics Monitoring Tool  
语法：`jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]] ]`
参数：
- generalOption
  - help
  - options
- outputOptions
  - stat option
    - class, 用于查看类加载情况的统计
    - compiler, 用于查看HotSpot中即时编译器编译情况的统计
    - gc, 用于查看JVM中堆的垃圾收集情况的统计
    - gccapacity, 用于查看新生代、老生代及持久代的存储容量情况
    - gccause, 用于查看垃圾收集的统计情况（这个和-gcutil选项一样），如果有发生垃圾收集，它还会显示最后一次及当前正在发生垃圾收集的原因。
    - gcnew, 用于查看新生代垃圾收集的情况
    - gcnewcapacity, 用于查看新生代的存储容量情况
    - gcold, 	用于查看老生代及持久代发生GC的情况
    - gcoldcapacity, 用于查看老生代的容量
    - gcpermcapacity, 用于查看持久代的容量
    - gcutil, 用于查看新生代、老生代及持代垃圾收集的情况
    - printcompilation, HotSpot编译方法的统计
  - other option
    - h n, 用于指定每隔几行就输出列头，如果不指定，默认是只在第一行出现列头。
    - t n, 用于在输出内容的第一列显示时间戳，这个时间戳代表的是JVM开始启动到现在的时间。
    - JjavaOption, 用于将给定的javaOption传给java应用程序加载器，例如，“-J-Xms48m”将把启动内存设置为48M。

各选项输出内容含义：

-class | 类加载情况的统计
--- | ---
列名 | 说明
Loaded | 加载了的类的数量
Bytes | 加载了的类的大小，单为Kb
Unloaded | 卸载了的类的数量
Bytes | 卸载了的类的大小，单为Kb
Time | 花在类的加载及卸载的时间

-compiler | HotSpot中即时编译器编译情况的统计
--- | ---
列名 | 说明
Compiled | 编译任务执行的次数
Failed | 编译任务执行失败的次数
Invalid | 编译任务非法执行的次数
Time | 执行编译花费的时间
FailedType | 最后一次编译失败的编译类型
FailedMethod | 最后一次编译失败的类名及方法名

-gc | JVM中堆的垃圾收集情况的统计
--- | ---
列名 | 说明
S0C | 新生代中Survivor space中S0当前容量的大小（KB）
S1C | 新生代中Survivor space中S1当前容量的大小（KB）
S0U | 新生代中Survivor space中S0容量使用的大小（KB）
S1U | 新生代中Survivor space中S1容量使用的大小（KB）
EC | Eden space当前容量的大小（KB）
EU | Eden space容量使用的大小（KB）
OC | Old space当前容量的大小（KB）
OU | Old space使用容量的大小（KB）
PC | Permanent space当前容量的大小（KB）
PU | Permanent space使用容量的大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
YGCT | 从应用程序启动到采样时 Young GC 所用的时间(秒)
FGC | 从应用程序启动到采样时发生 Full GC 的次数
FGCT | 从应用程序启动到采样时 Full GC 所用的时间(秒)
GCT | 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

-gccapacity | 新生代、老生代及持久代的存储容量情况
--- | ---
列名 | 说明
NGCMN | 新生代的最小容量大小（KB）
NGCMX | 新生代的最大容量大小（KB）
NGC | 当前新生代的容量大小（KB）
S0C | 当前新生代中survivor space 0的容量大小（KB）
S1C | 当前新生代中survivor space 1的容量大小（KB）
EC | Eden space当前容量的大小（KB）
OGCMN | 老生代的最小容量大小（KB）
OGCMX | 老生代的最大容量大小（KB）
OGC | 当前老生代的容量大小（KB）
OC | 当前老生代的空间容量大小（KB）
PGCMN | 持久代的最小容量大小（KB）
PGCMX | 持久代的最大容量大小（KB）
PGC | 当前持久代的容量大小（KB）
PC | 当前持久代的空间容量大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
FGC | 从应用程序启动到采样时发生 Full GC 的次数

-gccause | 这个选项用于查看垃圾收集的统计情况（这个和-gcutil选项一样），如果有发生垃圾收集，它还会显示最后一次及当前正在发生垃圾收集的原因，它比-gcutil会多出最后一次垃圾收集原因以及当前正在发生的垃圾收集的原因。用于查看垃圾收集的统计情况，包括最近发生垃圾的原因
--- | ---
列名 | 说明
LGCC | 最后一次垃圾收集的原因，可能为“unknown GCCause”、“System.gc()”等
GCC | 当前垃圾收集的原因

-gcnew | 新生代垃圾收集的情况
--- | ---
列名 | 说明
S0C | 当前新生代中survivor space 0的容量大小（KB）
S1C | 当前新生代中survivor space 1的容量大小（KB）
S0U | S0已经使用的大小（KB）
S1U | S1已经使用的大小（KB）
TT | Tenuring threshold，要了解这个参数，我们需要了解一点Java内存对象的结构，在Sun JVM中，（除了数组之外的）对象都有两个机器字（words）的头部。第一个字中包含这个对象的标示哈希码以及其他一些类似锁状态和等标识信息，第二个字中包含一个指向对象的类的引用，其中第二个字节就会被垃圾收集算法使用到。在新生代中做垃圾收集的时候，每次复制一个对象后，将增加这个对象的收集计数，当一个对象在新生代中被复制了一定次数后，该算法即判定该对象是长周期的对象，把他移动到老生代，这个阈值叫着tenuring threshold。这个阈值用于表示某个/些在执行批定次数youngGC后还活着的对象，即使此时新生的的Survior没有满，也同样被认为是长周期对象，将会被移到老生代中。
MTT | Maximum tenuring threshold，用于表示TT的最大值。
DSS | Desired survivor size (KB).可以参与这里：http://blog.csdn.net/yangjun2/article/details/6542357
EC | Eden space当前容量的大小（KB）
EU | Eden space已经使用的大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
YGCT | 从应用程序启动到采样时 Young GC 所用的时间(单位秒)

-gcnewcapacity | 新生代的存储容量情况
--- | ---
列名 | 说明
NGCMN | 新生代的最小容量大小（KB）
NGCMX | 新生代的最大容量大小（KB）
NGC | 当前新生代的容量大小（KB）
S0CMX | 新生代中SO的最大容量大小（KB）
S0C | 当前新生代中SO的容量大小（KB）
S1CMX | 新生代中S1的最大容量大小（KB）
S1C | 当前新生代中S1的容量大小（KB）
ECMX | 新生代中Eden的最大容量大小（KB）
EC | 当前新生代中Eden的容量大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
FGC | 从应用程序启动到采样时发生 Full GC 的次数

-gcold | 老生代及持久代发生GC的情况
--- | ---
列名 | 说明
PC | 当前持久代容量的大小（KB）
PU | 持久代使用容量的大小（KB）
OC | 当前老年代容量的大小（KB）
OU | 老年代使用容量的大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
FGC | 从应用程序启动到采样时发生 Full GC 的次数
FGCT | 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
GCT | 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

-gcoldcapacity | 老生代的存储容量情况
--- | ---
列名 | 说明
OGCMN | 老生代的最小容量大小（KB）
OGCMX | 老生代的最大容量大小（KB）
OGC | 当前老生代的容量大小（KB）
OC | 当前新生代的空间容量大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
FGC | 从应用程序启动到采样时发生 Full GC 的次数
FGCT | 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
GCT | 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

-gcpermcapacity | 从应用程序启动到采样时发生 Full GC 的次数，持久代的存储容量情况
--- | ---
列名 | 说明
PGCMN | 持久代的最小容量大小（KB）
PGCMX | 持久代的最大容量大小（KB）
PGC | 当前持久代的容量大小（KB）
PC | 当前持久代的空间容量大小（KB）
YGC | 从应用程序启动到采样时发生 Young GC 的次数
FGC | 从应用程序启动到采样时发生 Full GC 的次数
FGCT | 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
GCT | 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

-gcutil | 新生代、老生代及持代垃圾收集的情况
--- | ---
列名 | 说明
S0 | Heap上的 Survivor space 0 区已使用空间的百分比
S1 | Heap上的 Survivor space 1 区已使用空间的百分比
E | Heap上的 Eden space 区已使用空间的百分比
O | Heap上的 Old space 区已使用空间的百分比
P | Perm space 区已使用空间的百分比
YGC | 从应用程序启动到采样时发生 Young GC 的次数
YGCT | 从应用程序启动到采样时 Young GC 所用的时间(单位秒)
FGC | 从应用程序启动到采样时发生 Full GC 的次数
FGCT | 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
GCT | 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)，它的值等于YGC+FGC

-printcompilation | HotSpot编译方法的统计
--- | ---
列名 | 说明
Compiled | 编译任务执行的次数
Size | 方法的字节码所占的字节数
Type | 编译类型
Method | 指定确定被编译方法的类名及方法名，类名中使名“/”而不是“.”做为命名分隔符，方法名是被指定的类中的方法，这两个字段的格式是由HotSpot中的“-XX:+PrintComplation”选项确定的。


常用用法：  
`generalOption`
``` bash
jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcpermcapacity
-gcutil
-printcompilation
```
`outputOptions`
``` bash
# 查看pid为13772的类占用的内存
jstat -class 13772
Loaded  Bytes  Unloaded  Bytes     Time
  1850  3905.6        0     0.0       1.22
```

### 3. jps
简介：jps - Java Virtual Machine Process Status Tool
语法：`jps [ options ] [ hostid ]`
> - options  
Command-line options.
> - hostid  
The host identifier of the host for which the process report should be generated. The hostid may include optional components that indicate. the communications protocol, port number, and other implementation specific data.

常用用法：
``` bash
# 标准用法
jps
14826 Jps
14391 Bootstrap

# 仅查看pid
jps -q
14391
14836

# 查看完整类
jps -l
14900 sun.tools.jps.Jps
14391 org.apache.catalina.startup.Bootstrap

# 查看传递给类的参数
jps -m
14391 Bootstrap start
14981 Jps -m
```
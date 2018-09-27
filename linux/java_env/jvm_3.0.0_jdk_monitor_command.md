---
title: JVM: 3.0.0 jvm状态查看命令(JDK自带)
date: 2016-12-05 10:46:00
categories: linux/java_env
tags: [linux,java,stat]
---
### JVM: 3.0.0 jvm状态查看命令(JDK自带)

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

补充实例
``` bash
# jstat -gc vmid interval count
# 查看16009进程的各内存区域占用及gc情况，250ms一次，收集20次
jstat -gc 16009 250 20
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       PC     PU    YGC     YGCT    FGC    FGCT     GCT   
2560.0 2560.0  0.0   992.0  1393152.0 1094959.8 2796544.0   191228.2  262144.0 61116.1     95    1.107   0      0.000    1.107
2560.0 2560.0 1028.6  0.0   1393152.0 203113.7 2796544.0   192084.2  262144.0 61116.1     96    1.112   0      0.000    1.112
2560.0 2560.0 1028.6  0.0   1393152.0 938118.6 2796544.0   192084.2  262144.0 61116.1     96    1.112   0      0.000    1.112
2048.0 2560.0  0.0   928.0  1393152.0 240085.7 2796544.0   192976.8  262144.0 61116.1     97    1.117   0      0.000    1.117
2048.0 2560.0  0.0   928.0  1393152.0 910266.8 2796544.0   192976.8  262144.0 61134.0     97    1.117   0      0.000    1.117
2048.0 2048.0 1280.0  0.0   1394176.0 215747.2 2796544.0   193880.8  262144.0 61134.0     98    1.124   0      0.000    1.124
2048.0 2048.0 1280.0  0.0   1394176.0 853633.4 2796544.0   193880.8  262144.0 61134.2     98    1.124   0      0.000    1.124
2048.0 2048.0  0.0   1376.0 1394176.0 212152.5 2796544.0   194864.8  262144.0 61134.2     99    1.130   0      0.000    1.130
2048.0 2048.0  0.0   1376.0 1394176.0 887074.4 2796544.0   194864.8  262144.0 61134.2     99    1.130   0      0.000    1.130
2048.0 2048.0 1120.0  0.0   1394176.0 182373.2 2796544.0   195912.4  262144.0 61134.2    100    1.136   0      0.000    1.136
2048.0 2048.0 1120.0  0.0   1394176.0 990471.3 2796544.0   195912.4  262144.0 61134.2    100    1.136   0      0.000    1.136
2048.0 2048.0  0.0   1216.0 1394176.0 362706.0 2796544.0   196952.4  262144.0 61134.2    101    1.141   0      0.000    1.141
2048.0 2048.0  0.0   1216.0 1394176.0 1191005.5 2796544.0   196952.4  262144.0 61134.2    101    1.141   0      0.000    1.141
2048.0 2048.0 1344.0  0.0   1394176.0 598462.7 2796544.0   198056.4  262144.0 61134.2    102    1.148   0      0.000    1.148
2048.0 2048.0  0.0   1536.0 1394176.0   0.0    2796544.0   199256.4  262144.0 61134.2    103    1.155   0      0.000    1.155
2048.0 2048.0  0.0   1536.0 1394176.0 837905.3 2796544.0   199256.4  262144.0 61134.2    103    1.155   0      0.000    1.155
2048.0 6144.0 2033.4  0.0   1385984.0 210755.4 2796544.0   209344.4  262144.0 61134.3    104    1.174   0      0.000    1.174
2048.0 6144.0 2033.4  0.0   1385984.0 1042116.2 2796544.0   209344.4  262144.0 61134.3    104    1.174   0      0.000    1.174
6144.0 6144.0  0.0   1686.9 1385984.0 476307.6 2796544.0   209560.4  262144.0 61134.3    105    1.182   0      0.000    1.182
6144.0 5632.0 1792.0  0.0   1386496.0   0.0    2796544.0   211119.4  262144.0 61134.3    106    1.187   0      0.000    1.187

# jstat -gc vmid interval count
# 查看16009进程的各内存区域占用及gc情况，内存区域占用使用百分比形式输出结果，250ms一次，收集20次
jstat -gcutil 16009 250 20
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT   
  0.00  21.88  33.34   8.95  23.50    133    1.347     0    0.000    1.347
 22.66   0.00  15.33   8.98  23.50    134    1.352     0    0.000    1.352
  0.00  31.70   0.00   9.00  23.53    135    1.357     0    0.000    1.357
  0.00  31.70  81.63   9.00  23.53    135    1.357     0    0.000    1.357
 23.00   0.00  62.31   9.03  23.53    136    1.366     0    0.000    1.366
  0.00  25.00  44.33   9.06  23.53    137    1.370     0    0.000    1.370
 29.17   0.00  26.56   9.08  23.53    138    1.375     0    0.000    1.375
  0.00  32.29   8.65   9.11  23.53    139    1.381     0    0.000    1.381
  0.00  32.29  91.95   9.11  23.53    139    1.381     0    0.000    1.381
 31.25   0.00  73.50   9.14  23.53    140    1.386     0    0.000    1.386
  0.00  36.25  56.07   9.17  23.53    141    1.390     0    0.000    1.390
 62.33   0.00  37.90   9.19  24.07    142    1.396     0    0.000    1.396
  0.00  99.04  15.60   9.25  24.36    143    1.402     0    0.000    1.402
  0.00  99.04  93.77   9.25  24.36    144    1.402     0    0.000    1.402
 36.25   0.00  70.03   9.30  24.36    144    1.408     0    0.000    1.408
  0.00  35.84  50.60   9.34  24.37    145    1.415     0    0.000    1.415
 34.38   0.00  30.86   9.37  24.37    146    1.419     0    0.000    1.419
  0.00  34.38  12.22   9.40  24.37    147    1.426     0    0.000    1.426
 33.33   0.00   0.00   9.44  24.37    148    1.431     0    0.000    1.431
 33.33   0.00  77.94   9.44  24.37    148    1.431     0    0.000    1.431
```

---

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
# 可使用jps -v查看详细信息

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

---

### 4. jstack
``` bash
jstack 1534
2017-01-03 06:49:28
Full thread dump Java HotSpot(TM) 64-Bit Server VM (20.45-b01 mixed mode):

"Attach Listener" daemon prio=10 tid=0x00007fb0a0006800 nid=0x262c runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"ajp-8009-Acceptor-0" daemon prio=10 tid=0x00007fb0bc2ad000 nid=0xb4f runnable [0x00007fb0c0e63000]
   java.lang.Thread.State: RUNNABLE
        at org.apache.tomcat.jni.Socket.accept(Native Method)
        at org.apache.tomcat.util.net.AprEndpoint$Acceptor.run(AprEndpoint.java:1345)

"ajp-8009-CometPoller-0" daemon prio=10 tid=0x00007fb0bc300800 nid=0xb4e in Object.wait() [0x00007fb0c1054000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5ed17b0> (a org.apache.tomcat.util.net.AprEndpoint$Poller)
        at java.lang.Object.wait(Object.java:485)
        at org.apache.tomcat.util.net.AprEndpoint$Poller.run(AprEndpoint.java:1528)
        - locked <0x00000000f5ed17b0> (a org.apache.tomcat.util.net.AprEndpoint$Poller)

"ajp-8009-Poller-0" daemon prio=10 tid=0x00007fb0bc318800 nid=0xb4d in Object.wait() [0x00007fb0c1155000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5ed1848> (a org.apache.tomcat.util.net.AprEndpoint$Poller)
        at java.lang.Object.wait(Object.java:485)
        at org.apache.tomcat.util.net.AprEndpoint$Poller.run(AprEndpoint.java:1528)
        - locked <0x00000000f5ed1848> (a org.apache.tomcat.util.net.AprEndpoint$Poller)

"http-8080-Acceptor-0" daemon prio=10 tid=0x00007fb0bc0d4000 nid=0xb4c runnable [0x00007fb0c1256000]
   java.lang.Thread.State: RUNNABLE
        at org.apache.tomcat.jni.Socket.accept(Native Method)
        at org.apache.tomcat.util.net.AprEndpoint$Acceptor.run(AprEndpoint.java:1345)

"http-8080-Sendfile-0" daemon prio=10 tid=0x00007fb0bc052000 nid=0xb4b in Object.wait() [0x00007fb0c1446000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5e665e8> (a org.apache.tomcat.util.net.AprEndpoint$Sendfile)
        at java.lang.Object.wait(Object.java:485)
        at org.apache.tomcat.util.net.AprEndpoint$Sendfile.run(AprEndpoint.java:2002)
        - locked <0x00000000f5e665e8> (a org.apache.tomcat.util.net.AprEndpoint$Sendfile)

"http-8080-CometPoller-0" daemon prio=10 tid=0x00007fb0bc2a3800 nid=0xb4a in Object.wait() [0x00007fb0c1547000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5e66680> (a org.apache.tomcat.util.net.AprEndpoint$Poller)
        at java.lang.Object.wait(Object.java:485)
        at org.apache.tomcat.util.net.AprEndpoint$Poller.run(AprEndpoint.java:1528)
        - locked <0x00000000f5e66680> (a org.apache.tomcat.util.net.AprEndpoint$Poller)

"http-8080-Poller-0" daemon prio=10 tid=0x00007fb0bc2b8000 nid=0xb49 in Object.wait() [0x00007fb0c1648000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5e66718> (a org.apache.tomcat.util.net.AprEndpoint$Poller)
        at java.lang.Object.wait(Object.java:485)
        at org.apache.tomcat.util.net.AprEndpoint$Poller.run(AprEndpoint.java:1528)
        - locked <0x00000000f5e66718> (a org.apache.tomcat.util.net.AprEndpoint$Poller)

"ContainerBackgroundProcessor[StandardEngine[Catalina]]" daemon prio=10 tid=0x00007fb0bc2b3000 nid=0xb48 waiting on condition [0x00007fb0c1749000]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
        at java.lang.Thread.sleep(Native Method)
        at org.apache.catalina.core.ContainerBase$ContainerBackgroundProcessor.run(ContainerBase.java:1635)
        at java.lang.Thread.run(Thread.java:662)

"GC Daemon" daemon prio=10 tid=0x00007fb0bc267800 nid=0xa21 in Object.wait() [0x00007fb0c1854000]
   java.lang.Thread.State: TIMED_WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5b93108> (a sun.misc.GC$LatencyLock)
        at sun.misc.GC$Daemon.run(GC.java:100)
        - locked <0x00000000f5b93108> (a sun.misc.GC$LatencyLock)

"Low Memory Detector" daemon prio=10 tid=0x00007fb0bc088000 nid=0x698 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread1" daemon prio=10 tid=0x00007fb0bc085800 nid=0x697 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread0" daemon prio=10 tid=0x00007fb0bc083000 nid=0x696 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Signal Dispatcher" daemon prio=10 tid=0x00007fb0bc081000 nid=0x695 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Finalizer" daemon prio=10 tid=0x00007fb0bc065000 nid=0x65b in Object.wait() [0x00007fb0c2613000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5a354e8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:118)
        - locked <0x00000000f5a354e8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:134)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:171)

"Reference Handler" daemon prio=10 tid=0x00007fb0bc063000 nid=0x65a in Object.wait() [0x00007fb0c2714000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000f5a35588> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:485)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:116)
        - locked <0x00000000f5a35588> (a java.lang.ref.Reference$Lock)

"main" prio=10 tid=0x00007fb0bc007000 nid=0x60f runnable [0x00007fb0c340a000]
   java.lang.Thread.State: RUNNABLE
        at java.net.PlainSocketImpl.socketAccept(Native Method)
        at java.net.PlainSocketImpl.accept(PlainSocketImpl.java:408)
        - locked <0x00000000f5ed1910> (a java.net.SocksSocketImpl)
        at java.net.ServerSocket.implAccept(ServerSocket.java:462)
        at java.net.ServerSocket.accept(ServerSocket.java:430)
        at org.apache.catalina.core.StandardServer.await(StandardServer.java:430)
        at org.apache.catalina.startup.Catalina.await(Catalina.java:676)
        at org.apache.catalina.startup.Catalina.start(Catalina.java:628)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25)
        at java.lang.reflect.Method.invoke(Method.java:597)
        at org.apache.catalina.startup.Bootstrap.start(Bootstrap.java:289)
        at org.apache.catalina.startup.Bootstrap.main(Bootstrap.java:414)

"VM Thread" prio=10 tid=0x00007fb0bc05c000 nid=0x62e runnable

"VM Periodic Task Thread" prio=10 tid=0x00007fb0bc08b000 nid=0x699 waiting on condition

JNI global references: 950
```

---

### 5. jmap
简介： memory map for java，用于生成堆转储快照（heapdump文件）。
用法： jmap <options> vmid

选项|说明
---|---
-dump|生成java堆转储快照，格式为`jmap -dump:[live,]format=b,file=<filename>`，其中live参数说明是否只输出存活的对象
-finalizerinfo|显示在F-Queue中等待Finalizer线程执行finalize方法的对象。
-heap|显示java堆详细信息，如使用哪种回收器、参数设置、分代情况等。
-histo|显示堆中对象统计信息，包括类、实例数量、合计容量
-permstat|以ClassLoader为统计口径显示永久代内存状态。
-F|当虚拟机进程对-dump选项没有响应时，可使用这个选项强制生成dump快照。
> -dump和-histo是全平台，其他参数仅限linux/solaris系统。

``` bash
jmap -dump:format=b,file=heapdumpfile.bin 16009
Dumping heap to /home/heapdumpfile.bin ...
Heap dump file created


jmap -histo 16009|head -20

 num     #instances         #bytes  class name
----------------------------------------------
   1:       6485424     3125102320  [C
   2:       6230469      149531256  java.lang.String
   3:       3567271      114152672  java.util.HashMap$Entry
   4:         92458       69903496  [B
   5:        133276       53990712  [I
   6:       2163744       51929856  org.apache.commons.collections.map.ListOrderedMap$ListOrderedMapEntry
   7:        471105       36863656  [Ljava.lang.Object;
   8:        244953       32186352  [Ljava.util.HashMap$Entry;
   9:        415533       19945584  java.util.HashMap
  10:        121023       18848400  <constMethodKlass>
  11:        121023       15503984  <methodKlass>
  12:         10602       12984640  <constantPoolKlass>
  13:         10602        7703360  <instanceKlassKlass>
  14:          8776        7223168  <constantPoolCacheKlass>
  15:        297742        7145808  java.util.ArrayList
  16:         89105        7128400  java.lang.reflect.Method
  17:        135237        5409480  java.util.TreeMap$Entry
```
> dump出来的文件可以通过jhat工具分析，并以html格式查阅，但是一般很少直接在服务器上耗费资源来执行分析工具，一般都是拷贝出来，使用更人性化的第三方工具分析。比如说VisualVM，Eclipse Memory Analyzer，IBM HeapAnalyzer等工具。
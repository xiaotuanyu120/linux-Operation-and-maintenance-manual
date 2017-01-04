---
title: JVM: 2.1.0 调优实践
date: 2017-01-04 10:59:00
categories: linux/java_env
tags: [java,jvm]
---
### JVM: 2.1.0 调优实践

---

### 1. 锁定问题进程
#### 1) 监控OS资源
- `free -m` 查看内存资源使用情况
- `top` 查看整个系统的进程资源使用情况

#### 2) 根据进程号进行业务对应
根据上面的资源判断，会初步锁定几个进程号
``` bash
ps aux | grep pid
```
通过上面的命令将进程号和具体业务联系起来，判断是否近期做过代码更新或架构改动(网络或业务)

---

### 2. 锁定问题线程
下面的进程只是一个示例pid 5233
``` bash
top -H -p 5233
# 输出以下内容，根据cpu、mem和time排序，查看是否有异常的进程
top - 09:27:34 up  4:40,  3 users,  load average: 0.25, 0.07, 0.02
Tasks: 217 total,   0 running, 217 sleeping,   0 stopped,   0 zombie
Cpu(s):  0.4%us,  0.0%sy,  0.0%ni, 99.6%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:  16315680k total,  2505924k used, 13809756k free,    44396k buffers
Swap:  8224760k total,        0k used,  8224760k free,   191120k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND                                                                                        
 5292 root      20   0 16.9g 1.9g  12m S  0.0 12.5   1:35.52 java                                                                                            
 5259 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:32.12 java                                                                                            
 5258 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:31.21 java                                                                                            
 5342 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:28.30 java                                                                                            
 5234 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:10.69 java                                                                                            
 5290 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:09.39 java                                                                                            
 5340 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:09.32 java                                                                                            
 5345 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:05.63 java                                                                                            
 5367 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:04.97 java                                                                                            
 5346 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:04.36 java                                                                                            
 5253 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:04.02 java                                                                                            
 5371 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:03.59 java                                                                                            
 5464 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:03.16 java                                                                                            
 5386 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:03.09 java                                                                                            
 5461 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:03.06 java                                                                                            
 5395 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.71 java                                                                                            
 5354 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.59 java                                                                                            
 5369 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.56 java                                                                                            
 5408 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.50 java                                                                                            
 5403 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.36 java                                                                                            
 5348 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.24 java                                                                                            
 5405 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.21 java                                                                                            
 5353 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.18 java                                                                                            
 5261 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.17 java                                                                                            
 5390 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.14 java                                                                                            
 5373 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.09 java                                                                                            
 5416 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.07 java                                                                                            
 5381 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.06 java                                                                                            
 5349 root      20   0 16.9g 1.9g  12m S  0.0 12.5   0:02.03 java   
 # 按照time排序，发现有一个时间特别长的进程  
```

---

### 3. 查看线程具体信息
``` bash
# 通过jstack命令可以查看进程的栈信息
./jstack 5233|head
2017-01-04 09:26:11
Full thread dump Java HotSpot(TM) 64-Bit Server VM (20.6-b01 mixed mode):

"Attach Listener" daemon prio=10 tid=0x00007f5230001000 nid=0x17d7 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Thread-83" daemon prio=10 tid=0x00007f50b8010000 nid=0x1558 waiting on condition [0x00007f52142bc000]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
	at java.lang.Thread.sleep(Native Method)
	at org.apache.commons.pool.impl.GenericObjectPool$Evictor.run(GenericObjectPool.java:1080)
...
# 会输出该进程的所有线程及其状态，其中nid对应了该线程pid的16进制

# 获取5292线程的16位pid
echo "obase=16;5292"|bc
14AC
# 不同进制之间的转换命令
# http://www.cnblogs.com/chengmo/archive/2010/10/14/1851570.html

# 根据16进制的pid号搜索栈内存中的相应线程信息
./jstack 5233 |grep -A10 14ac
"chatCacheStoreTimer" prio=10 tid=0x00007f52a4aa9800 nid=0x14ac in Object.wait() [0x00007f52175c2000]
   java.lang.Thread.State: TIMED_WAITING (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x000000068d2c2c90> (a java.util.TaskQueue)
	at java.util.TimerThread.mainLoop(Timer.java:509)
	- locked <0x000000068d2c2c90> (a java.util.TaskQueue)
	at java.util.TimerThread.run(Timer.java:462)

"DefaultQuartzScheduler_QuartzSchedulerThread" prio=10 tid=0x00007f52a4a8f800 nid=0x14aa sleeping[0x00007f5217644000]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
	at java.lang.Thread.sleep(Native Method)
# 发现此线程是在等待状态，后面是一个循环
```

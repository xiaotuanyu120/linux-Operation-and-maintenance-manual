---
title: 调优: 1.1.0 TCP中的TIME_WAIT
date: 2017-02-07 16:56:00
categories: linux/advance
tags: [linux,tcp,time_wait]
---
### 调优: 1.1.0 TCP中的TIME_WAIT

---

### 1. 什么是TIME_WAIT?
TIME_WAIT是TCP连接中的一个状态，当TCP连接关闭之后，会在内存中维护一个控制块TCB，用来记录最近关闭连接的IP和端口，这类信息会维持一小段时间(最大分段使用期的2倍，2MSL)，以确保这段时间内不会有相同的IP和端口号的新连接，目的是为了预防，上一个连接的分组包延迟到达，而被新的连接接受而导致TCP流被破坏。此时TCP的状态就是TIME_WAIT。  
但是处于TIME_WAIT状态的TCP连接过多也会造成性能问题，比如我们的可用源端口只有60000个，而在2MSL(2分钟左右)内是无法被重用的，也就是说我们的tcp连接率就限制在了在60000/120 = 500次/秒。  
既然没有遇到端口耗尽的问题，在有大量TCP连接及内存中的TCB占据比例过大时，也会严重影响系统的性能。  
[参考文档资料](http://www.isi.edu/touch/pubs/infocomm99/infocomm99-web/)

---

### 2. TCP优化
``` bash
vim /etc/sysctl.conf
***************************************
# 开启SYN cookies，当syn队列溢出时，启用cookies来处理
net.ipv4.tcp_syncookies = 1
# 允许TIME_WAIT SOCKETS重新用于新的TCP连接
net.ipv4.tcp_tw_reuse = 1
# 开启TCP连接中的TIME_WAIT SOCKETS快速回收
net.ipv4.tcp_tw_recycle = 1
# 修改默认的timeout时间为30s
net.ipv4.tcp_fin_timeout = 30
***************************************

# 使配置立即生效
sysctl -p
```

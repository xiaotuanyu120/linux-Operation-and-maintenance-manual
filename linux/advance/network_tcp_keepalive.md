---
title: network: tcp keepalive (include versus with http keepalive)
date: 2018-06-25 12:57:00
categories: linux/advance
tags: [network,tcp]
---
### network: tcp keepalive (include versus with http keepalive)

---

### 1. 什么是[tcp keepalive](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/overview.html)？
tcp keepalive的含义就是字面含义，keep tcp alive。 启用它意味着我们可以检查tcp sockets是否依然保持连接。 当一个tcp被启动后，keepalive会初始化一系列timer，当一个timer变化为0时，本地的tcp就会发送一个ACK给peer，而peer的tcp如果依然有效，就会发送一个ACK回复。这样完成了一次检测，并依然保持tcp连接正常。这个机制在检测tcp是否连接时很有效，因为如果peer端的tcp断开，你能很快检测到，即使我们并没有在发送数据。。

### 2. 为什么要用tcp keepalive？
如果没有tcp keepalive，不会影响我们正常使用tcp。 所以，如果你在研究tcp keepalive，肯定是希望来研究它是否可以解决你的问题。  
tcp keepalive是非侵入式的一个方案，在大多数情况下，打开它并不会给你带来任何风险。但请记住它会产生额外的网络流量，这可能会对路由器和防火墙产生影响。  

tcp keepalive一般用于解决下面两个问题：
#### 1) 检查死掉的peers
tcp keepalive可以用于在peer节点不能通知你之前，它就死掉的情况。这种情况的原因有多种，例如linux内核panic错误或进程被强制终止。 另外一种场景可能是对方进程还存活，但是双方网络出现了问题，在这种情况下，如果网络不能恢复，也会出现同等的peer端tcp死亡的情况。这是正常的TCP操作无法检查连接状态的情况之一。  
假设我们拥有A和B两个节点，A发送SYN给B，B回复SYN/ACK给A，A回复ACK给B。此时，它们之间的tcp连接进入了一个稳定状态，tcp处在ESTABLISHED状态，此时双方都可以在这个channel上互相发送数据。 假设此时我们拔掉B节点的电源，B节点会瞬间死掉，并且无法通知A它已经死掉。 从A的角度来看，它已经做好和B通信的准备，并不知道B已经死掉。此时我们启动B的电源，等待系统重启。A和B的进程现在都已经就绪，但是A知道它和B有一个tcp连接，但是B已经不知道了。此时A尝试去给B发送数据时，B会回复RST标志，导致A最终关闭tcp连接。  
Keepalive可以避免对peer节点tcp断开误报的风险。 事实上，如果问题出现在两个peers之间的网络中，keepalive动作是等待一段时间，然后重试，在将连接标记为断开之前发送keepalive数据包。

#### 2) 预防由于网络不活动而导致的断开连接
tcp keepalive的另外一个主要用途是避免网络不活动导致连接断开。

### 3. 怎么使用tcp keepalive？
[如何在代码里面启用tcp keepalive，及linux内核参数介绍](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/usingkeepalive.html)

### 4. tcp keepalive vs http keepalive
个人总结，它们两个没有任何关系
- [answer in stackoverflow](https://stackoverflow.com/questions/9334401/http-keep-alive-and-tcp-keep-alive)
- [answer in quora](https://www.quora.com/How-does-http-keep-alive-works-whats-the-difference-between-tcp-keep-alive-and-http-keep-alive)

### 5. 如何查看程序是否使用了tcp keepalive
`netstat -o`
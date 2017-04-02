---
title: network: 理解TCP三次握手和四次挥手
date: 2016-08-02 08:36:00
categories: linux/advance
tags: [network,wireshark,tshark,tcp]
---
### network: 理解TCP三次握手和四次挥手

---

### 1. 安装wireshark和curl
``` bash
yum install wireshark curl -y
```
wireshark:抓包工具，负责抓取tcp连接过程中的封包
curl:网络访问工具，负责发起http访问

---

### 2. 抓取思路
先通过wireshark尝试抓取curl访问目标网站的封包，找出解析的ip
根据此ip来过滤出相关封包，以此来避免其他包混杂到我们的结果里，例如ssh连接封包

### 3. 抓取过程
#### 1) DNS请求过程
在另外一个terminal中执行<code>curl www.google.com</code>的同时,在当前terminal执行以下命令待命，会得到以下类似结果
``` bash
tshark -i eth1 |grep "DNS"
Running as user "root" and group "root". This could be dangerous.
Capturing on eth1
0.831905064 10.10.180.23 -> 10.10.210.3  DNS 75 Standard query 0x6379  A template.ig.com
0.832855189  10.10.210.3 -> 10.10.180.23 DNS 144 Standard query response 0x6379 No such name
0.912767746 10.10.180.23 -> 10.10.210.3  DNS 74 Standard query 0xa4fe  A www.google.com
0.912883870 10.10.180.23 -> 10.10.210.3  DNS 74 Standard query 0xc578  AAAA www.google.com
0.913856839  10.10.210.3 -> 10.10.180.23 DNS 102 Standard query response 0xc578  AAAA 2404:6800:4005:804::2004
0.913866732  10.10.210.3 -> 10.10.180.23 DNS 90 Standard query response 0xa4fe  A 216.58.203.4
```
10.10.210.3是我本机10.10.180.13的网关，本机通过和网关沟通，获取了www.google.com的dns地址

#### 2) tcp握手挥手包抓取过程
此时我们就可以通过域名(www.google.com)和ip(216.58.203.4)同时筛选出我们想要的结果，依旧是当前terminal中用tshark命令待命，另外一个terminal中执行<code>curl www.google.com</code>
``` bash
tshark -i eth1 |grep "216.58.203.4"
Running as user "root" and group "root". This could be dangerous.
Capturing on eth1
1.204415032  10.10.210.3 -> 10.10.180.23 DNS 90 Standard query response 0xe38f  A 216.58.203.4
1.210632617 10.10.180.23 -> 216.58.203.4 TCP 74 35944 > http [SYN] Seq=0 Win=14600 Len=0 MSS=1460 SACK_PERM=1 TSval=315183370 TSecr=0 WS=64
1.252280354 216.58.203.4 -> 10.10.180.23 TCP 74 http > 35944 [SYN, ACK] Seq=0 Ack=1 Win=42540 Len=0 MSS=1430 SACK_PERM=1 TSval=652383001 TSecr=315183370 WS=128
1.252310922 10.10.180.23 -> 216.58.203.4 TCP 66 35944 > http [ACK] Seq=1 Ack=1 Win=14656 Len=0 TSval=315183413 TSecr=652383001
1.252502322 10.10.180.23 -> 216.58.203.4 HTTP 241 GET / HTTP/1.1
1.294232971 216.58.203.4 -> 10.10.180.23 TCP 66 http > 35944 [ACK] Seq=1 Ack=176 Win=43648 Len=0 TSval=652383043 TSecr=315183413
1.295465786 216.58.203.4 -> 10.10.180.23 HTTP 545 HTTP/1.1 302 Found  (text/html)
1.295532090 10.10.180.23 -> 216.58.203.4 TCP 66 35944 > http [ACK] Seq=176 Ack=480 Win=15680 Len=0 TSval=315183456 TSecr=652383044
1.296258753 10.10.180.23 -> 216.58.203.4 TCP 66 35944 > http [FIN, ACK] Seq=176 Ack=480 Win=15680 Len=0 TSval=315183457 TSecr=652383044
1.339379760 216.58.203.4 -> 10.10.180.23 TCP 66 http > 35944 [FIN, ACK] Seq=480 Ack=177 Win=43648 Len=0 TSval=652383088 TSecr=315183457
1.339408390 10.10.180.23 -> 216.58.203.4 TCP 66 35944 > http [ACK] Seq=177 Ack=481 Win=15680 Len=0 TSval=315183500 TSecr=652383088
```

#### 3) 抓包结果总结

src ip | package | dest ip
--- | :---: | ---
| **three-way handshake** |
10.10.180.13 | - SYN(Seq=0) -> | 216.58.203.4
10.10.180.13 | <- SYN,ACK(Ack=1,Seq=0) - | 216.58.203.4
10.10.180.13 | - ACK(Seq=1,Ack=1) -> | 216.58.203.4
| **HTTP request** |
10.10.180.23 | - GET / HTTP/1.1 -> | 216.58.203.4
10.10.180.23 | <- ACK(Ack=176,Seq=1) - | 216.58.203.4
10.10.180.23 | <- HTTP/1.1 302 Found - | 216.58.203.4
| **four-way handshake** |
10.10.180.23 | - ACK(Seq=176,Ack=480) -> | 216.58.203.4
10.10.180.23 | - FIN,ACK(Seq=176,Ack=480) -> | 216.58.203.4
10.10.180.23 | <- FIN,ACK(Ack=177,Seq=480) - | 216.58.203.4
10.10.180.23 | - ACK(Seq=177,Ack=481) -> | 216.58.203.4

上表基本展示了一个标准的，三次握手创建连接，4次挥手关闭连接的过程

**seq和ack数字编号的含义**  
TCP会话的每一端都会维护一个32bit的序列号seq，该序列号seq用来跟踪该端发送的数据量，在接收端通过确认号ack用来通知数据接收成功  
当主机开启一个tcp会话时，seq号是随机的，是0-4,294,967,295之间的任意数值，但wireshark为了方便，都会显示给我们相对的seq和ack号，也就是上面我们看到的从0开始编号。

分析上面的三次握手过程  
客户端发送seq=0的包给服务端  
服务端发送ack=1，确认收到了1个包，然后seq=0（维护的是服务端发送数据的序列号）  
客户端发送ack=1确认收到了1个包，seq=1  

此时连接建立  
连接建立后，客户端发起正常请求，此处请求的是google服务器的根目录  
服务端发送ack=176确认收到1-176之间的包（包含客户端发送请求时的包），seq=1  
服务端返回客户端请求的数据  

总结来讲：  
seq是来计算自己发送数据包的序列号  
ack是来确认接收到对方的数据包的序列号  
---
title: nginx: 4.1.1 theory 获取真实客户端ip
date: 2017-09-20 17:47:00
categories: service/nginx
tags: [nginx]
---
### nginx: 4.1.1 theory 获取真实客户端ip

---

### 0. 前言
通过nginx为后端程序做反向代理，有时候客户端是通过 `代理1 - 代理2 - ... - 代理n - cdn - nginx`这个过程访问到nginx的。我们知道http的头中有一个变量叫做`$remote_addr`可以获取到发起http请求的直接ip(和服务器发生三次握手tcp连接的ip)，但是当客户端通过n多代理和cdn来访问的时候，`$remote_addr`代表的是和服务器真实发生三次握手的cdn或者代理的ip，而不是客户端的真实ip，此时，我们就需要额外两个变量`X-Forwarded-For`和`X-Real-IP`。
> 参考文档：[精品博客](http://www.wkii.org/nginx-cdn-get-user-real-ip.html)

---

### 1. X-Forwarded-For
X-Forwarded-For 是一个 HTTP 扩展头部。HTTP/1.1（RFC 2616）协议并没有对它的定义，它最开始是由 Squid 这个缓存代理软件引入，用来表示 HTTP 请求端真实 IP。如今它已经成为事实上的标准，被各大 HTTP 代理、负载均衡等转发服务广泛使用，并被写入 RFC 7239（Forwarded HTTP Extension）标准之中。

XFF的格式为：
```
X-Forwarded-For: client, proxy1, proxy2
```
XFF 的内容由「英文逗号 + 空格」隔开的多个部分组成，最开始的是离服务端最远的设备 IP，然后是每一级代理设备的 IP。（注意：如果未经严格处理，可以被伪造）

如果一个 HTTP 请求到达服务器之前，经过了三个代理 Proxy1、Proxy2、Proxy3，IP 分别为 IP1、IP2、IP3，用户真实 IP 为 IP0，那么按照 XFF 标准，服务端最终会收到以下信息：
```
X-Forwarded-For: IP0, IP1, IP2
```
Proxy3 直连服务器，它会给 XFF 追加 IP2，表示它是在帮 Proxy2 转发请求。列表中并没有 IP3，IP3 可以在服务端通过 Remote Address 字段获得。我们知道 HTTP 连接基于 TCP 连接，HTTP 协议中没有 IP 的概念，Remote Address 来自 TCP 连接，表示与服务端建立 TCP 连接的设备 IP，在这个例子里就是 IP3。Remote Address 无法伪造，因为建立 TCP 连接需要三次握手，如果伪造了源 IP，无法建立 TCP 连接，更不会有后面的 HTTP 请求。但是在正常情况下，web服务器获取Remote Address只会获取到上一级的IP，本例里则是proxy3 的 IP3。
> 转自http://www.wkii.org/nginx-cdn-get-user-real-ip.html

---

### 2. X-Real-IP
这又是一个自定义头部字段，通常被 HTTP 代理用来表示与它产生 TCP 连接的设备 IP，这个设备可能是其他代理，也可能是真正的请求端，这个要看经过代理的层级次数或是是否始终将真实IP一路传下来。（注意：如果未经严格处理，可以被伪造）
> 转自http://www.wkii.org/nginx-cdn-get-user-real-ip.html

---

### 3. 总结
获取客户端ip有一条铁律：  
**```
铁律：当多层代理或使用CDN时，如果代理服务器不把用户的真实IP传递下去，那么业务服务器将永远不可能获取到用户的真实IP。
```**

其他测试方法和nginx配置访问见转发原文

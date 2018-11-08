---
title: loadbalance: 1.1.0 cookie persistence
date: 2018-11-08 13:20:00
categories: service/proxy
tags: [loadbalance, f5, cookie persistence]
---
### loadbalance: 1.1.0 cookie persistence

### 0. 文章背景
最近参与了一个项目，算是甲方工程师，乙方要求使用F5做负载均衡，用了cookie sticky。我们领导不要，要使用软负载均衡，也做cookie sticky。之前一直对收费的F5没研究，趁着这个机会来看看F5的原理。文档主要是参照了F5官网的[这篇关于cookie persistence的文章](https://support.f5.com/csp/article/K83419154)

### 1. 关于此话题
Cookie持久化使用HTTP cookie强制执行持久化。与所有持久化模式一样，http cookie保证了在BIG-IP初始时负载均衡给client分配backend后，相同的client的请求会持续发送给同一个backend。如果这个backend不可用，则系统会做出一个新的负载均衡决定。

cookie持久化有四种方法。每一种方法都是独立的，并且它们一起提供了根据不同需求提供的多种选项。

### 2. cookie 持久化描述
cookie持久化包含下面四种持久化方法：

> **重要！**，F5推荐使用cookie的rewrite方法，而不是http cookie被动方法。

要使HTTP Cookie Passive方法成功，cookie必须来自Web服务器且包含相应的服务器信息。使用BIG-IP配置实用程序，您可以为cookie字符串生成一个模板，并自动添加编码，然后编辑模板以创建实际的cookie。

- cookie hash  
hash cookie到一个特定的backend。当client重新经过F5时，F5将其转回之前的backend。使用这个方法，web服务器必须要生成cookie。BIG-IP系统不会像使用HTTP Cookie Insert方法那样自动创建cookie。
- HTTP Cookie Insert  
使用HTTP Cookie Insert方法，client连接的服务器以插入HTTP响应头中的cookie的形式提供服务器信息。默认情况下，cookie名为`BIGipServer <pool_name>`，包括处理连接的backend的编码地址和端口。BIG-IP系统根据cookie持久性配置文件中的Expiration配置设置cookie的到期日期。HTTP Cookie Insert是cookie persistence的默认方法。
- HTTP Cookie Passive  
和其他持久化方法不同，BIG-IP不会在backend的响应中插入或搜索`Set-Cookie`首部。此方法不会尝试设置cookie。使用此方法，服务器提供cookie，使用正确的服务器信息和timeout格式化。
- HTTP Cookie Rewrite  
使用此方法，BIG-IP会拦截名为BIGipCookie的`Set-Cookie`首部，覆盖cookie的名称和值，然后发送给client。新cookie名为`BIGipServer <pool_name>`，它包含处理连接的backend服务器的地址和端口。

> 由于只是用于了解F5的配置，所以详细的配置和选项就不在这边赘述了，需要的可以参考[这篇关于cookie persistence的文章](https://support.f5.com/csp/article/K83419154)
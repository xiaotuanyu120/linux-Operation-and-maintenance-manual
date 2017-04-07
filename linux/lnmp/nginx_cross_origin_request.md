---
title: nginx: CORS-跨源资源分享
date: 2017-04-07 14:09:00
categories: linux/lnmp
tags: [nginx,cors]
---
### nginx: CORS-跨源资源分享

---

### 1. 什么是同源策略？
同源策略（Same Origin Policy）是一种约定，它是浏览器最核心也是最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能会受到影响。可以说Web是构建在同源策略的基础之上的，浏览器只是针对同源策略的一种实现。1995年，同源政策由 Netscape 公司引入浏览器。为了不让浏览器的页面行为发生混乱，浏览器提出了“Origin”（源）这一概念，来自不同 Origin的对象无法互相干扰。

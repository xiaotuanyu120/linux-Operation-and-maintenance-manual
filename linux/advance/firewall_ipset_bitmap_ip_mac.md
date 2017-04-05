---
title: firewall: ipset-bitmap:ip,mac
date: 2017-04-05 13:08:00
categories: linux/advance
tags: [linux,iptables,ipset,firewall]
---
### firewall: ipset-bitmap:ip,mac

---

### 0. 参考文档
[ipset Man 文档](http://ipset.netfilter.org/ipset.man.html)  
[gentoo 论坛关于ipset bitmap:ip,mac在iptables中规则的讨论](https://forums.gentoo.org/viewtopic-t-962562-start-0.html)  

---

### 1. 基础用法
``` bash
ipset create foo bitmap:ip,mac range 192.168.0.0/16
ipset add foo 192.168.1.1,12:34:56:78:9A:BC
ipset test foo 192.168.1.1
```

---

### 2. iptables中的规则写法
```
-A INPUT -p tcp -m set --match-set foo src,src --destination-port 443 -j ACCEPT
```
> 特别关注"src,src"，因为有ip和mac两个src

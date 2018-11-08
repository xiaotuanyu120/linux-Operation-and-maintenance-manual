---
title: nginx: 4.1.2 theory CORS-跨源资源分享
date: 2017-04-07 14:09:00
categories: service/nginx
tags: [nginx,cors]
---
### nginx: 4.1.2 theory CORS-跨源资源分享

---

### 1. 什么是同源策略？
同源策略（Same Origin Policy）是一种约定，它是浏览器最核心也是最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能会受到影响。可以说Web是构建在同源策略的基础之上的，浏览器只是针对同源策略的一种实现。1995年，同源政策由 Netscape 公司引入浏览器。为了不让浏览器的页面行为发生混乱，浏览器提出了“Origin”（源）这一概念，来自不同 Origin的对象无法互相干扰。  
[同源策略-文章](https://github.com/acgotaku/WebSecurity/blob/master/docs/content/Browser_Security/Same-Origin-Policy.md)  
[同源策略博客截图](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)  
[跨域访问授权方法](http://www.jianshu.com/p/f2ec1d6af047)

---

### 2. CORS-解决静态资源跨域请求问题
浏览器的同源策略有时候会导致A域名无法调用B域名的某些资源，这个在chrome浏览器的F12工具的console中会看到相应的跨源请求报错
#### nginx中的解决方案
``` bash
# 针对单个域名放开
location ~* \.(ttf|ttc|otf|eot|woff|font.css)$ {
    # 允许谁跨域访问，不推荐使用*,不安全。
    add_header Access-Control-Allow-Origin  http://backend.test.com;
}

# 针对多个域名放开
location ~* \.(ttf|ttc|otf|eot|woff|font.css)$ {
    if ($http_origin = 'http://backend.test.com') {
        add_header 'Access-Control-Allow-Origin' "$http_origin";
    }
    if ($http_origin = 'http://wap.test.com') {
        add_header 'Access-Control-Allow-Origin' "$http_origin";
    }
}
```

---
title: nginx: 7.3.0 在location里面匹配parameters
date: 2018-07-30 11:07:00
categories: service/nginx
tags: [nginx]
---
### nginx: 7.3.0 在location里面匹配parameters

---

### 0. 前言
nginx支持在location的匹配里面直接匹配parameter，但是可以使用`$request_uri`或`$args`匹配parameter，然后使用error_page或者rewrite的方式达到这个效果。[Stack Overflow 参考文档](https://serverfault.com/questions/811912/can-nginx-location-blocks-match-a-url-query-string)

---

### 1. 通过`$request_uri`或`$args`匹配parameter
#### 1) 希望达到的效果
访问`www.abc.com？testip=1.2.3.4`，因为含有testip这个parameter，则做出相应动作。

#### 2) 示例
```
server {
    ...

    location @testip {
        some_nginx_logic_here;
    }
    
    location / {
        error_page 301 = @testip;
        if ($args ~ .*testip=.*) {return 301;}
        
        ...
    }
}
```
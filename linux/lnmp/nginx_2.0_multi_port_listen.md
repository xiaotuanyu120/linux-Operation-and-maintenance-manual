---
title: nginx: 2.0 同时监听http和https
date: 2016-12-14 14:58:00
categories: linux/lnmp
tags: [nginx]
---
### nginx: 2.0 同时监听http和https

---

### 1. nginx配置
```
server {
    listen 6116;
    listen 443 ssl;
    server_name _;
    ssl_certificate     www.test.vip.crt;
    ssl_certificate_key www.test.vip.key;
    location / {
      ...
            }
    }
```
重点配置：
- https端口后面增加ssl，`listen 443 ssl`，相当于省略`ssl on`
- 之所以不加`ssl on`，是因为此配置会影响http端口的正常监听

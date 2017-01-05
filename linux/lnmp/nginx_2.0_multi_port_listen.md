---
title: nginx: 2.0 同时监听http和https
date: 2016-12-14 14:58:00
categories: linux/lnmp
tags: [nginx]
---
### nginx: 2.0 同时监听http和https

---

### 1. nginx配置
下面的示例是，nginx给tomcat做反向代理
```
upstream tomcat {
    server 127.0.0.1:6256;
    server 127.0.0.1:6266;
    server 127.0.0.1:6276;
}

server {
    listen 6116;
    listen 4433 ssl;
    server_name _;
    ssl_certificate     www.test.vip.crt;
    ssl_certificate_key www.test.vip.key;
    location / {
                proxy_pass http://tomcat;
                index index.jsp index.htm index.html;
                proxy_redirect off;
                proxy_set_header Host $host:$server_port;
                proxy_headers_hash_max_size 51200;
                proxy_headers_hash_bucket_size 6400;
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $http_x_forwarded_for;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
    }
```
重点配置：
- https端口后面增加ssl，`listen 4433 ssl`，相当于省略`ssl on`
- 之所以不加`ssl on`，是因为此配置会影响http端口的正常监听
- `proxy_set_header Host $host:$server_port`可以将正确的端口传递给tomcat(只是在用ip访问此host的情况，如果域名的话，不用增加)

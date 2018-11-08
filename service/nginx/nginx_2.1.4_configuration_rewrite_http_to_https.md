---
title: nginx: 2.1.4 configuration rewrite http到https
date: 2017-03-09 14:04:00
categories: service/nginx
tags: [nginx,rewrite]
---
### nginx: 2.1.4 configuration rewrite http到https

---

### 1. 示例配置及简要解释
#### 1) 示例配置
``` bash
server {
        listen 80 default_server;
        server_name _;
        return 301 https://$host$request_uri;
       }
```

#### 2) 简要解释
[$host变量说明](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_host)
[$request_uri变量说明](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_uri)

> 不要混淆$server_name和$host，server_name就是我们配置的该server块的变量


---
title: nginx: 2.1.5 configuration proxy_pass with URI
date: 2018-11-08 15:15:00
categories: service/nginx
tags: [nginx,rewrite]
---
### nginx: 2.1.5 configuration proxy_pass with URI

### 1. proxy_pass with URI
A request URI is passed to the server as follows:

If the proxy_pass directive is specified with a URI, then when a request is passed to the server, the part of a normalized request URI matching the location is replaced by a URI specified in the directive:
```
location /name/ {
    proxy_pass http://127.0.0.1/remote/;
}
```

If proxy_pass is specified without a URI, the request URI is passed to the server in the same form as sent by a client when the original request is processed, or the full normalized request URI is passed when processing the changed URI:
```
location /some/path/ {
    proxy_pass http://127.0.0.1;
}
```
Before version 1.1.12, if proxy_pass is specified without a URI, the original request URI might be passed instead of the changed URI in some cases.

> - proxy_pass包含URI可能遇到404: [proxy_pass return 404 error](http://stackoverflow.com/questions/16157893/nginx-proxy-pass-404-error-dont-understand-why)
- 更多官方文档参照: [nginx proxy module doc](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)
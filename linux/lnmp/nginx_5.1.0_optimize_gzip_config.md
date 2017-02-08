---
title: nginx: 5.1.0 配置gzip
date: 2017-02-08 10:11:00
categories: linux/lnmp
tags: [nginx,gzip]
---
### nginx: 5.1.0 配置gzip

---

### 1. 示例配置及简要解释
#### 1) 示例配置
``` bash
gzip on;
gzip_static on;
gzip_min_length  1k;
gzip_buffers     4 16k;
gzip_http_version 1.0;
gzip_comp_level 6;
gzip_proxied any;
gzip_types  
    text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
    text/javascript application/javascript application/x-javascript
    text/x-json application/json application/x-web-app-manifest+json
    text/css text/plain text/x-component
    font/opentype application/x-font-ttf application/vnd.ms-fontobject
    image/x-icon image/jpeg image/gif image/png;
gzip_disable "MSIE [1-6]\.(?!.*SV1)";
```
#### 2) 简要解释
- `gzip on;`  
打开gzip压缩功能
- `gzip_static on;`  
支持使用之前已经压缩过的文件响应请求，如果不存在，则正常压缩返回请求。用来降低cpu消耗
- `gzip_min_length  1k;`  
配置需要压缩的请求长度底限，根据Content-Length的数值来判断
- `gzip_buffers     4 16k;`  
gzip_buffers number size;  
number是size的个数，size是数据大小单位，用于申请内存
- `gzip_http_version 1.0;`  
配置需要压缩的最低http协议版本
- `gzip_comp_level 6;`  
压缩级别1-9，数字越大，压缩越狠，同时对cpu的消耗越大
- `gzip_proxied any;`  
对所有的代理请求进行压缩
- `gzip_types`  
需要压缩的MIME类型列表
- `gzip_disable "MSIE [1-6]\.(?!.*SV1)";`  
筛选掉IE6浏览器

---
title: nginx: 3.1.0 https优化
date: 2017-01-13 08:58:00
categories: linux/lnmp
tags: [nginx]
---
### nginx: 3.1.0 https优化

---

### 1. 优化ssl认证的CPU计算消耗
SSL 的运行计算需要消耗额外的 CPU 资源，一般多核处理器系统会运行多个工作进程(worker processes )，进程的数量不会少于可用的 CPU 核数。SSL 通讯过程中『握手』阶段的运算最占用 CPU 资源，有两个方法可以减少每台客户端的运算量：

- 激活 [keepalive](http://nginx.org/en/docs/http/ngx_http_core_module.html#keepalive_timeout) 长连接，一个连接发送更多个请求
- 复用 SSL 会话参数，在并行并发的连接数中避免进行多次 SSL『握手』

这些会话会存储在一个 SSL 会话缓存里面，通过命令 [ssl_session_cache](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache) 配置，可以使缓存在机器间共享，然后利用客戶端在『握手』阶段使用的 seesion id 去查询服务端的 session cathe(如果服务端设置有的话)，简化『握手』阶段。

1M 的会话缓存大概包含 4000 個会话，默认的缓存超时时间为 5 分钟，可以通过使用 [ssl_session_timeout](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_timeout) 命令设置缓存超时时间。

示例配置
``` bash
worker_processes auto;
http {
    #配置共享会话缓存大小
    ssl_session_cache   shared:SSL:10m;
    #配置会话超时时间
    ssl_session_timeout 10m;
    server {
        listen              443 ssl;
        server_name         www.example.com;
        #设置长连接
        keepalive_timeout   70;
        ssl_certificate     www.example.com.crt;
        ssl_certificate_key www.example.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        #...
```

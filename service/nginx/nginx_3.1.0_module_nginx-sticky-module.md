---
title: nginx: 3.1.0 module - nginx-sticky-module
date: 2018-11-07 16:11:00
categories: service/nginx
tags: [nginx]
---
### nginx: 3.1.0 module - nginx-sticky-module

---

### 0. 为什么需要sticky模块？
这里牵扯到了负载均衡中会话保持的知识。这里的sticky是基于cookie来将同一个用户的请求sticky到同一个后端服务的方法。
> 关于会话保持，可以参照:
- [F5中的cookie粘连](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/service/proxy/loadbalance_1.1.0_F5_cookie_persistence.md)
- [](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/java/tomcat/tomcat_5.1.2_session_sharing_by_using_redis.md)

### 1. nginx自带的sticky模块
nginx社区版是不包含sticky模块的，只有nginx企业版(nginx plus)才包含这个模块。
> - [关于找不到sticky模块的讨论社区 - nginx plus才有sticky](http://mail.wso2.org/mailarchive/dev/2015-August/053143.html)
- [nginx sticky官方文档](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#sticky)

### 2. nginx-sticky-module-ng
> 此模块老的版本是nginx-sticky-module，但是那个模块已经不更新了，所有有人fork了一个新版本[nginx-sticky-module-ng](https://bitbucket.org/nginx-goodies/nginx-sticky-module-ng)，目前收录在了[nginx第三方模块的列表](https://www.nginx.com/resources/wiki/modules/)中。

基于cookie将请求转发至同一个upstream服务器的nginx模块。当upstream拥有多个server时，将同一个client的请求发送至同一个server是很有必要的。这属于会话保持，其中cookie粘连是其中一种。还有一种通过ip地址的方法(ip_hash)，这种方法并不适用于所有情况，因为有可能大量的用户通过同一个代理ip来请求。这种情况下，负载均衡分配给不同server的压力可能就会不平衡。

当某个请求被接收，而sticky module无法被应用时，nginx会切换回经典的轮询方式来处理或者返回"Bad Gateway"(取决于no_fallback的配置)。

当浏览器不支持cookie时，sticky module是不会起作用的。

### 3. nginx-sticky-module-ng installation
``` bash
# 首先下载nginx-sticky-module-ng并解压，然后在编译nginx的时候，用--add-module参数指定其路径
./configure ... --add-module=/absolute/path/to/nginx-sticky-module-ng
make
make install
```

### 4. nginx-sticky-module-ng usage
```
upstream {
  sticky;
  server 127.0.0.1:9000;
  server 127.0.0.1:9001;
  server 127.0.0.1:9002;
}

  sticky [name=route] [domain=.foo.bar] [path=/] [expires=1h] 
       [hash=index|md5|sha1] [no_fallback] [secure] [httponly];
```

- name: cookie名称，默认是route。
- domain: cookie生效的域名，默认为nothing，让浏览器来管理。
- path: cookie生效的URL路径，默认是/。
- expires: cookie过期时间，默认是nothing，它是一个session cookie。有一个限制是必须要大于一秒钟。
- hash: 储存upstream中server的编码方法，不可以和hmac一起用。默认是md5
    - md5|sha1: 常用的哈希
    - index: 不使用哈希，而是在内存中维护一个索引。重点需要留意的是，索引中upstream的server和cookie的对应并不是一直持续的。当reload时，如果upstream中server更动过，index方法无法保证维护的索引和之前一样。仅在你了解并确定要使用这个方法时使用它。
- hmac: 使用HMAC哈希机制来编码upstream中server，它像一种哈希机制，但是它使用hmac_key来加密。不可与hash共用。默认是none
- hmac_key: hmac使用的key，必须和hmac成对使用。默认是nothing。
- no_fallback: 当设定了这个参数，当带cookie的request进来后对应的后端无响应时，nginx直接返回502 (Bad Gateway or Proxy Error) 。
- secure: 启用安全cookie，仅通过https传输。
- httponly: 使cookie不会通过js泄露。

> **issues and warnings:**
> - 当给同一个domain配置不同带sticky的upstream并指向不同的location时，使用不同的path配置。详细可查看[这里](https://bitbucket.org/nginx-goodies/nginx-sticky-module-ng/issues/7/leaving-cookie-path-empty-in-module)
- sticky模块不可以和server的backup配置一起使用
- sticky模块可以与nginx_http_upstream_check_module一起使用（从版本1.2.3开始）
- sticky模块可能需要使用SSL支持配置nginx（使用secure参数时）

> **production note:**
> - 使用了原版的nginx-module-sticky，结果和nginx1.14版本一起用时有问题，换了nginx-module-sticky-ng恢复正常。但是还是有一个问题，get时可以保持同一个server，但是post时会随机切换，不懂这个原理，因为没有影响业务，就没有深究。
- 使用了多层nginx代理，nginx-nodejs-nginx-tomcat，都启用了sticky，最开始是不正常的，当给sticky中的cookie名称设定为非默认的name，让不同nginx有不同的cookie名称时正常了。
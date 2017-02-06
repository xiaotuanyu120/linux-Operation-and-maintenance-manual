---
title: nginx: 4.1.0 server_name-"_"误解
date: 2017-02-06 08:58:00
categories: linux/lnmp
tags: [nginx,server_name]
---
### nginx: 4.1.0 server_name-`_`误解

---

### 1. 官方示例
官方的catch-all示例
```
server {
    listen       80  default_server;
    server_name  _;
    return       444;
}
```
之前一直有一个误解就是`_`代表的是ip地址，但是按照[官方的解释](http://nginx.org/en/docs/http/server_names.html)：  
There is nothing special about this name, it is just one of a myriad of invalid domain names which never intersect with any real name. Other invalid names like “--” and “!@#” may equally be used.  
这个名称只是一个不与任何我们监听的有效域名有关的其他所有的无效域名，nginx同时通过端口后的default_server来与这个server_name配合，这样我们就可以达到了catch-all的目的。

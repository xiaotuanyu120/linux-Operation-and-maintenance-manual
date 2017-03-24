---
title: rsync 1.1.0 error: max connections reached
date: 2017-03-24 13:49:00
categories: linux/advance
tags: [rsync,error]
---
### rsync 1.1.0 error: max connections reached

---

### 0. 理论
[rsync man 文档](https://download.samba.org/pub/rsync/rsyncd.conf.html)  
> max connections
This parameter allows you to specify the maximum number of simultaneous connections you will allow. Any clients connecting when the maximum has been reached will receive a message telling them to try later. The default is 0, which means no limit. A negative value disables the module. See also the "lock file" parameter.  
lock file
This parameter specifies the file to use to support the "max connections" parameter. The rsync daemon uses record locking on this file to ensure that the max connections limit is not exceeded for the modules sharing the lock file. The default is /var/run/rsyncd.lock.

---

### 1. 错误信息和解决办法
#### 1) 错误信息
``` bash
@ERROR: max connections (1) reached - try again later
```

#### 2) 解决办法
按照官方文档上的介绍，这个错误是因为有最大连接数的限制造成的，那干脆就将其设置为0，意为无限制
``` bash
max connections = 0
```

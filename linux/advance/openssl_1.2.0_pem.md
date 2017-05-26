---
title: openssl 1.2.0 pem基本操作
date: 2017-05-26 10:34:00
categories: linux/advance
tags: [openssl,pem]
---
### openssl 1.2.0 pem基本操作

---

### 0. pem基本操作
#### 1) 生成新的请求认证pem文件
``` bash
openssl req -newkey rsa:1024 -nodes -keyout req-key.pem -out req.pem
```
- `req` openssl的请求认证签名部分
- `-new` 生成新的认证请求，如果指定`-key`的话会同时生成新的私钥
- `-newkey` 生成新的认证请求，同时生成新的私钥
- `rsa:1024` rsa是私钥格式，1024是私钥长度
- `-nodes` 无私钥短语保护，不推荐
- `-keyout key.pem` 指定私钥文件
- `-out req.pem` 指定认证文件
> 可用于跟商业证书签名机构申请证书签名

#### 2) 生成自签名key
``` bash
openssl req -x509 -days 365 -nodes -newkey rsa:1024 -keyout key.pem -out cert.pem
```
> 自签名的证书浏览器不会认证，需要用户自己负责

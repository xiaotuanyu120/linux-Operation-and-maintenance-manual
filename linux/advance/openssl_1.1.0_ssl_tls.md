---
title: openssl 1.1.0 证书相关名词含义
date: 2017-05-26 10:34:00
categories: linux/advance
tags: [openssl,pem]
---
### openssl 1.1.0 证书相关名词含义

---

### 0. 参考链接
- [pem文件介绍](http://how2ssl.com/articles/working_with_pem_files/)
- [openssl命令文档](http://how2ssl.com/articles/openssl_commands_and_tips/)
- `man req`
- [x.509 wiki](https://en.wikipedia.org/wiki/X.509)
- [ssl & tls wiki](https://en.wikipedia.org/wiki/Transport_Layer_Security)
- [ssl support](https://support.ssl.com/Knowledgebase/Article/View/19/0/der-vs-crt-vs-cer-vs-pem-certificates-and-how-to-convert-them)
- [证书的工作原理](https://www.digicert.com/ssl.htm)

---

### 1. SSL相关概念含义介绍
#### 1) SSL
SSL(Secure Sockets Layer)是一种加密协议，在SSL发展到SSL v3.0之后，使用TLS(Transport Layer Security)代替了SSL v4.0的叫法，但是因为SSL已经广泛流传，所以有些还是沿用SSL的叫法。

#### 2) TLS
见第一条

#### 3) X.509
X.509是密码学中的一种公钥认证标准。很多协议使用了X.509标准，包括TLS/SSL，基于此才实现了HTTPS。

#### 4) DER
DER是一种编码规则，也用做扩展名。很多加密标准使用了ASN.1来定义数据结构，然后用DER来序列化那些数据结构。但是DER的编码规则产出的是二进制格式的文件，但有些软件只支持ASCII码，所以pem就出现了。

#### 5) pem
- pem是一种用于存储加密的key、证书和其他数据常用的文件格式。使用base64对DER编码的二进制数据进行编码得到了pem格式的文件  

- 文件格式
  ```
  -----BEGIN CERTIFICATE-----
  编码过的信息
  -----END CERTIFICATE-----
  ```

- 后缀名  
pem可以保存为".pem",".crt",".cer"后缀的文件中(为了认证)，也可以保存在".key"后缀文件中(为了储存私钥)。其实我们可以保存pem信息为任意后缀名称，因为系统对pem文件的识别是通过开头和结尾的label而不是后缀名。将其保存在各种特定的后缀中主要是为了对人和软件的友好。

- pem文件可以包含多个pem信息段

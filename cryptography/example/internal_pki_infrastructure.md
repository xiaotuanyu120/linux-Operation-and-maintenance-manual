---
title: 自建内部PKI体系-cfssl
date: 2018-01-09 17:10:00
categories: cryptography/example
tags: [cryptography,pki,cfssl]
---
### 自建内部PKI体系-cfssl

## 准备环境
hostname|ip|角色
---|---|---
node01|192.168.33.101|ca server
node02|192.168.33.102|ca client

## 一、PKI CA服务端
### 1. 证书包含了什么内容？
证书包含了拥有者的部分信息，公钥，CA签名。
> 每一个公钥和一个私钥联系在一起，私钥是owner自己保存，私钥的签名，公钥可以打开。

### 2. 自建pki的关键
- 一个合格的pki工具，这里我们用cfssl
- 保证做ca用的私钥的绝对安全，任何拥有这个key的人可以做一个ca和处理认证请求。（可以保存在 Hardware Security Modules (HSMs)确保私钥安全.）

### 3. 安装cfssl
``` bash
curl -s -L -o /usr/local/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
curl -s -L -o /usr/local/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
chmod +x /usr/local/bin/{cfssl,cfssljson}
```

### 4. 准备CA private key 和 certificate
创建ca-csr.json模板文件
``` bash
cfssl print-defaults csr > ca-csr.json
```
此时我们得到的模板文件内容
``` json
{
    "CN": "example.net",
    "hosts": [
        "example.net",
        "www.example.net"
    ],
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "C": "US",
            "L": "CA",
            "ST": "San Francisco"
        }
    ]
}
```
> ecdsa是椭圆曲线加密算法

修改相应内容为
``` json
{
    "CN": "commanname-domain.net",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "country",
            "L": "location",
            "O": "organization",
            "OU": "organization unit",
            "ST": "state"
        }
    ]
}
```
生成ca文件
``` bash
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
2018/01/10 01:40:30 [INFO] generating a new CA key and certificate from CSR
2018/01/10 01:40:30 [INFO] generate received request
2018/01/10 01:40:30 [INFO] received CSR
2018/01/10 01:40:30 [INFO] generating key: rsa-2048
2018/01/10 01:40:30 [INFO] encoded CSR
2018/01/10 01:40:30 [INFO] signed certificate with serial number 469763942862609470040121325446284354430448261745
```
> 生成了以下三个文件：
- ca.csr: CERTIFICATE REQUEST(是用来让另外的CA来签名的)
- ca-key.pem: RSA PRIVATE KEY
- ca.pem: CERTIFICATE

> 运行一个CA服务端最少需要private key 和 certificate

### 5. 签名配置文件config_ca.json
创建config_ca.json模板文件
``` bash
cfssl print-defaults config > ca-config.json
```
此时我们得到的模板文件内容
``` json
{
    "signing": {
        "default": {
            "expiry": "168h"
        },
        "profiles": {
            "www": {
                "expiry": "8760h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth"
                ]
            },
            "client": {
                "expiry": "8760h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "client auth"
                ]
            }
        }
    }
}
```
生成hex key
``` bash
hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random
```
修改模板文件为
``` json
{
  "signing": {
    "default": {
      "auth_key": "key1",
      "expiry": "8760h",
      "usages": [
         "signing",
         "key encipherment",
         "server auth"
       ]
     }
  },
  "auth_keys": {
    "key1": {
      "key": "your hex 16 digit key",
      "type": "standard"
    }
  }
}
```

### 6. 运行ca服务
``` bash
cfssl serve -ca-key ca-key.pem -ca ca.pem -config ca-config.json -address=0.0.0.0 -port=8888
```


## 二、PKI CA 客户端
### 1. 处理认证请求
客户端通过certificate signing request(CSR)和CA中心交互来获得认证。  
每个CSR包含：
- 发起认证请求的org信息
- 公钥
- 请求者的私钥


给定CSR，证书颁发机构（CA）可以创建一个证书。首先验证请求者是否拥有对相关私钥的控制权。它通过检查CSR的签名来做到这一点。然后，CA将检查请求方是否应该获得证书以及应该对哪个域名/IP有效。这可以通过数据库查询或通过注册机构完成。如果一切都检查无误，CA使用其私钥来创建并签署证书并发回给请求者。

### 2. 发起证书请求
**以下操作在客户端上进行操作**  
主要用到了cfssl的两个命令`gencert`,`sign`。  
`gencert`命令将自动处理整个证书生成过程。它将创建您的私钥，生成CSR，将CSR发送给CA进行签名并返回您的签名证书。  

此处，我们需要两个文件，一个是`csr_client.json`，它储存了org的基本信息，来填充到证书申请的CSR请求中。
``` json
{
  "hosts": [
    	"db1.mysite.com",
      "192.168.33.102"
  ],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "some country",
      "L": "some city",
      "O": "some company",
      "OU": "some organization units",
      "ST": "some state"
    }
  ]
}
```

另外，我们需要一个ca的客户端配置文件`config_client.json`，用来告诉ca服务器在哪里
``` json
{
  "signing": {
    "default": {
      "auth_remote" : {
        "auth_key": "key1",
        "remote": "caserver"
      }
    }
  },
  "auth_keys": {
    "key1": {
    "key": "16 byte hex API key here",
    "type": "standard"
    }
  },
  "remotes": {
    "caserver": "192.168.33.101:8888"
  }
}
```
发起请求
``` bash
cfssl gencert -config config_client.json csr_client.json | cfssljson -bare client
```
此时我们获取到了三个文件
```
client.csr  client-key.pem  client.pem
```
CSR可以重新提交给CA，在任何时候用sign命令重新签名
``` bash
cfssl sign -config config_client.json client.csr | cfssljson -bare client-new
```
此时会生成两个文件
```
client-new.csr client-new.pem
```
> client-new.csr和原来的client.csr一样

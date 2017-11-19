---
title: ssl: generate key by cfssl
date: 2017-11-16 10:19:00
categories: linux/advance
tags: [ssl,cfssl]
---
### ssl: generate key by cfssl

---

### 0. 前言
[cfssl使用说明](https://github.com/coreos/docs/blob/master/os/generate-self-signed-certificates.md)

---

### 1. cfssl生成ssl证书
#### 1) 下载cfssl
``` bash
mkdir ~/bin
curl -s -L -o ~/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
curl -s -L -o ~/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
chmod +x ~/bin/{cfssl,cfssljson}
export PATH=$PATH:~/bin
```
#### 2) 初始化证书授权
``` bash
mkdir ~/cfssl
cd ~/cfssl
cfssl print-defaults config > ca-config.json
cfssl print-defaults csr > ca-csr.json
```
#### 3) 配置CA（证书授权）选项
`ca-config.json`
``` json
{
    "signing": {
        "default": {
            "expiry": "43800h"
        },
        "profiles": {
            "www": {
                "expiry": "43800h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth"
                ]
            }
        }
    }
}

```
`ca-csr.json`
``` json
{
    "CN": "test.net",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
          "C": "PH",
          "L": "MNL",
          "O": "My Company Name",
          "ST": "office location",
          "OU": "Org Unit 1",
          "OU": "Org Unit 2"
        }
    ]
}
```
#### 4) 根据配置生成CA（证书授权）
``` bash
cfssl gencert -initca ca-csr.json | cfssljson -bare ca -
```
> 得到三个文件  
ca-key.pem  
ca.csr  
ca.pem - 最重要的文件，可以用它生成任何认证文件  

#### 5) 生成服务器用的www的证书
生成默认配置
``` bash
cfssl print-defaults csr > www.json
```
修改配置
```
{
    "CN": "example.net",
    "hosts": [
        "172.16.31.202",
        "202.95.237.20"
    ],
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "C": "PH",
            "L": "CA",
            "ST": "MNL"
        }
    ]
}
```
> hosts里面是服务器ip，是一个列表

生成证书
``` bash
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=www www.json | cfssljson -bare www
```
> 获得三个文件  
www.csr  
www-key.pem  
www.pem
(www.pem和www-key.pem可以直接在nginx里面使用)

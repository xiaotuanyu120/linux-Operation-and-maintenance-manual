---
title: coreos 2.4.0 生成ssl/tls自签名认证证书
date: 2017-08-11 09:59:00
categories: virtualization/container
tags: [cfssl,coreos]
---
### coreos 2.4.0 生成ssl/tls自签名认证证书

---

### 0. 生成ssl/tls认证证书之前
本文参照的是coreos官网的文档[生成自签名认证证书](https://github.com/coreos/docs/blob/master/os/generate-self-signed-certificates.md)，coreos推荐使用的工具是cfssl:，这是CloudFlare公司开源的PKI/TLS瑞士军刀，详细可参照其[开源项目地址](https://github.com/cloudflare/cfssl)。
> 除了cfssl，还有easyrsa和openssl也是生成认证证书的工具

---

### 1. 安装cfssl工具
``` bash
# 下载cfssl
mkdir ~/bin
curl -s -L -o ~/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
curl -s -L -o ~/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
chmod +x ~/bin/{cfssl,cfssljson}
export PATH=$PATH:~/bin
```
> cfssl是一个go语言工具，所谓的安装就是下载二进制文件

---

### 2. 生成CA文件
#### 1) 生成默认的CA选项文件
``` bash
mkdir ~/cfssl
cd ~/cfssl
cfssl print-defaults config > ca-config.json
cfssl print-defaults csr > ca-csr.json
```
> 默认的选项中只有`www`和`client`，我们需要进行自定义修改

#### 2) 自定义CA选项文件
``` bash
# 必选修改，增加profile内容，修改认证文件有效时间
cat << EOF > ca-config.json
{
    "signing": {
        "default": {
            "expiry": "43800h"
        },
        "profiles": {
            "server": {
                "expiry": "43800h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth"
                ]
            },
            "client": {
                "expiry": "43800h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "client auth"
                ]
            },
            "peer": {
                "expiry": "43800h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ]
            }
        }
    }
}
EOF

# 可选修改内容，主要是认证机构信息
cat << EOF > ca-csr.json
{
    "CN": "My own CA",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "US",
            "L": "CA",
            "O": "My Company Name",
            "ST": "San Francisco",
            "OU": "Org Unit 1",
            "OU": "Org Unit 2"
        }
    ]
}
EOF
```
> 增加了server，client和peer认证profile，时间调整为43800h。
> 证书类型介绍：  
> - client certificate 由客户端使用，服务器用其验证客户端身份。例如etcdctl，etcd proxy，fleetctl或docker客户端。
> - server certificate 由服务端使用，客户端用其验证服务器身份。例如docker服务器或kube-apiserver。
> - peer certificate 由etcd集群成员使用，供它们彼此之间通信使用。

#### 3) 生成CA文件
``` bash
cfssl gencert -initca ca-csr.json | cfssljson -bare ca -
```
> 会生成三个文件`ca.csr  ca-key.pem  ca.pem`
> `ca-key.pem`一定要保证它的安全，用其可随意生成认证文件

---

### 3. 生成服务端认证文件
``` bash
# 生成默认的server选项文件
cfssl print-defaults csr > server.json

# 自定义server选项文件
#最重要的是"CN"和"hosts"
cat << EOF > server.json
{
    "CN": "server1",
    "hosts": [
        "server1.local",
        "www.example.net",
        "192.168.0.100"
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
EOF

# 生成server端认证文件
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server server.json | cfssljson -bare server
```
> 会生成三个文件`server.csr  server-key.pem  server.pem`

---

### 4. 生成集群节点认证文件
``` bash
# 生成默认的peer选项文件
cfssl print-defaults csr > member1.json

# 自定义peer选项文件
cat << EOF > member1.json
{
    "CN": "member1",
    "hosts": [
        "192.168.122.101",
        "ext.example.com",
        "member1.local",
        "member1"
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
EOF

# 生成peer端认证文件
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=peer member1.json | cfssljson -bare member1
```
> 会生成三个文件`member1.csr  member1-key.pem  member1.pem`  
> 有多少个节点就生成多少个

---

### 5. 生成客户端认证文件
``` bash
# 生成默认的client选项文件
cfssl print-defaults csr > client.json

# 自定义client选项文件
#hosts可留空
cat << EOF > client.json
{
    "CN": "client",
    "hosts": [""],
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
EOF

# 生成client端认证文件
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client.json | cfssljson -bare client
```
> 会生成三个文件`client.csr  client-key.pem  client.pem`

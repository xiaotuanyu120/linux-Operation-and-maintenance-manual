---
title: etcd 1.1.4 etcd install static cluster with ssl/tls
date: 2017-08-10 14:35:00
categories: virtualization/container
tags: [etcd]
---
### etcd 1.1.4 etcd install static cluster with ssl/tls

---

### 0. 安装etcd集群之前
本文是在上一篇[etcd集群的static启动方法](http://linux.xiao5tech.com/virtualization/container/etcd_1.1.3_install_static_cluster_centos6.html))的基础上，增加[ssl/tls认证](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/security.md)的内容。

---

### 1. 使用static方法启动etcd集群(ssl/tls)
#### 1) 安装etcd
参照[etcd集群的static启动方法](http://linux.xiao5tech.com/virtualization/container/etcd_1.1.3_install_static_cluster_centos6.html)，这里不再赘述。

#### 2) 生成认证文件
生成认证文件详细操作参照[使用cfssl生成认证文件的文档](https://github.com/coreos/docs/blob/master/os/generate-self-signed-certificates.md)，这里仅提及必要的内容，生成配置文件可在任意linux系统中生成，只需要在生成之后把相应的认证文件拷贝到相应节点即可。  

etcd里面可以做的认证包括：
- 客户端验证服务端身份，需要在服务端提供服务器认证文件，例如server.pem，server-key.pem
- 服务端验证客户端身份，需要在客户端提供客户端认证文件，例如client-key.pem，client.pem
- etcd集群节点互相认证身份，需要各节点提供节点认证文件，例如member1.pem，member1-key.pem
> 当然任何认证都需要的一个文件是ca.pem

CA选项文件`ca-config.json`和`ca-csr.json`自定义内容
```
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
```
```
{
    "CN": "etcd cluster CA",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "PH",
            "L": "CA",
            "O": "skyluster",
            "ST": "manila",
            "OU": "OM"
        }
    ]
}
```

server端选项文件`server.json`
```
{
    "CN": "etcdServer",
    "hosts": [
        "192.168.86.19",
        "192.168.86.20",
        "192.168.86.21",
        "127.0.0.1"
    ],
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "C": "PH",
            "L": "CA",
            "ST": "MANILA"
        }
    ]
}
```

peer端选项文件`member1.json`
```
{
    "CN": "member1",
    "hosts": [
        "192.168.86.19"
    ],
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "C": "PH",
            "L": "CA",
            "ST": "MANILA"
        }
    ]
}
```
> 另外两个节点只要修改CN和hosts就好

client端选项文件`client.json`
```
{
    "CN": "client",
    "hosts": [""],
    "key": {
        "algo": "ecdsa",
        "size": 256
    },
    "names": [
        {
            "C": "PH",
            "L": "CA",
            "ST": "MANILA"
        }
    ]
}
```

使用上述选项文件，我们可以生成以下认证文件
- ca.csr  ca-key.pem  ca.pem
- server.csr  server-key.pem  server.pem
- member1.csr  member1-key.pem  member1.pem
- member2.csr  member2-key.pem  member2.pem
- member3.csr  member3-key.pem  member3.pem
- client.csr  client-key.pem  client.pem

#### 3) 拷贝认证文件到对应节点
本文中生成认证文件的节点不在etcd集群中
``` bash
mkdir -p /etc/etcd/ssl

# 1. 拷贝server认证文件
scp server.pem server-key.pem root@192.168.86.19:/etc/etcd/ssl
scp server.pem server-key.pem root@192.168.86.20:/etc/etcd/ssl
scp server.pem server-key.pem root@192.168.86.21:/etc/etcd/ssl
# 用于提供server身份认证

# 2. 拷贝client认证文件
#首先需要拷贝ca.pem或ca.csr到服务端
scp ca.pem root@192.168.86.19:/etc/etcd/ssl
scp ca.pem root@192.168.86.20:/etc/etcd/ssl
scp ca.pem root@192.168.86.21:/etc/etcd/ssl
#然后把client.pem client-key.pem拷贝到需要访问etcd集群的客户端
scp ca.pem client.pem client-key.pem root@<client-ip>:/any/dir

# 3. 拷贝peer认证文件
scp member1.pem member1-key.pem root@192.168.86.19:/etc/etcd/ssl
scp member2.pem member2-key.pem root@192.168.86.20:/etc/etcd/ssl
scp member3.pem member3-key.pem root@192.168.86.21:/etc/etcd/ssl
```

#### 4) 启动etcd
在各个节点创建新文件`/usr/local/bin/etcdStart`
``` bash
#!/bin/bash

etcd --name infra0 --data-dir /home/etcd --initial-advertise-peer-urls https://192.168.86.19:2380 \
  --listen-peer-urls https://192.168.86.19:2380 \
  --listen-client-urls https://192.168.86.19:2379,https://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.86.19:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=https://192.168.86.19:2380,infra1=https://192.168.86.20:2380,infra2=https://192.168.86.21:2380 \
  --initial-cluster-state new \
  --client-cert-auth --trusted-ca-file /etc/etcd/ssl/ca.pem \
  --cert-file /etc/etcd/ssl/server.pem --key-file /etc/etcd/ssl/server-key.pem \
  --peer-client-cert-auth --peer-trusted-ca-file /etc/etcd/ssl/ca.pem \
  --peer-cert-file /etc/etcd/ssl/member1.pem --peer-key-file /etc/etcd/ssl/member1-key.pem &
```  

``` bash
#!/bin/bash

etcd --name infra1 --data-dir /home/etcd --initial-advertise-peer-urls https://192.168.86.20:2380 \
  --listen-peer-urls https://192.168.86.20:2380 \
  --listen-client-urls https://192.168.86.20:2379,https://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.86.20:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=https://192.168.86.19:2380,infra1=https://192.168.86.20:2380,infra2=https://192.168.86.21:2380 \
  --initial-cluster-state new \
  --client-cert-auth --trusted-ca-file /etc/etcd/ssl/ca.pem \
  --cert-file /etc/etcd/ssl/server.pem --key-file /etc/etcd/ssl/server-key.pem \
  --peer-client-cert-auth --peer-trusted-ca-file /etc/etcd/ssl/ca.pem \
  --peer-cert-file /etc/etcd/ssl/member2.pem --peer-key-file /etc/etcd/ssl/member2-key.pem &
```

``` bash
#!/bin/bash

etcd --name infra2 --data-dir /home/etcd --initial-advertise-peer-urls https://192.168.86.21:2380 \
  --listen-peer-urls https://192.168.86.21:2380 \
  --listen-client-urls https://192.168.86.21:2379,https://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.86.21:2379 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster infra0=https://192.168.86.19:2380,infra1=https://192.168.86.20:2380,infra2=https://192.168.86.21:2380 \
  --initial-cluster-state new \
  --client-cert-auth --trusted-ca-file /etc/etcd/ssl/ca.pem \
  --cert-file /etc/etcd/ssl/server.pem --key-file /etc/etcd/ssl/server-key.pem \
  --peer-client-cert-auth --peer-trusted-ca-file /etc/etcd/ssl/ca.pem \
  --peer-cert-file /etc/etcd/ssl/member3.pem --peer-key-file /etc/etcd/ssl/member3-key.pem &
```

在各节点上启动etcd
``` bash
chmod u+x,g+x /usr/local/bin/etcdStart
etcdStart
```

#### 5) 检查etcd状态
查看集群状态
``` bash
ETCDCTL_API=3 etcdctl --cacert ./ca.pem --cert ./client.pem --key ./client-key.pem --endpoints https://192.168.86.20:2379 member list
3a7da2665bb89ebd, started, infra1, https://192.168.86.20:2380, https://192.168.86.20:2379
86a76c24d67842f0, started, infra2, https://192.168.86.21:2380, https://192.168.86.21:2379
dd786e4fce611409, started, infra0, https://192.168.86.19:2380, https://192.168.86.19:2379
```
> `ETCDCTL_API=3`变量的作用是让etctl使用etcd3的api语法，默认是etcd2的api语法。

增删改查
``` bash
# 使用etcdctl
ETCDCTL_API=3 etcdctl --cacert ./ca.pem --cert ./client.pem --key ./client-key.pem --endpoints https://192.168.86.20:2379 put /v2/keys/test test
OK
ETCDCTL_API=3 etcdctl --cacert ./ca.pem --cert ./client.pem --key ./client-key.pem --endpoints https://192.168.86.20:2379 get /v2/keys/test
/v2/keys/test
test
ETCDCTL_API=3 etcdctl --cacert ./ca.pem --cert ./client.pem --key ./client-key.pem --endpoints https://192.168.86.20:2379 del /v2/keys/test
1
ETCDCTL_API=3 etcdctl --cacert ./ca.pem --cert ./client.pem --key ./client-key.pem --endpoints https://192.168.86.20:2379 get /v2/keys/test
```
> 因为key格式的原因，无法使用curl来访问，需要后续研究

---
title: hyperledger fabric tutorial: 1.1.1 BYFN-cryptogen
date: 2017-12-27 11:57:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.1 BYFN-cryptogen

---

### 0. 环境说明
上一篇中，我们使用了byfn.sh这个脚本走了一遍大概的流程，从此篇开始，详细的按照教程走一遍手动执行过程。

### 1. Crypto Generator(加密生成器)
我们将使用cryptogen工具为我们的各种网络实体生成密码资料（x509证书和签名密钥）。 这些证书是身份的代表，它们允许在我们的实体进行通信和交易时进行签名/验证身份验证。

#### 1) 它是如何工作的？
Cryptogen使用包含网络拓扑的文件 - crypto-config.yaml，并允许我们为组织和组织内的组件生成一组证书和密钥。 每个组织都配备了一个独有的根证书（ca-cert），将特定的组件（同行和订购者）绑定到该组织。 通过为每个组织分配一个唯一的CA证书，我们正在模拟一个典型的网络，其中每个参与成员将使用自己的证书颁发机构。 Hyperledger Fabric中的事务和通信由实体的私钥（keystore）签名，然后通过公钥（signcerts）进行验证。

你会注意到这个文件中的一个count变量。 我们用这个来指定每个组织的节点的数量; 在我们的案例中，每个组织有两个节点。

#### 2) `crypto-config.yaml`文件
``` yaml
OrdererOrgs:
  - Name: Orderer
    Domain: example.com
    Specs:
      - Hostname: orderer
PeerOrgs:
  - Name: Org1
    Domain: org1.example.com
    Template:
      Count: 2
    Users:
      Count: 1
  - Name: Org2
    Domain: org2.example.com
    Template:
      Count: 2
    Users:
      Count: 1
```

#### 3) 执行过程
``` bash
# 删除之前的认证文件
rm -rf crypto-config

# 生成新的认证文件
cryptogen generate --config=./crypto-config.yaml
org1.example.com
org2.example.com

tree crypto-config
crypto-config
├── ordererOrganizations
│   └── example.com
│       ├── ca
│       │   ├── a177d6c2f5915b5d3fb885c41bb7e050d37636799ae97318de7404381a800302_sk
│       │   └── ca.example.com-cert.pem
│       ├── msp
│       │   ├── admincerts
│       │   │   └── Admin@example.com-cert.pem
│       │   ├── cacerts
│       │   │   └── ca.example.com-cert.pem
│       │   └── tlscacerts
│       │       └── tlsca.example.com-cert.pem
│       ├── orderers
│       │   └── orderer.example.com
│       │       ├── msp
│       │       │   ├── admincerts
│       │       │   │   └── Admin@example.com-cert.pem
│       │       │   ├── cacerts
│       │       │   │   └── ca.example.com-cert.pem
│       │       │   ├── keystore
│       │       │   │   └── 1d5ff682bb3cb81b29798109520e0584e964105cf21901cb45de96f4d990b260_sk
│       │       │   ├── signcerts
│       │       │   │   └── orderer.example.com-cert.pem
│       │       │   └── tlscacerts
│       │       │       └── tlsca.example.com-cert.pem
│       │       └── tls
│       │           ├── ca.crt
│       │           ├── server.crt
│       │           └── server.key
│       ├── tlsca
│       │   ├── 3d264bec9db6b8700832ccc5992366ba13bd423dffce3abd01cb0a034c83c690_sk
│       │   └── tlsca.example.com-cert.pem
│       └── users
│           └── Admin@example.com
│               ├── msp
│               │   ├── admincerts
│               │   │   └── Admin@example.com-cert.pem
│               │   ├── cacerts
│               │   │   └── ca.example.com-cert.pem
│               │   ├── keystore
│               │   │   └── 1bcd9d77d3c8d03d7be6e530a50e61cde22f70ab477604e655f0e4ee5f54cd0a_sk
│               │   ├── signcerts
│               │   │   └── Admin@example.com-cert.pem
│               │   └── tlscacerts
│               │       └── tlsca.example.com-cert.pem
│               └── tls
│                   ├── ca.crt
│                   ├── server.crt
│                   └── server.key
└── peerOrganizations
    ├── org1.example.com
    │   ├── ca
    │   │   ├── 7dd7d6ff9942843110810755e633e3666dd32ba98bf9283a9efdbb8f8158d039_sk
    │   │   └── ca.org1.example.com-cert.pem
    │   ├── msp
    │   │   ├── admincerts
    │   │   │   └── Admin@org1.example.com-cert.pem
    │   │   ├── cacerts
    │   │   │   └── ca.org1.example.com-cert.pem
    │   │   └── tlscacerts
    │   │       └── tlsca.org1.example.com-cert.pem
    │   ├── peers
    │   │   ├── peer0.org1.example.com
    │   │   │   ├── msp
    │   │   │   │   ├── admincerts
    │   │   │   │   │   └── Admin@org1.example.com-cert.pem
    │   │   │   │   ├── cacerts
    │   │   │   │   │   └── ca.org1.example.com-cert.pem
    │   │   │   │   ├── keystore
    │   │   │   │   │   └── 37b487a34be440cfe6b96f4475eb3b5bd62d3f7c38839d633763ad11e7fa5ea0_sk
    │   │   │   │   ├── signcerts
    │   │   │   │   │   └── peer0.org1.example.com-cert.pem
    │   │   │   │   └── tlscacerts
    │   │   │   │       └── tlsca.org1.example.com-cert.pem
    │   │   │   └── tls
    │   │   │       ├── ca.crt
    │   │   │       ├── server.crt
    │   │   │       └── server.key
    │   │   └── peer1.org1.example.com
    │   │       ├── msp
    │   │       │   ├── admincerts
    │   │       │   │   └── Admin@org1.example.com-cert.pem
    │   │       │   ├── cacerts
    │   │       │   │   └── ca.org1.example.com-cert.pem
    │   │       │   ├── keystore
    │   │       │   │   └── 02b7950b6e16e2b3878eba49f894761252d6c1a07f9377a4350c27613dc8f57a_sk
    │   │       │   ├── signcerts
    │   │       │   │   └── peer1.org1.example.com-cert.pem
    │   │       │   └── tlscacerts
    │   │       │       └── tlsca.org1.example.com-cert.pem
    │   │       └── tls
    │   │           ├── ca.crt
    │   │           ├── server.crt
    │   │           └── server.key
    │   ├── tlsca
    │   │   ├── 3bbe83a0f535af7577b996f584d434a5c54e132a46d12ddf2b2163a6e651b51b_sk
    │   │   └── tlsca.org1.example.com-cert.pem
    │   └── users
    │       ├── Admin@org1.example.com
    │       │   ├── msp
    │       │   │   ├── admincerts
    │       │   │   │   └── Admin@org1.example.com-cert.pem
    │       │   │   ├── cacerts
    │       │   │   │   └── ca.org1.example.com-cert.pem
    │       │   │   ├── keystore
    │       │   │   │   └── ac1dfa29dc9b3b5c05e586d12e51782e6a7bb74499e594766204f25969805019_sk
    │       │   │   ├── signcerts
    │       │   │   │   └── Admin@org1.example.com-cert.pem
    │       │   │   └── tlscacerts
    │       │   │       └── tlsca.org1.example.com-cert.pem
    │       │   └── tls
    │       │       ├── ca.crt
    │       │       ├── server.crt
    │       │       └── server.key
    │       └── User1@org1.example.com
    │           ├── msp
    │           │   ├── admincerts
    │           │   │   └── User1@org1.example.com-cert.pem
    │           │   ├── cacerts
    │           │   │   └── ca.org1.example.com-cert.pem
    │           │   ├── keystore
    │           │   │   └── 52488dc054947ecf5e62dc173a8c2d2a01ec9207dc3cf7ea7fb4f026ba38b07a_sk
    │           │   ├── signcerts
    │           │   │   └── User1@org1.example.com-cert.pem
    │           │   └── tlscacerts
    │           │       └── tlsca.org1.example.com-cert.pem
    │           └── tls
    │               ├── ca.crt
    │               ├── server.crt
    │               └── server.key
    └── org2.example.com
        ├── ca
        │   ├── 4c25c3bd0b50d31d261cb70ec2e36946b60ca2375c32ade095bc9b67d9075790_sk
        │   └── ca.org2.example.com-cert.pem
        ├── msp
        │   ├── admincerts
        │   │   └── Admin@org2.example.com-cert.pem
        │   ├── cacerts
        │   │   └── ca.org2.example.com-cert.pem
        │   └── tlscacerts
        │       └── tlsca.org2.example.com-cert.pem
        ├── peers
        │   ├── peer0.org2.example.com
        │   │   ├── msp
        │   │   │   ├── admincerts
        │   │   │   │   └── Admin@org2.example.com-cert.pem
        │   │   │   ├── cacerts
        │   │   │   │   └── ca.org2.example.com-cert.pem
        │   │   │   ├── keystore
        │   │   │   │   └── 0b1d7f28cec6f589f1ed61895788da9bfe27717d9976f41b8b03419bc6ab1178_sk
        │   │   │   ├── signcerts
        │   │   │   │   └── peer0.org2.example.com-cert.pem
        │   │   │   └── tlscacerts
        │   │   │       └── tlsca.org2.example.com-cert.pem
        │   │   └── tls
        │   │       ├── ca.crt
        │   │       ├── server.crt
        │   │       └── server.key
        │   └── peer1.org2.example.com
        │       ├── msp
        │       │   ├── admincerts
        │       │   │   └── Admin@org2.example.com-cert.pem
        │       │   ├── cacerts
        │       │   │   └── ca.org2.example.com-cert.pem
        │       │   ├── keystore
        │       │   │   └── e22691d7bbaa12fd52c2a5daa851d71ee83ece0c0c76e7fe1c32cbbb126341ca_sk
        │       │   ├── signcerts
        │       │   │   └── peer1.org2.example.com-cert.pem
        │       │   └── tlscacerts
        │       │       └── tlsca.org2.example.com-cert.pem
        │       └── tls
        │           ├── ca.crt
        │           ├── server.crt
        │           └── server.key
        ├── tlsca
        │   ├── 84c20fae049944017990bc1103fbdfd565633dc588c5864f261f13bee4439230_sk
        │   └── tlsca.org2.example.com-cert.pem
        └── users
            ├── Admin@org2.example.com
            │   ├── msp
            │   │   ├── admincerts
            │   │   │   └── Admin@org2.example.com-cert.pem
            │   │   ├── cacerts
            │   │   │   └── ca.org2.example.com-cert.pem
            │   │   ├── keystore
            │   │   │   └── 07d3a83b1b81a15a6da9913f92bc7eef3682536e6dcafa46754e52b8742f256d_sk
            │   │   ├── signcerts
            │   │   │   └── Admin@org2.example.com-cert.pem
            │   │   └── tlscacerts
            │   │       └── tlsca.org2.example.com-cert.pem
            │   └── tls
            │       ├── ca.crt
            │       ├── server.crt
            │       └── server.key
            └── User1@org2.example.com
                ├── msp
                │   ├── admincerts
                │   │   └── User1@org2.example.com-cert.pem
                │   ├── cacerts
                │   │   └── ca.org2.example.com-cert.pem
                │   ├── keystore
                │   │   └── cc1d931d84ab51d661801c7ba2678ae527009d2313f3a2b9fd86b5b04d3a5636_sk
                │   ├── signcerts
                │   │   └── User1@org2.example.com-cert.pem
                │   └── tlscacerts
                │       └── tlsca.org2.example.com-cert.pem
                └── tls
                    ├── ca.crt
                    ├── server.crt
                    └── server.key

109 directories, 101 files
```

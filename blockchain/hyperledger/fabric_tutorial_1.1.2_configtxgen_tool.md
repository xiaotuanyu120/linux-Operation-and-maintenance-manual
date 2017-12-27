---
title: hyperledger fabric tutorial: 1.1.2 BYFN-configtxgen
date: 2017-12-27 11:57:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.2 BYFN-configtxgen

---

### 0. 环境说明
上一篇中，我们使用了cryptogen工具生成了网络内实体的认证资料，接下来了解configtxgen。

### 1. configtxgen
configtxgen工具用于创建四个配置：
- orderer `genesis block`,
- channel `configuration transaction`,
- and two `anchor peer transactions` - one for each Peer Org.

orderer block是ordering服务的Genesis block，并且channel配置文件在channel创建时被广播给orderer。anchor peer事务指定了该通道上的每个组织的anchor peer。
> 参考链接：
- [Channel Configuration (configtxgen)](https://hyperledger-fabric.readthedocs.io/en/latest/configtxgen.html)
- [Genesis Block](https://hyperledger-fabric.readthedocs.io/en/latest/glossary.html#genesis-block)
- [Channel](https://hyperledger-fabric.readthedocs.io/en/latest/glossary.html#channel)
- [anchor-peer](https://hyperledger-fabric.readthedocs.io/en/latest/glossary.html#anchor-peer)

#### 1) 它是如何工作的？
Configtxgen使用`configtx.yaml`-包含了样本网络的配置。有三个配置，一个是orderer Org(`OrdererOrg`)和两个Peer Org(`Org1` & `Org2`)。该文件还指定了由两个对等组织组成的联盟 - `SampleConsortium`。请特别注意本文件顶部的“Profiles”部分。 你会注意到我们有两个独特的header。 一个为orderer genesis block - TwoOrgsOrdererGenesis - 一个为我们的channel - TwoOrgsChannel。 这些header很重要，因为我们将在创建工件时将它们作为参数传递它们。

#### 2) `configtx.yaml`文件
``` yaml
---
Profiles:
    TwoOrgsOrdererGenesis:
        Orderer:
            <<: *OrdererDefaults
            Organizations:
                - *OrdererOrg
        Consortiums:
            SampleConsortium:
                Organizations:
                    - *Org1
                    - *Org2
    TwoOrgsChannel:
        Consortium: SampleConsortium
        Application:
            <<: *ApplicationDefaults
            Organizations:
                - *Org1
                - *Org2
Organizations:
    - &OrdererOrg
        Name: OrdererOrg
        ID: OrdererMSP
        MSPDir: crypto-config/ordererOrganizations/example.com/msp
    - &Org1
        Name: Org1MSP
        ID: Org1MSP
        MSPDir: crypto-config/peerOrganizations/org1.example.com/msp
        AnchorPeers:
            - Host: peer0.org1.example.com
              Port: 7051
    - &Org2
        Name: Org2MSP
        ID: Org2MSP
        MSPDir: crypto-config/peerOrganizations/org2.example.com/msp
        AnchorPeers:
            - Host: peer0.org2.example.com
              Port: 7051
Orderer: &OrdererDefaults
    OrdererType: solo
    Addresses:
        - orderer.example.com:7050
    BatchTimeout: 2s
    BatchSize:
        MaxMessageCount: 10
        AbsoluteMaxBytes: 99 MB
        PreferredMaxBytes: 512 KB
    Kafka:
        Brokers:
            - 127.0.0.1:9092
    Organizations:
Application: &ApplicationDefaults
    Organizations:
```

#### 3) 执行过程
``` bash
export FABRIC_CFG_PATH=$PWD

# create the orderer genesis block
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
2017-12-27 07:07:14.518 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-27 07:07:14.527 UTC [common/tools/configtxgen] doOutputBlock -> INFO 002 Generating genesis block
2017-12-27 07:07:14.528 UTC [common/tools/configtxgen] doOutputBlock -> INFO 003 Writing genesis block

# Create a Channel
export CHANNEL_NAME=mychannel
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
2017-12-27 07:07:48.377 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-27 07:07:48.385 UTC [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 002 Generating new channel configtx
2017-12-27 07:07:48.386 UTC [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 003 Writing new channel tx

# 定义channel上的org1的peer节点
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
2017-12-27 07:08:18.404 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-27 07:08:18.412 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
2017-12-27 07:08:18.413 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update

# 定义channel上的org2的peer节点
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
2017-12-27 07:08:35.353 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-27 07:08:35.360 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
2017-12-27 07:08:35.361 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update

tree channel-artifacts/
channel-artifacts/
├── channel.tx
├── genesis.block
├── Org1MSPanchors.tx
└── Org2MSPanchors.tx

0 directories, 4 files
```

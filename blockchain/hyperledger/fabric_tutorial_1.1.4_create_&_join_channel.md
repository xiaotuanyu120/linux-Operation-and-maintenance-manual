---
title: hyperledger fabric tutorial: 1.1.4 BYFN-create & join channel
date: 2017-12-27 15:30:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.4 BYFN-create & join channel

---

### 0. 环境说明
上一篇中，我们启动了网络，接下来，我们使用mount到cli中的文件来创建和加入channel。

### 1. Create & Join Channel
``` bash
# 进入cli容器
docker exec -it cli bash

# 在cli容器中使用mount进来的channel.tx文件和channel名称，来创建channel
export CHANNEL_NAME=mychannel
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
2017-12-27 07:58:17.084 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 07:58:17.084 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 07:58:17.219 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-27 07:58:17.221 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-27 07:58:17.221 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-27 07:58:17.221 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-27 07:58:17.221 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-27 07:58:17.221 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA2060A074F7267314D53501296062D...53616D706C65436F6E736F727469756D
2017-12-27 07:58:17.221 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 7E950EFF2E61E133D3AB78D889F9797342517D44A520F734999DEB31557AA8C9
2017-12-27 07:58:17.221 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-27 07:58:17.221 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-27 07:58:17.221 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-27 07:58:17.221 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-27 07:58:17.221 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD9060A1508021A060899A58DD20522...A21B132E4F8F67D731A56F663068862D
2017-12-27 07:58:17.221 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: E7B4F70C95537A5C12A37C25E590AAD3F526374542992264C087342F74AF7CD8
2017-12-27 07:58:17.387 UTC [msp] GetLocalMSP -> DEBU 010 Returning existing local MSP
2017-12-27 07:58:17.387 UTC [msp] GetDefaultSigningIdentity -> DEBU 011 Obtaining default signing identity
2017-12-27 07:58:17.403 UTC [msp] GetLocalMSP -> DEBU 012 Returning existing local MSP
2017-12-27 07:58:17.403 UTC [msp] GetDefaultSigningIdentity -> DEBU 013 Obtaining default signing identity
2017-12-27 07:58:17.403 UTC [msp/identity] Sign -> DEBU 014 Sign: plaintext: 0AD9060A1508021A060899A58DD20522...2CC696F9B87D12080A021A0012021A00
2017-12-27 07:58:17.403 UTC [msp/identity] Sign -> DEBU 015 Sign: digest: A4C9FE61C16D70247F13AFCDE9414896600B96932D44FFB92A6FD71F07705013
2017-12-27 07:58:17.429 UTC [channelCmd] readBlock -> DEBU 016 Got status: &{NOT_FOUND}
2017-12-27 07:58:17.430 UTC [msp] GetLocalMSP -> DEBU 017 Returning existing local MSP
2017-12-27 07:58:17.430 UTC [msp] GetDefaultSigningIdentity -> DEBU 018 Obtaining default signing identity
2017-12-27 07:58:17.440 UTC [channelCmd] InitCmdFactory -> INFO 019 Endorser and orderer connections initialized
2017-12-27 07:58:17.641 UTC [msp] GetLocalMSP -> DEBU 01a Returning existing local MSP
2017-12-27 07:58:17.641 UTC [msp] GetDefaultSigningIdentity -> DEBU 01b Obtaining default signing identity
2017-12-27 07:58:17.641 UTC [msp] GetLocalMSP -> DEBU 01c Returning existing local MSP
2017-12-27 07:58:17.641 UTC [msp] GetDefaultSigningIdentity -> DEBU 01d Obtaining default signing identity
2017-12-27 07:58:17.641 UTC [msp/identity] Sign -> DEBU 01e Sign: plaintext: 0AD9060A1508021A060899A58DD20522...E73F6E4CC50612080A021A0012021A00
2017-12-27 07:58:17.641 UTC [msp/identity] Sign -> DEBU 01f Sign: digest: 3C9624452A8991FE45E1EE1424522D30569EB92FFD891787A30F146DA586B89F
2017-12-27 07:58:17.644 UTC [channelCmd] readBlock -> DEBU 020 Received block: 0
2017-12-27 07:58:17.644 UTC [main] main -> INFO 021 Exiting.....

ls .
channel-artifacts  crypto  mychannel.block  scripts
```
> -c 指定了channel名称；  
-f 指定了channel配置文件（channel.tx-configtxgen创建）；

这个命令返回一个genesis block - <channel-ID.block> - 我们将用它来加入这个channel。 它包含在channel.tx中指定的配置信息。如果您尚未对默认频道名称进行任何修改，则该命令将返回一个mychannel.block。

### 2. join channel
``` bash
# 因为在docker-compose-cli.yaml文件中有以下几个变量
# CORE_PEER_ADDRESS=peer0.org1.example.com:7051
# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
# CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
# 所以加入peer0.org1.example.com这个节点的时候，可以直接执行下面的命令
peer channel join -b mychannel.block
2017-12-27 08:12:45.233 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:12:45.233 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:12:45.237 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-27 08:12:45.238 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0A9F070A5B08011A0B08FDAB8DD20510...795AF72E71D71A080A000A000A000A00
2017-12-27 08:12:45.238 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: A01ED385D5944AA3C7CA9B80C7CF68D0FD7D7DED27D58D8AA38D773CCFAEB38B
2017-12-27 08:12:45.329 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-27 08:12:45.329 UTC [main] main -> INFO 007 Exiting.....


# 而加入其它节点到mychannel时，需要在前面手动指定这些变量内容
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp \
CORE_PEER_ADDRESS=peer0.org2.example.com:7051 CORE_PEER_LOCALMSPID="Org2MSP" \
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
peer channel join -b mychannel.block
2017-12-27 08:19:24.778 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:19:24.778 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:19:24.800 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-27 08:19:24.800 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0A9C070A5C08011A0C088CAF8DD20510...795AF72E71D71A080A000A000A000A00
2017-12-27 08:19:24.800 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: C5966DDE87F936A2FDFDB4529F26CA6749A3AFFF82FDC0954A50DDB04EA07023
2017-12-27 08:19:24.875 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-27 08:19:24.875 UTC [main] main -> INFO 007 Exiting.....
```

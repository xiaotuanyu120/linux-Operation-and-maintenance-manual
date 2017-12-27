---
title: hyperledger fabric tutorial: 1.1.5 BYFN-Update the anchor peers
date: 2017-12-27 16:12:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.5 BYFN-Update the anchor peers

---

### 0. 环境说明
上一篇中，我们使用mount到cli中的文件来创建和加入channel,接下来我们更新channel的锚节点。

### 1. Update the anchor peers
更新通道定义，将Org1的锚点定义为peer0.org1.example.com
``` bash
peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
2017-12-27 08:23:55.749 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:23:55.749 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:23:55.753 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-27 08:23:55.755 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-27 08:23:55.755 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-27 08:23:55.755 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-27 08:23:55.755 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-27 08:23:55.755 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA2060A074F7267314D53501296062D...2A0641646D696E732A0641646D696E73
2017-12-27 08:23:55.755 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 267CB6E93A774C73E54630060281E102BE91DD94B0B8A811726627BE6F528DCD
2017-12-27 08:23:55.755 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-27 08:23:55.755 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-27 08:23:55.755 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-27 08:23:55.755 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-27 08:23:55.756 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD9060A1508021A06089BB18DD20522...D9993958EA037CEAEE83A7CE331ED296
2017-12-27 08:23:55.756 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: 6F3B6B3E64E7F3D6353304280CB52BA52A12FBCF78B24003719EB3A93037DE8D
2017-12-27 08:23:55.807 UTC [main] main -> INFO 010 Exiting.....

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp \
CORE_PEER_ADDRESS=peer0.org2.example.com:7051 CORE_PEER_LOCALMSPID="Org2MSP" \
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
2017-12-27 08:26:01.631 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:26:01.631 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:26:01.635 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-27 08:26:01.637 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-27 08:26:01.637 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-27 08:26:01.637 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-27 08:26:01.637 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-27 08:26:01.637 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0A9E060A074F7267324D53501292062D...2A0641646D696E732A0641646D696E73
2017-12-27 08:26:01.637 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 25E66B1641C4A65F9F3A3870D26AB5E9C6B78714F482FF48F8DBF207453D31C9
2017-12-27 08:26:01.637 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-27 08:26:01.637 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-27 08:26:01.637 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-27 08:26:01.637 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-27 08:26:01.637 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD5060A1508021A060899B28DD20522...247C9ADCCC434C8A06096496C7352A20
2017-12-27 08:26:01.637 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: 0EFDD68DE3EDDACCAA51F5D8D030C39BFA819297BC208C535AD8DDF52B972910
2017-12-27 08:26:01.683 UTC [main] main -> INFO 010 Exiting.....
```

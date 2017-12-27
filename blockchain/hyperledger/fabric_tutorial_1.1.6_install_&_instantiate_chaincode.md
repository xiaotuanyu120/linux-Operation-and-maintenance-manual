---
title: hyperledger fabric tutorial: 1.1.6 BYFN-Install & Instantiate Chaincode
date: 2017-12-27 16:30:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.6 BYFN-Install & Instantiate Chaincode

---

### 0. 环境说明
上一篇中，我们更新了channel的锚节点，接下来，我们安装和实例化chaincode。
应用程序通过chaincode与区块链分类帐进行交互，因此，我们需要在每个将执行并支持我们的交易的peer上安装chaincode，然后在通道上实例化chaincode。

### 1. Install Chaincode
``` bash
# this installs the Go chaincode
peer chaincode install -n mycc -v 1.0 -p github.com/chaincode/chaincode_example02/go/
2017-12-27 08:36:20.532 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:36:20.532 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:36:20.532 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-27 08:36:20.532 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-27 08:36:20.532 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-27 08:36:20.821 UTC [golang-platform] getCodeFromFS -> DEBU 006 getCodeFromFS github.com/chaincode/chaincode_example02/go/
2017-12-27 08:36:21.191 UTC [golang-platform] func1 -> DEBU 007 Discarding GOROOT package fmt
2017-12-27 08:36:21.191 UTC [golang-platform] func1 -> DEBU 008 Discarding provided package github.com/hyperledger/fabric/core/chaincode/shim
2017-12-27 08:36:21.191 UTC [golang-platform] func1 -> DEBU 009 Discarding provided package github.com/hyperledger/fabric/protos/peer
2017-12-27 08:36:21.191 UTC [golang-platform] func1 -> DEBU 00a Discarding GOROOT package strconv
2017-12-27 08:36:21.191 UTC [golang-platform] GetDeploymentPayload -> DEBU 00b done
2017-12-27 08:36:21.199 UTC [msp/identity] Sign -> DEBU 00c Sign: plaintext: 0A9F070A5B08031A0B0885B78DD20510...F619FF0E0000FFFFACD4020D001C0000
2017-12-27 08:36:21.199 UTC [msp/identity] Sign -> DEBU 00d Sign: digest: 3A2D709A56BCBBEE48E10C9E3A476E0F81BB09E3B7301D04401A9D2C918B549A
2017-12-27 08:36:21.239 UTC [chaincodeCmd] install -> DEBU 00e Installed remotely response:<status:200 payload:"OK" >
2017-12-27 08:36:21.239 UTC [main] main -> INFO 00f Exiting.....

docker ps
CONTAINER ID        IMAGE                                                                                                  COMMAND                  CREATED             STATUS              PORTS                                              NAMES
f328f1921dcb        dev-peer0.org1.example.com-mycc-1.0-384f11f484b9302df90b453200cfb25174305fce8f53f4e94d45ee3b6cab0ce9   "chaincode -peer.a..."   10 minutes ago      Up 10 minutes                                                          dev-peer0.org1.example.com-mycc-1.0

```

### 2. Instantiate Chaincode
这将初始化通道上的chain code，设置chain code的背书策略，并为目标对象启动chain code容器。 -P参数指定policy。
``` bash
# Next, instantiate the chaincode on the channel
peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
2017-12-27 08:41:00.343 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:41:00.343 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:41:00.349 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-27 08:41:00.349 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-27 08:41:00.350 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-27 08:41:00.350 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C089CB98DD20510...324D53500A04657363630A0476736363
2017-12-27 08:41:00.350 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: 7382FB80F530C76B4C4D9FF70183F13E458860C14CEEE8A4FB286193C07C8F22
2017-12-27 08:41:43.138 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AAB070A6708031A0C089CB98DD20510...90C2DB79A45FD68BC649E16B7B499594
2017-12-27 08:41:43.142 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 030A10247B6C2208EABEE6E6BDBC7B8F02CD08795C277977703346B0B379654B
2017-12-27 08:41:43.260 UTC [main] main -> INFO 00a Exiting.....
```

### 3. 验证
``` bash
# 查询
peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
2017-12-27 08:45:37.828 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:45:37.828 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:45:37.828 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-27 08:45:37.828 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-27 08:45:37.828 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-27 08:45:37.829 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C08B1BB8DD20510...6D7963631A0A0A0571756572790A0161
2017-12-27 08:45:37.829 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: B6FA9FAE9926180FA9B60B6AA7C234879128F54ED7B9B454D744EF751729C264
Query Result: 100

# 调用
peer chaincode invoke -o orderer.example.com:7050  --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C $CHANNEL_NAME -n mycc -c '{"Args":["invoke","a","b","10"]}'
2017-12-27 08:46:19.051 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:46:19.051 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:46:19.083 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-27 08:46:19.083 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-27 08:46:19.083 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-27 08:46:19.084 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAA070A6608031A0B08DBBB8DD20510...696E766F6B650A01610A01620A023130
2017-12-27 08:46:19.084 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: F2C1336CD3D4D6D06548F4381A4FA5DB1FC522EA61621BD2C763DABE25CF5AC7
2017-12-27 08:46:19.094 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AAA070A6608031A0B08DBBB8DD20510...88E41FE2961A91B611E1745544A0477A
2017-12-27 08:46:19.094 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: 697A0C6B1D9A2653EDA55E20CE81E9FECB25BBA1ECACA9F9DEFDF9669714B4E4
2017-12-27 08:46:19.101 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> DEBU 00a ESCC invoke result: version:1 response:<status:200 message:"OK" > payload:"\n \276\220.\214\242\257\360\3208\227\326Q\224\245\256\224\014{z:\352\313\0267\333\253=\033\330\346\177\370\022Y\nE\022\024\n\004lscc\022\014\n\n\n\004mycc\022\002\010\003\022-\n\004mycc\022%\n\007\n\001a\022\002\010\003\n\007\n\001b\022\002\010\003\032\007\n\001a\032\00290\032\010\n\001b\032\003210\032\003\010\310\001\"\013\022\004mycc\032\0031.0" endorsement:<endorser:"\n\007Org1MSP\022\226\006-----BEGIN CERTIFICATE-----\nMIICGTCCAb+gAwIBAgIQLHs2/2u9j9LD0X8QeVOqHDAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0xNzEyMjcwMzQ5MDhaFw0yNzEyMjUwMzQ5MDha\nMFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMR8wHQYDVQQDExZwZWVyMC5vcmcxLmV4YW1wbGUuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqWuu4or/gf/qvZvllh+sbeL32CCK8R/6\nrOdW5Z7/1Ihk/e2Rh25oBVl67GYMrlpv4Q48/a+l6A17yQ0h3eQm3aNNMEswDgYD\nVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgfdfW/5lChDEQ\ngQdV5jPjZm3TK6mL+Sg6nv27j4FY0DkwCgYIKoZIzj0EAwIDSAAwRQIhAPAvy0MQ\nnh3iLmMM7TSXewhSxZhhOqRhyKpNctMS99ySAiBKYJ2w1+kTzv3U7MYk4IVGSnY5\n7tSA/01M3jtL7ssLrA==\n-----END CERTIFICATE-----\n" signature:"0D\002 7\351\271+\305\226\032H\014\t\311\313\257\r\"\007F\334\004W\344\031D\227\264\271K\027\010+f#\002 &E\357\264\250\365\237\007\014\330y\276@\367\t\177\210\344\037\342\226\032\221\266\021\341tUD\240Gz" >
2017-12-27 08:46:19.106 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 00b Chaincode invoke successful. result: status:200
2017-12-27 08:46:19.106 UTC [main] main -> INFO 00c Exiting.....

# 查询确认上面的调用
peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
2017-12-27 08:46:49.046 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-27 08:46:49.046 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-27 08:46:49.046 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-27 08:46:49.046 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-27 08:46:49.046 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-27 08:46:49.046 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAA070A6608031A0B08F9BB8DD20510...6D7963631A0A0A0571756572790A0161
2017-12-27 08:46:49.046 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: BCF020BCBA033F57BA5503C4B3AE0EA42090788E080CD415145CF3F23B21A143
Query Result: 90
2017-12-27 08:46:49.054 UTC [main] main -> INFO 008 Exiting.....
```

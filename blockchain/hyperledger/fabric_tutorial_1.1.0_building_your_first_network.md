---
title: hyperledger fabric tutorial: 1.1.0 Building Your First Network
date: 2017-12-24 12:09:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.0 Building Your First Network

---

### 0. 环境说明
官方文档上的BYFN是使用的1.0.3版本，如果使用的bin文件和docker镜像不是1.0.3版本，需要查看configuration和排查错误。
> 需要提前安装fabric prerequisites和下载fabric samples


### 1. byfn.sh
byfn.sh这个脚本可以用来操作fabric。

> **byfn.sh脚本必须要在fabric-samples/first-network/目录下执行`./byfn.sh`**  

> byfn.sh是sample中的一个脚本，官方文档里面说必须要在git clone下来的samples目录中的first-network中执行，否则无法找到对应的binary文件，其实这个可以通过修改脚本里面的`PATH`变量来解决。  

``` bash
cd fabric-samples/first-network/
cat byfn.sh |grep -Ev "^#|^ *$"|head -29
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
function printHelp () {
  echo "Usage: "
  echo "  byfn.sh -m up|down|restart|generate [-c <channel name>] [-t <timeout>] [-d <delay>] [-f <docker-compose-file>] [-s <dbtype>]"
  echo "  byfn.sh -h|--help (print this message)"
  echo "    -m <mode> - one of 'up', 'down', 'restart' or 'generate'"
  echo "      - 'up' - bring up the network with docker-compose up"
  echo "      - 'down' - clear the network with docker-compose down"
  echo "      - 'restart' - restart the network"
  echo "      - 'generate' - generate required certificates and genesis block"
  echo "    -c <channel name> - channel name to use (defaults to \"mychannel\")"
  echo "    -t <timeout> - CLI timeout duration in microseconds (defaults to 10000)"
  echo "    -d <delay> - delay duration in seconds (defaults to 3)"
  echo "    -f <docker-compose-file> - specify which docker-compose file use (defaults to docker-compose-cli.yaml)"
  echo "    -s <dbtype> - the database backend to use: goleveldb (default) or couchdb"
  echo
  echo "Typically, one would first generate the required certificates and "
  echo "genesis block, then bring up the network. e.g.:"
  echo
  echo "	byfn.sh -m generate -c mychannel"
  echo "	byfn.sh -m up -c mychannel -s couchdb"
  echo "	byfn.sh -m down -c mychannel"
  echo
  echo "Taking all defaults:"
  echo "	byfn.sh -m generate"
  echo "	byfn.sh -m up"
  echo "	byfn.sh -m down"
}
```
因为最开始将binarys文件都安装在了`/usr/local/fabric.hyperledger`目录中，所以直接修改`/root/fabric-samples/first-network/byfn.sh`
``` bash
# 修改byfn.sh中的PATH变量为以下内容
export PATH=$PATH:/usr/local/fabirc.hyperledger/bin
```
此时我们就完成了二进制文件的绝对路径指定，然后我们可以使用byfn.sh这个脚本来启动一个网络，使用docker启动包含两个组织（每个组织各两个节点）。同时会启动一个docker执行脚本将四个节点加入到网络的channel中。

**byfn.sh解析**
在我们generate一个网络channel时，实际上是执行了三个function：
- `generateCerts`  
执行了`cryptogen generate --config=./crypto-config.yaml`语句，`cryptogen`使用了`crypto-config.yaml`文件生成了认证文件在`crypto-config`目录中。
- `replacePrivateKey`  
先拷贝`docker-compose-e2e-template.yaml`为`docker-compose-e2e.yaml`，接下来替换第一步生成的认证文件信息到`docker-compose-e2e.yaml`中
- `generateChannelArtifacts`  
`configtxgen`使用了`configtx.yaml`文件，使用了其他的profile来执行了一系列命令。


### 2. generate第一个网络配置
``` bash
./byfn.sh -m generate
Generating certs and genesis block for with channel 'mychannel' and CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue (y/n)? y
proceeding ...
/root/bin/cryptogen

##########################################################
##### Generate certificates using cryptogen tool #########
##########################################################
org1.example.com
org2.example.com

/root/bin/configtxgen
##########################################################
#########  Generating Orderer Genesis block ##############
##########################################################
2017-12-25 03:04:33.738 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-25 03:04:33.748 UTC [common/tools/configtxgen] doOutputBlock -> INFO 002 Generating genesis block
2017-12-25 03:04:33.748 UTC [common/tools/configtxgen] doOutputBlock -> INFO 003 Writing genesis block

#################################################################
### Generating channel configuration transaction 'channel.tx' ###
#################################################################
2017-12-25 03:04:33.766 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-25 03:04:33.774 UTC [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 002 Generating new channel configtx
2017-12-25 03:04:33.774 UTC [common/tools/configtxgen] doOutputChannelCreateTx -> INFO 003 Writing new channel tx

#################################################################
#######    Generating anchor peer update for Org1MSP   ##########
#################################################################
2017-12-25 03:04:33.787 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-25 03:04:33.795 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
2017-12-25 03:04:33.795 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update

#################################################################
#######    Generating anchor peer update for Org2MSP   ##########
#################################################################
2017-12-25 03:04:33.808 UTC [common/tools/configtxgen] main -> INFO 001 Loading configuration
2017-12-25 03:04:33.816 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 002 Generating anchor peer update
2017-12-25 03:04:33.816 UTC [common/tools/configtxgen] doOutputAnchorPeersUpdate -> INFO 003 Writing anchor peer update
```
> -c 参数可以改变channel名称，默认为mychannel

> 在`crypto-config`目录中生成了各种认证文件，而且生成了`docker-compose-e2e.yaml`文件，里面挂载了`crypto-config`中的认证文件到docker里。

### 3. 启动第一个网络
``` bash
./byfn.sh -m up
```
输出结果
```
Starting with channel 'mychannel' and CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue (y/n)? y
proceeding ...
Creating network "net_byfn" with the default driver
Creating peer0.org1.example.com ...
Creating peer1.org1.example.com ...
Creating peer0.org2.example.com ...
Creating orderer.example.com ...
Creating peer1.org2.example.com ...
Creating peer1.org1.example.com
Creating peer0.org1.example.com
Creating orderer.example.com
Creating peer0.org2.example.com
Creating orderer.example.com ... done
Creating cli ...
Creating cli ... done

 ____    _____      _      ____    _____
/ ___|  |_   _|    / \    |  _ \  |_   _|
\___ \    | |     / _ \   | |_) |   | |  
 ___) |   | |    / ___ \  |  _ <    | |  
|____/    |_|   /_/   \_\ |_| \_\   |_|  

Build your first network (BYFN) end-to-end test

Channel name : mychannel
Creating channel...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
2017-12-25 03:16:20.879 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:20.879 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:20.941 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:20.948 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-25 03:16:20.948 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-25 03:16:20.948 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-25 03:16:20.948 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-25 03:16:20.948 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA2060A074F7267314D53501296062D...53616D706C65436F6E736F727469756D
2017-12-25 03:16:20.948 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: C0E5F2C08F2690314CEBEC33BC7950A8C2A28B63598D1FE90D3CC70D0D437E76
2017-12-25 03:16:20.948 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-25 03:16:20.948 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-25 03:16:20.948 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-25 03:16:20.948 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-25 03:16:20.948 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD9060A1508021A060884DB81D20522...C96621648B41B3E9D2762B223167F1F5
2017-12-25 03:16:20.948 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: 2F8360442F4A879455AD4BB47E5DBB926DB2D1FC0C370C5248F7674A0B0E7C3B
2017-12-25 03:16:20.991 UTC [msp] GetLocalMSP -> DEBU 010 Returning existing local MSP
2017-12-25 03:16:20.991 UTC [msp] GetDefaultSigningIdentity -> DEBU 011 Obtaining default signing identity
2017-12-25 03:16:20.991 UTC [msp] GetLocalMSP -> DEBU 012 Returning existing local MSP
2017-12-25 03:16:20.991 UTC [msp] GetDefaultSigningIdentity -> DEBU 013 Obtaining default signing identity
2017-12-25 03:16:20.991 UTC [msp/identity] Sign -> DEBU 014 Sign: plaintext: 0AD9060A1508021A060884DB81D20522...DE5D476C892712080A021A0012021A00
2017-12-25 03:16:20.991 UTC [msp/identity] Sign -> DEBU 015 Sign: digest: E8A6EA83BC9D5C98C90F081A6BF2EFD4E8B083D11DD5100C84A86D375280C591
2017-12-25 03:16:21.003 UTC [channelCmd] readBlock -> DEBU 016 Got status: &{NOT_FOUND}
2017-12-25 03:16:21.004 UTC [msp] GetLocalMSP -> DEBU 017 Returning existing local MSP
2017-12-25 03:16:21.004 UTC [msp] GetDefaultSigningIdentity -> DEBU 018 Obtaining default signing identity
2017-12-25 03:16:21.009 UTC [channelCmd] InitCmdFactory -> INFO 019 Endorser and orderer connections initialized
2017-12-25 03:16:21.209 UTC [msp] GetLocalMSP -> DEBU 01a Returning existing local MSP
2017-12-25 03:16:21.209 UTC [msp] GetDefaultSigningIdentity -> DEBU 01b Obtaining default signing identity
2017-12-25 03:16:21.209 UTC [msp] GetLocalMSP -> DEBU 01c Returning existing local MSP
2017-12-25 03:16:21.209 UTC [msp] GetDefaultSigningIdentity -> DEBU 01d Obtaining default signing identity
2017-12-25 03:16:21.209 UTC [msp/identity] Sign -> DEBU 01e Sign: plaintext: 0AD9060A1508021A060885DB81D20522...A0D2B2044A0112080A021A0012021A00
2017-12-25 03:16:21.209 UTC [msp/identity] Sign -> DEBU 01f Sign: digest: 7399CF9E3EE8BC7667AB55DB0B94117668EAD4BCD9A58E80020C9DAADAE2031C
2017-12-25 03:16:21.212 UTC [channelCmd] readBlock -> DEBU 020 Received block: 0
2017-12-25 03:16:21.212 UTC [main] main -> INFO 021 Exiting.....
===================== Channel "mychannel" is created successfully =====================

Having all peers join the channel...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
2017-12-25 03:16:21.280 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:21.280 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:21.284 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:21.284 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0AA0070A5C08011A0C0885DB81D20510...A59BBF1379671A080A000A000A000A00
2017-12-25 03:16:21.284 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: CBB387448C51EE9A829E2DF18FD02DA7417CA385DB65030A212BBD749EDE3927
2017-12-25 03:16:21.325 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-25 03:16:21.325 UTC [main] main -> INFO 007 Exiting.....
===================== PEER0 joined on the channel "mychannel" =====================

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer1.org1.example.com:7051
2017-12-25 03:16:24.385 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:24.385 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:24.389 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:24.390 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0AA0070A5C08011A0C0888DB81D20510...A59BBF1379671A080A000A000A000A00
2017-12-25 03:16:24.390 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: D5235D2DBC7D847F0962E8365D247033692839D6B911D2AAA497B3CD1E6F7A0E
2017-12-25 03:16:24.417 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-25 03:16:24.417 UTC [main] main -> INFO 007 Exiting.....
===================== PEER1 joined on the channel "mychannel" =====================

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org2.example.com:7051
2017-12-25 03:16:27.470 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:27.470 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:27.473 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:27.474 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0AA0070A5C08011A0C088BDB81D20510...A59BBF1379671A080A000A000A000A00
2017-12-25 03:16:27.474 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: BD29D27419FC86840FE166F7A8219464A413FAC5CF6927E860F0712967EF97F4
2017-12-25 03:16:27.506 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-25 03:16:27.506 UTC [main] main -> INFO 007 Exiting.....
===================== PEER2 joined on the channel "mychannel" =====================

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer1.org2.example.com:7051
2017-12-25 03:16:30.557 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:30.557 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:30.561 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:30.561 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0AA0070A5C08011A0C088EDB81D20510...A59BBF1379671A080A000A000A000A00
2017-12-25 03:16:30.561 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: 41458510521B1F9CDCD5DDEF4B376D89656DEFC003C3F1493DEF041719FD78A5
2017-12-25 03:16:30.593 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2017-12-25 03:16:30.593 UTC [main] main -> INFO 007 Exiting.....
===================== PEER3 joined on the channel "mychannel" =====================

Updating anchor peers for org1...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
2017-12-25 03:16:33.643 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:33.643 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:33.649 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:33.650 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-25 03:16:33.650 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-25 03:16:33.650 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-25 03:16:33.650 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-25 03:16:33.650 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA2060A074F7267314D53501296062D...2A0641646D696E732A0641646D696E73
2017-12-25 03:16:33.650 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: A641503410704F06CF75791B2A5CC84F65BAB3DA0DDBC00B66FBE31D364AF626
2017-12-25 03:16:33.651 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-25 03:16:33.651 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-25 03:16:33.651 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-25 03:16:33.651 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-25 03:16:33.651 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD9060A1508021A060891DB81D20522...DB201C90CC247B59ECCF5775836F5E18
2017-12-25 03:16:33.651 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: ADACED624090D15308A30BA3338004A12E2D2A4070A2D51AA9BDE8E4571A1304
2017-12-25 03:16:33.666 UTC [main] main -> INFO 010 Exiting.....
===================== Anchor peers for org "Org1MSP" on "mychannel" is updated successfully =====================

Updating anchor peers for org2...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org2.example.com:7051
2017-12-25 03:16:36.730 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:36.730 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:36.733 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2017-12-25 03:16:36.734 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2017-12-25 03:16:36.734 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2017-12-25 03:16:36.734 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2017-12-25 03:16:36.734 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2017-12-25 03:16:36.734 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AA2060A074F7267324D53501296062D...2A0641646D696E732A0641646D696E73
2017-12-25 03:16:36.734 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: B7E0192667D842EDE0CC397EA8D7532D4891E92808717F36844F1E8BD3BCC766
2017-12-25 03:16:36.734 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2017-12-25 03:16:36.734 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2017-12-25 03:16:36.735 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2017-12-25 03:16:36.735 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2017-12-25 03:16:36.735 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AD9060A1508021A060894DB81D20522...8A6D5FC90C0667844667375BB64FADBF
2017-12-25 03:16:36.735 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: 6C0BF068B3A8C686B5835C5AFAC6565B5B731B00B8BC322F8F2765AA85ED33CE
2017-12-25 03:16:36.756 UTC [main] main -> INFO 010 Exiting.....
===================== Anchor peers for org "Org2MSP" on "mychannel" is updated successfully =====================

Installing chaincode on org1/peer0...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
2017-12-25 03:16:39.898 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:39.898 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:39.898 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:16:39.898 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:16:39.899 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:16:40.164 UTC [golang-platform] getCodeFromFS -> DEBU 006 getCodeFromFS github.com/chaincode/chaincode_example02/go/
2017-12-25 03:16:40.573 UTC [golang-platform] func1 -> DEBU 007 Discarding GOROOT package fmt
2017-12-25 03:16:40.573 UTC [golang-platform] func1 -> DEBU 008 Discarding provided package github.com/hyperledger/fabric/core/chaincode/shim
2017-12-25 03:16:40.573 UTC [golang-platform] func1 -> DEBU 009 Discarding provided package github.com/hyperledger/fabric/protos/peer
2017-12-25 03:16:40.573 UTC [golang-platform] func1 -> DEBU 00a Discarding GOROOT package strconv
2017-12-25 03:16:40.573 UTC [golang-platform] GetDeploymentPayload -> DEBU 00b done
2017-12-25 03:16:40.580 UTC [msp/identity] Sign -> DEBU 00c Sign: plaintext: 0AA0070A5C08031A0C0898DB81D20510...F619FF0E0000FFFFACD4020D001C0000
2017-12-25 03:16:40.580 UTC [msp/identity] Sign -> DEBU 00d Sign: digest: 018C6DCFEE3A3EF1E8B8E435D84F471D6AFB1F51A4F5F22C840668FCB0C422FE
2017-12-25 03:16:40.609 UTC [chaincodeCmd] install -> DEBU 00e Installed remotely response:<status:200 payload:"OK" >
2017-12-25 03:16:40.609 UTC [main] main -> INFO 00f Exiting.....
===================== Chaincode is installed on remote peer PEER0 =====================

Install chaincode on org2/peer2...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org2.example.com:7051
2017-12-25 03:16:40.688 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:40.688 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:40.688 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:16:40.688 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:16:40.688 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:16:40.744 UTC [golang-platform] getCodeFromFS -> DEBU 006 getCodeFromFS github.com/chaincode/chaincode_example02/go/
2017-12-25 03:16:40.872 UTC [golang-platform] func1 -> DEBU 007 Discarding GOROOT package fmt
2017-12-25 03:16:40.872 UTC [golang-platform] func1 -> DEBU 008 Discarding provided package github.com/hyperledger/fabric/core/chaincode/shim
2017-12-25 03:16:40.872 UTC [golang-platform] func1 -> DEBU 009 Discarding provided package github.com/hyperledger/fabric/protos/peer
2017-12-25 03:16:40.872 UTC [golang-platform] func1 -> DEBU 00a Discarding GOROOT package strconv
2017-12-25 03:16:40.872 UTC [golang-platform] GetDeploymentPayload -> DEBU 00b done
2017-12-25 03:16:40.873 UTC [msp/identity] Sign -> DEBU 00c Sign: plaintext: 0AA0070A5C08031A0C0898DB81D20510...F619FF0E0000FFFFACD4020D001C0000
2017-12-25 03:16:40.873 UTC [msp/identity] Sign -> DEBU 00d Sign: digest: 4E54E8A3650C77D8A55A9FC7DF42AB2C7290B2E92126FA31C4D03E62B6C5F219
2017-12-25 03:16:40.877 UTC [chaincodeCmd] install -> DEBU 00e Installed remotely response:<status:200 payload:"OK" >
2017-12-25 03:16:40.877 UTC [main] main -> INFO 00f Exiting.....
===================== Chaincode is installed on remote peer PEER2 =====================

Instantiating chaincode on org2/peer2...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org2.example.com:7051
2017-12-25 03:16:40.936 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:16:40.936 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:16:40.940 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:16:40.940 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:16:40.940 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:16:40.940 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C0898DB81D20510...324D53500A04657363630A0476736363
2017-12-25 03:16:40.940 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: E67E8ECA12107DDD09BE6ACE025D384919C9C85F4180F6D2A44FCD531ADC2516
2017-12-25 03:17:35.032 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AAB070A6708031A0C0898DB81D20510...4F4D5548CF26B0A7AA529924547BAEA6
2017-12-25 03:17:35.035 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: E363C273E38F555EF8E6B63942B270A8FAC453771E643F4BA0BD773DEEC14F1B
2017-12-25 03:17:35.169 UTC [main] main -> INFO 00a Exiting.....
===================== Chaincode Instantiation on PEER2 on channel 'mychannel' is successful =====================

Querying chaincode on org1/peer0...
===================== Querying on PEER0 on channel 'mychannel'... =====================
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
Attempting to Query PEER0 ...3 secs

2017-12-25 03:17:38.433 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:17:38.433 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:17:38.433 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:17:38.433 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:17:38.433 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:17:38.433 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C08D2DB81D20510...6D7963631A0A0A0571756572790A0161
2017-12-25 03:17:38.433 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: BB8BC3E02571527D0827D4DA3785F943382ECF8EF844D9FE1D50350A2FD1DDE4
Query Result: 100
2017-12-25 03:18:36.228 UTC [main] main -> INFO 008 Exiting.....
===================== Query on PEER0 on channel 'mychannel' is successful =====================
Sending invoke transaction on org1/peer0...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org1MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
2017-12-25 03:18:36.538 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:18:36.538 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:18:36.600 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:18:36.600 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:18:36.600 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:18:36.600 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C088CDC81D20510...696E766F6B650A01610A01620A023130
2017-12-25 03:18:36.600 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: 77E7342CE30FB1019E10104B474E20FCCC9520D8E6ED74EACC1928DD468E2463
2017-12-25 03:18:36.669 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0AAB070A6708031A0C088CDC81D20510...9B0F975285EC19350F9647DC9D6E2953
2017-12-25 03:18:36.677 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: BB96D47F6B82FE893DAD980EF64A5E542D0CB7162E77633E64419195DC80E78A
2017-12-25 03:18:36.711 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> DEBU 00a ESCC invoke result: version:1 response:<status:200 message:"OK" > payload:"\n \353\301\324)\307\032R\244\204\267?\022\216\304\350\030\304/\257%/\370?\322\032\220(\216.E\002\323\022Y\nE\022\024\n\004lscc\022\014\n\n\n\004mycc\022\002\010\003\022-\n\004mycc\022%\n\007\n\001a\022\002\010\003\n\007\n\001b\022\002\010\003\032\007\n\001a\032\00290\032\010\n\001b\032\003210\032\003\010\310\001\"\013\022\004mycc\032\0031.0" endorsement:<endorser:"\n\007Org1MSP\022\226\006-----BEGIN CERTIFICATE-----\nMIICGTCCAcCgAwIBAgIRAN6ftJn5srvO0W27Kr8vDFwwCgYIKoZIzj0EAwIwczEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcxMjI1MDI1OTMzWhcNMjcxMjIzMDI1OTMz\nWjBbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMN\nU2FuIEZyYW5jaXNjbzEfMB0GA1UEAxMWcGVlcjAub3JnMS5leGFtcGxlLmNvbTBZ\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABOnaVMrrbNzM7o/9p5Ow8gELygihuhJm\nt68BSwT0JnNQmDiSt3vicRXL/gohCIg7vHbf+wtMjhaTcuN4J8WBZNOjTTBLMA4G\nA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIJzBDrFFSxVf\n2ccls5b4RmLdx9z9TI76n2CnePcaOKufMAoGCCqGSM49BAMCA0cAMEQCIH4/gtNX\ne6sTT+jDjVqdj27maDq6UEyw12Bsx3cHfykYAiB/I/6VkEdcM7M6wnAj17eOnbGQ\n1zYAVq6EwX/1yd87fw==\n-----END CERTIFICATE-----\n" signature:"0D\002 f\210%DT\206\316Q.\311qd\324HB=\004\255\227\006\033lO\332SA3\355\032\201\263H\002 |\271\327\257*\313\364\222\212\224\237N\325\215jU\233\017\227R\205\354\0315\017\226G\334\235n)S" >
2017-12-25 03:18:36.711 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 00b Chaincode invoke successful. result: status:200
2017-12-25 03:18:36.711 UTC [main] main -> INFO 00c Exiting.....
===================== Invoke transaction on PEER0 on channel 'mychannel' is successful =====================

Installing chaincode on org2/peer3...
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer1.org2.example.com:7051
2017-12-25 03:18:36.804 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:18:36.804 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:18:36.804 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:18:36.804 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:18:36.804 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:18:37.033 UTC [golang-platform] getCodeFromFS -> DEBU 006 getCodeFromFS github.com/chaincode/chaincode_example02/go/
2017-12-25 03:18:37.479 UTC [golang-platform] func1 -> DEBU 007 Discarding GOROOT package fmt
2017-12-25 03:18:37.479 UTC [golang-platform] func1 -> DEBU 008 Discarding provided package github.com/hyperledger/fabric/core/chaincode/shim
2017-12-25 03:18:37.479 UTC [golang-platform] func1 -> DEBU 009 Discarding provided package github.com/hyperledger/fabric/protos/peer
2017-12-25 03:18:37.479 UTC [golang-platform] func1 -> DEBU 00a Discarding GOROOT package strconv
2017-12-25 03:18:37.480 UTC [golang-platform] GetDeploymentPayload -> DEBU 00b done
2017-12-25 03:18:37.551 UTC [msp/identity] Sign -> DEBU 00c Sign: plaintext: 0AA0070A5C08031A0C088DDC81D20510...F619FF0E0000FFFFACD4020D001C0000
2017-12-25 03:18:37.551 UTC [msp/identity] Sign -> DEBU 00d Sign: digest: 5E16F50DD79854E648D4FF4FE806D5A7F3D8DE0050DCC2E5E7C14DD30D4B134B
2017-12-25 03:18:37.611 UTC [chaincodeCmd] install -> DEBU 00e Installed remotely response:<status:200 payload:"OK" >
2017-12-25 03:18:37.612 UTC [main] main -> INFO 00f Exiting.....
===================== Chaincode is installed on remote peer PEER3 =====================

Querying chaincode on org2/peer3...
===================== Querying on PEER3 on channel 'mychannel'... =====================
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
CORE_PEER_LOCALMSPID=Org2MSP
CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ID=cli
CORE_LOGGING_LEVEL=DEBUG
CORE_PEER_ADDRESS=peer1.org2.example.com:7051
Attempting to Query PEER3 ...3 secs

2017-12-25 03:18:40.772 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2017-12-25 03:18:40.772 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2017-12-25 03:18:40.772 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2017-12-25 03:18:40.772 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2017-12-25 03:18:40.772 UTC [chaincodeCmd] getChaincodeSpec -> DEBU 005 java chaincode disabled
2017-12-25 03:18:40.773 UTC [msp/identity] Sign -> DEBU 006 Sign: plaintext: 0AAB070A6708031A0C0890DC81D20510...6D7963631A0A0A0571756572790A0161
2017-12-25 03:18:40.773 UTC [msp/identity] Sign -> DEBU 007 Sign: digest: 77AE6CF225E8C5E062239B5BA53DE4D89874716D0C96CA26306A99EEA5EF6837
Query Result: 90
2017-12-25 03:19:40.233 UTC [main] main -> INFO 008 Exiting.....
===================== Query on PEER3 on channel 'mychannel' is successful =====================

========= All GOOD, BYFN execution completed ===========


 _____   _   _   ____   
| ____| | \ | | |  _ \  
|  _|   |  \| | | | | |
| |___  | |\  | | |_| |
|_____| |_| \_| |____/  
```


### 4. 关闭第一个网络（docker镜像）
``` bash
./byfn.sh -m down
```
输出结果
```
./byfn.sh -m down
Stopping with channel 'mychannel' and CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue (y/n)? y
proceeding ...
WARNING: The CHANNEL_NAME variable is not set. Defaulting to a blank string.
WARNING: The DELAY variable is not set. Defaulting to a blank string.
WARNING: The TIMEOUT variable is not set. Defaulting to a blank string.
Stopping peer1.org2.example.com ... done
Stopping peer0.org2.example.com ... done
Stopping orderer.example.com    ... done
Stopping peer0.org1.example.com ... done
Stopping peer1.org1.example.com ... done
Removing cli                    ... done
Removing peer1.org2.example.com ... done
Removing peer0.org2.example.com ... done
Removing orderer.example.com    ... done
Removing peer0.org1.example.com ... done
Removing peer1.org1.example.com ... done
Removing network net_byfn
WARNING: The CHANNEL_NAME variable is not set. Defaulting to a blank string.
WARNING: The DELAY variable is not set. Defaulting to a blank string.
WARNING: The TIMEOUT variable is not set. Defaulting to a blank string.
Removing network net_byfn
WARNING: Network net_byfn not found.
7c6ab9071e95
3b58ece1ef0c
f1baf5093d28
Untagged: dev-peer1.org2.example.com-mycc-1.0-26c2ef32838554aac4f7ad6f100aca865e87959c9a126e86d764c8d01f8346ab:latest
Deleted: sha256:db02e031bae234a7f34d1742761831b3adbaae1c8e16b53d1e836e76040f8465
Deleted: sha256:f1d92393436eb8d7ca2e7c4437abe73e6815c49de6414017287f78170f3c2883
Deleted: sha256:6e1d522092385265fdc71e1afeb70a985fb554314e30752730be269d5447f890
Deleted: sha256:73ae0193c0378e4b1d5a0c9b1258355e6c55065febacce6f07db033427327612
Deleted: sha256:eb0fe9917ac9b6e7225fa624804f1e2dc65559d7be3b77208cb5a7d686a86945
Deleted: sha256:28470b767fb8f93f14360ddfd83ab69bf629e6ca0996263a7b25049e02d8f100
Deleted: sha256:f4c98e0b387aed52da8b2481b64141d6e36d8c491ced901532a701cb2870ba67
Untagged: dev-peer0.org1.example.com-mycc-1.0-384f11f484b9302df90b453200cfb25174305fce8f53f4e94d45ee3b6cab0ce9:latest
Deleted: sha256:a5ed1590c8085692e9d4b43c28f98324477fed0a755d2b834a39a492c8f3bc56
Deleted: sha256:a31a50af4b7ed75a2015966eb969e18932770fdc1b8a5699f893514341f9d0b8
Deleted: sha256:091c6cf8e2fcacb165388f8008132b0a43334c92974d9acf4f78d7ca24089c0a
Deleted: sha256:19437a3a67c53e4b9283c2ef1530dc3671f20304df61de9f17ecc70359ae1301
Deleted: sha256:d8f8ea09c62fb46dc5eeebde50aa8ce2cc94d6166aeeeff0313cd480c4388c12
Deleted: sha256:422396097a6f2fd605b666692c952422a0fab7ab0be27c7094bb4d65e29c6d34
Deleted: sha256:945aa9cc7b9f84ab22f756c7a5e3d62e777c7a74f328d04d019180165c747eb6
Untagged: dev-peer0.org2.example.com-mycc-1.0-15b571b3ce849066b7ec74497da3b27e54e0df1345daff3951b94245ce09c42b:latest
Deleted: sha256:9cf2b5de7e387f01c1c62edbc3824a22130c4d55b3ea9bfe7520eb45ab9c4a50
Deleted: sha256:bdf0eeac600fb0f9aca80754b386d2ca9a4b5e6b7b00caaa717a74e93bda5074
Deleted: sha256:1f7c20f1e4a04fd303b02d22ef54c3748d33b6e8eddfccb92f2a8fc4ab6b18b3
Deleted: sha256:40f99113286b447ecda7da280c239253112a63265db9fdda9ddbe3e4025bf370
Deleted: sha256:4fe67ea9f6d90866cc83df6d4b6384415bb64c8cce30ac91bb7ffec3a5ae53df
Deleted: sha256:222840c8d52f01f451e0b5dab8e154af57fb4d131aa3b7c950d774feffa6c6df
Deleted: sha256:3edd307aba48e9551c5e0ddb2b31278638995e58ace57114738ee87d6562fc75
```

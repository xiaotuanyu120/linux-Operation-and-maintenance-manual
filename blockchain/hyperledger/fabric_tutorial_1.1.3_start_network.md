---
title: hyperledger fabric tutorial: 1.1.3 BYFN-start network
date: 2017-12-27 15:14:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 1.1.3 BYFN-start network

---

### 0. 环境说明
上一篇中，我们使用了configtxgen生成了组织的区块链文件，接下来我们来启动网络。

### 1. 启动网络
我们将使用docker-compose来启动网络。docker-compose将引用我们之前下载的docker镜像，并使用configtxgen生成的genesis.block来引导orderer。

#### 1) 注释fabric-sample自带的`docker-compose-cli.yaml`
将script.sh脚本的自动执行取消掉，因为我们希望手动来按照步骤一步一步执行。注释后应该是如下所示：
```
working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
# command: /bin/bash -c './scripts/script.sh ${CHANNEL_NAME} ${DELAY} ${LANG}; sleep $TIMEOUT'
```

#### 2) `TIMEOUT`变量
默认启动网络的时候，cli的容器默认存活时间是10000s，如果需要延长，可手动传入`TIMEOUT`变量
``` bash
TIMEOUT=9999999 CHANNEL_NAME=$CHANNEL_NAME docker-compose -f docker-compose-cli.yaml up -d
```
> -d 参数将docker按照daemon模式后台运行，无法实时看日志，如果希望看日志，则去掉-d参数，然后打开另外一个terminal来操作。

#### 3) 执行过程
``` bash
TIMEOUT=9999999 CHANNEL_NAME=$CHANNEL_NAME docker-compose -f docker-compose-cli.yaml up

docker ps
CONTAINER ID        IMAGE                        COMMAND             CREATED             STATUS              PORTS                                              NAMES
96c5ce415758        hyperledger/fabric-tools     "/bin/bash"         36 seconds ago      Up 35 seconds                                                          cli
21ec694c86fc        hyperledger/fabric-orderer   "orderer"           39 seconds ago      Up 36 seconds       0.0.0.0:7050->7050/tcp                             orderer.example.com
9e698f748782        hyperledger/fabric-peer      "peer node start"   39 seconds ago      Up 35 seconds       0.0.0.0:8051->7051/tcp, 0.0.0.0:8053->7053/tcp     peer1.org1.example.com
c9b73439e6a7        hyperledger/fabric-peer      "peer node start"   39 seconds ago      Up 35 seconds       0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp     peer0.org1.example.com
cf25c78c585f        hyperledger/fabric-peer      "peer node start"   39 seconds ago      Up 36 seconds       0.0.0.0:10051->7051/tcp, 0.0.0.0:10053->7053/tcp   peer1.org2.example.com
745552515ed2        hyperledger/fabric-peer      "peer node start"   39 seconds ago      Up 37 seconds       0.0.0.0:9051->7051/tcp, 0.0.0.0:9053->7053/tcp     peer0.org2.example.com
```

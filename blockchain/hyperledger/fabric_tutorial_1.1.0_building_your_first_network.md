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

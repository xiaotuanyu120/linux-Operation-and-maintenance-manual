---
title: hyperledger fabric tutorial: 2.0.0 WYFA-环境准备
date: 2017-12-29 09:27:00
categories: blockchain/hyperledger
tags: [blockchain,hyperledger,fabric]
---
### hyperledger fabric tutorial: 2.0.0 WYFA-环境准备

---

### 0. 说明
在本节中，我们将查看一些示例程序，以了解Fabric应用程序的工作原理。 这些应用程序（以及他们使用的智能合约） - 统称为fabcar - 提供了Fabric功能的广泛演示。 值得注意的是，我们将显示与证书颁发机构进行交互并生成注册证书的过程，之后我们将利用这些生成的身份（用户对象）来查询和更新分类账。

我们将经历三个主要步骤：
1. 建立一个开发环境。  
我们的应用程序需要一个网络进行交互，所以我们将下载一个简单的注册/注册，查询和更新所需的组件：

2. 学习我们的应用程序将使用的示例智能合约的参数。  
我们的智能合约包含各种功能，使我们能够以不同的方式与分类帐进行交互。我们将进入并检查这个智能合约，以了解我们的应用程序将使用的功能。

3. 开发应用程序以查询和更新分类帐上的资产。  
我们将进入应用程序代码本身（我们的应用程序已经用Javascript编写），并手动操作变量来运行不同类型的查询和更新。

完成本教程后，您应该对应用程序如何与智能合约一起编程，以便与Fabric网络上的账本（即peer）进行交互有基本的了解。
> 这里使用的nodejs v6.12.2


### 1. 设置开发环境
首先完成以下几个步骤：
- [prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)
- [Hyperledger Fabric Samples](https://hyperledger-fabric.readthedocs.io/en/latest/samples.html)

``` bash
# 进入sample给我们的js写的application
cd fabric-samples/fabcar  && ls
enrollAdmin.js  invoke.js  package.json  query.js  registerUser.js  startFabric.sh

# 删除之前的docker运行的镜像，删掉docker简历的byfn网络
docker rm -f $(docker ps -aq)
docker network prune
```
> 如果是第二次进行此实验的话，需要删除之前创建的fabcar的镜像

### 2. 安装客户端并启动网络
> 以下过程需要你在`fabric-samples/fabcar`目录下执行

这里我们将根据`package.json`来安装nodejs需要的依赖
``` json
{
    "name": "fabcar",
    "version": "1.0.0",
    "description": "Hyperledger Fabric Car Sample Application",
    "main": "fabcar.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
        "fabric-ca-client": "unstable",
        "fabric-client": "unstable",
        "grpc": "^1.6.0"
    },
    "author": "Anthony O'Dowd",
    "license": "Apache-2.0",
    "keywords": [
        "Hyperledger",
        "Fabric",
        "Car",
        "Sample",
        "Application"
    ]
}
```
> 其中重点关注：
- fabric-ca-client，帮助我们的app和ca服务器通讯，并获取身份认证资料。
- fabric-client，帮助我们加载身份认证资料，并和peer通信。

``` bash
# 安装nodejs依赖
npm install
```

使用startFabric.sh shell脚本启动您的网络。这个命令会启动我们的各种Fabric实体，并启动一个用Golang编写的链式代码的智能合约容器：
``` bash
./startFabric.sh

docker ps
CONTAINER ID        IMAGE                                                                                                    COMMAND                  CREATED             STATUS              PORTS                                            NAMES
4f5217221dd9        dev-peer0.org1.example.com-fabcar-1.0-5c906e402ed29f20260ae42283216aa75549c571e2e380f3615826365d8269ba   "chaincode -peer.a..."   13 minutes ago      Up 13 minutes                                                        dev-peer0.org1.example.com-fabcar-1.0
620941d125ba        hyperledger/fabric-tools                                                                                 "/bin/bash"              13 minutes ago      Up 13 minutes                                                        cli
fb329e284af4        hyperledger/fabric-peer                                                                                  "peer node start"        14 minutes ago      Up 14 minutes       0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
d6b7bc3da088        hyperledger/fabric-ca                                                                                    "sh -c 'fabric-ca-..."   14 minutes ago      Up 14 minutes       0.0.0.0:7054->7054/tcp                           ca.example.com
86ac72ebcd40        hyperledger/fabric-orderer                                                                               "orderer"                14 minutes ago      Up 14 minutes       0.0.0.0:7050->7050/tcp                           orderer.example.com
8dd2888ebc32        hyperledger/fabric-couchdb                                                                               "tini -- /docker-e..."   14 minutes ago      Up 14 minutes       4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb

```
> 脚本首先执行了../basic-network/start.sh这个脚本，大意是关闭当前的docker-compose，启动一个网络，包含：ca.example.com orderer.example.com peer0.org1.example.com couchdb。  
然后在peer0.org1.example.com容器中进行了以下操作，创建了mychannel，把peer0加入了这个channel中来。

> 接着启动了cli容器，并在cli容器中执行了以下操作，安装了fabcar这个chaincode，实例化fabcar到mychannel中，并初始化它。

### 3. 应用程序如何与网络互动
应用程序使用软件开发工具包（SDK）访问允许查询和更新账本的API。
> 以下两节涉及与证书颁发机构的通信，查看其日志会很有用:`docker logs -f ca.example.com`

#### 1) 注册管理员用户
当我们启动我们的网络时，一个管理员用户 - `admin` - 已经在我们的认证中心注册了。现在我们需要向CA服务器发送一个注册呼叫，取回admin的注册证书（eCert）。SDK和扩展我们的应用程序需要此证书，以形成管理员的用户对象。
``` bash
node enrollAdmin.js
 Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully enrolled admin user "admin"
Assigned the admin user to the fabric client ::{"name":"admin","mspid":"Org1MSP","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"19fbea5f91c0e305dfa4dca1718dc4e3cf2b949b7767106ac5956af1971b4a63","identity":{"certificate":"-----BEGIN CERTIFICATE-----\nMIIB8DCCAZegAwIBAgIUChHEKKwkU+JwSvdDDi8BVwtvrr4wCgYIKoZIzj0EAwIw\nczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\nE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcxMjI5MDMxNjAwWhcNMTgxMjI5MDMx\nNjAwWjAQMQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IA\nBJISPwSX5Dqtpc/YcNqgVqaan7Su9+csCcN1G/wymmm7Ji1BOccqWnvHFQUhW6sF\nxU60VOLTFM9cHV9xtuk0/2GjbDBqMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8E\nAjAAMB0GA1UdDgQWBBTKXGfcilHxulLvHGVo86cStTW3yDArBgNVHSMEJDAigCBC\nOaoNzXba7ri6DNpwGFHRRQTTGq0bLd3brGpXNl5JfDAKBggqhkjOPQQDAgNHADBE\nAiA2BGOq1YFIB9B4j4MTDGm8WDxJSFflQxpyPFFo8wFynAIgc1MxxEKxJhtje+NW\nebeKPgCF8BxtN+c4gHAbRnufdlg=\n-----END CERTIFICATE-----\n"}}}
# 文件内容储存在hfc-key-store/admin中

# 查看hfc-key-store目录
ls hfc-key-store/
19fbea5f91c0e305dfa4dca1718dc4e3cf2b949b7767106ac5956af1971b4a63-priv  admin
19fbea5f91c0e305dfa4dca1718dc4e3cf2b949b7767106ac5956af1971b4a63-pub
```
该程序将调用证书签名请求（CSR），并最终将eCert和密钥材料输出到新创建的文件夹- `hfc-key-store` -中。当我们的应用程序需要为我们的不同用户创建或加载身份对象时，我们的应用程序将查找此位置。

同时在ca服务器的日志中我们发现
```
2017/12/29 03:21:03 [DEBUG] Received request for /api/v1/enroll
2017/12/29 03:21:03 [DEBUG] ca.Config: &{CA:{Name:ca.example.com Keyfile:/etc/hyperledger/fabric-ca-server-config/4239aa0dcd76daeeb8ba0cda701851d14504d31aad1b2ddddbac6a57365e497c_sk Certfile:/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem Chainfile:/etc/hyperledger/fabric-ca-server/ca-chain.pem} Signing:0xc42028df00 CSR:{CN:ca.org1.example.com Names:[{C:US ST:North Carolina L: O:Hyperledger OU:Fabric SerialNumber:}] Hosts:[d6b7bc3da088 localhost] KeyRequest:<nil> CA:0xc420291620 SerialNumber:} Registry:{MaxEnrollments:-1 Identities:[{ Name:**** Pass:**** Type:client Affiliation: MaxEnrollments:-1 Attrs:map[hf.Revoker:1 hf.IntermediateCA:1 hf.GenCRL:1 hf.Registrar.Attributes:* hf.Registrar.Roles:client,user,peer,validator,auditor hf.Registrar.DelegateRoles:client,user,validator,auditor]  }]} Affiliations:map[org1:[department1 department2] org2:[department1]] LDAP:{ Enabled:false URL:ldap://****:****@<host>:<port>/<base> UserFilter:(uid=%s) GroupFilter:(memberUid=%s) TLS:{false [/etc/hyperledger/fabric-ca-server/ldap-server-cert.pem] {/etc/hyperledger/fabric-ca-server/ldap-client-key.pem /etc/hyperledger/fabric-ca-server/ldap-client-cert.pem}}  } DB:{ Type:sqlite3 Datasource:/etc/hyperledger/fabric-ca-server/fabric-ca-server.db TLS:{false [/etc/hyperledger/fabric-ca-server/db-server-cert.pem] {/etc/hyperledger/fabric-ca-server/db-client-key.pem /etc/hyperledger/fabric-ca-server/db-client-cert.pem}}  } CSP:0xc4202918a0 Client:<nil> Intermediate:{ParentServer:{ URL: CAName:  } TLS:{Enabled:false CertFiles:[] Client:{KeyFile: CertFile:}} Enrollment:{ Name: Secret:**** Profile: Label: CSR:<nil> CAName: AttrReqs:[]  }} CRL:{Expiry:24h0m0s}}
2017/12/29 03:21:03 [DEBUG] DB: Getting identity admin
2017/12/29 03:21:03 [DEBUG] DB: Login user admin with max enrollments of -1 and state of 0
2017/12/29 03:21:03 [DEBUG] DB: identity admin successfully logged in
2017/12/29 03:21:03 [DEBUG] csrAuthCheck: id=admin, CommonName=admin, Subject=<nil>
2017/12/29 03:21:03 [DEBUG] CSR authorization check passed
2017/12/29 03:21:03 [DEBUG] Checking CSR fields to make sure that they do not exceed maximum character limits
2017/12/29 03:21:03 [DEBUG] DB: Getting information for identity admin
2017/12/29 03:21:03 [INFO] signed certificate with serial number 57486108224766557023846387326486306383092231870
2017/12/29 03:21:03 [DEBUG] DB: Insert Certificate
2017/12/29 03:21:03 [DEBUG] Saved serial number as hex a11c428ac2453e2704af7430e2f01570b6faebe
2017/12/29 03:21:03 [DEBUG] saved certificate with serial number 57486108224766557023846387326486306383092231870
2017/12/29 03:21:03 [DEBUG] Successfully incremented state for identity admin to 1
2017/12/29 03:21:03 [INFO] 172.18.0.1:47454 POST /api/v1/enroll 200 0 "OK"
```

#### 2) Register and Enroll user1
使用我们新生成的admin eCert，我们现在将再次与CA服务器进行通信，以注册新用户。我们将使用新用户user1来查询和更新账本。需要注意的是，我们使用的是admin身份来注册的新用户。
``` bash
node registerUser.js
 Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded admin from persistence
Successfully registered user1 - secret:FmderpEJjOEZ
Successfully enrolled member user "user1"
User1 was successfully registered and enrolled and is ready to intreact with the fabric network

ls hfc-key-store/
19fbea5f91c0e305dfa4dca1718dc4e3cf2b949b7767106ac5956af1971b4a63-priv
19fbea5f91c0e305dfa4dca1718dc4e3cf2b949b7767106ac5956af1971b4a63-pub
admin
ae4555175023ca3f31d94941603b220fb9e702b12760c836b0f1adeb67bc7d36-priv
ae4555175023ca3f31d94941603b220fb9e702b12760c836b0f1adeb67bc7d36-pub
user1
```
ca容器的日志
```
2017/12/29 03:30:22 [DEBUG] Received request for /api/v1/register
2017/12/29 03:30:22 [DEBUG] Checking for revocation/expiration of certificate owned by 'admin'
2017/12/29 03:30:22 [DEBUG] DB: Get certificate by serial (a11c428ac2453e2704af7430e2f01570b6faebe) and aki (4239aa0dcd76daeeb8ba0cda701851d14504d31aad1b2ddddbac6a57365e497c)
2017/12/29 03:30:22 [DEBUG] Successful token authentication of 'admin'
2017/12/29 03:30:22 [DEBUG] Received registration request from admin: { Name:user1 Type: Secret:**** MaxEnrollments:1 Affiliation:org1.department1 Attributes:[] CAName:  }
2017/12/29 03:30:22 [DEBUG] DB: Getting identity admin
2017/12/29 03:30:22 [DEBUG] canRegister - Check to see if user admin can register
2017/12/29 03:30:22 [DEBUG] Validate Affiliation
2017/12/29 03:30:22 [DEBUG] Affiliation of 'org1.department1' specified in registration request
2017/12/29 03:30:22 [DEBUG] Validate ID
2017/12/29 03:30:22 [DEBUG] An affiliation is required for identity type user
2017/12/29 03:30:22 [DEBUG] Validating affiliation: org1.department1
2017/12/29 03:30:22 [DEBUG] DB: Get affiliation org1.department1
2017/12/29 03:30:22 [DEBUG] Validating that registrar 'admin' with the following value for hf.Registrar.Attributes '*' is authorized to register the requested attributes '[]'
2017/12/29 03:30:22 [DEBUG] Registering user id: user1
2017/12/29 03:30:22 [DEBUG] Max enrollment value verification - User specified max enrollment: 1, CA max enrollment: -1
2017/12/29 03:30:22 [DEBUG] DB: Getting identity user1
2017/12/29 03:30:22 [DEBUG] DB: Add identity user1
2017/12/29 03:30:22 [DEBUG] Successfully added identity user1 to the database
2017/12/29 03:30:22 [INFO] 172.18.0.1:47458 POST /api/v1/register 200 0 "OK"
2017/12/29 03:30:23 [DEBUG] Received request for /api/v1/enroll
2017/12/29 03:30:23 [DEBUG] ca.Config: &{CA:{Name:ca.example.com Keyfile:/etc/hyperledger/fabric-ca-server-config/4239aa0dcd76daeeb8ba0cda701851d14504d31aad1b2ddddbac6a57365e497c_sk Certfile:/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem Chainfile:/etc/hyperledger/fabric-ca-server/ca-chain.pem} Signing:0xc42028df00 CSR:{CN:ca.org1.example.com Names:[{C:US ST:North Carolina L: O:Hyperledger OU:Fabric SerialNumber:}] Hosts:[d6b7bc3da088 localhost] KeyRequest:<nil> CA:0xc420291620 SerialNumber:} Registry:{MaxEnrollments:-1 Identities:[{ Name:**** Pass:**** Type:client Affiliation: MaxEnrollments:-1 Attrs:map[hf.Registrar.Attributes:* hf.Registrar.Roles:client,user,peer,validator,auditor hf.Registrar.DelegateRoles:client,user,validator,auditor hf.Revoker:1 hf.IntermediateCA:1 hf.GenCRL:1]  }]} Affiliations:map[org2:[department1] org1:[department1 department2]] LDAP:{ Enabled:false URL:ldap://****:****@<host>:<port>/<base> UserFilter:(uid=%s) GroupFilter:(memberUid=%s) TLS:{false [/etc/hyperledger/fabric-ca-server/ldap-server-cert.pem] {/etc/hyperledger/fabric-ca-server/ldap-client-key.pem /etc/hyperledger/fabric-ca-server/ldap-client-cert.pem}}  } DB:{ Type:sqlite3 Datasource:/etc/hyperledger/fabric-ca-server/fabric-ca-server.db TLS:{false [/etc/hyperledger/fabric-ca-server/db-server-cert.pem] {/etc/hyperledger/fabric-ca-server/db-client-key.pem /etc/hyperledger/fabric-ca-server/db-client-cert.pem}}  } CSP:0xc4202918a0 Client:<nil> Intermediate:{ParentServer:{ URL: CAName:  } TLS:{Enabled:false CertFiles:[] Client:{KeyFile: CertFile:}} Enrollment:{ Name: Secret:**** Profile: Label: CSR:<nil> CAName: AttrReqs:[]  }} CRL:{Expiry:24h0m0s}}
2017/12/29 03:30:23 [DEBUG] DB: Getting identity user1
2017/12/29 03:30:23 [DEBUG] DB: Login user user1 with max enrollments of 1 and state of 0
2017/12/29 03:30:23 [DEBUG] Max enrollment value (1) of identity is greater than allowed by CA, using CA max enrollment value of -1
2017/12/29 03:30:23 [DEBUG] DB: identity user1 successfully logged in
2017/12/29 03:30:23 [DEBUG] csrAuthCheck: id=user1, CommonName=user1, Subject=<nil>
2017/12/29 03:30:23 [DEBUG] CSR authorization check passed
2017/12/29 03:30:23 [DEBUG] Checking CSR fields to make sure that they do not exceed maximum character limits
2017/12/29 03:30:23 [DEBUG] DB: Getting information for identity user1
2017/12/29 03:30:23 [INFO] signed certificate with serial number 185255935578020512862318647850015851996183155613
2017/12/29 03:30:23 [DEBUG] DB: Insert Certificate
2017/12/29 03:30:23 [DEBUG] Saved serial number as hex 207329d852163d4aba3ec5ec86e23a1117e2539d
2017/12/29 03:30:23 [DEBUG] saved certificate with serial number 185255935578020512862318647850015851996183155613
2017/12/29 03:30:23 [DEBUG] Successfully incremented state for identity user1 to 1
2017/12/29 03:30:23 [INFO] 172.18.0.1:47462 POST /api/v1/enroll 200 0 "OK"
```

#### 3) 查询账本
查询是如何从分类帐中读取数据的。 这些数据以一系列键/值对的形式存储，您可以查询单个键，多个键的值，或者 - 如果分类帐以像JSON这样的丰富数据存储格式写入，则对其进行复杂的搜索 查找包含特定关键字的所有资产）。
``` bash
# 首先，运行我们的query.js程序返回账本上所有汽车的清单
# 核心语句是fabric_client.getUserContext('user1', true)
node query.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  [{"Key":"CAR0", "Record":{"colour":"blue","make":"Toyota","model":"Prius","owner":"Tomoko"}},{"Key":"CAR1", "Record":{"colour":"red","make":"Ford","model":"Mustang","owner":"Brad"}},{"Key":"CAR2", "Record":{"colour":"green","make":"Hyundai","model":"Tucson","owner":"Jin Soo"}},{"Key":"CAR3", "Record":{"colour":"yellow","make":"Volkswagen","model":"Passat","owner":"Max"}},{"Key":"CAR4", "Record":{"colour":"black","make":"Tesla","model":"S","owner":"Adriana"}},{"Key":"CAR5", "Record":{"colour":"purple","make":"Peugeot","model":"205","owner":"Michel"}},{"Key":"CAR6", "Record":{"colour":"white","make":"Chery","model":"S22L","owner":"Aarav"}},{"Key":"CAR7", "Record":{"colour":"violet","make":"Fiat","model":"Punto","owner":"Pari"}},{"Key":"CAR8", "Record":{"colour":"indigo","make":"Tata","model":"Nano","owner":"Valeria"}},{"Key":"CAR9", "Record":{"colour":"brown","make":"Holden","model":"Barina","owner":"Shotaro"}}]
```
> 传入的参数是user1，使用这个账户去查询。  
账本是基于key/value的，在我们的实例中，key是CAR0到CAR9


**让我们详细深入分析一下`query.js`**  
初始化部分，定义了一些变量，例如channel名称，cert储存位置和peer的网络地址。此例中，我们把变量及内容都写死了，实际app中，需要进行部分调整。
``` javascript
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;
```
接下来的一部分是构建查询部分的语句
``` javascript
// queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
// queryAllCars chaincode function - requires no arguments , ex: args: [''],
const request = {
  //targets : --- letting this default to the peers assigned to the channel
  chaincodeId: 'fabcar',
  fcn: 'queryAllCars',
  args: ['']
};
```
这里指定了chaincodeId和functionName，当app运行时，会调用chaincode（fabcar）来执行queryAllCars函数，此处没有传输args。

chaincode代码在`fabric-samples/chaincode/fabcar/go/fabcar.go`中
``` go
func (s *SmartContract) queryAllCars(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
```
> 在chaincode源码中，我们有以下几个接口api，`initLedger`, `queryCar`, `queryAllCars`, `createCar`, and `changeCarOwner`


**带参数查询**  
复制query.js为queryCar.js，将queryAllCars改成queryCar，参数改为“CAR4”
``` javascript
const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: 'fabcar',
        fcn: 'queryCar',
        args: ['CAR4']
};
```
执行queryCar.js来查询“CAR4”
``` bash
node queryCar.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  {"colour":"black","make":"Tesla","model":"S","owner":"Adriana"}
```

#### 4) 更新账本
更新账本的流程：客户端发起交易给endorse节点 - endorse节点模拟执行交易对其背书并发回给客户端 - 客户端将背书后的交易请求发送给order节点 - order节点对交易请求排序发给commit节点对账本进行写入 - commit节点检查交易请求是否合法，合法则写入账本。

我们使用`invoke.js`来发起更新请求。发起请求部分的代码如下
``` javascript
var request = {
        //targets: let default to the peer assigned to the client
        chaincodeId: 'fabcar',
        fcn: '',
        args: [''],
        chainId: 'mychannel',
        txId: tx_id
};
```

**增加CAR10**  
我们需要手动补充fcn和args
``` javascript
var request = {
  //targets: let default to the peer assigned to the client
  chaincodeId: 'fabcar',
  fcn: 'createCar',
  args: ['CAR10', 'Chevy', 'Volt', 'Red', 'Nick'],
  chainId: 'mychannel',
  txId: tx_id
};
```
执行并查询结果
``` bash
node invoke.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Assigning transaction_id:  1d099f203b819c03aaf21e86d67b1049de05b6bc3a1a1dad7bf1da8a2e225d34
Transaction proposal was good
Successfully sent Proposal and received ProposalResponse: Status - 200, message - "OK"
info: [EventHub.js]: _connect - options {"grpc.max_receive_message_length":-1,"grpc.max_send_message_length":-1}
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer

# 把queryCar.js中的CAR4改成CAR10
node queryCar.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  {"colour":"Red","make":"Chevy","model":"Volt","owner":"Nick"}
```

**修改owner**  
修改CAR10的owner为Dave
``` javascript
var request = {
  //targets: let default to the peer assigned to the client
  chaincodeId: 'fabcar',
  fcn: 'changeCarOwner',
  args: ['CAR10', 'Dave'],
  chainId: 'mychannel',
  txId: tx_id
};
```
执行更新，并查询结构
``` bash
# 执行更改
node invoke.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Assigning transaction_id:  eedcb8a401ffabc32a56e2f836a8821a5280c127d82c3d9f8d6cfb217ac8431c
Transaction proposal was good
Successfully sent Proposal and received ProposalResponse: Status - 200, message - "OK"
info: [EventHub.js]: _connect - options {"grpc.max_receive_message_length":-1,"grpc.max_send_message_length":-1}
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer

# 查询结果
node queryCar.js
Store path:/root/fabric-samples/fabcar/hfc-key-store
Successfully loaded user1 from persistence
Query has completed, checking results
Response is  {"colour":"Red","make":"Chevy","model":"Volt","owner":"Dave"}
```

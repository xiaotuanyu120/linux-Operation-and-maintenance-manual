---
title: elk 1.1.1: production installation add xpack
date: 2018-10-05 10:04:00
categories: devops/elk
tags: [elk, elasticsearch, xpack]
---
### elk 1.1.1: production installation add xpack

### 0. 什么是X-pack？
xpack是一个集成了security, alerting, monitoring, reporting, 和 graph capabilities于一身的一个elastic stack的扩展包。虽然X-Pack组件可以无缝协同工作，但可以轻松启用或禁用要使用的功能。在elasticsearch 5.0.0之前，还需要分开装很多单独的组件，但现在全部整合在X-pack中了。

### 1. 安装X-pack
安装X-pack之前，必须要先安装好elastic和kibana，如果要在logstash里面也安装X-pack，同时也要提前先安装好logstash。
> 需要注意的是，从elastic stack6.3版本开始，X-pack会包含在elk中，无需手动安装。

> 安装X-pack参考这篇[官方文档](https://www.elastic.co/guide/en/x-pack/current/installing-xpack.html)

#### 1) 在elasticsearch中安装X-pack
> **重要：**   
如果是在现存的es cluster中第一次安装X-pack，必须要整个es cluster来一次完整的重启。

**step 1 在elasticsearch中安装x-pack插件**
``` bash
bin/elasticsearch-plugin install x-pack
-> Downloading x-pack from elastic
[=================================================] 100%  
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* java.io.FilePermission \\.\pipe\* read,write
* java.lang.RuntimePermission accessClassInPackage.com.sun.activation.registries
* java.lang.RuntimePermission getClassLoader
* java.lang.RuntimePermission setContextClassLoader
* java.lang.RuntimePermission setFactory
* java.net.SocketPermission * connect,accept,resolve
* java.security.SecurityPermission createPolicy.JavaPolicy
* java.security.SecurityPermission getPolicy
* java.security.SecurityPermission putProviderProperty.BC
* java.security.SecurityPermission setPolicy
* java.util.PropertyPermission * read,write
See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
for descriptions of what these permissions allow and the associated risks.

Continue with installation? [y/N]y
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@        WARNING: plugin forks a native controller        @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
This plugin launches a native controller that is not subject to the Java
security manager nor to system call filters.

Continue with installation? [y/N]y
Elasticsearch keystore is required by plugin [x-pack-security], creating...
-> Installed x-pack with: x-pack-core,x-pack-deprecation,x-pack-graph,x-pack-logstash,x-pack-ml,x-pack-monitoring,x-pack-security,x-pack-upgrade,x-pack-watcher
```
> elasticsearch安装插件需要网络连接，如果没有网络连接，可以使用以下语法来安装本地X-pack包
``` bash
bin/elasticsearch-plugin install file:///path/to/file/x-pack-6.2.4.zip
```

> X-pack会尝试在elasticsearch中自动创建多个indices，默认情况下elasticsearch是允许自动创建index的。然而如果你配置了禁止这个动作，必须在elasticsearch.yml中配置`action.auto_create_index`来允许X-pack来创建以下indices:
``` yaml
action.auto_create_index: .security,.monitoring*,.watches,.triggered_watches,.watcher-history*,.ml*
```
如果使用了logstash和beats，X-Pack需要创建更多的indices，具体名称需要参考本地环境配置，如果不确定其名称，可以修改`action.auto_create_index`的值为`*`，这样elasticsearch就允许自动创建任意名称的index了。

**step 2 配置TLS/SSL**
> security部分是X-Pack的收费部分，免费试用30天，超过天数之后收费

> ssl针对的是多节点集群，如果只是通过本机lo网卡的单点服务就不需要这个了

a. Elasticsearch nodes 之间的TLS.
elasticsearch在X-Pack中提供了一个简易的认证工具`certutil`，它可以生成CA、CSR和签名。

``` bash
mkdir /usr/local/elasticsearch/certs-gen-folder
cd /usr/local/elasticsearch/certs-gen-folder

# step 1. 生成ca
/usr/local/elasticsearch/bin/x-pack/certutil ca --pem
# 默认在当前目录生成pem ca文件
unzip elastic-stack-ca.zip
Archive:  elastic-stack-ca.zip
   creating: ca/
  inflating: ca/ca.crt               
  inflating: ca/ca.key
# 默认生成了一个ca/ca.key ca/ca.crt，用这个ca可以给集群节点的key签名
# 这两个文件是根证书和私钥，一定要保存好，后面增加节点的时候需要用这个来给证书签名用。

# step 2. 给所有节点生成证书
/usr/local/elasticsearch/bin/x-pack/certutil cert --pem --ca-cert ca/ca.crt --ca-key ca/ca.key --ip 127.0.0.1,192.168.100.68
unzip certificate-bundle.zip
Archive:  certificate-bundle.zip
   creating: instance/
  inflating: instance/instance.crt   
  inflating: instance/instance.key
# 默认生成了instance/instance.crt  instance/instance.key

# 将目录重命名为nodes，标识这是elasticsearch nodes间的证书
mv instance nodes

# step 3. 拷贝证书到相应的节点
# 此处我只有一个节点，就拷贝证书文件到任意一个指定目录就可以了
mkdir /usr/local/elasticsearch/config/certs
cp ca/ca.crt /usr/local/elasticsearch/config/certs/
cp nodes/instance.crt /usr/local/elasticsearch/config/certs/nodes.crt
cp nodes/instance.key /usr/local/elasticsearch/config/certs/nodes.key
chown -R elasticsearch.elasticsearch /usr/local/elasticsearch/
# ca.key需要保存好，如果你生成的时候给它配置了密码，也请记录好，以后增加es节点就靠这个文件来生成证书
```
> certutil生成key时指定了ip列表，请确认elasticsearch配置的`network.host`监听的是这个ip，否则会报错`io.netty.handler.codec.DecoderException: javax.net.ssl.SSLHandshakeException: General SSLEngine problem ... Caused by: java.security.cert.CertificateException: No subject alternative names matching IP address 0:0:0:0:0:0:0:1 found`， 我遇到这个错误是因为我把`network.host`设定为了`0.0.0.0`

``` yaml
# step 4. 配置证书到elasticsearch.yml中，增加以下配置
# 多节点时，需要在各个节点上都增加此配置
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: full
xpack.security.transport.ssl.key: /usr/local/elasticsearch/config/certs/nodes.key
xpack.security.transport.ssl.certificate: /usr/local/elasticsearch/config/certs/nodes.crt
xpack.security.transport.ssl.certificate_authorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
```
> 配置说明：
- xpack.security.transport.ssl.verification_mode
    - full, (default), 验证是否由指定的CA签名，另外验证hostname(或IP)是否匹配证书里面指定的hostname(或IP)。
    - certificate, 仅验证是否由指定的CA签名，不验证其他。
    - none, 什么都不验证，仅用于调试阶段，不要在生产环境上使用。
- xpack.security.transport.ssl.key，节点key的绝对路径，位置必须是elasticsearch配置目录的子级目录。
- xpack.security.transport.ssl.certificate，节点证书的绝对路径，位置必须是elasticsearch配置目录的子级目录。
- xpack.security.transport.ssl.certificate_authorities，受信任的CA文件的数组，位置必须是elasticsearch配置目录的子级目录。

``` bash
# step 5. 如果给PEM文件加了密语，需要将此密语增加到elasticsearch的keystore里面
/usr/local/elasticsearch/bin/elasticsearch-keystore add xpack.security.transport.ssl.secure_key_passphrase

# step 6. 重启elasticsearch
systemctl restart elasticsearch
```

b. client 与 elasticsearch 之间http的TLS
``` bash
# step 1. 生成http对端的证书和key
/usr/local/elasticsearch/bin/x-pack/certutil cert --pem --ca-cert ca/ca.crt --ca-key ca/ca.key --ip 127.0.0.1,192.168.100.68,192.168.86.130

unzip certificate-bundle.zip
Archive:  certificate-bundle.zip
   creating: instance/
  inflating: instance/instance.crt   
  inflating: instance/instance.key  
# 默认生成了instance/instance.crt  instance/instance.key

# 将目录重命名为http-client，标识这是elasticsearch nodes间的证书
mv instance http-client

# step 2. 拷贝http对端证书和key到elasticsearch配置目录下
cp http-client/instance.crt /usr/local/elasticsearch/config/certs/http-client.crt
cp http-client/instance.key /usr/local/elasticsearch/config/certs/http-client.key
chown -R elasticsearch.elasticsearch /usr/local/elasticsearch/
```
``` yaml
# step 3. 修改配置文件，增加以下配置内容
# 多节点时，需要在各个节点上都增加此配置
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.client_authentication: none
xpack.security.http.ssl.key:  /usr/local/elasticsearch/config/certs/http-client.key
xpack.security.http.ssl.certificate: /usr/local/elasticsearch/config/certs/http-client.crt
xpack.security.http.ssl.certificate_authorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
```
> [xpack.security.http.ssl.client_authentication](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html#transport-tls-ssl-settings)必须要配置，不然会报错`did not find a SSLContext for [SSLConfiguration ...`。

``` bash
# step 4. 如果给PEM文件加了密语，需要将此密语增加到elasticsearch的keystore里面
/usr/local/elasticsearch/bin/elasticsearch-keystore add xpack.security.transport.ssl.secure_key_passphrase

# step 5. 重启elasticsearch
systemctl restart elasticsearch
```

c. 给内置用户增加密码
``` bash
/usr/local/elasticsearch/bin/x-pack/setup-passwords interactive
Initiating the setup of passwords for reserved users elastic,kibana,logstash_system.
You will be prompted to enter passwords as the process progresses.
Please confirm that you would like to continue [y/N]y


Enter password for [elastic]: 
Reenter password for [elastic]: 
Enter password for [kibana]: 
Reenter password for [kibana]: 
Enter password for [logstash_system]: 
Reenter password for [logstash_system]: 
Changed password for user [kibana]
Changed password for user [logstash_system]
Changed password for user [elastic]
```
> 会依次让你设定内置的三个用户的密码(elastic,kibana,logstash_system), 密码可以随便设定，例如elastic123

#### 2) 在kibana中安装X-Pack

**step 1. 在kibana中安装X-Pack**
``` bash
bin/kibana-plugin install x-pack
Attempting to transfer from x-pack
Attempting to transfer from https://artifacts.elastic.co/downloads/kibana-plugins/x-pack/x-pack-6.2.4.zip
Transferring 264988487 bytes....................
Transfer complete
Retrieving metadata from plugin archive
Extracting plugin archive
Extraction complete
Optimizing and caching browser bundles...
Plugin installation complete
```
> 内存要大点，不然安装进程会被kill掉，我分配虚拟机2G时就面临了这个情况，调整成3G解决。

**step 2. kibana配置修改**
kibana.yml
``` yaml
elasticsearch.url: "https://192.168.100.68:9200"

# If your Elasticsearch is protected with basic authentication, these settings provide
# the username and password that the Kibana server uses to perform maintenance on the Kibana
# index at startup. Your Kibana users still need to authenticate with Elasticsearch, which
# is proxied through the Kibana server.
elasticsearch.username: "kibana"
elasticsearch.password: "kibanapass"

elasticsearch.ssl.certificate: /usr/local/elasticsearch/config/certs/http-client.crt
elasticsearch.ssl.key: /usr/local/elasticsearch/config/certs/http-client.key
elasticsearch.ssl.certificateAuthorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
elasticsearch.ssl.verificationMode: full
```

**step 3. 检验效果**
- 重启kibana服务
- 通过浏览器访问kibana（http://localhost:5601/），此时会需要验证登陆

#### 3) 在logstash中安装X-Pack
**step 1. 在logstash中安装X-Pack**
``` bash
bin/logstash-plugin install x-pack
Downloading file: https://artifacts.elastic.co/downloads/logstash-plugins/x-pack/x-pack-6.2.4.zip
Downloading [=============================================================] 100%
Installing file: /tmp/studtmp-3194fb67c182e5c40490c6236b617a1b83f68ef2ddb9ed2874585ef0ccc0/x-pack-6.2.4.zip
Install successful
```

**step 2. logstash配置修改**
拷贝ca.crt签名证书到logstash机器，等待配置

logstash.yml
``` yaml
xpack.monitoring.enabled: true
xpack.monitoring.elasticsearch.url: https://192.168.100.68:9200
xpack.monitoring.elasticsearch.username: logstash_system
xpack.monitoring.elasticsearch.password: logstashpassword
xpack.monitoring.elasticsearch.ssl.ca: /usr/local/logstash/config/certs/ca.crt
```
> xpack monitoring的配置参考：[es 6.2官方文档](https://www.elastic.co/guide/en/logstash/6.2/configuring-logstash.html)

```
input {
  redis {
    data_type => "list"
    key => "filebeat-*"
    host => "127.0.0.1"
    port => 6379
    threads => 5
    password => "123456"
  }
}
filter {

}
output {
  elasticsearch {
    ssl => true
    hosts => ["192.168.100.68:9200"]
    index => "%{[fields][service]}"
    user => logstash_system
    password => changeme
    cacert => "/usr/local/logstash/config/certs/ca.crt"
  }
}

```
> - [cacert 配置说明](https://www.elastic.co/guide/en/logstash/6.2/plugins-outputs-elasticsearch.html#plugins-outputs-elasticsearch-cacert)
> - [ssl 配置说明](https://www.elastic.co/guide/en/logstash/6.2/plugins-outputs-elasticsearch.html#plugins-outputs-elasticsearch-ssl)

> Failed to install template error
---
title: elk 1.1.0: production installation
date: 2018-05-14 09:38:00
categories: bigdata/elk
tags: [elk, elasticsearch, filebeat, logstash, kibana, redis]
---
### elk 1.1.0: production installation

### 0. 组件介绍
详细的组件说明可参照官方文档，此处只列出基于生产环境的标准考量采用的组件。
- `filebeat`, log collector
- `redis`, message queue
- `logstash`, log analysis & filter
- `elasticsearch`, storage & search
- `kibana`, web UI

服务分布架构

服务器ip|角色|备注
---|---|---
192.168.86.24|tomcat & filebeat|6.2.4
192.168.86.105|tomcat & filebeat|6.2.4
192.168.86.138|redis|3.2.4
192.168.86.130|logstash|6.2.4
192.168.100.68|elasticsearch|6.2.4
192.168.100.68|kibana|6.2.4

### 1. 安装及配置
#### 1) elasticsearch
*在elasticsearch节点机器上执行以下命令*

**用户**
``` bash
groupadd elasticsearch
useradd -g elasticsearch elasticsearch
```

**安装**
``` bash
cd /usr/local/src
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.2.4.tar.gz
tar zxvf elasticsearch-6.2.4.tar.gz
mv elasticsearch-6.2.4 /usr/local/elasticsearch
mkdir /usr/local/elasticsearch/var
chown -R elasticsearch.elasticsearch /usr/local/elasticsearch
```

**配置systemd文件**
``` bash
echo '[Unit]
Description=Elasticsearch
Documentation=http://www.elastic.co
Wants=network-online.target
After=network-online.target

[Service]
RuntimeDirectory=elasticsearch
Environment=JAVA_HOME=/usr/java/jdk1.8.0_144
Environment=JRE_HOME=${JAVA_HOME}/jre
Environment=ES_HOME=/usr/local/elasticsearch
Environment=ES_PATH_CONF=/usr/local/elasticsearch/config
Environment=PID_DIR=/usr/local/elasticsearch/var
EnvironmentFile=-/usr/local/elasticsearch/config/default/elasticsearch

WorkingDirectory=/usr/local/elasticsearch

User=elasticsearch
Group=elasticsearch

ExecStart=/usr/local/elasticsearch/bin/elasticsearch -p ${PID_DIR}/elasticsearch.pid --quiet

# StandardOutput is configured to redirect to journalctl since
# some error messages may be logged in standard output before
# elasticsearch logging system is initialized. Elasticsearch
# stores its logs in /var/log/elasticsearch and does not use
# journalctl by default. If you also want to enable journalctl
# logging, you can simply remove the "quiet" option from ExecStart.
StandardOutput=journal
StandardError=inherit

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536

# Specifies the maximum number of processes
LimitNPROC=4096

# Specifies the maximum number of memory_lock
LimitMEMLOCK=infinity

# Specifies the maximum size of virtual memory
LimitAS=infinity

# Specifies the maximum file size
LimitFSIZE=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=0

# SIGTERM signal is used to stop the Java process
KillSignal=SIGTERM

# Send the signal only to the JVM rather than its control group
KillMode=process

# Java process is never killed
SendSIGKILL=no

# When a JVM receives a SIGTERM signal it exits with code 143
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target

# Built for ${project.name}-${project.version} (${project.name})' > /usr/lib/systemd/system/elasticsearch.service

systemctl daemon-reload
```
> 启动脚本：
- [SysV init file](https://github.com/elastic/elasticsearch/blob/master/distribution/packages/src/rpm/init.d/elasticsearch)  
- [elasticsearch systemd unit file](https://github.com/elastic/elasticsearch/blob/master/distribution/packages/src/common/systemd/elasticsearch.service)

**配置elasticsearch.yml**
``` yaml
cluster.name: dc-es
node.name: node-1
path.data: /home/es-data
path.logs: /home/es-data
bootstrap.memory_lock: true
network.host: 0.0.0.0
http.port: 9200
```
> 当设定bootstrap.memory_lock: true锁定内存地址之后，容易出现错误：`memory locking requested for elasticsearch process but memory is not locked`，解决办法是在`/etc/security/limits.conf`中配置如下`* soft memlock unlimited`和`* hard memlock unlimited`

> data和log目录设定好以后，要记得创建并授权给elasticsearch
``` bash
mkdir -p /home/es-data
chown -R elasticsearch.elasticsearch /home/es-data
```

**配置jvm.options**
```
-Xms16g
-Xmx16g
```

**系统调优**
``` bash
# 关闭swap
sudo swapoff -a
# 永久关闭需要打开/etc/fstab，注释包含swap关键字那行

# 增大文件句柄
ulimit -n 65536
# 或者打开/etc/security/limits.conf，把nofile设置成65536

# 虚拟内存
sysctl -w vm.max_map_count=262144
# 也可以在/etc/sysctl.conf中设置vm.max_map_count算

# 线程数量
ulimit -u 4096
# 或者打开/etc/security/limits.conf，把nproc设定为4096

# 内存锁定容量
ulimit -l unlimited
# 或者打开/etc/security/limits.conf，把memlock设定为unlimited
```
> 如果使用的是systemd来host服务，ulimit的三个选项可以在systemd的unitfile里面配置

<!--
#### 2) 给elasticsearch安装x-pack
``` bash
# 1. 安装x-pack
/usr/local/elasticsearch/bin/elasticsearch-plugin install x-pack

# 2. 让x-pack可以auto index
# 默认情况下，elasticsearch允许automatic index creation，我们不需要做任何操作
# 确保没有手动禁用这个配置(elasticsearch.yml)就好，否则就需要启用它，例如下面
action.auto_create_index: .security,.monitoring*,.watches,.triggered_watches,.watcher-history*,.ml*
```

增强node节点之间的安全性
``` bash
# step 1. 生成ca
/usr/local/elasticsearch/bin/x-pack/certutil ca --pem
unzip elastic-stack-ca.zip
# 默认生成了一个ca/ca.key ca/ca.crt，用这个ca可以给集群节点的key签名

# step 2. 给所有节点生成证书
/usr/local/elasticsearch/bin/x-pack/certutil cert --pem --ca-cert ca/ca.crt --ca-key ca/ca.key --ip 127.0.0.1,192.168.100.68
unzip certificate-bundle.zip
# 默认生成了instance/instance.crt  instance/instance.key

# step 3. 拷贝证书到相应的节点
# 此处我只有一个节点，就mv .p12的证书文件到任意一个指定目录就可以了
mkdir /usr/local/elasticsearch/config/certs
cp ca/ca.crt instance/* /usr/local/elasticsearch/config/certs
# ca.key需要保存好，如果你生成的时候给它配置了密码，也请记录好，以后增加es节点就靠这个文件来生成证书

# step 4. 配置证书到elasticsearch.yml中，增加以下配置
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.key: /usr/local/elasticsearch/config/certs/instance.key
xpack.security.transport.ssl.certificate: /usr/local/elasticsearch/config/certs/instance.crt
xpack.security.transport.ssl.certificate_authorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
```

增强http连接安全性（client -> server）
``` bash
# step 0. 确保node节点之间的安全性搞定，并获得了ca和证书

# step 1. 修改配置文件（elasticsearch.yml）
xpack.security.http.ssl.client_authentication: none
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.key:  /usr/local/elasticsearch/config/certs/instance.key  
xpack.security.http.ssl.certificate: /usr/local/elasticsearch/config/certs/instance.crt
xpack.security.http.ssl.certificate_authorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
```
> [参照链接](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/configuring-tls.html)
> [xpack.security.http.ssl.client_authentication](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html)必须要配置，不然会报错`did not find a SSLContext for [SSLConfiguration ...`。

给内置用户增加密码
``` bash
/usr/local/elasticsearch/bin/x-pack/setup-passwords interactive
# 会依次让你设定已下三个用户的密码
# elastic,kibana,logstash_system
```
> 密码可以随便设定，例如elastic123
-->

#### 3) 安装kibana
*以下命令在kibana节点服务器上执行*

**用户**
``` bash
groupadd kibana
useradd -g kibana kibana
```

**安装**
``` bash
cd /usr/local/src
wget https://artifacts.elastic.co/downloads/kibana/kibana-6.2.4-linux-x86_64.tar.gz
tar -xzf kibana-6.2.4-linux-x86_64.tar.gz
mv kibana-6.2.4-linux-x86_64 /usr/local/kibana
chown -R kibana.kibana /usr/local/kibana
```

**配置systemd**
``` bash
echo '[Unit]
Description=Kibana 6

[Service]
Type=simple
User=kibana
Environment=KIBANA_HOME=/usr/local/kibana
Environment=CONFIG_PATH=/usr/local/kibana/kibana.yml
Environment=NODE_ENV=production
ExecStart=/usr/local/kibana/bin/kibana

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kibana.service

systemctl daemon-reload
```

**配置kibana.yml**
``` yaml
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.url: "http://127.0.0.1:9200"
```
<!--
**配置kibana.yml**
``` yaml
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.url: "https://127.0.0.1:9200"
elasticsearch.username: "kibana"
elasticsearch.password: "kibana123"
```

#### 4) 给kibana安装x-pack
``` bash
# step 1. 安装x-pack
/usr/local/kibana/bin/kibana-plugin install x-pack

# step 2. 修改kibana.yml配置
elasticsearch.ssl.certificate: /usr/local/elasticsearch/config/certs/instance.crt
elasticsearch.ssl.key: /usr/local/elasticsearch/config/certs/instance.key
elasticsearch.ssl.certificateAuthorities: [ "/usr/local/elasticsearch/config/certs/ca.crt" ]
elasticsearch.ssl.verificationMode: certificate
```
-->

#### 5) 安装logstash
*以下命令在logstash节点服务器上执行*

**用户**
``` bash
groupadd logstash
useradd -g logstash logstash
```

**安装**
``` bash
cd /usr/local/src
wget https://artifacts.elastic.co/downloads/logstash/logstash-6.2.4.tar.gz
tar zxvf logstash-6.2.4.tar.gz
mv logstash-6.2.4 /usr/local/logstash
chown -R logstash.logstash /usr/local/logstash

mkdir /home/logstash/logs
mkdir /home/logstash/data
chown -R logstash.logstash /home/logstash
```

**配置systemd**
``` bash
echo '[Unit]
Description=Logstash
Documentation=https://www.elastic.co/products/logstash
After=network.target
#ConditionPathExists=/etc/logstash.conf

[Service]
Environment=JAVA_HOME=/usr/java/jdk1.8.0_144
Environment=JRE_HOME=${JAVA_HOME}/jre
Environment=HOME=/usr/local/logstash
ExecStart=/usr/local/logstash/bin/logstash

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/logstash.service

systemctl daemon-reload
```
> HOME变量是为了解决一个[dotfile变量不存在问题](https://github.com/awesome-print/awesome_print/issues/316)

**配置startup.options**
```
# Override Java location
#JAVACMD=/usr/bin/java

# Set a home directory
LS_HOME=/usr/local/logstash
HOME=${LS_HOME}

# logstash settings directory, the path which contains logstash.yml
LS_SETTINGS_DIR="${LS_HOME}/config"

# Arguments to pass to logstash
LS_OPTS="--path.settings ${LS_SETTINGS_DIR}"

# Arguments to pass to java
LS_JAVA_OPTS=""

# pidfiles are not used the same way for upstart and systemd; this is for sysv users.
LS_PIDFILE=/var/run/logstash.pid

# user and group id to be invoked as
LS_USER=logstash
LS_GROUP=logstash

# Enable GC logging by uncommenting the appropriate lines in the GC logging
# section in jvm.options
LS_GC_LOG_FILE=/var/log/logstash/gc.log

# Open file limit
LS_OPEN_FILES=16384

# Nice level
LS_NICE=19

# Change these to have the init script named and described differently
# This is useful when running multiple instances of Logstash on the same
# physical box or vm
SERVICE_NAME="logstash"
SERVICE_DESCRIPTION="logstash"
```
> 这个文件仅用于$LS_HOME/bin/system-install去生成启动脚本用，如果使用的是systemd，那就不需要用这个文件了

**配置jvm.options**
```
-Xms16g
-Xmx16g
```

**配置logstash.yml**
``` yaml
# ------------ Data path ------------------
path.data: /home/logstash/data
# ------------ Pipeline Settings --------------
# pipeline.id: main
# pipeline.batch.size: 125
# path.config: /usr/local/logstash/config/redis-pipelines.conf
# ------------ Pipeline Configuration Settings --------------
# config.test_and_exit: true
config.reload.automatic: true
config.reload.interval: 3s
# ------------ Debugging Settings --------------
log.level: info
path.logs: /home/logstash/logs
```
> 此配置主要是配置logstash的启动选项，在command line指定的选项会覆盖此配置文件中的配置

**配置pipeline.yml**
``` yaml
- pipeline.id: redis-pipe
  queue.type: persisted
  path.config: "/usr/local/logstash/config/redis-pipelines.conf"
```
> 默认的pipeline配置的主文件

**配置redis-pipelines.conf**
```
input {
    redis {
        data_type => "list"
        key => "filebeat-*"
        host => "192.168.86.138"
        port => 6379
        threads => 5
        password => "my_password"
    }
}
filter {

}
output {
  elasticsearch {
    hosts => ["192.168.100.68:9200"]
    index => "%{[fields][service]}"
  }
}
```
> - [input redis docs](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-redis.html)
> - [input redis example](https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/input/redis.html)

> `"%{[fields][service]}"`是filebeat中的一个field，[如何在logstash中使用filebeat的field](https://discuss.elastic.co/t/how-to-use-filebeat-fields-name-value-in-logstash-config/79791/3)

> logstash中的input部分，redis的key是不可以模糊匹配的，只能写唯一值。 但是比较奇怪的是，好多中文甚至是英文文档里面，他们的配置举例里面都是带wildcard的类似于`test-*`这种写法，针对这种情况，我在elasticsearch的官方讨论区里面找到了一个elasticsearch团队的成员的确切回答，这边只能写唯一值(warkolm
Mark Walkom Elastic Team Member May 24:I believe you can only input a single key there.)，链接在[这里:elasticsearch的讨论区](https://discuss.elastic.co/t/redis-input-wildcard-key-seems-not-working/132962)，还有[这里:谷歌讨论组](https://groups.google.com/forum/#!msg/logstash-users/GWNx5OFd5XQ/tTHrAmjshRgJ)

<!--
```
input {
    redis {
        data_type => "list"
        key => "filebeat-*"
        host => "192.168.86.138"
        port => 6379
        threads => 5
        password => "my_password"
    }
}
filter {

}
output {
  elasticsearch {
    hosts => ["192.168.100.68:9200"]
    index => "%{[fields][service]}"
    user => logstash_system
    password => logstash_system123
  }
}
```
-->

<!--
#### 6) install x-pack for logstash
``` bash
# step 1. install plugin x-pack
/usr/local/logstash/bin/logstash-plugin install x-pack

# step 2. config logstash.yml
xpack.monitoring.elasticsearch.username: logstash_system
xpack.monitoring.elasticsearch.password: logstashpassword
```
-->

#### 7) 安装filebeat
**安装**
``` bash
cd /usr/local/src
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.2.4-x86_64.rpm
rpm -vi filebeat-6.2.4-x86_64.rpm
```

**配置文件：/etc/filebeat/filebeat.yml**
``` yaml
#=========================== Filebeat prospectors =============================
filebeat.prospectors:
- type: log
  enabled: true
  tail_files: true
  paths:
    - /home/middleservice/blog_midd/logs/catalina.out
  fields:
    service: blog_midd
  multiline.pattern: '^[[:space:]]+(at|\.{3})\b|^Caused by:'
  multiline.negate: false
  multiline.match: after
#============================= Filebeat modules ===============================
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
#==================== Elasticsearch template setting ==========================
setup.template.settings:
  index.number_of_shards: 3
#================================ General =====================================
name: 86.24
tags: ["middleservice", "service"]
#================================ Outputs =====================================
output.redis:
  hosts: ["192.168.86.138"]
  password: "my_password"
  bulk_max_size: 1024
  key: "filebeat-midd"
  db: 0
  timeout: 5
```
> - [fileds替换document_type](http://blog.51cto.com/kexiaoke/2092029)
- [filebeat multiline example](https://www.elastic.co/guide/en/beats/filebeat/master/_examples_of_multiline_configuration.html)
- `filebeat modules list`, 可查看启用的[modules](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html)
- [general config docs](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-general-options.html)
- redis的[datatype配置](https://www.elastic.co/guide/en/beats/filebeat/current/redis-output.html#_literal_datatype_literal)默认是list
- [Failed to RPUSH to redis list with write tcp i/o timeout错误解决](https://discuss.elastic.co/t/filebeat-error-err-failed-to-publish-events-caused-by-read-tcp-i-o-timeout/68023)
- filebeat默认从日志文件开头开始收集日志，如果希望filebeat从文件末尾开始收集日志，需要在日志源处配置`tail_files: true`。同时，filebeat会维护一个registry文件，来记录filebeat读取日志的位置，如果是中途增加了`tail_files: true`配置，需要关闭filebeat服务，删除这个registry文件，然后重新打开filebeat服务才可以。 rpm格式安装的filebeat的registry文件位于:`/var/lib/filebeat/registry`。 详细日志可以参考：[Update the registry file](https://www.elastic.co/guide/en/beats/filebeat/master/migration-registry-file.html)

---
title: kafka 1.1.0 quick start
date: 2018-08-21 13:41:00
categories: linux/service
tags: [kafka]
---
### kafka 1.1.0 quick start

---

### 1. kafka installation
``` bash
# step 1. download kafka
wget http://www-eu.apache.org/dist/kafka/2.0.0/kafka_2.11-2.0.0.tgz
tar -xzf kafka_2.11-2.0.0.tgz
mv kafka_2.11-2.0.0 /usr/local/

# step 2. prepare kafka systemd unit files
echo '[Unit]
Description=Apache Zookeeper server (Kafka)
Documentation=http://zookeeper.apache.org
Requires=network.target
After=network.target

[Service]
Type=simple
User=root
Group=root
Environment=JAVA_HOME=/usr/java/jdk1.8.0_144
ExecStart=/usr/local/kafka_2.11-2.0.0/bin/zookeeper-server-start.sh /usr/local/kafka_2.11-2.0.0/config/zookeeper.properties
ExecStop=/usr/local/kafka_2.11-2.0.0/bin/zookeeper-server-stop.sh

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kafka-zookeeper.service

echo '[Unit]
Description=Apache Kafka server (broker)
Documentation=http://kafka.apache.org/documentation.html
Requires=network.target
After=network.target kafka-zookeeper.service

[Service]
Type=simple
User=root
Group=root
Environment=JAVA_HOME=/usr/java/jdk1.8.0_144
ExecStart=/usr/local/kafka_2.11-2.0.0/bin/kafka-server-start.sh /usr/local/kafka_2.11-2.0.0/config/server.properties
ExecStop=/usr/local/kafka_2.11-2.0.0/bin/kafka-server-stop.sh

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kafka.service

# step 3. reload systemd unit files
systemctl daemon-reload
```

### 2. kafka configuration
`config/zookeeper.properties`部分配置
``` properties
# the directory where the snapshot is stored.
dataDir=/tmp/zookeeper
```

`config/server.properties`部分配置
``` properties
# The id of the broker. This must be set to a unique integer for each broker.
broker.id=0

# The address the socket server listens on. It will get the value returned from 
# java.net.InetAddress.getCanonicalHostName() if not configured.
listeners=PLAINTEXT://:9092

# The number of threads that the server uses for receiving requests from the network and sending responses to the network
num.network.threads=3

# The number of threads that the server uses for processing requests, which may include disk I/O
num.io.threads=8

# The send buffer (SO_SNDBUF) used by the socket server
socket.send.buffer.bytes=102400

# The receive buffer (SO_RCVBUF) used by the socket server
socket.receive.buffer.bytes=102400

# The maximum size of a request that the socket server will accept (protection against OOM)
socket.request.max.bytes=104857600

# A comma separated list of directories under which to store log files
log.dirs=/tmp/kafka-logs

# The default number of log partitions per topic. More partitions allow greater
# parallelism for consumption, but this will also result in more files across
# the brokers.
num.partitions=1
```

> 此处只是部分配置，详细可以参照官方文档查看所有配置信息

### 3. kafka start
``` bash
systemctl start kafka-zookeeper.service
systemctl start kafka.service
```

### 4. Create a topic
``` bash
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
Created topic "test".

bin/kafka-topics.sh --list --zookeeper localhost:2181
test

# alter partition numbers
bin/kafka-topics.sh --alter --zookeeper localhost:2181 --partitions 2 --topic test
WARNING: If partitions are increased for a topic that has a key, the partition logic or ordering of the messages will be affected
Adding partitions succeeded!
```

### 5. 生产和消费数据
``` bash
bin/kafka-console-producer.sh --broker-list 192.168.33.10:9092 --topic test
test
test2
quit

bin/kafka-console-consumer.sh --bootstrap-server 192.168.33.10:9092 --topic test --from-beginning
test
quit
test2
```

### 6. 设置一个多broker的集群
配置和启动集群
``` bash
# step 1. 准备其他两个节点的配置文件
cp config/server.properties config/server-1.properties
cp config/server.properties config/server-2.properties

# config/server-1.properties
broker.id=1
listeners=PLAINTEXT://:9093
log.dirs=/tmp/kafka-logs-1
 
# config/server-2.properties:
broker.id=2
listeners=PLAINTEXT://:9094
log.dirs=/tmp/kafka-logs-2

# step 2. 准备systemd unit file
# - 复制/usr/lib/systemd/system/kafka.service为/usr/lib/systemd/system/kafka-1.service和/usr/lib/systemd/system/kafka-2.service
# - 修改ExecStart中指向的配置文件为对应的配置文件（上面准备的）


# step 3. 启动集群
systemct daemon-reload
systemctl start kafka-1
systemctl start kafka-2
```

设定多factor单分区的topic
``` bash
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 1 --topic my-replicated-topic
Created topic "my-replicated-topic".

bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic
Topic:my-replicated-topic	PartitionCount:1	ReplicationFactor:3	Configs:
	Topic: my-replicated-topic	Partition: 0	Leader: 1	Replicas: 1,0,2	Isr: 1,0,2
```

设定多factor多分区的topic
``` bash
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 4 --topic my-replicated-topic-4
Created topic "my-replicated-topic-4".

bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-replicated-topic-4
Topic:my-replicated-topic-4	PartitionCount:4	ReplicationFactor:3	Configs:
	Topic: my-replicated-topic-4	Partition: 0	Leader: 2	Replicas: 2,1,0	Isr: 2,1,0
	Topic: my-replicated-topic-4	Partition: 1	Leader: 0	Replicas: 0,2,1	Isr: 0,2,1
	Topic: my-replicated-topic-4	Partition: 2	Leader: 1	Replicas: 1,0,2	Isr: 1,0,2
	Topic: my-replicated-topic-4	Partition: 3	Leader: 2	Replicas: 2,0,1	Isr: 2,0,1
```
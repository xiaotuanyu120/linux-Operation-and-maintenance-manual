---
title: elk 2.2.0 config kafka with filebeat and logstash
date: 2018-08-21 09:30:00
categories: devops/elk
tags: [elk, kafka, logstash, filebeat]
---
### elk 2.2.0 config kafka with filebeat and logstash

---

### 1. 配置kafka为filebeat的输出目标
``` yaml
filebeat.prospectors:
- type: log
  enabled: true
  paths:
    - /path/to/catalina.out
  fields:
    service: some_service_name
    log_topic: some_log_topic_name
  multiline.pattern: '^[[:space:]]+(at|\.{3})\b|^Caused by:'
  multiline.negate: false
  multiline.match: after

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false

setup.template.settings:
  index.number_of_shards: 3

name: beat_name
tags: ["tag1", "tag2"]
output.kafka:
  # initial brokers for reading cluster metadata
  hosts: ["kafka1:9092", "kafka2:9092", "kafka3:9092"]

  # message topic selection + partitioning
  topic: '%{[fields.log_topic]}'
  partition.round_robin:
    reachable_only: false

  required_acks: 1
  compression: gzip
  max_message_bytes: 1000000
```
> [filebeat kafka output](https://www.elastic.co/guide/en/beats/filebeat/master/kafka-output.html)

> filebeat默认从日志文件开头开始收集日志，如果希望filebeat从文件末尾开始收集日志，需要在日志源处配置`tail_files: true`。同时，filebeat会维护一个registry文件，来记录filebeat读取日志的位置，如果是中途增加了`tail_files: true`配置，需要关闭filebeat服务，删除这个registry文件，然后重新打开filebeat服务才可以。 rpm格式安装的filebeat的registry文件位于:`/var/lib/filebeat/registry`。 详细日志可以参考：[Update the registry file](https://www.elastic.co/guide/en/beats/filebeat/master/migration-registry-file.html)

### 2. 配置kafka为logstash的输入源
``` yaml
input {
  kafka{
    bootstrap_servers => ["ip1:9092,ip2:9093"]
    topics => "filebeat-nginx"
    consumer_threads => 1
    decorate_events => true
    codec => "json"
    auto_offset_reset => "latest"
  }
}
```
> [logstash input plugin kafka](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-kafka.html)
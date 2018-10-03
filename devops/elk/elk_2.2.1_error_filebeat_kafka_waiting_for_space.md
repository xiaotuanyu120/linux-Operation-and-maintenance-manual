---
title: elk 2.2.1 config kafka with filebeat and logstash
date: 2018-10-03 15:12:00
categories: devops/elk
tags: [elk, kafka, logstash, filebeat]
---
### elk 2.2.1 config kafka with filebeat and logstash

---

### 1. 错误信息
```
2018-07-09T13:54:25+02:00 INFO producer/broker/[[0]] maximum request accumulated, waiting for space
2018-07-09T13:54:25+02:00 INFO producer/broker/[[0]] maximum request accumulated, waiting for space
```

### 2. 原因及解决办法
网上查看这个错误，找到一个[解决办法的文章](https://discuss.elastic.co/t/file-beat-kafka-producer-config/139175)，里面提到解决办法是`I have solved by increasing Buffer memory and producer config of Filebeat and Kafka`。于是修改filebeat的配置
``` yaml
filebeat.prospectors:
- type: log
  enabled: true
  paths:
    - /home/data/wwwlogs/e68_web.log
  fields:
    service: e68_web_nginx
    log_topic: filebeat-web-nginx
  multiline.pattern: '^[[:space:]]+(at|\.{3})\b|^Caused by:'
  multiline.negate: false
  multiline.match: after

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false

setup.template.settings:
  index.number_of_shards: 3

name: 13.251.170.43
tags: ["web-nginx", "e68"]
output.kafka:
  hosts: ["69.172.86.138:9092", "69.172.86.138:9093", "47.91.153.74:9092"]

  topic: '%{[fields.log_topic]}'
  partition.round_robin:
    reachable_only: false

  required_acks: 1
  compression: gzip
  max_message_bytes: 100000000
```
> 提高max_message_bytes的缓冲区数值为100000000。[max_message_bytes配置说明](https://www.elastic.co/guide/en/beats/filebeat/master/kafka-output.html#kafka-max_message_bytes)
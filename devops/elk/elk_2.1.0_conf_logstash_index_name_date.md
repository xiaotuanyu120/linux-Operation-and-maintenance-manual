---
title: elk 2.1.0 logstash config index name with current date
date: 2018-08-21 09:22:00
categories: devops/elk
tags: [elk, logstash]
---
### elk 2.1.0 logstash config index name with current date

---

### 1. 配置index名称
本来是想找到如何archive旧elasticsearch的办法，结果突然想到，可以将index名称里面增加上日期，这样的话，就可以按照日期来储存不同的数据，之后archive或者删除也方便。
``` yaml
output {
  elasticsearch {
    hosts => ["host_ip:9200"]
    index => "%{[fields][service]}-%{+YYYY-MM}"
    user => "logstash_system"
    password => "logstash_system123"
  }
}
```
> [关于index名称中配置日期的讨论](https://discuss.elastic.co/t/indexname-with-current-date/51413)
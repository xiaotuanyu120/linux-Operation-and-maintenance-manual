---
title: elk 3.2.0 logstash plugin geoip and kibana visualize
date: 2018-08-27 16:42:00
categories: bigdata/elk
tags: [elk, logstash, geoip, kibana]
---
### elk 3.2.0 logstash plugin geoip and kibana visualize

---

### 1. 自定义index的创建模板
必须要在elasticsearch中的index创建之前来创建这个模板，不然的话，创建这个模板是不会对已经存在的index生效的。
``` bash
PUT _template/logstash
{
    "order": 0,
    "version": 60001,
    "index_patterns": [
      "logstash-*"
    ],
    "settings": {
      "index": {
        "refresh_interval": "5s"
      }
    },
    "mappings": {
      "_default_": {
        "dynamic_templates": [
          {
            "message_field": {
              "path_match": "message",
              "match_mapping_type": "string",
              "mapping": {
                "type": "text",
                "norms": false
              }
            }
          },
          {
            "string_fields": {
              "match": "*",
              "match_mapping_type": "string",
              "mapping": {
                "type": "text",
                "norms": false,
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              }
            }
          }
        ],
        "properties": {
          "@timestamp": {
            "type": "date"
          },
          "@version": {
            "type": "keyword"
          },
          "geoip": {
            "dynamic": true,
            "properties": {
              "ip": {
                "type": "ip"
              },
              "location": {
                "type": "geo_point"
              },
              "latitude": {
                "type": "half_float"
              },
              "longitude": {
                "type": "half_float"
              }
            }
          }
        }
      }
    },
    "aliases": {}
  }
```
> 其中最重要的是下面mapping中的geoip部分，主要是定义了location、latitude和longitude字段的格式。
``` json
{
  "geoip": {
    "dynamic": true,
    "properties": {
      "ip": {
        "type": "ip"
      },
      "location": {
        "type": "geo_point"
      },
      "latitude": {
        "type": "half_float"
      },
      "longitude": {
        "type": "half_float"
      }
    }
  }
}
```

**之所以要配置上面的templates，来自定义mapping规则，将location字段格式化成geo_point格式，是因为在kibana中创建visuallize时，要用到coordinate map。而只有geo_point格式的字段，才能被coordinate map使用，location中记录的是一个ip访问的经纬度信息，通过geo_point格式被kibana的coordinate map加载，才会有在地图上显示客户访问位置的效果**

### 2. 配置logstash
```
filter {
  grok {
    patterns_dir => ["./patterns"]
    match => { "message" => "%{NGINXWEB}" }
  }
  geoip {
    source => "clientip"
  }
```
> geoip中的source选项，是来指定使用什么grok中的什么字段来作为输入源，所以我们必须在grok的匹配中配置一个名为`clientip`的字段。此处的`NGINXWEB`是我自定义的一个grok pattern，感兴趣的可以参照[这篇文章](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/bigdata/elk/elk_3.1.0_logstash_plugin_grok.md)。
> geoip中还可以配置`database`选项来指定自定义的geoip的地址库，可以买商业版。

需要注意的部分是，index名称部分，要和上面templates中定义的index_patterns中配置的匹配起来
```
output {
  elasticsearch {
    hosts => ["iporhostname:9200"]
    index => "logstash-%{[fields][service]}-%{+YYYY-MM}"
    user => "user"
    password => "password"
  }
}
```

当配置完logstash，并重启logstash之后，logstash加载我们的配置，会自动去elasticsearch中创建index，此时就会应用我们定义好的template，然后就会自动加入geoip的mapping规则。接下来，我们就需要去kibana处创建visualize了

### 3. 创建visualize
- 在management中增加index pattern(使用上面我们在logstash的output部分配置的index名称)
- 在visualize中创建新的visualize，类型选择coordinate map，index名称选择上面新增加的index pattern，然后在buckets中选择Geo Coordinate，在Aggregation中选择Geohash，在field中选择我们上面转换成geo_point格式的geoip.location，然后保存
- 在dashboard中可以增加创建好的visualize项目来展示出来看
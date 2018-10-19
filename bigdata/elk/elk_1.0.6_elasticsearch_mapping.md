---
title: elk 1.0.6: elasticsearch mapping
date: 2018-08-28 16:07:00
categories: bigdata/elk
tags: [elk, elasticsearch, mapping]
---
### elk 1.0.6: elasticsearch mapping

### 1. mapping
[mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)是一个定义文档和它包含的fields如何存储和索引的处理过程。例如：  
- 定义哪一个字符串字段会被处理成全字符串的字段
- 定义哪一个字段包含数字，日期或者geolocations
- 定义是否文档包含的所有文档的值都需要保存到_all字段中
- 定义日期字段的格式
- 为动态添加的字段制定自定义mapping规则

#### mapping 类型 => 字段数据类型
- 基本类型: `text`, `keyword`, `date`, `long`, `double`, `boolean` or `ip`.
- 支持JSON的分层特性的类型： `object`, `nested`.
- 特殊类型： `geo_point`, ` geo_shape` or `completion`.

#### mapping 例子
```
PUT my_index 
{
  "mappings": {
    "doc": { 
      "properties": { 
        "title":    { "type": "text"  }, 
        "name":     { "type": "text"  }, 
        "age":      { "type": "integer" },  
        "created":  {
          "type":   "date", 
          "format": "strict_date_optional_time||epoch_millis"
        }
      }
    }
  }
}
```

#### mapping 更新
现存的mapping无法被更新，只能是重新创建一个新的index，配置新的mapping规则，然后把老的数据reindex过来。
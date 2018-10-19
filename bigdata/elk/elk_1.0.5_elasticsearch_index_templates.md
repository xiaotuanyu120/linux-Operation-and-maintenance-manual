---
title: elk 1.0.5: elasticsearch index templates
date: 2018-08-28 15:09:00
categories: bigdata/elk
tags: [elk, elasticsearch, templates]
---
### elk 1.0.5: elasticsearch index templates

### 1. index templates
[index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates.html)是es中的一种模板，当创建index时，根据index templates中指定的index_patterns数组来确定新index应用哪个模板。templates中包含settings、mappings和index_patterns。index templates只会在index创建时被应用，当index已经存在时，修改现存的index templates无法影响该index。

#### 查看index templates
```
GET _template
GET _template/template_1
GET /_template/temp*
GET /_template/template_1,template_2
```

#### 查看index templates是否存在
```
HEAD _template/template_1
```

#### 创建index templates
```
PUT _template/template_1
{
  "index_patterns": ["te*", "bar*"],
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "_doc": {
      "_source": {
        "enabled": false
      },
      "properties": {
        "host_name": {
          "type": "keyword"
        },
        "created_at": {
          "type": "date",
          "format": "EEE MMM dd HH:mm:ss Z YYYY"
        }
      }
    }
  }
}
```
> index templates 支持c语言样式的`/**/`注释

#### 删除index templates
```
DELETE _template/template_1
```

#### 多index templates应用
可以使用多个index templates来应用给同一个index，只需要用order选项来指定顺序，顺序在前的先加载，后面加载的会覆盖之前已存在的选项。
```
PUT /_template/template_1
{
    "index_patterns" : ["*"],
    "order" : 0,
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "_doc" : {
            "_source" : { "enabled" : false }
        }
    }
}

PUT /_template/template_2
{
    "index_patterns" : ["te*"],
    "order" : 1,
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "_doc" : {
            "_source" : { "enabled" : true }
        }
    }
}
```
> _source选项加载了两次，后面加载的覆盖前面加载的，所以最终其配置为{ "enabled" : true }
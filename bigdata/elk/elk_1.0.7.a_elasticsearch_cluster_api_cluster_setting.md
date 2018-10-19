---
title: elk 1.0.7.a: elasticsearch cluster api - cluster setting
date: 2018-10-19 11:03:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elk 1.0.7.a: elasticsearch cluster api - cluster setting


### 1. Cluster Update Settings
允许更新群集范围的特定设置。更新的设置可以是持久的(适用于重启)或是短暂的(重启后失效)。
```
PUT /_cluster/settings
{
    "persistent" : {
        "indices.recovery.max_bytes_per_sec" : "50mb"
    }
}
```
或者
```
PUT /_cluster/settings?flat_settings=true
{
    "transient" : {
        "indices.recovery.max_bytes_per_sec" : "20mb"
    }
}
```
集群会返回更新设定的响应。例如最后一个请求的响应是：
```
{
    ...
    "persistent" : { },
    "transient" : {
        "indices.recovery.max_bytes_per_sec" : "20mb"
    }
}
```

可以通过设定"null"来重置永久或临时设定。如果临时设定被重置时，永久设定可用的话，则应用永久设定。否则的话，elasticsearch会根据配置文件的对应值设定，如果这个设定不存在，则应用该设定的默认值。这里是一个示例：
```
PUT /_cluster/settings
{
    "transient" : {
        "indices.recovery.max_bytes_per_sec" : null
    }
}
```
重置设定后，该设定不会在响应中返回。所以上面操作的响应结果是：
```
{
    ...
    "persistent" : {},
    "transient" : {}
}
```

设定重置也支持wildcard。例如，如果你希望重置所有`indices.recovery`的临时设定，可以使用其作为prefix：
```
PUT /_cluster/settings
{
    "transient" : {
        "indices.recovery.*" : null
    }
}
```

#### Precedence of settings
临时设定优先级高于永久设定，永久设定优先级高于`elasticsearch.yml`文件中配置的设定。

最好是在通过设定API来设定集群范围内的设定，而用`elasticsearch.yml`来配置本地设定。这样，您可以确保所有节点上的设置都相同。另一方面，如果您使用配置文件意外地在不同节点上定义了不同的设置，则很难注意到这些差异。

可以在[Modules文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules.html)中找到动态可更新设置的列表。

### 2. Cluster Get Settings
获取集群设定
```
GET /_cluster/settings
```
或者
```
GET /_cluster/settings?include_defaults=true
```
在上面的示例中，参数include_defaults还确保返回未明确设置的设置。默认情况下，include_defaults设置为false。
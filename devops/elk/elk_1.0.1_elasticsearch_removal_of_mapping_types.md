---
title: elk 1.0.1: elasticsearch removal of mapping types
date: 2018-10-15 15:43:00
categories: devops/elk
tags: [elk, elasticsearch]
---
### elk 1.0.1: elasticsearch removal of mapping types

> **重要**：  
在Elasticsearch 6.0.0或更高版本中创建的索引可能只包含单个映射类型。在具有多种映射类型的5.x中创建的索引将继续像以前一样在Elasticsearch 6.x中运行。映射类型将在Elasticsearch 7.0.0中完全移除。

### 什么是映射类型？
自Elasticsearch的第一个版本以来，每个文档都存储在单个索引中并分配了单个映射类型。映射类型用于表示被索引的文档或实体的类型，例如，twitter索引可能具有`user`类型和`tweet`类型。  

每一个映射类型可以有它自己的字段，所以，`user`类型可以有一个`full_name`、`user_name`和`email`字段，而`tweet`类型可以有一个`content`、`tweeted_at`和像在`user`字段中一样的`user_name`字段。  

每一个文档都有一个包含类型名称的`_type`元字段，可以通过在URL中指定类型名称来在搜索时被一种或多种类型来限定:
```
GET twitter/user,tweet/_search
{
  "query": {
    "match": {
      "user_name": "kimchy"
    }
  }
}
```
`_type`字段结合文档的`_id`可以生成`_uid`字段，拥有相同`_id`的不同类型的文档可以储存在同一个索引中。

映射类型还用于在文档之间建立父子关系，所以`question`类型的文档可以是`answer`类型的文档的父文档。

### 为什么要移除映射类型？
最初，我们谈到了一个“索引”类似于SQL数据库中的“数据库”，而“类型”等同于“表”。

这是一个糟糕的比喻，它会导致错误的假设。在SQL数据库中，表是互相独立的。一个表中的列与另一个表中具有相同名称的列是无关的。映射类型中的字段不是这种情况。

在elasticsearch中的一个索引中，在不同映射类型中的同名字段在内部由相同的Lucene字段支撑。换句话说，使用上面的例子，`user`类型中的`user_name`字段和`tweet`类型中的`user_name`字段会储存在相同的字段中，同时，两个`user_name`字段在两种类型中必须具有相同的映射（定义）。

当你希望同一个索引中的`deleted`字段在一个类型中是`date`字段而在另一个类型中是`boolean`字段时，就会出现问题。

最重要的是，在同一索引中存储具有很少或没有共同字段的不同实体会导致稀疏数据并干扰Lucene有效压缩文档的能力。

基于以上的原因，我们决定在elasticsearch中移除`类型映射`这个概念。

### 映射类型的替代方案
#### 每一个文档类型单独储存在索引中
第一种方法是每个文档类型都有一个索引。不同于将`tweet`类型和`user`类型储存在同一个`twitter`索引中，你可以将`tweet`字段储存在`tweets`索引中，而将`user`字段储存在`user`索引中。

索引之间完全独立，从而也不会有索引之间字段类型冲突的问题。

这个方法有两个优点：
- 数据更密集的可能性增大，因此会更加从Lucene中使用的压缩技术中收益。
- 用于全文搜索评分的术语统计更可能是准确的，因为同一索引中的所有文档都代表单独的实体。

每个索引的大小可以根据其包含的文档数量进行适当调整：您可以为`user`索引使用较少数量的主分片，为`tweets`索引使用较大数量的主分片。

#### 自定义类型字段
当然，群集中可以存在多少个主分片是有限的，因此您可能不希望浪费整个分片只收集几千个文档。在这种情况下，您可以实现自己的自定义`type`字段，该字段的工作方式与旧的`_type`类似。

让我们继续使用上面的例子。最初，工作流程大概是这样子：
```
PUT twitter
{
  "mappings": {
    "user": {
      "properties": {
        "name": { "type": "text" },
        "user_name": { "type": "keyword" },
        "email": { "type": "keyword" }
      }
    },
    "tweet": {
      "properties": {
        "content": { "type": "text" },
        "user_name": { "type": "keyword" },
        "tweeted_at": { "type": "date" }
      }
    }
  }
}

PUT twitter/user/kimchy
{
  "name": "Shay Banon",
  "user_name": "kimchy",
  "email": "shay@kimchy.com"
}

PUT twitter/tweet/1
{
  "user_name": "kimchy",
  "tweeted_at": "2017-10-24T09:00:00Z",
  "content": "Types are going away"
}

GET twitter/tweet/_search
{
  "query": {
    "match": {
      "user_name": "kimchy"
    }
  }
}
```
您可以通过添加自定义`type`字段来实现相同的目的，如下所示：
```
PUT twitter
{
  "mappings": {
    "_doc": {
      "properties": {
        "type": { "type": "keyword" }, 
        "name": { "type": "text" },
        "user_name": { "type": "keyword" },
        "email": { "type": "keyword" },
        "content": { "type": "text" },
        "tweeted_at": { "type": "date" }
      }
    }
  }
}

PUT twitter/_doc/user-kimchy
{
  "type": "user", 
  "name": "Shay Banon",
  "user_name": "kimchy",
  "email": "shay@kimchy.com"
}

PUT twitter/_doc/tweet-1
{
  "type": "tweet", 
  "user_name": "kimchy",
  "tweeted_at": "2017-10-24T09:00:00Z",
  "content": "Types are going away"
}

GET twitter/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "user_name": "kimchy"
        }
      },
      "filter": {
        "match": {
          "type": "tweet" 
        }
      }
    }
  }
}
```

#### 没有映射类型的父子类型
以前，通过将一个映射类型设置为父级，将一个或多个其他映射类型设置为子级来表示父子关系。没有映射类型，我们不能再使用这种语法了。除了表示文档之间关系的方式已更改为使用新的`join`字段之外，这种父子特征将继续像以前一样运行。

### 移除映射类型的规划
这对我们的用户来说是一个很大的变化，所以我们试图让它尽可能轻松。更改将如下所示：
- Elasticsearch 5.6.0
    - 在索引中设置`index.mapping.single_type：true`将启用在6.0中强制执行的每个索引单一类型的行为。
    - 在5.6上创建的索引，可以使用`join`字段来实现父子类型。
- Elasticsearch 6.x
    - 在5.x版本创建的索引将继续在6.x中按照原来的方式存在。
    - 在6.x版本创建的索引仅允许每个索引单一类型。type可以使用任意名称，但是在每个索引中只能有一个type。推荐的type名称是`_doc`，以便索引API具有与7.0中相同的路径：`PUT {index}/_doc/{id}` 和 `POST {index}/_doc`。
    - `_type`名称不能再与`_id`组合以形成`_uid`字段。 `_uid`字段现在是`_id`字段的别名。
    - 新创建的索引不再支持老式的父子类型，而是以`_join`字段方式来替代。
    - 不推荐再使用`_default_`映射类型。
- Elasticsearch 7.x
    - URL中的`type`参数已弃用。例如，索引文档不再需要文档类型。对于自动创建的id，新的索引API是`PUT {index}/_doc/{id}`(在明确的id时) 和 `POST {index}/_doc`
    - 索引创建、`GET|PUT _mapping`和文档API支持查询字符串参数(include_type_name)，该参数指示请求和响应是否应该包含类型名称。这个参数默认是`true`。7.x中创建的未明确指定类型的索引将使用一个虚拟类型`_doc`。未设置`include_type_name = false`将导致弃用警告。
    - `_default_`映射类型已删除。
- Elasticsearch 8.x
    - URL中不再支持type参数。
    - 不推荐使用·include_type_name·参数，默认为false，并在其设置为true时使请求失败。
- Elasticsearch 9.x
    - `include_type_name`参数已删除。
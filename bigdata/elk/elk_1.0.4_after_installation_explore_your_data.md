---
title: elk 1.0.4: explore your data
date: 2018-10-17 13:10:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elk 1.0.4: explore your data

## Exploring Your Data

### 1. prepare data
#### Sample Dataset
我们已经对基础有了一定的了解，现在我们尝试在更加真实的场景下来研究。这里我会准备一组虚拟的银行账户信息。每一条都类似于这样：
``` json
{
    "account_number": 0,
    "balance": 16623,
    "firstname": "Bradshaw",
    "lastname": "Mckenzie",
    "age": 29,
    "gender": "F",
    "address": "244 Columbus Place",
    "employer": "Euron",
    "email": "bradshawmckenzie@euron.com",
    "city": "Hobucken",
    "state": "CO"
}
```
这些数据都是从 www.json-generator.com 生成的，所以请忽略其实际值。

#### Loading the Sample Dataset
你可以从[这里](https://github.com/elastic/elasticsearch/blob/master/docs/src/test/resources/accounts.json?raw=true)下载到测试用的数据集。把文件放在当前目录，然后用下面的命令来导入它到elasticsearch集群中：
``` bash
curl -H "Content-Type: application/json" -XPOST "localhost:9200/bank/_doc/_bulk?pretty&refresh" --data-binary "@accounts.json"
curl "localhost:9200/_cat/indices?v"
```
返回结果是
```
health status index uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   bank  l7sSYV2cQXmu6_4rJWVIww   5   1       1000            0    128.6kb        128.6kb
```
这意味着我们只是成功地将1000个文档批量索引到银行索引（在_doc类型下）。


### 2. The Search API
现在让我们从一些简单的搜索开始吧。运行搜索有两种基本方法：一种是通过[REST请求URI](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/search-uri-request.html)发送搜索参数，另一种是通过[REST请求体](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/search-request-body.html)发送搜索参数。请求体方法允许您更具表现力，并以更易读的JSON格式定义搜索。我们将尝试一个请求URI方法的示例，但是对于本教程的其余部分，我们将专门使用请求体方法。

可以从_search端点访问用于搜索的REST API。此示例返回银行索引中的所有文档：
```
GET /bank/_search?q=*&sort=account_number:asc&pretty
```

- `/bank/_search`，在bank索引上执行搜索API
- `q=*`，匹配所有的在bank索引中的文档
- `sort=account_number:asc`，使用account_number排序，采用升序排序。
- `pretty`，只是告诉Elasticsearch返回漂亮的JSON结果。

部分返回结果为：
``` json
{
  "took" : 63,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1000,
    "max_score" : null,
    "hits" : [ {
      "_index" : "bank",
      "_type" : "_doc",
      "_id" : "0",
      "sort": [0],
      "_score" : null,
      "_source" : {"account_number":0,"balance":16623,"firstname":"Bradshaw","lastname":"Mckenzie","age":29,"gender":"F","address":"244 Columbus Place","employer":"Euron","email":"bradshawmckenzie@euron.com","city":"Hobucken","state":"CO"}
    }, {
      "_index" : "bank",
      "_type" : "_doc",
      "_id" : "1",
      "sort": [1],
      "_score" : null,
      "_source" : {"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
    }, ...
    ]
  }
}
```
返回结果中，我们看到了如下部分：
- `took` - Elasticsearch执行搜索的时间（以毫秒为单位）
- `timed_out` - 告诉我们搜索是否超时
- `_shards` - 告诉我们搜索了多少个分片，以及搜索成功/失败分片的计数
- `hits` - 搜索结果
- `hits.total` - 符合我们搜索条件的文档总数
- `hits.hits` - 实际的搜索结果数组（默认为前10个文档）
- `hits.sort` - 搜索结果排序的key（如果是按照score排序，则missing）
- `hits._score and max_score` - 目前不需要关注字段含义

下面的操作效果和上面一样，只不过使用的是请求体方式：
```
GET /bank/_search
{
  "query": { "match_all": {} },
  "sort": [
    { "account_number": "asc" }
  ]
}
```

重要的是要理解，一旦您获得了搜索结果，Elasticsearch就完全完成了请求，并且不会在结果中维护任何类型的服务器端资源或打开游标。这与SQL等许多其他平台形成鲜明对比，在其中您可能最初预先获得查询结果的部分子集，然后如果要获取（或翻页）其余的结果则必须连续返回到服务器端，这是使用某种有状态服务器端游标的结果。

### 3. Introducing the Query Language
Elasticsearch提供了一种JSON样式的特定于域的语言，可用于执行查询。这被称为[查询DSL](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl.html)。

查询bank索引所有的文档
```
GET /bank/_search
{
  "query": { "match_all": {} }
}
```
query告诉我们这里是匹配结果的定义语句，match_all是告诉我们实际查询的语句。

除了query之外，我们还可以增加其他的参数来影响搜索的结果。之前我们使用了sort参数，这里我们尝试使用size参数：
```
GET /bank/_search
{
  "query": { "match_all": {} },
  "size": 1
}
```
size影响的是查询结果中返回的数组结果，如果不指定size的值，默认是10。

下面的例子返回查询结果中序号10-19
```
GET /bank/_search
{
  "query": { "match_all": {} },
  "from": 10,
  "size": 10
}
```
from的作用很明显，是指定结果数组中起始的index值，如果没有指定from，默认是0。

下面的例子是使用balance来降序排序：
```
GET /bank/_search
{
  "query": { "match_all": {} },
  "sort": { "balance": { "order": "desc" } }
}
```

### 4. Executing Searches
现在我们已经了解了一些基本的搜索参数，让我们继续了解查询DSL的更多吧。首先，让我们看一下返回结果中的字段。默认情况下，会在查询结果中返回完整的json格式的文档。这被称之为源（命中结果中的`_source`字段）。如果我们不希望返回整个源文档，我们可以选择只返回源的部分字段。

下面的例子展示了如何在搜索结果中只返回两个字段，account_number和balance:
```
GET /bank/_search
{
  "query": { "match_all": {} },
  "_source": ["account_number", "balance"]
}
```
在上面的例子中，我们只是简单的减少了_source参数的内容。它依然会返回_source，只是其中的内容仅包含account_number和balance。

如果你是从SQL世界中来，那么上面的请求类似于`select from`语句。

okay，现在让我们来看看查询部分。之前，我们已经看过了如何是用match_all来匹配索引中所有的文档了。现在让我们看一个新的参数[match](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-match-query.html)，这个参数可以认为可以进行一个基本的字段查询（根据一个或者一组字段来查询）。

下面这个例子返回account number为20的账户：
```
GET /bank/_search
{
  "query": { "match": { "account_number": 20 } }
}
```

下面这个例子返回地址中包含mill的账户：
```
GET /bank/_search
{
  "query": { "match": { "address": "mill" } }
}
```

下面这个例子返回地址中包含mill或者lane的账户：
```
GET /bank/_search
{
  "query": { "match": { "address": "mill lane" } }
}
```

下面这个例子使用了match的一个变种match_phrase，它会返回所有地址匹配“mill lane”的账户：
```
GET /bank/_search
{
  "query": { "match_phrase": { "address": "mill lane" } }
}
```

现在我们来聊聊[bool查询](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-bool-query.html)。bool查询允许我们使用布尔逻辑将较小的查询组成更大的查询。

下面这个例子中，组合了两个小查询成为一个大查询，查询结果中地址必须同时包含mill和lane：
```
GET /bank/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
```
在上面的示例中，bool must子句指定所有必须为true的查询才能将文档视为匹配项。

作为对比，下面这个例子中，查询结果中地址只要包含mill或lane其中一个即可：
```
GET /bank/_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
```
在上面的示例中，bool should字句指定查询中至少有一个为true才能将文档视为匹配项。

下面这个例子中，查询结果中地址既不可能包含mill也不能包含lane：
```
GET /bank/_search
{
  "query": {
    "bool": {
      "must_not": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
```
在上面的示例中，bool should字句指定查询中至少有一个为true才能将文档视为匹配项。

我们可以在bool查询中同时组合must，should和must_not子句。此外，我们可以在任何这些bool子句中组合bool查询来模仿任何复杂的多级布尔逻辑。

下面这个例子中，返回任何40岁但不住在ID（aho）的人的所有帐户：
```
GET /bank/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "age": "40" } }
      ],
      "must_not": [
        { "match": { "state": "ID" } }
      ]
    }
  }
}
```

### 5. Executing Filters
在前面，我们跳过了一个小细节，叫做文档score(搜索结果中的`_score`字段)。socre是一个数值，它是文档与我们指定的搜索查询条件匹配程度的相对值。分值越高，说明和搜索条件契合度越高，反之就是契合度越低。

但是查询并不总是需要产生分数，特别是当它们仅用于“过滤”文档集时。Elasticsearch会检测这些情况并自动优化查询执行，以便不计算无用的分数。

我们在前面中介绍的bool查询还支持过滤子句，这些子句可以来限制其他子句搜索匹配的文档，而不会更改计算得分的方式。举例子之前，让我们介绍[range查询](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-range-query.html)，它允许我们按一系列值过滤文档。这通常用于数字或日期过滤。

下面这个例子，我们使用bool查询到所有balance在20000-30000之间的账户：
```
GET /bank/_search
{
  "query": {
    "bool": {
      "must": { "match_all": {} },
      "filter": {
        "range": {
          "balance": {
            "gte": 20000,
            "lte": 30000
          }
        }
      }
    }
  }
}
```
上面的查询中，match_all是查询部分，range是filter部分。我们可以使用其他任何查询API来替换上面的查询部分和过滤部分。

除了match_all，match，bool和range查询之外，还有很多其他可用的查询类型，我们不会在这里讨论它们。由于我们已经基本了解它们的工作原理，因此将这些知识应用于学习和试验其他查询类型应该不会太困难。

### 6. Executing Aggregations
聚合提供了从数据中分组和提取统计信息的功能。理解聚合的最简单方法是将其大致等同于SQL GROUP BY和SQL聚合函数。在elasticsearch中，你可以执行返回命中结果的搜索，同时在同一个响应中返回单独的聚合信息。这是非常强大和高效的，通过使用简洁的API，你可以同时执行一个查询和多个聚合操作，然后一次性得到所有(或任一)结果，而避免了更多的网络开销。

首先，下面这个例子，使用state来分组所有账户，然后按照count的减序（默认减序）返回前十个（默认10个）state:
```
GET /bank/_search
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      }
    }
  }
}
```
在SQL中，上述聚合在概念上类似于：
``` sql
SELECT state, COUNT(*) FROM bank GROUP BY state ORDER BY COUNT(*) DESC LIMIT 10;
```
返回结果是
``` json
{
  "took": 29,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped" : 0,
    "failed": 0
  },
  "hits" : {
    "total" : 1000,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "group_by_state" : {
      "doc_count_error_upper_bound": 20,
      "sum_other_doc_count": 770,
      "buckets" : [ {
        "key" : "ID",
        "doc_count" : 27
      }, {
        "key" : "TX",
        "doc_count" : 27
      }, {
        "key" : "AL",
        "doc_count" : 25
      }, {
        "key" : "MD",
        "doc_count" : 25
      }, {
        "key" : "TN",
        "doc_count" : 23
      }, {
        "key" : "MA",
        "doc_count" : 21
      }, {
        "key" : "NC",
        "doc_count" : 21
      }, {
        "key" : "ND",
        "doc_count" : 21
      }, {
        "key" : "ME",
        "doc_count" : 20
      }, {
        "key" : "MO",
        "doc_count" : 20
      } ]
    }
  }
}
```
我们可以看到，在ID生活的account有27个，TX的有27个...依次往下类推。

值得注意的是我们设定了size为0，是因为我们仅仅希望在响应中看到聚合的结果。

在前面聚合的基础上，这个例子根据state分组来计算了账户的balance平均值（同样仅针对按count降序排序的前10个state）:
```
GET /bank/_search
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
```
请注意我们如何嵌套group_by_state聚合到average_balance聚合中的。这是聚合的常见模式。你可以在任意聚合中嵌套聚合，来从数据中提取你所需要的统计概要。

在前面聚合的基础上，下面的例子中，我们改用average_balance来降序排序：
```
GET /bank/_search
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword",
        "order": {
          "average_balance": "desc"
        }
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
```

下面这个例子演示了如何使用年龄段分组，然后是用性别分组，最后得到一个每个性别中每个年龄段账户余额的平均值：
```
GET /bank/_search
{
  "size": 0,
  "aggs": {
    "group_by_age": {
      "range": {
        "field": "age",
        "ranges": [
          {
            "from": 20,
            "to": 30
          },
          {
            "from": 30,
            "to": 40
          },
          {
            "from": 40,
            "to": 50
          }
        ]
      },
      "aggs": {
        "group_by_gender": {
          "terms": {
            "field": "gender.keyword"
          },
          "aggs": {
            "average_balance": {
              "avg": {
                "field": "balance"
              }
            }
          }
        }
      }
    }
  }
}
```
还有许多其他聚合功能，我们在此不再详述。如果您想进行进一步的实验，[聚合参考指南](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/search-aggregations.html)是一个很好的起点。
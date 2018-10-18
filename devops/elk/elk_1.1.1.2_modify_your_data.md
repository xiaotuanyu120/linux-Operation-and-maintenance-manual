---
title: elk 1.1.1.2: modify your data
date: 2018-10-17 09:28:00
categories: devops/elk
tags: [elk, elasticsearch]
---
### elk 1.1.1.2: modify your data

## Modifying Your Data
Elasticsearch提供几乎实时的数据操作和搜索功能。默认情况下，在执行索引、更新
删除数据操作直到搜索结果出现，你可以有个大概一秒的延迟预期。这是与SQL等其他平台的重要区别，它们的数据在事务完成后是立即可用的。

### 1. Indexing/Replacing Documents
前面我们已经演示过如何索引一个文档:
```
PUT /customer/_doc/1?pretty
{
  "name": "John Doe"
}
```
同样的，上面的命令会索引一个ID为1的文档到customer索引中。如果我们再次用不同或相同的内容执行上面的动作，elasticsearch会重新替换（重新索引）一个ID为1的文档：
```
PUT /customer/_doc/1?pretty
{
  "name": "Jane Doe"
}
```
上面的操作将ID为1的文档中的“name”从“John Doe”更换成了“Jane Doe”。换句话说，另一方面，如果我们使用不同的ID号码，一个新的文档会被索引，而旧有的数据不会变更。
```
PUT /customer/_doc/2?pretty
{
  "name": "Jane Doe"
}
```
上面的操作创建了一个新的ID为2的文档。

当索引新文档时，URL的ID部分是可选的。如果没有指定ID，elasticsearch会随机生成一个ID来分配给新的被索引的文档。Elasticsearch生成的实际ID（或前面示例中显式指定的内容）将作为索引API调用的一部分返回。

下面的例子展示了如何在不指定ID的情况下索引新文档：
```
POST /customer/_doc?pretty
{
  "name": "Jane Doe"
}
```
值得注意的是，上面的例子中我们使用POST来替代了PUT，因为我们没有指定ID。


### 2. Updating Documents
除了能够索引和替换文档，我们还可以更新文档。请注意，Elasticsearch实际上并没有在内部进行就地更新。每当我们进行更新文档操作时，Elasticsearch都会删除旧文档，然后将更新后的文档内容索引成新文档。

下面是一个更新ID位1的文档的name为Jane Doe的例子:
```
POST /customer/_doc/1/_update?pretty
{
  "doc": { "name": "Jane Doe" }
}
```

下面的例子，除了更新name之外，扩展增加了一个age的内容:
```
POST /customer/_doc/1/_update?pretty
{
  "doc": { "name": "Jane Doe", "age": 20 }
}
```

更新操作也可以执行一个简单的脚本，下面的例子给上面的age增加了5岁:
```
POST /customer/_doc/1/_update?pretty
{
  "script" : "ctx._source.age += 5"
}
```
在上面的例子中，`ctx._source`指向的是要被更新的源文档。

Elasticsearch提供了在给定查询条件（如SQL UPDATE-WHERE语句）的情况下更新多个文档的功能。请参阅[docs-update-by-query API](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/docs-update-by-query.html)


### 3. Deleting Documents
删除文档的操作相当直观。下面的例子展示了如何删除ID为2的文档：
```
DELETE /customer/_doc/2?pretty
```
可以查看[`_delete_by_query API`](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/docs-delete-by-query.html)来实现根据查询语句来删除所有符合条件的文档。特别值得注意的是，删除整个索引比按照查询删除API来删除所有的文档来的更高效。

### 4. Batch Processing
除了能够索引，更新和删除单个文档之外，Elasticsearch还提供了使用[`_bulk API`](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/docs-bulk.html)批量执行上述任何操作的功能。这个功能很重要，它提供了一个高效的机制来完成多个操作，是在尽量少的网络回路下尽可能快的完成。

下面的示例批量索引了两个文档(ID 1 - John Doe and ID 2 - Jane Doe)：
```
POST /customer/_doc/_bulk?pretty
{"index":{"_id":"1"}}
{"name": "John Doe" }
{"index":{"_id":"2"}}
{"name": "Jane Doe" }
```

下面的示例批量执行id为1的文档的更新和id为2的文档的删除操作：
```
POST /customer/_doc/_bulk?pretty
{"update":{"_id":"1"}}
{"doc": { "name": "John Doe becomes Jane Doe" } }
{"delete":{"_id":"2"}}
```
请注意，对于删除操作，之后没有相应的源文档，因为删除只需要删除文档的ID。

Bulk API不会因其中一个操作失败而失败。如果单个操作因任何原因失败，它将继续处理其后的其余操作。Bulk API返回时，它将为每个操作提供一个状态（按照发送的顺序），以便您可以检查特定操作是否失败。
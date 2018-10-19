---
title: elk 1.10.2: explore you cluster
date: 2018-10-16 15:55:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elk 1.0.2: explore you cluster

### REST API
现在我们已经将我们的节点或者集群运行起来了，接下来是要理解和熟悉如何与其交互了。庆幸的是，elasticsearch提供了一个非常完备和强大的REST API，使其易于交互。使用API可以完成以下事项：
- 检查群集，节点和索引运行状况，状态和统计信息
- 管理您的群集，节点和索引数据和元数据
- 对索引执行CRUD（创建，读取，更新和删除）和搜索操作
- 执行高级搜索操作，例如分页，排序，过滤，脚本编写，聚合等等

> 调用REST API有几种方式，可以直接通过浏览器、curl工具、开发语言等，elk中的kibana提供了一个console，可以直接提供给我们很方便的和elasticsearch的API进行交互，以下的示例中，我们无特别说明时默认使用这种方式。

#### CLUSTER HEALTH
要检查群集运行状况，我们将使用_cat API。
```
GET /_cat/health?v
```
返回结果是
```
epoch      timestamp cluster       status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1475247709 17:01:49  elasticsearch green           1         1      0   0    0    0        0             0                  -                100.0%
```
我们可以看到名为“elasticsearch”的群集处于绿色状态。

每当我们发出集群健康请求时，我们会获得绿色，黄色或红色中的一种。

- 绿色 - 集群完全健康（集群功能全部正常）
- 黄色 - 所有数据都可用，但一些副本尚未分配（集群功能全部正常）
- 红色 - 部分数据因为任意原因不可用（集群功能部分正常）

> 当群集为红色时，它将继续提供来自可用分片的搜索请求，但您可能需要尽快修复它，因为存在未分配的分片。

同样从上面的响应中，我们可以看到总共1个节点，并且我们有0个分片，因为我们还没有数据。请注意，由于我们使用的是默认群集名称（elasticsearch），并且由于Elasticsearch默认使用单播网络发现来查找同一台计算机上的其他节点，因此可能会意外启动计算机上的多个节点并将他们加入了同一个集群。在这种情况下，你可能会在上面的返回中看到多个节点。

我们也可以查看集群中的节点信息
```
GET /_cat/nodes?v
```
返回结果是
```
ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
127.0.0.1           10           5   5    4.46                        mdi      *      PB2SGZY
```
在这里，我们可以看到一个名为“PB2SGZY”的节点，它是我们集群中当前的单个节点。


#### List All Indices
我们可以这样查看所有的索引
```
GET /_cat/indices?v
```
返回结果是
```
health status index uuid pri rep docs.count docs.deleted store.size pri.store.size
```
> 如果没有其他内容，说明集群里面还没有创建索引。

#### Create an Index
让我们创建一个名为“customer”的索引，然后重新查看一下所有的索引
```
PUT /customer?pretty
GET /_cat/indices?v
```
返回结果是
```
health status index    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   customer 95SQ4TSUT7mWBT7VNHH67A   5   1          0            0       260b           260b
```
第二个命令的结果告诉我们，我们现在有一个名为customer的索引，它有5个主分片和1个副本（默认值），并且它包含0个文档。

你可能还注意到cusomer索引被标记了黄色。根据之前的说明，黄色表示某些副本尚未分配。这个customer发生这种状况的原因是默认elasticsearch给它创建了一个副本。因为我们此时在集群里只有一个节点，而根据高可用的原则，我们目前不能分配空间给这个副本，直到另外一个节点加入此集群。一旦将该副本分配到第二个节点后，此索引的运行状况将变为绿色。


#### Index and Query a Document
现在我们放一点东西到customer索引中。我们将索引一个简单的customer文档到customer索引中，和下面的命令一样，我们给这个文档分配的ID为1：
```
PUT /customer/_doc/1?pretty
{
  "name": "John Doe"
}
```
返回结果是
```
{
  "_index" : "customer",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```
从上面可以看出，在customer索引中，一个新的customer文档已经被成功创建了。这个文档就像我们在创建时指定的一样，内部ID为1。

需要重点注意的是，elasticsearch并不是严格的要求你在向一个索引内部存放文档之前先手动创建改索引。在上面的例子中，如果customer索引不存在的情况下，elasticsearch会自动创建该索引。

现在让我们检索刚刚编入索引的文档：
```
GET /customer/_doc/1?pretty
```
返回结果是
```
{
  "_index" : "customer",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "found" : true,
  "_source" : { "name": "John Doe" }
}
```
结果中列出了原始文档信息，另外，`found`字段说明我们找到了一个请求ID为1的文档，`_source`字段返回我们从上一步索引的完整JSON文档。


#### Delete an Index
现在让我们删除我们刚刚创建的索引，然后再来查看一下索引列表
```
DELETE /customer?pretty
GET /_cat/indices?v
```
返回结果是
```
health status index uuid pri rep docs.count docs.deleted store.size pri.store.size
```
这意味着索引已经删除成功，我们重新回到了我们集群最开始空无一物的状态。

在我们继续前进之前，让我们先来看看目前我们学到了API中的哪些操作
```
PUT /customer
PUT /customer/_doc/1
{
  "name": "John Doe"
}
GET /customer/_doc/1
DELETE /customer
```
如果我们学习上面这些命令足够细心，我们会发现在elasticsearch中与数据交互的一种语法。这种语法可以总结为：
```
<HTTP Verb> /<Index>/<Type>/<ID>
```
这种REST访问模式在所有API命令中都非常普遍，如果你能记住它，你将在掌握Elasticsearch方面有一个良好的开端。
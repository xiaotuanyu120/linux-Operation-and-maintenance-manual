---
title: elk 1.0.0: elasticsearch concept
date: 2018-10-11 16:18:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elk 1.0.0: elasticsearch concept

### Basic Concept
elasticsearch中有一些核心概念，理解它们会简化学习elasticsearch的进程。

### Near Realtime(NRT)
elasticsearch是一个接近实时查询的平台，这意味着在你index一个document到它可以被搜索之间有一个微小的延迟(通常是1s)。

### Cluster
一个集群是一个或者多个服务器的集合，它(们共同)保管了所有的数据，并提供了跨越所有节点的联合索引和搜索功能。一个集群会拥有一个独一无二的集群名称，默认是elasticsearch。这个名称很重要，因为如果节点设置为按照名称加入集群，节点只有正确设定名称才会是集群的一部分。  
确保不要在不同的环境中重用相同的群集名称，否则可能会导致节点加入错误的群集。  
注意，如果一个集群只包含一个节点是正常情况。此外，你可以设定多个集群，每个集群拥有唯一的集群名称。

### Node
节点是作为群集一部分的单个服务器，存储数据并参与群集的索引和搜索功能。就像群集一样，节点由名称标识，默认情况下，该名称是在启动时分配给节点的随机通用唯一标识符（UUID）。如果不希望使用默认的名称，可以手动配置。从管理角度来看，此名称非常重要，可以在其中识别网络中哪些服务器与Elasticsearch集群中的哪些节点相对应。  
可以将节点配置为按群集名称加入特定群集。 默认情况下，每个节点都设置为加入名为elasticsearch的群集，这意味着如果您在网络上启动了许多节点并且 - 假设他们可以相互发现 - 他们将自动形成并加入名为elasticsearch的单个群集。  
在单个群集中，您可以拥有任意数量的节点。此外，如果您的网络上当前没有其他Elasticsearch节点正在运行，则默认情况下，启动单个节点将形成名为elasticsearch的新单节点集群。

### Index
Index是具有某些类似特征的Document集合。例如，您可以拥有客户数据的Index，产品目录的另一个Index以及订单数据的另一个Index。Index由名称标识（必须全部小写），此名称用于在对其中的文档执行索引、搜索、更新和删除操作时引用索引。  
在一个集群中，你可以定义任意数量的index。

### Type(6.0.0 Deprecated)
Type曾是index的逻辑类别或分区，允许你在同一index中储存不同类型的document，例如一个type是用户信息，另外一个type是发布的博客。不再可能在索引中创建多个type，并且将在更高版本中删除type的整个概念。 废弃原因可以查看： [Removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html)

### Document
document是可以被索引的一个基本信息单元。例如，你可以为单个客户提供document、为单个产品提供document、为单个订单提供document。document使用JSON（JavaScript Object Notation）表示，它是一种普遍存在的互联网数据交换格式。  
在同一个index/type中，你可以存储任意数量的document。值得注意的是，尽管document物理上是储存在index中，但是实际上是需要被索引或分配到index中的一个type中。

### Shards & Replicas
Index可能存储大量可能超过单个节点的硬件限制的数据。例如，占用1TB磁盘空间的十亿个documents的单个index可能不适合只使用单个节点的磁盘，或者可能在单个节点的磁盘去执行搜索请求时太慢。  
为了解决这个问题，Elasticsearch提供了将index细分为多个称为shards的功能。创建索引时，只需定义所需的shard数即可。每个shard本身都是一个功能齐全且独立的“index”，可以托管在集群中的任何节点上。  

sharding之所以重要，是因为以下两个原因：
- 它允许你水平拆分或缩放内容量
- 它允许您跨shard（可能在多个节点上）分布和并行化操作，从而提高性能/吞吐量

shard的分布方式以及如何将其文档聚合回搜索请求的机制完全由Elasticsearch管理，对用户而言是透明的。  


在可以随时发生故障的网络/云环境中，强烈建议使用故障转移机制，这非常有用，可以预防shard/节点以某种方式脱机或因任何原因消失。为此，Elasticsearch允许您将索index的shard的一个或多个副本制作成所谓的replica shards或简称replicas。

replication之所以重要，是因为以下两个原因：
- 在shard或node发生错误时提供高可用性。因此，特别需要注意的是，replica shard不可以和原始的shard在同一个节点上。
- 它允许您扩展搜索量/吞吐量，因为可以在所有副本上并行执行搜索。

总而言之，每个index可以拆分为多个shard。 index也可以复制为零（表示没有replica）或更多次。 复制后，每个index都将具有primary shard和replica shard（主分片的副本）。  
可以在创建索引时为每个索引定义分片和副本的数量，可以在任意时间动态的调整replicas的数量。你可以使用_shrink和_split API更改现有index的shard数量，但这不是一项简单的任务，预先计划正确数量的shard是最佳方法。  
默认情况下，Elasticsearch中的每个索引都分配了5个primary shard和1个replica，这意味着如果群集中至少有两个节点，则索引将包含5个primary shard和另外5个replica shard（1个完整副本），总计为 每个index 10个shard。
> 每个Elasticsearch分片都是Lucene索引。 单个Lucene索引中的documents都有一个最大数量。 从[LUCENE-5843](https://issues.apache.org/jira/browse/LUCENE-5843)之后，限制为2,147,483,519（= Integer.MAX_VALUE - 128）个文件。 您可以使用`_cat/shards` API查看shard数量。

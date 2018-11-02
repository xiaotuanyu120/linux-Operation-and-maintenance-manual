---
title: elk 1.2.0: elasticsearch upgrade from 6.2.4 to 6.4.2
date: 2018-10-04 09:49:00
categories: bigdata/elk
tags: [elk, elasticsearch, upgrade]
---
### elk 1.2.0: elasticsearch upgrade from 6.2.4 to 6.4.2

### 1. 主要参照文档
- [ES6.4的升级引导文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-upgrade.html)
- [ES6.2.4 - 6.4滚动升级文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/rolling-upgrades.html)

### 2. Upgrading the Elastic Stack
当升级elasticsearch到一个新版本时，你需要同时提升elastic stack中的其他组件。Beats和Logstash 5.6和elasticsearch6.4.2兼容，这样会让升级规划更加灵活。

如果在使用6.0以前的版本，推荐在升级到6.4.2之前先升级到5.6版本。X-Pack 5.6提供了一个免费的升级助手，可以帮助在升级之前定位你需要处理的问题，而且在升级之前简化需要reindex的索引的迁移过程。升级助手在试用版和基本版许可证下都是启用的。你可以以升级为目的来安装X-Pack。在6.3版本及其之后，当你安装elasticsearch、kibana和logstash时，X-Pack会自动被安装。

从elasticsearch5.6或者elasticsearch6.0-6.2版本升级来elasticsearch6.4.2都支持滚动升级。从5.6之前的任何版本升级都需要完全重新启动集群。
> 2.x版本的索引不兼容6.4.2。你必须在升级6.4.2之前，在5.6版本上移除或者重新索引它们。内部Kibana和X-Pack索引以及默认的Beats和Logstash映射模板也需要更新才能与6.4.2一起使用。

### 3. Preparing to upgrade
1. 备份elasticsearch的数据。如果没有备份数据，无法回滚到之前版本。要查看快照的更多信息，参照[snapshot and restore](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/bigdata/elk/elk_1.0.8.a_elasticsearch_modules_snapshot_and_restore.md)。

2. 检查elasticsearch的[弃用日志](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/settings.html)来查看是否使用了弃用的特性来相应的更新自己的代码。默认情况下，弃用日志信息在`WARN`级别输出。

3. 查看使用的每个产品的重大更改并进行必要的更改，以使自己的代码与6.4.2兼容：
    - [Beats 6.4.2 breaking changes](https://www.elastic.co/guide/en/beats/libbeat/6.4/breaking-changes.html)
    - [Elasticsearch 6.4.2 breaking changes](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/breaking-changes.html)
    - [Elasticsearch Hadoop 6.4.2 breaking changes](https://www.elastic.co/guide/en/elasticsearch/hadoop/6.4/breaking-changes.html)
    - [Kibana 6.4.2 breaking changes](https://www.elastic.co/guide/en/kibana/6.4/breaking-changes.html)
    - [Logstash 6.4.2 breaking changes](http://www.elastic.co/guide/en/logstash/6.4/breaking-changes.html)
> - 如果是从2.x版本升级上来，注意查看2.x与5.x的区别，同样需要查看5.x和6.x的区别。
- 如果您使用的是包含已停止搜索或查询域特定语言（DSL）的计算机学习数据馈送，则升级将失败。在5.6.5及更高版本中，升级助手提供有关需要更新哪些数据馈送的信息。

4. 删除或者重新索引在2.x版本创建的索引。推荐升级到5.6，然后使用其X-Pack的重新索引助手来重新索引2.x里面创建的索引。

5. 如果Kibana和X-Pack是您的堆栈的一部分，请升级内部Kibana和X-Pack索引。建议使用X-Pack 5.6 Reindex Helper升级内部索引。如果从早期版本通过执行完全集群重启来升级，则还可以在安装Elasticsearch 6.4.2后直接使用`_xpack/migration/upgrade` API升级内部索引。

6. 如果使用X-Pack的安全功能：
    - a. 确保node之间的TLS加密通信启用。在elasticsearch6.4.2中，TLS必须被启用，详情可以查看[加密通信](https://www.elastic.co/guide/en/elastic-stack-overview/6.4/encrypting-communications.html) 
    - b. 确保为内置的elasticsearch，kibana和logstash_system用户配置了密码。5.x中默认的密码(changeme)不可以使用。详情查看[内置用户](https://www.elastic.co/guide/en/elastic-stack-overview/6.4/built-in-users.html)

7. 在开始升级之前，停止任何正在运行的X-Pack机器学习任务。查看[停止机器学习](https://www.elastic.co/guide/en/elastic-stack-overview/6.4/stopping-ml.html)

> 生产环境升级之前，在开发环境中先测试，重要！

### 4. Upgrade order
elastic stack升级时需要按照以下的顺序：
1. Elasticsearch Hadoop: [install instructions](https://www.elastic.co/guide/en/elasticsearch/hadoop/6.4/install.html)
2. Elasticsearch: [upgrade instructions](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/setup-upgrade.html)
3. Kibana: [upgrade instructions](https://www.elastic.co/guide/en/kibana/6.4/upgrade.html)
4. Logstash: [upgrade instructions](http://www.elastic.co/guide/en/logstash/6.4/upgrading-logstash.html)
5. Beats: [upgrade instructions](https://www.elastic.co/guide/en/beats/libbeat/6.4/upgrading.html)

### 5. elasticsearch 滚动升级
#### 1) Disable shard allocation.
当关闭一个node时，allocation进程会在复制此节点上的分片去集群中其他节点上之前等待`index.unassigned.node_left.delayed_timeout`(默认是一分钟)长的时间，这个allocation动作会产生大量的I/O。因为这个节点只是短暂的重启一下，这样的I/O是不必要的。你可以在关闭节点之前禁用allocation来避免。
```
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "none"
  }
}
```

#### 2) Stop non-essential indexing and perform a synced flush. (Optional)
虽然在升级期间也可以继续编制索引，但是暂时禁用非必要的索引并执行[同步刷新](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-synced-flush.html)
```
POST _flush/synced
```
当执行同步刷新时，检查返回的响应确保没有错误信息。虽然请求本身仍返回200 OK状态，但响应正文中列出了由于挂起的索引操作而失败的同步刷新操作。如果有失败，请重新发出请求。

#### 3) Stop any machine learning jobs that are running. 
See [Stopping Machine Learning](https://www.elastic.co/guide/en/elastic-stack-overview/6.4/stopping-ml.html).

#### 4) Shut down a single node.
``` bash
systemctl stop elasticsearch
```

#### 5) Upgrade the node you shut down.
> important: 如果是从6.3之前的版本升级上来的，需要注意提前要移除X-Pack插件，然后再去升级版本。执行`bin/elasticsearch-plugin remove x-pack`

- a. 备份原来的elasticsearch目录，然后解压新版的elasticsearch。
- b. 如果使用外部的配置路径，配置`ES_PATH_CONF`环境变量到那个位置。如果没有的话，拷贝老的配置目录过来新的elasticsearch目录就可以了。
- c. 检查`path.data`是否指向正确的数据目录
- d. 检查`path.log`是否指向正确的日志目录

#### 6) Upgrade any plugins.
使用elasticsearch-plugin脚本安装每个已安装的Elasticsearch插件的升级版本。升级节点时，必须升级所有插件。

#### 7) Start the upgraded node.
启动升级后的节点，并通过查看日志和使用下面命令来检查节点是否正确加入到集群
```
GET _cat/nodes
```

#### 8) Reenable shard allocation.
节点加入集群后，删除cluster.routing.allocation.enable设置以启用分片分配并开始使用节点：
```
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": null
  }
}
```

#### 9) Wait for the node to recover.
在升级下一个节点之前，等待集群完成分片分配。可以通过下面的请求来检查:
```
GET _cat/health
```
等待`status`由`yellow`变化为`green`。一旦状态转化为`green`，所有的主分片和副本分片都已经被分配了。

> IMPORTANT: 在滚动升级期间，分配给运行新版本的节点的主分片无法将其副本分配给具有旧版本的节点。新版本可能具有旧版本无法理解的不同数据格式。

> 如果无法将副本分片分配给另一个节点（群集中只有一个已升级的节点），则副本分片将保持未分配状态，并且状态保持`yellow`。

> 在这种情况下，您可以在没有初始化或重定位分片时继续（检查init和relo列）。

> 一旦升级了另一个节点，就可以分配副本并且状态将变为`green`。

没有设置同步刷新的分片需要更长时间来恢复。可以通过以下请求来监控分片的还原状态：
```
GET _cat/recovery
```
如果停止了索引，则可以在恢复完成后立即恢复索引。

#### 10) Repeat
当节点已恢复且群集稳定后，请对需要更新的每个节点重复这些步骤。

#### 11) Restart machine learning jobs.
如果使用了机器学习的话。

> IMPORTANT：在滚动升级过程中，集群可以正常操作。然而，新功能都会处在禁用状态或者向后兼容状态，直到集群中所有的节点全部升级完毕。一旦集群中节点全部升级完毕，新功能将会启用，同时将不可能回到向后兼容模式。当集群完全升级后，运行之前major版本的节点将不会加入到这个集群。

> 如果在升级过程中网络出现故障，将所有剩余的旧节点与群集隔离，则必须使旧节点脱机并升级它们以使其能够加入群集。
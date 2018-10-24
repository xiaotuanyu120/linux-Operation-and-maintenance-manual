---
title: elk 1.0.8.a: elasticsearch modules - snapshot and restore
date: 2018-10-22 10:15:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elk 1.0.8.a: elasticsearch modules - snapshot and restore


### 1. Snapshot And Restore
快照是从一个运行的elasticsearch集群上获取的备份。你可以备份单个索引或者整个集群的快照，然后将它存储到将其存储在共享文件系统的存储库中，并且有一些插件支持S3，HDFS，Azure，Google云存储等上的远程存储库。

快照是递增备份的。这意味着在创建索引的快照时，Elasticsearch将避免复制已存储在存储库中的任何数据，作为同一索引的早期快照的一部分。因此，当我们对集群进行频繁快照备份时是很高效的。

可以通过还原API将快照还原到正在运行的群集中。还原索引的备份时，可以更改已还原索引的名称及其某些设置，从而可以在如何使用快照和还原功能方面提供极大的灵活性。
> 不可以简单的通过把elasticsearch集群中各节点的数据目录的拷贝来备份。elasticsearch可能在集群运行时动态的修改内容。这意味着拷贝数据目录无法保证数据图像的一致性。尝试从这样的备份中恢复数据可能会失败，报告损坏和/或丢失文件，或者可能似乎已成功安静地丢失了某些数据。唯一可靠的集群备份方式就是使用快照和恢复功能。

### 2. Version compatibility
快照包含构成索引的磁盘数据结构的副本。这意味着快照只能恢复到可以读取索引的Elasticsearch版本：
- 5.x 制作的快照可以恢复到 6.x
- 2.x 制作的快照可以恢复到 5.x
- 1.x 制作的快照可以恢复到 2.x

相反的，1.x制作的快照不可以恢复到5.x或者6.x，2.x制作的快照不可以恢复到6.x。

每一个快照可以包含多个版本的集群创建的索引，当恢复快照时，必须保证所有的索引都可以被恢复到集群中。如果任何一个索引的版本不匹配当前的集群，你将无法恢复这个快照。
> 在升级之前备份数据时，请记住，如果升级包含在与升级版本不兼容的版本中创建的索引，则升级后将无法还原快照。

如果您最终需要还原与当前正在运行的群集版本不兼容的索引的快照，您可以在最新的兼容版本上恢复它，并使用[reindex-from-remote](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/docs-reindex.html#reindex-from-remote)在当前版本上重建索引。只有原始索引启用了源，才能从远程重新索引。检索和重新索引数据所花费的时间比简单地恢复快照要长得多。如果您有大量数据，我们建议您使用一部分数据测试远程进程的reindex，以便在继续之前了解时间要求。

### 3. Repositories
在执行快照和还原操作之前必须先注册快照存储库。我们建议为每个主要版本创建一个新的快照存储库。有效的存储库设置取决于存储库类型。如果将多个集群注册到同一个快照存储库，则只有一个集群应具有对存储库的写入权限。连接到该存储库的所有其他集群应将存储库设置为只读模式。
> 在主版本之间快照的格式可能会改变。所以，如果你有多个不同版本的集群尝试向同一个存储库中写入快照时，其中一个集群版本写入的可能对其他版本的集群是不可见的，存储库也有可能损坏。虽然可以给多个不同主版本集群除了其中一个集群之外设定只读是可行的，但是它不是一个受支持的配置。

创建快照存储库
```
PUT /_snapshot/my_backup
{
  "type": "fs",
  "settings": {
    "location": "my_backup_location"
  }
}
```
> 类型是`fs`，意味着采用的是文件系统。`my_backup_location`是备份位置，可以是一个本地或者共享的磁盘的目录，例如`/data/elasticsearch/backup`。

> 值得注意的是，需要给这个目录以elasticsearch程序运行用户以读写权限。

查看快照存储库信息，可以使用GET请求
```
GET /_snapshot/my_backup
```
返回结果是
```
{
  "my_backup": {
    "type": "fs",
    "settings": {
      "location": "my_backup_location"
    }
  }
}
```

查看多个快照存储库的信息，可以使用一个`,`隔开的列表。也可以使用`*`来模糊匹配快照存储库名称。
```
GET /_snapshot/repo*,*backup*
```

查看所有快照存储库的信息，可以忽略库名称或者使用`_all`
```
GET /_snapshot
```
或者
```
GET /_snapshot/_all
```

#### 1) Shared File System Repository
共享文件系统存储库("type": "fs")使用共享文件系统来储存快照。为了注册共享文件系统存储库，必须将相同的共享文件系统安装到所有主节点和数据节点上的相同位置。必须在所有主节点和数据节点上的path.repo设置中注册此位置（或其父目录之一）。

假设共享文件系统挂载到了`/mount/backups/my_fs_backup_location`，则需要在`elasticsearch.yml`中配置如下设定：
```
path.repo: ["/mount/backups", "/mount/longterm_backups"]
```

path.repo设置支持Microsoft Windows UNC路径，只要至少将服务器名称和共享指定为前缀并正确转义反斜杠：
```
path.repo: ["\\\\MY_SERVER\\Snapshots"]
```

重新启动所有节点后，可以使用以下命令注册名为my_fs_backup的共享文件系统存储库：
```
PUT /_snapshot/my_fs_backup
{
    "type": "fs",
    "settings": {
        "location": "/mount/backups/my_fs_backup_location",
        "compress": true
    }
}
```

如果快照存储库中的位置是相对于`path.repo`中设定目录的相对路径，可以这样设定：
```
PUT /_snapshot/my_fs_backup
{
    "type": "fs",
    "settings": {
        "location": "my_fs_backup_location",
        "compress": true
    }
}
```

支持下面的配置：

items|meanings
---|---
location    |   Location of the snapshots. Mandatory.
compress    |   Turns on compression of the snapshot files. Compression is applied only to metadata files (index mapping and settings). Data files are not compressed. Defaults to true.
chunk_size  |   Big files can be broken down into chunks during snapshotting if needed. The chunk size can be specified in bytes or by using size value notation, i.e. 1g, 10m, 5k. Defaults to null (unlimited chunk size).
max_restore_bytes_per_sec   |   Throttles per node restore rate. Defaults to 40mb per second.
max_snapshot_bytes_per_sec  |   Throttles per node snapshot rate. Defaults to 40mb per second.
readonly    |   Makes repository read-only. Defaults to false.

#### 2) Read-only URL Repository
URL存储库("type": "url")可用作访问共享文件系统存储库创建的数据的备用只读方式。url参数中指定的URL应指向共享文件系统存储库的根目录。支持以下设置：
- url, Location of the snapshots. Mandatory.

URL Repository支持以下协议:"http"、"https"、"ftp"、"file"和"jar"。具有"http:"、
"https:"和"ftp:"URL的URL存储库必须通过在`repositories.url.allowed_urls`设置中指定允许的URL来列入白名单。此设置支持代替主机，路径，查询和片段的通配符。例如：
```
repositories.url.allowed_urls: ["http://www.example.org/root/*", "https://*.mydomain.com/*?*#*"]
```
带有`files:`的URL存储库：URL只能指向path.repo设置中注册的位置，类似于共享文件系统存储库。

#### 3) Repository plugins
以下插件提供了其他的存储库后端：
- [repository-s3](https://www.elastic.co/guide/en/elasticsearch/plugins/6.4/repository-s3.html) for S3 repository support
- [repository-hdfs](https://www.elastic.co/guide/en/elasticsearch/plugins/6.4/repository-hdfs.html) for HDFS repository support in Hadoop environments
- [repository-azure](https://www.elastic.co/guide/en/elasticsearch/plugins/6.4/repository-azure.html) for Azure storage repositories
- [repository-gcs](https://www.elastic.co/guide/en/elasticsearch/plugins/6.4/repository-gcs.html) for Google Cloud Storage repositories

#### 4) Repository Verification
注册存储库后，会立即在所有主节点和数据节点上验证它，以确保它在群集中当前存在的所有节点上都能正常运行。在注册或更新存储库时，verify参数可用于显式禁用存储库验证：
```
PUT /_snapshot/my_unverified_backup?verify=false
{
  "type": "fs",
  "settings": {
    "location": "my_unverified_backup_location"
  }
}
```
也可以手动的执行验证动作：
```
POST /_snapshot/my_unverified_backup/_verify
```
它返回成功验证存储库的节点列表，或者验证验证过程失败时的错误消息。

### 4. Snapshot
一个存储库可以存放同一个集群的多个快照。快照在集群中拥有唯一的名称标识。名为`snapshot_1`在存储库`my_backup`中可以用以下命令创建：
```
PUT /_snapshot/my_backup/snapshot_1?wait_for_completion=true
```
`wait_for_completion`这个参数的含义是，是否在创建快照的动作初始化完毕后立刻返回(默认)或等待快照创建完毕后返回。在快照创建初始化时，所有之前的快照信息都会加载到内存中，这意味着在大型存储库中初始化命令的返回需要耗费数秒(或数分钟)，即使`wait_for_completion`设定为`false`。

默认情况下，会创建群集中所有打开和启动索引的快照。可以通过在快照请求体中指定索引列表来改变这个默认行为：
```
PUT /_snapshot/my_backup/snapshot_2?wait_for_completion=true
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```
通过`indices`指定包含在快照中的索引，语法可参照[多索引语法](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/multi-index.html)。快照请求同时也支持`ignore_unavailable`选项。将其设置为true将导致在创建快照期间忽略不存在的索引。默认情况下`ignore_unavailable`选项是没有设定的，在缺少索引时会导致快照失败。通过将`include_global_state`设置为false，可以防止将群集全局状态存储为快照的一部分。默认情况下，如果参与快照的一个或多个索引没有可用的所有主分片，则整个快照将失败。可以通过将partial设置为true来更改此行为。

快照名称可以通过[日期数学表达式](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/date-math-index-names.html)自动生成，和创建新索引时使用的方法类似。请注意，特殊字符需要进行URI编码。

例如，使用当天的日期来创建快照，`snapshot-2018.10.22`，可以使用下面的命令：
```
# PUT /_snapshot/my_backup/<snapshot-{now/d}>
PUT /_snapshot/my_backup/%3Csnapshot-%7Bnow%2Fd%7D%3E
```
索引快照过程是增量的。在制作索引快照的过程中，Elasticsearch会分析已存储在存储库中的索引文件列表，并仅复制自上次快照以来创建或更改的文件。这允许以紧凑的形式在存储库中保留多个快照。快照过程以非阻塞方式执行。在索引正在创建快照时，可以继续对其执行所有索引和搜索操作。但是，快照表现的是当快照创建时索引的状态，所以在快照创建时间点之后索引中的数据变化不会体现在快照中。快照创建对于当时处于活动和非重新定位状态的主分区会立刻开始执行。在1.2.0版本之前，如果一个集群有任何重定位或初始化索引分区主分区的状态，快照操作会返回错误。在1.2.0版本之后，elasticsearch会等待其结束后再执行快照。

除了创建所有索引的副本之外，快照进程也会储存全局集群元数据，其中包含了集群的持久设定和模板。临时设定和注册过的快照存储库不会保存到快照中。

同时只能有一个快照进程执行。当给特定的一个分片执行快照时，这个分片不能转移到其他节点，这会干扰重新平衡过程和分配过滤。elasticsearch只有在快照操作结束之后才可以转移分片去另外一个节点(根据当前的分配过滤配置和再平衡算法)。

一旦快照被创建，可以根据以下命令来查看其信息：
```
GET /_snapshot/my_backup/snapshot_1
```
这个命令返回快照的基本信息，包括开始结束时间、elasticsearch版本、包含的索引列表、快照目前的状态和创建快照时发生的错误列表。快照状态可以是：

- IN_PROGRESS, 快照正在创建中。
- SUCCESS, 快照创建完成，所有的分区已经成功被储存。
- FAILED, 快照创建以错误结束，无法储存任意数据。
- PARTIAL, 存储了全局群集状态，但至少有一个分片的数据未成功存储。在这种情况下，`failure`部分应包含有关未正确处理的分片的更多详细信息。
- INCOMPATIBLE, 快照是使用旧版本的Elasticsearch创建的，因此与群集的当前版本不兼容。

和快照存储库类似，可以一次性请求多个快照信息，另外也支持通配符：
```
GET /_snapshot/my_backup/snapshot_*,some_other_snapshot
```

可以通过下面命令查询所有的快照信息
```
GET /_snapshot/my_backup/_all
```
当某些快照不可达时上面的请求会失败。布尔类型的参数`ignore_unavailable`可用于在此情况下返回所有可达的快照信息。

从成本和性能的角度来看，在基于云的存储库中获取存储库中的所有快照可能成本很高。如果只是希望获取快照名称/uuid和每一个快照中的索引，可以将布尔类型参数`verbose`设置为`false`，这样会让检索更高性能和更经济。值得注意的是将`verbose`设定为`false`会忽略快照所有其他的信息，例如状态信息、快照的分片数量等。`verbose`的默认值是`true`。

查看当前正在进行的快照操作可以使用下面命令：
```
GET /_snapshot/my_backup/_current
```

可以在存储库中删除快照
```
DELETE /_snapshot/my_backup/snapshot_2
```
当在存储库中删除快照后，elasticsearch会删除所有和这个快照相关且未被其他快照使用的问题。当快照创建过程中执行快照删除操作后，快照创建进程会被中止，然后在创建快照过程中创建的所有问题都会被删除。因此，快照删除命令可以用于停止因错误开始的快照创建过程。

快照存储库可以被注销
```
DELETE /_snapshot/my_backup
```
当快照存储库被注销后，elasticsearch只是删除了指向快照存储位置的索引。快照本身不会被改动。

### 5. Restore
快照可以用以下命令恢复
```
POST /_snapshot/my_backup/snapshot_1/_restore
```
默认情况下，快照中所有的索引会被恢复，但是集群状态不会恢复。可以通过`indices`和`include_global_state`来自定义被恢复的索引和是否允许集群全局状态恢复。索引列表支持[多索引语法](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/multi-index.html)。`rename_pattern`和`rename_replacement`选项还可用于使用支持引用原始文本的正则表达式重命名还原时的索引，如[此处](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html#appendReplacement(java.lang.StringBuffer,%20java.lang.String))所述。将include_aliases设置为false可防止别名与关联索引一起恢复
```
POST /_snapshot/my_backup/snapshot_1/_restore
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": true,
  "rename_pattern": "index_(.+)",
  "rename_replacement": "restored_index_$1"
}
```
可以在正常运行的集群上执行还原操作.但是，现有索引只有在关闭时才能恢复，并且与快照中的索引具有相同数量的分片。如果已关闭，则还原操作会自动打开恢复的索引，如果群集中不存在，则会创建新索引。如果使用`include_global_state`(默认为false)还原集群状态，则会添加群集中当前不存在的模板，也会替换具有相同名称的现有模板。并且恢复快照中的永久设置到集群中的永久设置中。

#### 1) Partial restore
默认情况下，如果参与操作的一个或多个索引没有可用的所有分片的快照，则整个还原操作将失败。例如，如果某些分片无法快照，则会发生这种情况。通过将`partial`设置为`true`，仍然可以恢复这些索引。这个时候需要注意，只有被快照成功的分片会被成功恢复，其他的会创建一个空的分片。

#### 2) Changing index settings during restore
大部分索引的设定可以在恢复的时候覆盖。例如，以下命令将在切换回默认刷新间隔时恢复索引index_1而不创建任何副本：
```
POST /_snapshot/my_backup/snapshot_1/_restore
{
  "indices": "index_1",
  "index_settings": {
    "index.number_of_replicas": 0
  },
  "ignore_index_settings": [
    "index.refresh_interval"
  ]
}
```
需要注意的是，有一些设定，例如`index.number_of_shards`无法在恢复操作期间修改。

#### 3) Restoring to a different cluster
快照中储存的信息并没有和一个特定的集群或者集群名称绑定在一起。因为，从一个集群的快照备份中恢复到另外一个集群是可以的。唯一需要的是在新的集群中注册这个快照存储库，然后恢复快照。新的集群不用必须具备同样的容量大小和拓扑结构。然而，新的集群版本必须要和做快照的集群相同或者更新(最多新一个主版本)。例如，你可以恢复1.x的快照到2.x中，但是不可以将其恢复到5.x中。

如果新的集群拥有更小的容量，那么需要需要有一些额外的考虑。首先，需要保证新的集群拥有足够的容量来恢复快照中的所有索引。可以在快照恢复过程中修改索引设置来减少副本的数量，这样可以对恢复大容量集群的快照到小容量集群中。也可以使用`indices`参数来恢复快照中索引的子集到小容量集群中。

如果使用[shard allocation filtering](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/shard-allocation-filtering.html)将原始群集中的索引分配给特定节点，则将在新群集中强制执行相同的规则。因此，如果新群集不包含具有适当属性的节点可以分配已还原的索引，则将无法成功还原此索引, 除非在还原操作期间更改这些索引分配设置。

恢复操作也会在执行时检查要恢复的持久性设置和当前集群中的设定是否兼容，以此来避免意外的不兼容设定的恢复，例如，`discovery.zen.minimum_master_nodes`，设定这个的结果会导致一个比此设定master节点数少的小集群停止服务，直到符合此设定的合格的master节点被增加。如果快照中有和当前集群不兼容的持久性设置，而却还是想还原它，可以在禁用还原全局状态的情况下还原其他数据。

### 6. Snapshot status
可以使用以下命令获取当前运行的快照及其详细状态信息的列表：
```
GET /_snapshot/_status
```
在此格式中，该命令将返回有关所有当前正在运行的快照的信息。通过指定存储库名称，可以将结果限制为特定存储库：
```
GET /_snapshot/my_backup/_status
```
如果同时指定了存储库名称和快照ID，则此命令将返回给定快照的详细状态信息，即使它当前未运行：
```
GET /_snapshot/my_backup/snapshot_1/_status
```
返回结果是这种格式：
```
{
  "snapshots": [
    {
      "snapshot": "snapshot_1",
      "repository": "my_backup",
      "uuid": "XuBo4l4ISYiVg0nYUen9zg",
      "state": "SUCCESS",
      "include_global_state": true,
      "shards_stats": {
        "initializing": 0,
        "started": 0,
        "finalizing": 0,
        "done": 5,
        "failed": 0,
        "total": 5
      },
      "stats": {
        "incremental": {
          "file_count": 8,
          "size_in_bytes": 4704
        },
        "processed": {
          "file_count": 7,
          "size_in_bytes": 4254
        },
        "total": {
          "file_count": 8,
          "size_in_bytes": 4704
        },
        "start_time_in_millis": 1526280280355,
        "time_in_millis": 358,

        "number_of_files": 8,
        "processed_files": 8,
        "total_size_in_bytes": 4704,
        "processed_size_in_bytes": 4704
      }
    }
  ]
}
```
输出结果由多个部分组成。`stats`子对象提供有关快照文件的数量和大小的详细信息。由于快照是增量式的，仅复制尚未存储在存储库中的Lucene段，因此stats对象包含快照引用的所有文件的`total`部分，以及`incremental`部分，对于那些实际需要作为增量快照的一部分进行复制的文件的信息。在快照创建中时，返回结果中会有一个`progressed`部分，包含有关正在复制的文件的信息。
> 注意：属性`number_of_files`、`processed_files`、`total_size_in_bytes`和`processed_size_in_bytes`用于旧版5.x和6.x版本的向后兼容性原因。这些字段将在Elasticsearch v7.0.0中删除。

支持多个快照id
```
GET /_snapshot/my_backup/snapshot_1,snapshot_2/_status
```

### 7. Monitoring snapshot/restore progress
有好几个方式在快照创建和还原过程中时来监控它们。两个操作都支持wait_for_completion参数，该参数将阻塞客户端直到操作完成。这是获得操作完成通知的最简单的监控方式。

还可以通过定期调用快照信息来监视快照操作
```
GET /_snapshot/my_backup/snapshot_1
```

请注意，快照信息查询操作使用与快照操作相同的资源和线程池。因此，在对很大量分片的集群进行快照时进行快照信息查询操作需要等待资源来返回结果。在非常大量分片的集群上，这个等待时间会比较显著。

如果希望更快速获得信息更完整的快照信息，可以用下面的命令
```
GET /_snapshot/my_backup/snapshot_1/_status
```
快照信息查询操作只是返回进行中的快照基本信息，而快照状态查询操作返回快照中每一个分片的完整的当前状态。

还原过程依赖于Elasticsearch的标准恢复机制。这样的结果是，标准恢复监控服务可用于监控还原状态。当执行还原操作的时候，集群进入`red`状态。因为还原操作开始执行索引主分区的还原动作了。在这个动作期间主分区不可用所以进入了`red`状态。一旦主分区的还原结束，elasticsearch集群会切换去标准创建副本进程来创建需要的副本数量，与此同时，集群状态转换为`yellow`。当副本全部创建完成，集群会进入`green`状态。

集群健康状态的切换仅提供了还原过程中的一种高层次的状态。可以通过[`indices recovery`](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/indices-recovery.html)和[`cat recovery`](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/cat-recovery.html) API来获得当前还原过程更详细的状态。

### 8. Stopping currently running snapshot and restore operationse
快照和还原框架同一时刻仅允许一个快照或还原操作执行。如果当前的操作是误执行或花费了异常长的时间，可以使用快照删除操作来停止它。快照删除操作会检查需要删除的快照是否正在创建中，如果是，删除操作会先停止快照创建动作，然后在快照存储库中删除该快照。
```
DELETE /_snapshot/my_backup/snapshot_1
```
快照还原操作使用了标准分片还原机制。任何正在执行的还原操作可以通过删除被还原的索引来取消。请注意，删除操作的结果是，所有被删除的索引的数据会从集群中移除。

### 9. Effect of cluster blocks on snapshot and restore operations
许多快照和还原操作都受集群和索引块的影响。例如，注册和取消注册存储库需要写入全局元数据访问。快照操作要求所有索引及其元数据以及全局元数据都是可读的。还原操作要求全局元数据是可写的，但在还原期间会忽略索引级别块，因为索引基本上是在还原期间重新创建的。请注意，存储库内容不是群集的一部分，因此群集块不会影响内部存储库操作，例如列出或删除已注册的存储库中的快照。
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
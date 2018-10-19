---
title: cloudera 1.1.0 简介和安装要求说明
date: 2018-09-24 11:00:00
categories: bigdata/cloudera
tags: [hadoop,cloudera]
---
### cloudera 1.1.0 简介和安装要求说明

---

### 1. 关于cloudera，CDH和CM
cloudera是一家hadoop的商业公司，提供hadoop的商业产品CDH(Cloudera Distribution including Apache Hadoop)。同时cloudera也是apache软件基金会的赞助商。

- (CDH)[https://www.cloudera.com/documentation/enterprise/6/6.0/topics/cdh_intro.html]: cloudera根据apache hadoop及其他开源工具组合的一套cloudera的hadoop发行版, 包含以下组件
    - HIVE
    - IMPALA
    - KUDU
    - SENTRY
    - SPARK
- (CM - cloudera manager)[https://www.cloudera.com/documentation/enterprise/6/6.0/topics/cm_intro_primer.html]: cloudera提供的一个程序，可以从web界面管理CDH集群。

### 2. CDH6.X安装要求和支持的版本
参考文档： (CDH安装要求说明官方文档)[https://www.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_requirements_supported_versions.html]
#### 1) 操作系统要求
- 软件版本：
    - python 2.7
    - perl
    - python-psycopg2 - 如果使用postgresql的话，依赖这个python包
    - iproute package， centos7系统的话，版本需要iproute-3.10
- 系统版本：
    - centos 7.5, 7.4, 7.3, 7.2
    - centos 6.9 , 6.8
- HDFS支持的底层文件系统格式：
    - ext3, HDFS测试最成熟的文件系统格式
    - ext4, HDFS不支持ext3升级为ext4，推荐直接将磁盘格式化为ext4后使用
    - XFS, centos7的默认存储格式
    - S3, 亚马逊的简单存储服务
- KUDU支持的底层文件系统格式：
    - ext4
    - XFS
- file access time：
    - 编辑/etc/fstab: `/dev/sdb1 /data1 ext4 defaults,noatime 0`, 增加noatime选项，具体磁盘和挂载点按照实际情况来
    - 使上面的配置生效: `mount -o remount /data1`, 挂载点按照实际情况来
- 文件系统挂载选项： 磁盘挂载到系统时，会有一个sync选项来启用写同步，但是对于HDFS, YARN, Kafka 和 Kudu来说，在CDH中，大部分的写操作已经做到了多副本备份，所以，写同步是没有必要的，降低性能的，可以禁用掉。例如: `/dev/sdb1 /data1 ext4 defaults,noatime,nosync 0`
- nproc配置： CM会自动在/etc/security/limits.conf中配置nproc限制，但是这个配置可能会被/etc/security/limits.d/中的文件覆盖掉，请确保这样的事情不会发生，或者你手动设定nproc来保证上线足够高，例如262144或65536

#### 2) 数据库要求
CM和CDH自带了一个内嵌的PostgreSQL数据库，仅用于非生产环境，生产环境下，需要配置使用一个外部使用的数据库。  

注意点：
- 使用UTF8编码，mysql和mariadb必须使用utf8编码，而不是uft8mb4；
- 如果使用MySQL5.7，需要安装MySQL-shared-compat 或 MySQL-shared package，因为CM的agent安装时依赖这个包。
- 不支持mysql的基于GTID的replication
- Hue需要操作系统默认版本的MySQL和MariaDB版本。
- MySQL社区版和企业版都支持
- cloudera支持oracle的Exadata和RAC instances当他们作为CDH的后端数据库却没有配置高可用时。 cloudera假定后端的数据库都是单点实例, 不支持数据库的高可用。

> 当重启进程时，各个服务都会在CM连接的数据库中读取配置，如果配置无法读取，大数据集群将不会正确的启动。所以必须要提前做好数据库的备份，这方面内容可以参照(数据库备份)[https://www.cloudera.com/documentation/enterprise/6/latest/topics/cm_ag_backup_dbs.html#xd_583c10bfdbd326ba--6eed2fb8-14349d04bee--7e98]

数据库支持列表：
- MySQL 5.7
- MariaDB 5.5, 10.0
- PostgreSQL 8.4, 9.2, 9.4
- Oracle 12c

#### 3) JAVA
CDH 6.X 仅支持oracle JDK8(不支持openjdk)，以下是详细列表：
- 1.8u162	Recommended / Latest version tested
- 1.8u131	Recommended
- 1.8u121	Recommended
- 1.8u111	Recommended
- 1.8u102	Recommended
- 1.8u91	Recommended
- 1.8u74	Recommended
- 1.8u31	Minimum required

#### 4) 网络和安全要求

**CDH和CM的TLS版本支持表**

Component|Role|Name|Port|Version
---|---|---|---|---
Cloudera Manager|Cloudera Manager Server||7182|TLS 1.2
Cloudera Manager|Cloudera Manager Server||7183|TLS 1.2
Flume|||9099|TLS 1.2
Flume||Avro Source/Sink	||TLS 1.2
Flume||Flume HTTP Source/Sink||TLS 1.2
HBase|Master|HBase Master Web UI Port|60010|TLS 1.2
HDFS|NameNode|Secure NameNode Web UI Port|50470|TLS 1.2
HDFS|Secondary NameNode|Secure Secondary NameNode Web UI Port|50495|TLS 1.2
HDFS|HttpFS|REST Port|14000|TLS 1.1, TLS 1.2
Hive|HiveServer2|HiveServer2 Port|10000|TLS 1.2
Hue |Hue Server|Hue HTTP Port|8888|TLS 1.2
Impala|Impala Daemon|Impala Daemon Beeswax Port|21000|TLS 1.2
Impala|Impala Daemon|Impala Daemon HiveServer2 Port|21050|TLS 1.2
Impala|Impala Daemon|Impala Daemon Backend Port|22000|TLS 1.2
Impala|Impala StateStore|StateStore Service Port|24000|TLS 1.2
Impala|Impala Daemon|Impala Daemon HTTP Server Port|25000|TLS 1.2
Impala|Impala StateStore|StateStore HTTP Server Port|25010|TLS 1.2
Impala|Impala Catalog Server|Catalog Server HTTP Server Port|25020|TLS 1.2
Impala|Impala Catalog Server|Catalog Server Service Port|26000|TLS 1.2
Oozie|Oozie Server|Oozie HTTPS Port|11443|TLS 1.1, TLS 1.2
Solr|Solr Server|Solr HTTP Port|8983|TLS 1.1, TLS 1.2
Solr|Solr Server|Solr HTTPS Port|8985|TLS 1.1, TLS 1.2
Spark|History Server||18080|TLS 1.2
YARN|ResourceManager|ResourceManager Web Application HTTP Port|8090|TLS 1.2
YARN|JobHistory Server|MRv1 JobHistory Web Application HTTP Port|19890|TLS 1.2

**网络和安全要求**
- 网络协议： 仅支持ipv4，需要禁用ipv6
- 集群主机的/etc/hosts文件
    - 所有的主机上都要有一致的/etc/hosts文件
    - hostname中不包含大写字母
    - 不包含重复的ip
- 大多数情况下，在使用CM安装和升级集群时，CM需要拥有对所有主机的SSH权限。一旦集群安装或者升级完毕，需要禁用CM的SSH的访问权限。CM不会保存SSH的认证，当安装和升级过程结束，CM会丢弃所有的SSH认证。
- CM agent需要用root身份运行，来保证必要目录得以创建以及让特定的用户拥有进程和文件的权限（例如hdfs和mapred）。
- selinux尽量关闭，或者你有本事别让它阻碍CDH和CM正常运行
- 防火墙需要关闭，或者放行所有CM CDH和相关服务的(端口)[https://www.cloudera.com/documentation/enterprise/6/latest/topics/cm_ig_ports.html#concept_k5z_vwy_4j]
- 对RHEL和CENTOS来说，`/etc/sysconfig/network`文件必须配置正确的hostname
- CM和CDH使用多个users和groups来完成它们的工作。具体是哪些用户取决于你安装哪些组件和服务，不要去删除这些用户和组，也不要去修改他们的权限。CM、CDH和被管理的服务使用以下用户和组：

Component (Version)|Unix User ID|Groups|Functionality
---|---|---|---
Cloudera Manager (all versions)|cloudera-scm|cloudera-scm|Clusters managed by Cloudera Manager run Cloudera Manager Server, monitoring roles, and other Cloudera Server processes as cloudera-scm.<br>Requires keytab file named cmf.keytabbecause name is hard-coded in Cloudera Manager.
Apache Accumulo|accumulo|accumulo|Accumulo processes run as this user.
Apache Flume|flume|flume|The sink that writes to HDFS as user must have write privileges.
Apache HBase|hbase|hbase|The Master and the RegionServer processes run as this user.
HDFS|hdfs|hdfs, hadoop|The NameNode and DataNodes run as this user, and the HDFS root directory as well as the directories used for edit logs should be owned by it.
Apache Hive|hive|hive|The HiveServer2 process and the Hive Metastore processes run as this user.<br>A user must be defined for Hive access to its Metastore DB (for example, MySQL or Postgres) but it can be any identifier and does not correspond to a Unix uid. This is javax.jdo.option.ConnectionUserName in hive-site.xml.
Apache HCatalog|hive|hive|The WebHCat service (for REST access to Hive functionality) runs as the hive user.
HttpFS|httpfs|httpfs|The HttpFS service runs as this user. See HttpFS Security Configuration for instructions on how to generate the merged httpfs-http.keytab file.
Hue|hue|hue|Hue services run as this user.
Hue Load Balancer|apache|apache|The Hue Load balancer has a dependency on the apache2 package that uses the apacheuser name. Cloudera Manager does not run processes using this user ID.
Impala|impala|impala, hive|Impala services run as this user.
Apache Kafka|kafka|kafka|Kafka services run as this user.
Java KeyStore KMS|kms|kms|The Java KeyStore KMS service runs as this user.
Key Trustee KMS|kms|kms|The Key Trustee KMS service runs as this user.
Key Trustee Server|keytrustee|keytrustee|The Key Trustee Server service runs as this user.
Kudu|kudu|kudu|Kudu services run as this user.
MapReduce|mapred|mapred, hadoop|Without Kerberos, the JobTracker and tasks run as this user. The LinuxTaskController binary is owned by this user for Kerberos.
Apache Oozie|oozie|oozie|The Oozie service runs as this user.
Parquet|~|~|No special users.
Apache Pig|~|~|No special users.
Cloudera Search|solr|solr|The Solr processes run as this user.
Apache Spark|spark|spark|The Spark History Server process runs as this user.
Apache Sentry|sentry|sentry|The Sentry service runs as this user.
Apache Sqoop|sqoop|sqoop|This user is only for the Sqoop1 Metastore, a configuration option that is not recommended.
YARN|yarn|yarn, hadoop|Without Kerberos, all YARN services and applications run as this user. The LinuxContainerExecutor binary is owned by this user for Kerberos.


### 3. 裸机安装指南
(Cloudera Enterprise Reference Architecture for Bare Metal Deployments (PDF))[http://www.cloudera.com/documentation/other/reference-architecture/PDF/cloudera_ref_arch_metal.pdf]
#### 1) java
CM和CDH使用oracle jdk，不支持openjdk。

#### 2) 适当大小的服务器配置
cloudera推荐在生产环境中部署三到四种机器类型：
- Master Node, 运行Hadoop master daemon: NameNode, Standby NameNode, YARN Resource Manager and History Server, the HBase Master daemon, Sentry server, and the Impala StateStore Server and Catalog Server。 同时也是Zookeeper和JournalNodes的安装位置。kudu master servers也会部署在Master Node上。
- Worker Node, Runs the HDFS DataNode, YARN NodeManager, HBase RegionServer, Impala impalad, Search worker daemons and Kudu Tablet Servers.
- Utility Node, Runs Cloudera Manager and the Cloudera Management Services. 也可以部署一个MySQL（或其他）数据库，用于Cloudera Manager, Hive, Sentry 和其他 Hadoop-related projects.
- Edge Node, Contains all client-facing configurations and services, including gateway configurations for HDFS, YARN, Impala, Hive, and HBase. The edge node is also a good place for Hue, Oozie, HiveServer2, and Impala HAProxy. HiveServer2 and Impala HAProxy serve as a gateway to external applications such as Business Intelligence (BI) tools.


### 4. 扩展阅读
[before you install](https://www.cloudera.com/documentation/enterprise/6/6.0/topics/installation_reqts.html#pre-install)
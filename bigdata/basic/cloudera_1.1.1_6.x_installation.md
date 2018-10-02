---
title: cloudera 1.1.1 生产环境安装实践
date: 2018-09-25 12:42:00
categories: bigdata/basic
tags: [hadoop,cloudera]
---
### cloudera 1.1.1 生产环境安装实践

---

### step 0: 准备工作

#### 1) 主机分布

ip|角色
---|---
172.23.2.87| clouderamanager.cdh.com
172.23.2.88| masterhost01.cdh.com
172.23.2.89| masterhost02.cdh.com
172.23.2.201| workerhost01.cdh.com
172.23.2.202| workerhost02.cdh.com
172.23.2.203| workerhost03.cdh.com
172.23.2.204| workerhost04.cdh.com

#### 2) 设定hosts文件
集群里面所有机器此文件一致
``` bash
cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

172.23.2.87  clouderamanager.localcdh.com clouderamanager
172.23.2.88  masterhost01.localcdh.com    masterhost01
172.23.2.89  masterhost02.localcdh.com    masterhost02
172.23.2.201 workerhost01.localcdh.com    workerhost01
172.23.2.202 workerhost02.localcdh.com    workerhost02
172.23.2.203 workerhost03.localcdh.com    workerhost03
172.23.2.204 workerhost04.localcdh.com    workerhost04
```

#### 3) 设定hostname
``` bash
hostname set-hostname <对应主机名>

vim /etc/sysconfig/network
************************************
HOSTNAME=<对应主机名>
************************************
```

#### 4) 设定swap
``` bash
sudo echo 'vm.swappiness=1' >> /etc/sysctl.conf
sudo sysctl -p

cat /proc/sys/vm/swappiness
```
> 之前cloudera推荐将swap关闭，但是这样在新版本内核中会有OOM的影响，所以现在推荐将swap设定为0-10，详情参照[cloudera关于swap的文档](https://www.cloudera.com/documentation/enterprise/latest/topics/cdh_admin_performance.html)

#### 5) 大页透明问题
已启用透明大页面压缩，可能会导致重大性能问题。请运行“echo never > /sys/kernel/mm/transparent_hugepage/defrag”和“echo never > /sys/kernel/mm/transparent_hugepage/enabled”以禁用此设置
``` bash
echo never > /sys/kernel/mm/transparent_hugepage/defrag
echo never > /sys/kernel/mm/transparent_hugepage/enabled

echo `echo never > /sys/kernel/mm/transparent_hugepage/defrag
echo never > /sys/kernel/mm/transparent_hugepage/enabled` >> /etc/rc.local
```

#### 6) psycopg2 -> 2.5.4 安装
CDH 6 中的hue依赖psycopg2连接PostgreSQL，需要版本高于2.5.4，一般cm安装agent的时候会默认安装这个包，但是通常版本都会比较低。
```
sudo yum install python-pip
sudo pip install psycopg2==2.7.5 --ignore-installed
```

本文主要参照的文档：[cloudera 6.x 安装指引](https://www.cloudera.com/documentation/enterprise/6/6.0/topics/installation.html)

### Step 1: Configure a Repository
> 在clouderamanager.cdh.com上执行

``` bash
# 下载cloudera 软件源仓库文件
sudo wget https://archive.cloudera.com/cm6/6.0.0/redhat7/yum/cloudera-manager.repo -P /etc/yum.repos.d/

# 安装仓库文件的GPG key
sudo rpm --import https://archive.cloudera.com/cm6/6.0.0/redhat7/yum/RPM-GPG-KEY-cloudera
```

### Step 2: Install JDK
> 在clouderamanager.cdh.com上执行

可以通过CM来托管安装，也可以手动安装oracle JDK

安装要求：
- JDK必须是64位
- 集群里面的JDK必须版本一致
- JDK安装目录必须是/usr/java/jdk-version

``` bash
sudo yum install oracle-j2sdk1.8
```

### Step 3: Install Cloudera Manager Server
> 在clouderamanager.cdh.com上执行

**安装CM**
``` bash
sudo yum install cloudera-manager-daemons cloudera-manager-agent cloudera-manager-server
```

**(Recommended) Enable Auto-TLS**  
Auto-TLS极大地简化了在群集上启用和管理TLS加密的过程。 它可以自动创建内部证书颁发机构（CA）并在所有群集主机上部署证书。 它还可以自动分发现有证书，例如由公共CA签名的证书。 将新的群集主机或服务添加到启用了自动TLS的群集会自动创建和部署所需的证书。  
但是Auto-TLS仅在最新安装的时候支持。必须在给CM添加主机之前开启这个功能。

``` bash
# 启用Auto-TLS
sudo JAVA_HOME=/usr/java/jdk1.8.0_141-cloudera /opt/cloudera/cm-agent/bin/certmanager setup --configure-services
INFO:root:Logging to /var/log/cloudera-scm-agent/certmanager.log

# 启用过程日志查看
cat /var/log/cloudera-scm-agent/certmanager.log
[27/Sep/2018 18:15:24 +0000] 2519 MainThread cert         INFO     SCM Certificate Manager
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager None None 0o755
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/private cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/trust-store cloudera-scm cloudera-scm 0o755
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/hosts-key-store cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/CMCA cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/CMCA/ca-db cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/CMCA/private cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:24 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/CMCA/ca-db/newcerts cloudera-scm cloudera-scm 0o700
[27/Sep/2018 18:15:25 +0000] 2519 MainThread os_ops       INFO     Created directory /var/lib/cloudera-scm-server/certmanager/hosts-key-store/localhost.localdomain cloudera-scm cloudera-scm 0o755
```
> 推荐不开启，开启之后，server日志里面有报错，说没有企业版的license，所以没有自动注册证书什么的。然后又引起了安装CDH的错误 - `Installation failed. Failed to receive heartbeat from agent.`，排查了好久，网上都说hostname、hosts文件格式、tmpfs挂载、ntp时间同步和7182端口配置错误什么鬼的，结果没启用tls就安装成功了。  
以下是两个关于tmpfs错误的说明，感兴趣的可以了解一下
- [tmpfs - Cloudera Manager. Agent cannot connect with supervisor. Failed to receive heartbeat from agent - 1](https://community.cloudera.com/t5/Cloudera-Manager-Installation/Cloudera-Manager-Agent-cannot-connect-with-supervisor-Failed/td-p/58522)
- [tmpfs - Cloudera Manager. Agent cannot connect with supervisor. Failed to receive heartbeat from agent - 2](http://community.cloudera.com/t5/Cloudera-Manager-Installation/CDH-5-12-0-clouder-manager-agent-can-not-start/td-p/58654)

### Step 4: Install Databases
> 在clouderamanager.cdh.com上执行，如果条件允许，可以有一台单独的数据库服务器

#### 1) 安装mysql
``` bash
# 1. 安装mysql
sudo wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
sudo yum update
sudo yum install mysql-server

# 2. 配置mysql
echo '[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
transaction-isolation = READ-COMMITTED
# Disabling symbolic-links is recommended to prevent assorted security risks;
# to do so, uncomment this line:
symbolic-links = 0

key_buffer_size = 32M
max_allowed_packet = 32M
thread_stack = 256K
thread_cache_size = 64
query_cache_limit = 8M
query_cache_size = 64M
query_cache_type = 1

max_connections = 550
#expire_logs_days = 10
#max_binlog_size = 100M

#log_bin should be on a disk with enough free space.
#Replace '/var/lib/mysql/mysql_binary_log' with an appropriate path for your
#system and chown the specified folder to the mysql user.
log_bin=/var/lib/mysql/mysql_binary_log

#In later versions of MySQL, if you enable the binary log and do not set
#a server_id, MySQL will not start. The server_id must be unique within
#the replicating group.
server_id=1

binlog_format = mixed

read_buffer_size = 2M
read_rnd_buffer_size = 16M
sort_buffer_size = 8M
join_buffer_size = 8M

# InnoDB settings
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit  = 2
innodb_log_buffer_size = 64M
innodb_buffer_pool_size = 4G
innodb_thread_concurrency = 8
innodb_flush_method = O_DIRECT
innodb_log_file_size = 512M

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

sql_mode=STRICT_ALL_TABLES' > /etc/my.cnf

# 3. 启动mysql
sudo systemctl enable mysqld
sudo systemctl start mysqld

# 4. 初始化mysql
sudo /usr/bin/mysql_secure_installation
# 默认root密码为空
[...]
Enter current password for root (enter for none):
OK, successfully used password, moving on...
[...]
Set root password? [Y/n] Y
New password:
Re-enter new password:
Remove anonymous users? [Y/n] Y
[...]
Disallow root login remotely? [Y/n] N
[...]
Remove test database and access to it [Y/n] Y
[...]
Reload privilege tables now? [Y/n] Y
All done!
```

#### 2) Installing the MySQL JDBC Driver
``` bash
wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.46.tar.gz
tar zxvf mysql-connector-java-5.1.46.tar.gz
sudo mkdir -p /usr/share/java/
cd mysql-connector-java-5.1.46
sudo cp mysql-connector-java-5.1.46-bin.jar /usr/share/java/mysql-connector-java.jar
```

#### 3) Creating Databases for Cloudera Software
给此表中的信息创建库和用户

Service|Database|User
---|---|---
Cloudera Manager Server|scm|scm
Activity Monitor|amon|amon
Reports Manager|rman|rman
Hue|hue|hue
Hive Metastore Server|metastore|hive
Sentry Server|sentry|sentry
Cloudera Navigator Audit Server|nav|nav
Cloudera Navigator Metadata Server|navms|navms
Oozie|oozie|oozie

``` sql
CREATE DATABASE <database> DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON <database>.* TO '<user>'@'%' IDENTIFIED BY '<password>';
```

可以通过以下sql命令确认上面的操作
``` sql
SHOW DATABASES;
SHOW GRANTS FOR '<user>'@'%';
```

### Step 5: Set up the Cloudera Manager Database
> 在clouderamanager.cdh.com上执行，如果条件允许，可以有一台单独的数据库服务器

CM提供了一个脚本(scm_prepare_database.sh)来创建和配置CM的数据库，这个脚本可以作如下事情：
- 创建Cloudera Manager Server数据库配置文件
- 为Cloudera Manager Server创建和配置数据库(MariaDB, MySQL, and PostgreSQL)
- 为Cloudera Manager Server创建和配置用户(MariaDB, MySQL, and PostgreSQL)

#### 1) Syntax for scm_prepare_database.sh
`/opt/cloudera/cm/schema/scm_prepare_database.sh [options] <databaseType> <databaseName> <databaseUser> <password>`
- `<databaseType>`:
    - MariaDB: mysql
    - MySQL: mysql
    - Oracle: oracle
    - PostgreSQL: postgresql
- `<databaseName>`, 对MySQL, MariaDB, and PostgreSQL来说，如果指定`-u`和`-p`选项，则脚本会创建指定的数据库，否则只会配置它。
- `<databaseUser>`, 数据库用户名。
- `<password>`, 数据库用户名密码，如果不想显式的暴露密码，可以忽略，然后在交互中输入密码。

> 如果在第四步中已经创建过数据库和用户授权，不需要执行此脚本时增加`-u`和`-p`选项

#### 2) Preparing the Cloudera Manager Server Database
使用第四步中使用的数据库名称、数据库用户和数据库密码，来执行scm_prepare_database.sh脚本
``` bash
sudo /opt/cloudera/cm/schema/scm_prepare_database.sh mysql <databaseName> <databaseUser>


# example
/opt/cloudera/cm/schema/scm_prepare_database.sh mysql scm scm
Enter SCM password:
JAVA_HOME=/usr/java/jdk1.8.0_141-cloudera
Verifying that we can write to /etc/cloudera-scm-server
Creating SCM configuration file in /etc/cloudera-scm-server
Executing:  /usr/java/jdk1.8.0_141-cloudera/bin/java -cp /usr/share/java/mysql-connector-java.jar:/usr/share/java/oracle-connector-java.jar:/usr/share/java/postgresql-connector-java.jar:/opt/cloudera/cm/schema/../lib/* com.cloudera.enterprise.dbutil.DbCommandExecutor /etc/cloudera-scm-server/db.properties com.cloudera.cmf.db.
[                          main] DbCommandExecutor              INFO  Successfully connected to database.
All done, your SCM database is configured correctly!
```
> 此处只针对cm和mysql安装在同一台上的用法，其他情况，可参照文章最开头的官方文档的链接

### Step 6: Install CDH and Other Software
#### 1) 启动Cloudera Manager Server
``` bash
sudo systemctl start cloudera-scm-server
```

#### 2) 确定Cloudera Manager Server服务启动完毕
``` bash
sudo tail -f /var/log/cloudera-scm-server/cloudera-scm-server.log
...
INFO WebServerImpl:com.cloudera.server.cmf.WebServerImpl: Started Jetty server.
# 当看到上面信息的时候，服务已经启动完毕
```
> 错误说明
- 现象描述: 在群集安装界面，每次都是安装失败，失败的原因是在`正在检测 Cloudera Manager Server...`部分里面，执行的是`BEGIN host -t PTR localhost.localdomain`，每一台都是。
>
>- 问题分析: 最初以为是cm会动态分析hostname，获得cm server的hostname，然后在各个cluster节点上使用/etc/hosts文件解析出来真正的ip。所以一直都在排查hosts文件，但其实不是这里的问题。
>
>- 真实原因: cm并不会动态分析hostname，而是在初始化的时候生成一个这样的初始化文件`/var/lib/cloudera-scm-server/certmanager/cm_init.txt`，里面很多初始化信息，后面cm再重启就不会变了，会一直用这个文件里面获取的信息。结果我遇到的坑就是，我先启动的cm然后又修改的hostname，结果web界面初始化的时候，死活识别不了真正的hostname，手动修改一下这个文件里面的hostname，然后重启一下cm，问题解决。

#### 3) 离线准备parcel文件(可选)
因为parcel文件很大，所以避免网络延迟，我们可以提前下载parcel文件在本地，然后再进行安装。  
我们需要安装5.11.1版本，所以我们访问https://archive.cloudera.com/cdh6/6.0.0/parcels/  

这里需要下载以下三个文件
- CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel
- CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel.sha256(需要更名)
- manifest.json

> 重点注意，此处下载的文件，后来实测发现用不上，还是会在线下载，原因未查明。

``` bash
cd /opt/cloudera/parcel-repo/
wget https://archive.cloudera.com/cdh6/6.0.0/parcels/CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel
wget -O CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel.sha https://archive.cloudera.com/cdh6/6.0.0/parcels/CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel.sha256
wget https://archive.cloudera.com/cdh6/6.0.0/parcels/manifest.json

ls
CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel  CDH-6.0.0-1.cdh6.0.0.p0.537114-el7.parcel.sha  manifest.json
```

#### 4) 浏览器访问
`http://<server_host>:7180`
> 如果开启了Auto-TLS，会跳转到`https://<server_host>:7183`

#### 5) 登陆Cloudera Manager Admin Console
默认账号密码是`admin`:`admin`

### Step 7: Set Up a Cluster
#### 1) 群集安装
会在web界面经过以下操作步骤：
- 欢迎
- Specify Hosts，示例格式`clouderamanager.localcdh.com,masterhost0[1-2].localcdh.com,workerhost0[1-4].localcdh.com`
- 选择存储库, 选择公共库就好，暂时个人还没有碰到私有库的需求。如果界面上没有CDH6的选项，可以点击`选择parcel`旁边的更多选项，把最新版本的parcel url输入进去就可以了，例如，我希望安装CDH6，但是发现没有，我就增加一个`https://archive.cloudera.com/cdh6/6.0.0/parcels/`，即可。 如果需要安装sqoop，在这边需要勾选，不然后面没法选了。
- JDK 安装选项， 选择oracle jdk安装，另外可以勾选无限什么的那个选项，估计就是jdk的证书白名单。
- 提供 SSH 登录凭据，推荐用root的sshkey或者密码，这样权限足够，不会有乱七八糟问题。
- Install Agents，容易出现`安装失败。 无法接收 Agent 发出的检测信号。`错误，就跟上面auto-tls注释里面说明的一样，注意那几项肯定能成功。
- 正在安装选定 Parcel，顾名思义。
- Inspect Hosts，检测部分参数，根据参数提示调整即可

#### 2) 群集配置
会在web界面经过以下操作步骤：
- Select Services，有打包好的方案选择，也有自定义服务选择，通常是自定义，方便看到安装了什么服务。
- 自定义角色分配，可以参照[官网推荐](https://www.cloudera.com/documentation/enterprise/6/6.0/topics/cm_ig_host_allocations.html#host_role_assignments)
- 数据库设置，这边就是第四步里面创建的数据库
- 审核更改，审核上面的配置
- 命令详细信息，执行命令
- Summary，结束
---
title: cloudera 1.1.1 生产环境安装实践
date: 2018-09-25 12:42:00
categories: bigdata/basic
tags: [hadoop,cloudera]
---
### cloudera 1.1.1 生产环境安装实践

---

### Step 1: Configure a Repository
``` bash
# 下载cloudera 软件源仓库文件
sudo wget https://archive.cloudera.com/cm6/6.0.0/redhat7/yum/cloudera-manager.repo -P /etc/yum.repos.d/

# 安装仓库文件的GPG key
sudo rpm --import https://archive.cloudera.com/cm6/6.0.0/redhat7/yum/RPM-GPG-KEY-cloudera
```

### Step 2: Install JDK
可以通过CM来托管安装，也可以手动安装oracle JDK

安装要求：
- JDK必须是64位
- 集群里面的JDK必须版本一致
- JDK安装目录必须是/usr/java/jdk-version

``` bash
sudo yum install oracle-j2sdk1.8
```

### Step 3: Install Cloudera Manager Server
``` bash
sudo yum install cloudera-manager-daemons cloudera-manager-agent cloudera-manager-server
```

### Step 4: Install Databases

### Step 5: Set up the Cloudera Manager Database

### Step 6: Install CDH and Other Software

### Step 7: Set Up a Cluster
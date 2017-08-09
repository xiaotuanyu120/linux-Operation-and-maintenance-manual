---
title: etcd 2.1.0 etcd-api python-etcd
date: 2017-08-09 14:02:00
categories: virtualization/container
tags: [etcd,python-etcd]
---
### etcd 2.1.0 etcd-api python-etcd

---

### 0. 使用python-etcd之前
确保安装了python-2.7.13和git
> 参照文档[python-etcd](https://github.com/jplana/python-etcd)

---

### 1. python-etcd
#### 1) 安装python-etcd
``` bash
git clone https://github.com/jplana/python-etcd.git
cd python-etcd/
python setup.py install
```
#### 2) 修改etcd值
``` python
import etcd

client = etcd.Client(host='192.168.33.41', port=2379)
# for etcd cluster
# client = etcd.Client(host=(('127.0.0.1', 4001), ('127.0.0.1', 4002), ('127.0.0.1', 4003)))

client.write('/nodes/n1', 1)
```
> 更多更新etcd值方法和参数，参照[python-etcd](https://github.com/jplana/python-etcd)

#### 3) 读取etcd值
``` python
client.read('/nodes/n2').value
client.read('/nodes', recursive = True) #get all the values of a directory, recursively.
```
> 更多读取etcd值方法和参数，参照[python-etcd](https://github.com/jplana/python-etcd)

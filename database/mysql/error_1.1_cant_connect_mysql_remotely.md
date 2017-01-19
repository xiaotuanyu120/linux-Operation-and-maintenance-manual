---
title: error: 1.1 DNS查询优化和Host缓存
date: 2016-05-02 19:42:00
categories: database/mysql
tags: [database,mysql,error]
---
###

---

### 1. 错误现象
报错信息：  
数据库配置了远程访问的用户，连接报错  
```
2013 lost connection to mysql server at 'waiting for initial communication packet'...
```
网查后，发现跟msyql的host cache有关系

---

### 2. 错误分析
根据mysql5.7的操作手册整理
MySQL服务器在内存中维护了一个host缓存，包括了"IP地址"，"主机名称"和"错误信息"。服务器会在非本机TCP连接的时候用到这个缓存。在使用以"127.0.0.1"/"::1"为ip的tcp连接和Unix socket文件连接中不会使用这个缓存。

对于每个新的client连接，服务器会使用client的ip地址去检查client的主机名是否存在于host缓存中。如果不在的话，服务器会尝试解析它的主机名。首先，它会解析这个ip地址为一个主机名，然后把主机名重新解析回ip地址。然后对比两个ip地址，确保它们是一致的。服务器会保存结果信息到host缓存中。如果host缓存满了，这最旧的缓存会被抛弃。

服务器是这样处理host缓存中的entries的：

1、当第一个TCP client通过一个给定的ip地址连接到服务器时，一个新的entry会被创建用以记录"client IP","host name"和"client lookup validation flag"。最开始，host name会被设置成"NULL"，flag为"false"。后续从跟此entry同一来源ip的连接也会使用此entry。

2、如果"validation flag"是false, 服务器会尝试从IP解析到host name。如果解析成功，host name会被记录，"validation flag"也会被设置成ture。如果解析失败，会根据这个错误是永久的还是短期的来分别采取不同的动作。如果是永久错误，host name会保持NULL，而validation flag会被修改为true；如果是暂时的错误，host name和validation flag都会保持不变。（会在此ip再次访问时继续尝试解析）

3、如果在给定的ip地址连接到服务器的处理过程中发生了错误，服务器会在此ip地址的entry中更新响应错误计数器，详情参照http://dev.mysql.com/doc/refman/5.7/en/host-cache-table.html

---

### 3. 解决办法：
``` bash
# 关闭上面resolve的过程
vi /etc/my.cnf
***************************
[mysqld]
skip-name-resolve
***************************
service mysqld restart

## 问题解决
```

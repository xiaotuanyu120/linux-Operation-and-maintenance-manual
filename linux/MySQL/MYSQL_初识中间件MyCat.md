MYSQL: 初识中间件MyCat
2016年9月22日
9:46
 
---
title: MyCat初识
date: 2016-09-22 09:46:00
categories: database
tags: [mysql,mycat]
---
### 什么是MyCat？
MyCat是一个开源的数据库中间件，基于阿里曾经的cobar开发，致力于提供数据库分布式集群解决方案。
 
<!--more-->
 
### MyCat的特性
- 支持SQL92标准
- 遵守Mysql原生协议，跨语言，跨平台，跨数据库的通用中间件代理。
- 基于心跳的自动故障切换，支持读写分离，支持MySQL主从，以及galera cluster集群。
- 支持Galera for MySQL集群，Percona Cluster或者MariaDB cluster
- 基于Nio实现，有效管理线程，高并发问题。
- 支持数据的多片自动路由与聚合，支持sum,count,max等常用的聚合函数,支持跨库分页。
- 支持单库内部任意join，支持跨库2表join，甚至基于caltlet的多表join。
- 支持通过全局表，ER关系的分片策略，实现了高效的多表join查询。
- 支持多租户方案。
- 支持分布式事务（弱xa）。
- 支持全局序列号，解决分布式下的主键生成问题。
- 分片规则丰富，插件化开发，易于扩展。
- 强大的web，命令行监控。
- 支持前端作为mysq通用代理，后端JDBC方式支持Oracle、DB2、SQL Server 、 mongodb 、巨杉。
- 支持密码加密
- 支持服务降级
- 支持IP白名单
- 支持SQL黑名单、sql注入攻击拦截
- 支持分表（1.6）
- 集群基于ZooKeeper管理，在线升级，扩容，智能优化，大数据处理（2.0开发版）。
 
### 接触MyCat的几个缘由
公司数据库瓶颈，想到可以做读写分离，于是接触到数据库中间件，在了解数据库中间件的过程中，发现MyCat的社区氛围、安装难度和配置复杂度深得我心。
 
### 运维角度来看MyCat
- 安装配置相对简单
- 和Mysql集群架构低耦合，mysql可选主从、双主、n主n从等架构
- 读写分离配置容易，只需要mycat配置好可读可写
- 抽象了物理库表为逻辑库表，支持sql、join等操作，对用户来讲，接受难度低

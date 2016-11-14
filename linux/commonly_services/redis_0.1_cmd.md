---
title: redis: 0.1_基本命令
date: 2016-11-14 13:45:00
categories: linux/commonly_services
tags: [linux,redis]
---
### redis的基本命令
----
### 1. redis基本命令
- `redis-server`, redis服务启动命令
- `redis-cli`, redis客户端启动命令
- `redis-setinel`, redis哨兵程序启动命令
- `redis-check-aof`, redis AOF持久化文件的检测及修复工具  
`Usage: redis-check-aof [--fix] <file.aof>`
- `redis-check-dump`, redis RDB持久化文件的检测工具  
`Usage: redis-check-dump <dump.rdb>`
- `redis-benchmark`, 用来测试redis性能的工具
----
### 2. redis-cli
`-a` 使用密码登录 及 `auth`授权
``` bash
# 使用密码登录redis
redis-cli -p 6389 -a redis
127.0.0.1:6389> keys *
1) "counter:__rand_int__"
2) "key:__rand_int__"
3) "mylist"


# 无密码连接后，使用auth
redis-cli -h 127.0.0.1 -p 6389
127.0.0.1:6389> keys *
(error) NOAUTH Authentication required.
127.0.0.1:6389> auth redis
OK
127.0.0.1:6389> keys *
1) "counter:__rand_int__"
2) "key:__rand_int__"
3) "mylist"
```

增加`key:value`及查询`value`
``` bash
127.0.0.1:6389> set foo bar
OK
127.0.0.1:6389> get foo
"bar"
```

查询key是否存在
``` bash
# 查询key是否存在
127.0.0.1:6389> keys food
1) "food"

# 模糊匹配
127.0.0.1:6389> keys f*
1) "foo"
2) "food"

# 查看所有的key
127.0.0.1:6389> keys *
1) "foo"
2) "counter:__rand_int__"
3) "key:__rand_int__"
4) "mylist"
5) "food"
```

给key设置过期时间，并查看可存活时间
``` bash
127.0.0.1:6389> set mykey hello
OK
127.0.0.1:6389> expire mykey 10
(integer) 1
127.0.0.1:6389> ttl mykey
(integer) 6
127.0.0.1:6389> ttl mykey
(integer) 5
...
127.0.0.1:6389> ttl mykey
(integer) -2
127.0.0.1:6389> get mykey
(nil)
```

`MGET`减少request数量
``` bash
127.0.0.1:6389> get foo
"bar"
127.0.0.1:6389> get food
"bread"
127.0.0.1:6389> mget foo food
1) "bar"
2) "bread"
```
> 多次GET请求可以合并成一个MGET请求，降低请求次数

慢日志查询
``` bash
# 查看慢日志配置
127.0.0.1:6389> CONFIG GET slowlog-log-slower-than
1) "slowlog-log-slower-than"
2) "10000"
# 1000000us是1s
127.0.0.1:6389> CONFIG GET slowlog-max-len
1) "slowlog-max-len"
2) "128"
# 内存中慢日志条数的最大值

# 临时设定慢日志配置为0，然后查询慢日志内容
127.0.0.1:6389> CONFIG SET slowlog-log-slower-than 0
OK
127.0.0.1:6389> get number
"10086"
127.0.0.1:6389> slowlog get
1) 1) (integer) 2
   2) (integer) 1479108471
   3) (integer) 5
   4) 1) "get"
      2) "number"
2) 1) (integer) 1
   2) (integer) 1479108471
   3) (integer) 6
   4) 1) "AUTH"
      2) "redis"
3) 1) (integer) 0
   2) (integer) 1479108455
   3) (integer) 9
   4) 1) "CONFIG"
      2) "SET"
      3) "slowlog-log-slower-than"
      4) "0"
# 发现慢日志记录从下往上一次是慢日志查询设置操作-redis授权-number值的获取

# 查看慢日志条数
127.0.0.1:6389> slowlog len
(integer) 6
```
[redisbook 关于慢日志文档](http://redisbook.com/preview/slowlog/content.html)  

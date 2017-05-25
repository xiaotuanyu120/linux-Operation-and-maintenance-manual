---
title: redis: 1.2.1 将redis执行结果输出到文件
date: 2017-05-25 17:43:00
categories: linux/service
tags: [linux,redis]
---
### redis: 1.2.1 将redis执行结果输出到文件

---

### 1. redis在shell中执行命令并将结果输出到文件
``` bash
# redis-cli -a {redis_password} -p {redis_port} {redis_cmd} > file
redis-cli -a myredis -p 6381 get mykey > redis.txt
```
> 如果没有设置requirepass，不用使用-a参数指定密码

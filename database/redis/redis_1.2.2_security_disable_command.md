---
title: redis: 1.2.2 安全性(CONFIG重命名)
date: 2017-06-01 10:22:00
categories: database/redis
tags: [database,redis]
---
### redis: 1.2.2 安全性(CONFIG重命名)

---

### 1. 重命名CONFIG命令
redis中有部分命令的权限很重要，比如CONFIG，有时我们不希望连上redis的客户端可以执行此命令，我们可以采取redis的重命名操作
``` bash
vim /etc/redis/6379.conf
************************************************
# 1. 重命名为特殊名称，保证安全性
rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

# 2. 或者干脆禁用CONFIG命令
rename-command CONFIG ""
************************************************
```

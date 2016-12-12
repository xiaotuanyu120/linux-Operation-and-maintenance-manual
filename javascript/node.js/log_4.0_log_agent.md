---
title: weblog: 4.0 log_agent
date: 2016-12-07 00:40:00
categories: javascript/node.js
tags: [node.js,socket.io,express,jquery,redis]
---
### log 4.0 client

---

### 1. agent需要完成的功能
- tail日志内容
- 将tail到的内容发布到redis服务器中

---

### 2. agent文件内容
`log_agent.py`
``` python
import subprocess
import select

import redis

r = redis.StrictRedis(host="127.0.0.1", port=6379)
filename = '/tmp/test.log'
f = subprocess.Popen(['tail','-F',filename],\
        stdout=subprocess.PIPE,stderr=subprocess.PIPE)
p = select.poll()
p.register(f.stdout)

# p.poll(timeout)
while True:
    if p.poll(1):
        r.publish('logchannel', f.stdout.readline())
```

---
title: git: 1.5.0 mv error(case sensitive of linux)
date: 2016-10-25 19:49:00
categories: devops/git
tags: [devops,git,error]
---
### git: 1.5.0 mv error(case sensitive of linux)

---

### 1. mv错误
#### 1) 错误信息
``` bash
git mv DevOps devops
fatal: renaming 'DevOps' failed: Text file busy
```

#### 2) 原因和解决办法
这是因为git认为DevOps和devops一样，可以使用下面的方法解决
``` bash
git mv DevOps devopss
git mv devopss devops
```

---
title: git: 1.7.0 push返回403
date: 2016-05-05 14:18:00
categories: devops/git
tags: [git,error]
---
### git: 1.7.0 push返回403

---

### 1. 问题描述
1. 首先git clone自己的分支
2. 修改后git push
3. 返回错误
``` bash
git push
error: The requested URL returned error: 403 Forbidden \while accessing https://github.com/xiaotuanyu120/op-utility.git/info/refs
```

---

### 2. 解决方案
``` bash
vim .git/config
************************************
# 找到下面这条信息
url = https://github.com/xiaotuanyu120/op-utility.git
# 修改为
url = https://username:password@github.com/xiaotuanyu120/op-utility.git
************************************
git push
```
> 其实如果详细了解http协议的话，就知道，url的编写是协议://用户名：密码@域名/资源路径，此处我们手动写入用户名和密码来解决403的权限问题

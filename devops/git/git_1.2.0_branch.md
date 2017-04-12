---
title: git: 1.2.0 分支
date: 2016-03-01 16:03:00
categories: devops/git
tags: [git,branch]
---
### git: 1.2.0 分支

---

### 1. 分支操作
#### 1) 如何创建分支
``` bash
git branch test
```

#### 2) 查看分支
``` bash
git branch
* client
  list
  master
  test
```
> 有"\*"标识的是当前分支

#### 3) 切换分支
``` bash
git checkout test
git checkout master
# "git branch -b branch_name" == "git branch branch_name;git checkout branch_name"

# 切换时文件的改变
git checkout test
echo "check" >> README.md
git commit -a -m "check file status when branch changed"
# 切换分支之前，尽量commit所有更改，保持切换时分支是干净的

git checkout master
cat README.md
op-utility
utilities for operation
# 发现并没有上面添加的内容
```

#### 4) 合并分支到当前分支
``` bash
git status
# On branch master
nothing to commit, working directory clean

git merge test
# 相当于把test分支合并到了当前master分支
```

#### 5) 删除分支
``` bash
git branch -d test
```
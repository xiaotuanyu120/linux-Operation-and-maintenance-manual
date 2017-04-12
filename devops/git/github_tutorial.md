---
title: github: 入门引导
date: 2015-08-23 22:35:00
categories: devops/git
tags: [github,git]
---
### github: 入门引导

---

### 1. github引导
#### 1) 安装git
``` bash
yum install git```
#### 2) 初始化git目录
``` bash
git init
```

#### 3) 增加项目文件到git仓库中
``` bash
git add ./*
```

#### 4) commit改动
``` bash
git commit -m "first commit"
[master (root-commit) 428c777] first commit
 44 files changed, 11264 insertions(+)
 create mode 100644 _3rd/is_num.py
 ......
 create mode 100644 _7th_1/get_tree_dir2.py
 create mode 100644 _7th_1/walk/this_is_file_test_walk```

#### 5) 增加remote地址
该地址是你在github上注册登录后，创建的第一个repo的地址，可在创建repo后复制
``` bash
git remote add origin https://github.com/xiaotuanyu120/py_homework.git
```
> 增加remote地址后，可在.git/config中查看配置的信息

#### 6) 推送本地commit过的文件到github
``` bash
git push -u origin master
Username for 'https://github.com': xiaotuanyu120
Password for 'https://xiaotuanyu120@github.com':
Counting objects: 54, done.
Compressing objects: 100% (50/50), done.
Writing objects: 100% (54/54), 267.01 KiB | 0 bytes/s, done.
Total 54 (delta 8), reused 0 (delta 0)
To https://github.com/xiaotuanyu120/py_homework.git
 * [new branch]      master -> master
Branch master set up to track remote branch master from origin.```
> 需要手动输入在git注册的账号和密码

---

### 3. HOW TO CLONE A REPO THAT IDENTIFY BRANCH
``` bash
git clone -b webserver https://git.coding.net/the5fire/PyCode.git# 指定clone到webserver这个分支```
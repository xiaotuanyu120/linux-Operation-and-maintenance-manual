---
title: gitlab: 1.1.0 安装(centos6)
date: 2016-08-26 15:19:00
categories: devops/git
tags: [devops,gitlab,git]
---
### gitlab: 1.1.0 安装(centos6)

---

### 0. 文档
[gitlab centos6 installation guide](https://about.gitlab.com/downloads/#centos6)  
在上面的的文档中，你可以选择不同的linux版本切换文档

### 1. 安装gitlab
#### 1) Install and configure the necessary dependencies
``` bash
yum install curl openssh-server openssh-clients postfix cronie
service postfix start
chkconfig postfix on
lokkit -s http -s ssh
```

#### 2) Add the GitLab package server and install the package
``` bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
yum install gitlab-ce
# 下载中断的话，可重新执行yum命令继续下载

gitlab-ctl reconfigure
```

---

### 2. 测试访问
0. 在浏览器中访问服务器ip
1. 第一个页面是给root用户配置一个密码
2. 使用root登陆

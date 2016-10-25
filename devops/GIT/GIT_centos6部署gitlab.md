GIT: centos6部署gitlab
Friday, 26 August 2016
3:19 PM
 
---
title: centos6上部署gitlab服务
date: 2016-08-26 15:19:00
categories: devops
tags: [devops,gitlab,git]
---
## 安装gitlab
**Install and configure the necessary dependencies**
```
yum install curl openssh-server openssh-clients postfix cronie
service postfix start
chkconfig postfix on
lokkit -s http -s ssh
```
 
**Add the GitLab package server and install the package**
``` bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
yum install gitlab-ce
# 下载中断的话，可重新执行yum命令继续下载
 
gitlab-ctl reconfigure
```
 
## 测试访问
0、在浏览器中访问服务器ip
1、第一个页面是给root用户配置一个密码
2、使用root登陆
 
 
**页面效果**
![058-page](http://blog.xiao5tech.com/uploads/058.png)


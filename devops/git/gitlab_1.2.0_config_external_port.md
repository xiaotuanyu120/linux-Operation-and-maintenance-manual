---
title: gitlab 1.2.0 配置gitlab访问端口
date: 2017-03-09 14:05:00
categories: devops/git
tags: [gitlab]
---
### gitlab 1.2.0 配置gitlab访问端口

---

### 1. 配置过程
``` bash
# 1. 配置external_url改变默认80端口
vim /etc/gitlab/gitlab.rb
******************************
#external_url 'http://yourip'
external_url 'http://yourip:999'
******************************

# 重新配置gitlab
gitlab-ctl reconfigure
```

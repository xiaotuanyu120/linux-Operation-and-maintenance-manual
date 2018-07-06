---
title: gitlab: 1.3.0 gitlab备份及恢复
date: 2018-07-06 08:57:00
categories: devops/git
tags: [gitlab,backup,restore]
---
### gitlab: 1.3.0 gitlab备份及恢复

---

### 0. gitlab备份
#### 1) 依赖条件
- rsync安装

> [gitlab backup and restore official docs](https://docs.gitlab.com/ee/raketasks/backup_restore.html)

#### 2) 备份时间戳  
假设备份文件名称是 `1493107454_2018_04_25_10.6.4-ce_gitlab_backup.tar`(文件格式：`[TIMESTAMP]_gitlab_backup.tar`)，则备份时间戳是`1493107454_2018_04_25_10.6.4-ce`。  
备份的tar文件是在`backup_path`定义的目录中。

### 1. 创建gitlab备份
因为一直都是在用gitlab rpm安装，所以下面只讨论yum或rpm安装的gitlab的文件备份方式
#### 1) 手动备份
``` bash
gitlab-rake gitlab:backup:create
```

#### 2) cron定时备份
``` bash
sudo su -
crontab -e
```

增加下面的内容到cron定时任务中
```
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create CRON=1
```

在`/etc/gitlab/gitlab.rb`中可以配置定时产生的备份文件保留时间
```
# limit backup lifetime to 7 days - 604800 seconds
gitlab_rails['backup_keep_time'] = 604800
```

### 2. 恢复gitlab备份
``` bash
# 关闭访问数据库的服务
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq

# 恢复数据
gitlab-rake gitlab:backup:restore BACKUP=1493107454_2018_04_25_10.6.4-ce
```
> 备份恢复必须要同样的gitlab版本

> BACKUP=timestamp_of_backup，不需要指定文件名称，只需要指定timestamp就可以

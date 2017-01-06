---
title: inotify: 3.1.0 inotify实现代码回滚(设想)
date: 2016-11-08 14:26:00
categories: linux/service
tags: [linux,inotify]
---
### inotify: 3.1.0 inotify实现代码回滚(设想)

---

### 1. 需求背景
目前公司实际情况：
1. 开发团队更新时段09:00 - 18:00
2. 更新流程为：
svn提交 -> svn仓库中基于rsync的shell同步脚本 -> 线上机器(重启tomcat)

目前面临的问题：
开发负责更新流程的svn提交和shell同步脚本的执行，运维只负责重启，所以无法控制备份时间，增加了实现按更新备份策略的难度

因为代码回滚的核心就在于是否可以按照更新的频率去提前备份代码，所以基于上面的困难，就产生了此文的需求，如何实现按更新频率备份代码

----

### 2. 设想解决方案
#### 1) 前提
公司不想使用svn、git等版本控制来控制代码回滚，而我们通常用inotify+rsync来实现实时同步，但那并不能实现按照版本备份代码。

#### 2) 方案
但是我们可以转变一下思路：
1. 在每天09:00之前备份一次，作为每日的固定备份
2. 使用inotify+rsync，在inotify检测到文件系统最后一次更新行为后的一段时间内，若没有更新则代表此次更新结束，做一次更新

这样就可以实现，每日早上一次原始备份，在每次开发的更新行为之后进行一次实时备份，若开发更新频繁，则可控制保留最近的n次更新

---

### 3. 备份脚本
``` bash
#!/bin/bash

src='/tmp/src1/'
dest='/tmp/dest1'
start_time=`date +%s`

while true
do
  changed=`inotifywait -rqt 10 -e modify,attrib,moved_to,moved_from,move,move_self,create,delete,delete_self $src`
  node_time=`date +%s`
  process_time=$(($node_time-$start_time))
  [ -z "$changed" ] && {
    [ $process_time -gt 20 ] && {
      backdir=$dest/`date +%m%d-%H%M`
      mkdir -p $backdir
      rsync -av --delete $src $backdir
    }
  }
done
```

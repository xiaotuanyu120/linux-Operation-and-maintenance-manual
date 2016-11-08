---
title: inotify+rsync实现实时文件同步
date: 2016-11-08 13:52:00
categories: linux/commonly_services
tags: [linux,inotify]
---
### inotify+rsync实现实时文件同步

----

#### 需求背景
服务器文件需要实时同步，即使是轮询，也存在同步延迟，inotify的出现让真正的实时成为了现实  
我们可以用inotify去监控文件系统的事件变化，一旦有我们期望的事件发生，就使用rsync进行冗余同步

----

#### 脚本内容
``` bash
#!/bin/bash

src='/tmp/src1/'
dest='/tmp/dest1'

inotifywait -mrq -e modify,attrib,moved_to,moved_from,move,move_self,create,delete,delete_self --timefmt='%d/%m/%y %H:%M' --format='%T %w%f %e' $src | while read chgeFile
do
  rsync -avqz --delete $src $dest &>>./rsync.log
done
```
1. 使用inotifywait监控文件系统时间变化
2. while通过管道符接受内容，传给read命令
3. read读取到内容，则执行rsync程序

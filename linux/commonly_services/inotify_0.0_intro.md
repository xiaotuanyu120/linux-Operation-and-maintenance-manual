---
title: inotify: 0.0 初识
date: 2016-11-08 13:02:00
categories: linux/commonly_services
tags: [linux,inotify]
---
### 0.0 inotify初识
----
#### 什么是inotify？
inotify是用来监控文件系统事件的实时监控工具。

特点：
inotify可监控文件或目录，监控目录时，会返回所有该目录和其内部文件的监控情况。
inotify监控目录时，若无-r参数，则只监控目录本身及其根目录下的文件，子目录中的文件不监控

----

#### 安装inotify
``` bash
yum install epel-release
yum install inotify-tools
```

----

#### inotify使用
**inotifywait命令**
作用：使用inotify来等待文件系统的改动
语法：
```
inotifywait  [-hcmrq]  [-e  <event>  ]  [-t  <seconds> ]
       [--format <fmt> ] [--timefmt <fmt> ] <file> [ ... ]
```

参数：
- -h 帮助
- --exclude 排除不需要监控的文件，可使用正则("--exclude ./*test*" 排除所有包含test的文件)
- --excludei 和exclude一样，区别是不区分大小写
- -m monitor，默认情况下监控到第一个事件既退出进程，此参数让inotify进程一直监控
- -r 递归监控指定目录的所有子目录下的文件
- -q 代表了quiet模式，尽量少的输出内容
- -qq 什么都不会输出，除非出现致命的错误
- -e 指定需要监控的事件类型
```
# 没有用-e指定监控的事件时，默认监控所有改动事件
# -e指定多个事件类型时，时间类型以','间隔
access
A watched file or a file within a watched directory was read from.
modify
A watched file or a file within a watched directory was written to.
attrib
The metadata of a watched file or a file within a watched directory was modified. This includes timestamps, file permissions, extended attributes etc.
close_write
A watched file or a file within a watched directory was closed, after being opened in writeable mode. This does not necessarily imply the file was written to.
close_nowrite
A watched file or a file within a watched directory was closed, after being opened in read-only mode.
close
A watched file or a file within a watched directory was closed, regardless of how it was opened. Note that this is actually implemented simply by listening for both close_write and close_nowrite, hence all close events received will be output as one of these, not CLOSE.
open
A watched file or a file within a watched directory was opened.
moved_to
A file or directory was moved into a watched directory. This event occurs even if the file is simply moved from and to the same directory.
moved_from
A file or directory was moved from a watched directory. This event occurs even if the file is simply moved from and to the same directory.
move
A file or directory was moved from or to a watched directory. Note that this is actually implemented simply by listening for both moved_to and moved_from, hence all close events received will be output as one or both of these, not MOVE.
move_self
A watched file or directory was moved. After this event, the file or directory is no longer being watched.
create
A file or directory was created within a watched directory.
delete
A file or directory within a watched directory was deleted.
delete_self
A watched file or directory was deleted. After this event the file or directory is no longer being watched. Note that this event can occur even if it is not explicitly being listened for.
unmount
The filesystem on which a watched file or directory resides was unmounted. After this event the file or directory is no longer being watched. Note that this event can occur even if it is not explicitly being listened to.
```

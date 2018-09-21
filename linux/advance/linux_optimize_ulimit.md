---
title: linux: ulimit优化
date: 2016-08-23 03:04:00
categories: linux/advance
tags: [linux,ulimit]
---
### linux: ulimit优化

---

### 0. ulimit简介
linux系统有文件句柄限制的概念，其配置就是ulimit来管理的。  
这个限制的含义就是，linux使用其来对shell进程及其子进程使用资源进行的一种限制。

---

### 1. ulimit信息查看
``` bash
# 查看所有信息
ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 3876
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 10240
cpu time               (seconds, -t) unlimited
max user processes              (-u) 3876
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited

# 查看针对当前用户的软限制
ulimit -Sn
1024

# 查看针对当前用户的硬限制
ulimit -Hn
1024
```
其中open files对应的配置数目是最大打开文件数目，默认是1024，生产环境下，这个参数会影响到某些程序的并发数量，例如mysql。

---

### 2. 系统总文件句柄查看
``` bash
# 查看系统总的文件句柄限制
cat /proc/sys/fs/file-max
97984

# 查看目前系统使用的文件句柄数量
cat /proc/sys/fs/file-nr
512 0 97984
# 512   -> 分配并使用的文件句柄数
# 0     -> 分配却未使用的文件句柄数
# 97984 -> 内核级别的最大文件句柄数
```
> **file-max vs ulimit**  
`file-max`是linux内核级别的设定，影响的是linux内核最高可以打开的文件数限制；  
`ulimit`是进程级别的设定，影响的是指定用户启动进程最高可以打开的文件数限制；

> 参考文档:  
[ulimit设定的是每个进程的属性，而不是该用户所有进程的总限制](https://unix.stackexchange.com/questions/55319/are-limits-conf-values-applied-on-a-per-process-basis)  
[ulimit vs file-max](https://unix.stackexchange.com/questions/447583/ulimit-vs-file-max)  
[如何计算最大文件打开数应该设定多少](https://stackoverflow.com/questions/6180569/need-to-calculate-optimum-ulimit-and-fs-file-max-values-according-to-my-own-se)

---

### 3. ulimit配置
#### 1) 通过配置文件来修改
``` bash
# 修改/etc/security/limits.conf
********************
* soft nofile 32768
* hard nofile 65535
********************
## 重点需要注意 ##
# 后来发现编辑此文件并没有改变ulimit -a 中的open files值，原来是因为，当我们用'*'入口来配置时，会被/etc/security/limits.d/90-nproc.conf中的配置所覆盖，此时只需要去更改此默认值就可以了


# limits.conf实际是linux pam中的pam_limits.so的配置文件，针对于单个会话
# 编辑/etc/pam.d/login
********************
session    required     /lib64/security/pam_limits.so
********************
```

#### 2) limits.conf的详细说明
``` bash
# /etc/security/limits.conf
#
#Each line describes a limit for a user in the form:
#
#<domain>        <type>  <item>  <value>
#
#Where:
#<domain> can be:
#        - a user name
#        - a group name, with @group syntax
#        - the wildcard *, for default entry
#        - the wildcard %, can be also used with %group syntax,
#                 for maxlogin limit
#
#<type> can have the two values:
#        - "soft" for enforcing the soft limits
#        - "hard" for enforcing hard limits
#        - "-" for both enforcing hard and soft limits
#
#<item> can be one of the following:
#        - core - limits the core file size (KB)
#        - data - max data size (KB)
#        - fsize - maximum filesize (KB)
#        - memlock - max locked-in-memory address space (KB)
#        - nofile - max number of open file descriptors
#        - rss - max resident set size (KB)
#        - stack - max stack size (KB)
#        - cpu - max CPU time (MIN)
#        - nproc - max number of processes
#        - as - address space limit (KB)
#        - maxlogins - max number of logins for this user
#        - maxsyslogins - max number of logins on the system
#        - priority - the priority to run user process with
#        - locks - max number of file locks the user can hold
#        - sigpending - max number of pending signals
#        - msgqueue - max memory used by POSIX message queues (bytes)
#        - nice - max nice priority allowed to raise to values: [-20, 19]
#        - rtprio - max realtime priority
#
#<domain>      <type>  <item>         <value>
#

#*               soft    core            0
#*               hard    rss             10000
#@student        hard    nproc           20
#@faculty        soft    nproc           20
#@faculty        hard    nproc           50
#ftp             hard    nproc           0
#@student        -       maxlogins       4

# End of file
```

#### 3) 通过ulimit命令来修改
``` bash
# 将ulimit命令添加到rc.local中
echo "ulimit -SHn 65535" >> /etc/rc.local
```

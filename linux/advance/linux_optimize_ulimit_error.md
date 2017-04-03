---
title: linux: 普通用户无法修改ulimit
date: 2015-12-23 11:40:00
categories: linux/advance
tags: [linux,ulimit]
---
### linux: 普通用户无法修改ulimit

---

### 0. 问题背景
执行命令：`ulimit -c unlimited`  
报错信息：`-bash: ulimit: core file size: cannot modify limit: Operation not permitted`

---

### 1. hard limit 和 soft limit
首先在man page中发现hard limit和soft limit
```
A hard limit cannot be increased by a non-root user once it is set;
a soft limit may be increased up to the value of the hard limit.
```
意思是：
1. root用户可以设置hard limit
2. 所有用户的soft limit 不可以超过root设置的hard limit

#### 实践测试
``` bash
# 创建test用户
useradd test
cat /etc/passwd|grep test
test:x:501:502::/home/test:/bin/bash

# root下设置hard limit
ulimit -Hc 51200

# test用户测试
su - test
ulimit -c 51201
-bash: ulimit: core file size: cannot modify limit: Operation not permitted

ulimit -c 51200
```
> 结论，此报错，确实有可能是soft limit的值超过了hard limit的值
---

### 2. 网查的解决方案
How do I enable core dumps for everybody
Overview
In most Linux Distributions core file creation is disabled by default for a normal user. However, it can be necessary to enable this feature for an application (e.g. Oracle). For example, if you encounter an ORA-7445 error in Oracle, then it must be possible to write a core file for the user "oracle".
To enable writing core files you use the ulimit command, it controls the resources available to a process started by the shell, on systems that allow such control.
If you try to enable writing core files, usually you run in the following problem. Normally SSH is used to logon to the server.
``` bash
ssh oracle@ora-server

ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
file size               (blocks, -f) unlimited
pending signals                 (-i) 1024
max locked memory       (kbytes, -l) 32
max memory size         (kbytes, -m) unlimited
open files                      (-n) 65536
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
stack size              (kbytes, -s) 10240
cpu time               (seconds, -t) unlimited
max user processes              (-u) 16384
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```
Now, try (not as user root) to change the core file size to unlimited
``` bash
ulimit -c unlimited
-bash: ulimit: core file size: cannot modify limit: Operation not permitted
```

#### Solution
#### 1) Check Environment for ulimit
The first step is to check, that you don't set ulimit -c 0 in any shell configuration files for this user, for example in $HOME/.bash_profile or $HOME/.bashrc. Uncomment it if you have such an entry.
```
*****************************
#
# Do not produce core dumps
#
# ulimit -c 0
*****************************
```
#### 2) Globally enable Core Dumps

This must be done as user root, usually in /etc/security/limits.conf
```
*****************************
# /etc/security/limits.conf
#
# Each line describes a limit for a user in the form:
#
# <domain> <type> <item> <value>
#
*  soft  core  unlimited
*****************************
```

#### 3) Logoff and Logon again and set ulimit
``` bash
ssh oracle@ora-server

ulimit -c
0
```
Try to set the limit as user root first
``` bash
su -
ulimit -c unlimited
ulimit -c
unlimited
```
Now you can set ulimit also for user oracle
``` bash
su - oracle
ulimit -c unlimited
ulimit -c
unlimited
```
Perhaps the last step number 3 is not necessary, but we have figured out, that this is the way which always work. The core file size limitation is usually also set in different configuration files. If you want to enable cores, you can uncomment them.  
In /etc/profile (Redhat)
```
# No core files by default
# ulimit -S -c 0 > /dev/null 2>&1
```
In /etc/init.d/functions (Redhat)
```
# make sure it doesn't core dump anywhere unless requested
# ulimit -S -c ${DAEMON_COREFILE_LIMIT:-0} >/dev/null 2>&1
```
Now, from this current shell you can generate the core, so check ulimit before.
``` bash
ulimit -a
core file size          (blocks, -c) unlimited
data seg size           (kbytes, -d) unlimited
file size               (blocks, -f) unlimited
pending signals                 (-i) 1024
max locked memory       (kbytes, -l) 32
max memory size         (kbytes, -m) unlimited
open files                      (-n) 65536
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
stack size              (kbytes, -s) 10240
cpu time               (seconds, -t) unlimited
max user processes              (-u) 16384
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited```
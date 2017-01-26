---
title: 日常管理: 1.0 查看文件与用户和进程的关联
date: 2017-01-26 16:33:00
categories: linux/advance
tags: [linux,operation,fuser,lsof]
---
### 日常管理: 1.0 查看文件与用户和进程的关联

---

### 1. fuser查看文件占用信息
``` bash
# 查看某日志文件是哪个程序生成的
fuser /logs/elf_web.log
/logs/elf_web.log:   25191

# 输出更多信息
fuser -v /logs/elf_web.log
                     USER        PID ACCESS COMMAND
/logs/elf_web.log:   root      25191 F.... java
```

---

### 2. lsof查看文件占用信息
``` bash
lsof /logs/elf_web.log
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
java    25191 root  244w   REG  253,0 77806698 655521 /logs/elf_web.log

# 查看某个用户使用的所有文件信息
lsof -u zabbix|head
COMMAND     PID   USER   FD   TYPE    DEVICE SIZE/OFF    NODE NAME
zabbix_ag 14441 zabbix  cwd    DIR     253,0     4096       2 /
zabbix_ag 14441 zabbix  rtd    DIR     253,0     4096       2 /
zabbix_ag 14441 zabbix  txt    REG     253,0  1101135 3278932 /usr/local/zabbix/sbin/zabbix_agentd
zabbix_ag 14441 zabbix  mem    REG     253,0    65960 2621471 /lib64/libnss_files-2.12.so
zabbix_ag 14441 zabbix  mem    REG     253,0   142688 2621479 /lib64/libpthread-2.12.so
zabbix_ag 14441 zabbix  mem    REG     253,0  1923352 2621455 /lib64/libc-2.12.so
zabbix_ag 14441 zabbix  mem    REG     253,0   110960 2621481 /lib64/libresolv-2.12.so
zabbix_ag 14441 zabbix  mem    REG     253,0    43944 2621483 /lib64/librt-2.12.so
zabbix_ag 14441 zabbix  mem    REG     253,0    19536 2621461 /lib64/libdl-2.12.so
```

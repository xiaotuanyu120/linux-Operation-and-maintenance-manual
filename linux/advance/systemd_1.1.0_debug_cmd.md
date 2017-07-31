---
title: systemd 1.1.0 排查错误使用的命令
date: 2017-07-31 10:44:00
categories: linux/advance
tag: [systemd,debug]
---
### systemd 1.1.0 排查错误使用的命令

---

### 1. 排查错误的systemd命令
``` bash
# 查看启动失败的服务
systemctl --failed

# 查看所有加载的unit文件
systemctl list-unit-files

# 修改unit文件后重载
systemctl daemon-reload

# 查看服务状态
systemctl status <daemon_file_name>

# 查看进程号对应的详细日志
journalctl _PID=<pid_number>
```
> 需要注意的几个排查点
- 如果提示找不到unit文件
    - daemon_file_name名称是否正确（后缀名）
    - 是否重载了unit文件(systemctl reload)
    - 使用systemctl list-unit-files|grep <daemon_file_name>来排查是否加载

---
title: selinux 1.0.0 basic
date: 2016-03-29 09:50:00
categories: linux/advance
tags: [selinux]
---
### selinux 1.0.0 basic

---

### 1. semanage命令安装
``` bash
yum install -y policycoreutils-python
```

---

### 2. 查看及修改服务状态
``` bash
getenforce

# 临时关闭selinux(数字1是开启)
setenforce 0

# 永久更改selinux
vim /etc/selinux/config
*********************************
# SELINUX= 可以配置以下三个状态:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=enforcing
*********************************
```

---

### 3. 查看及修改文件selinux上下文
``` bash
# 查看
ls -Z
-rw-------. root root system_u:object_r:admin_home_t:s0 anaconda-ks.cfg

# 使用semanage永久修改文件上下文(-a add；-t type)
semanage fcontext -a -t samba_share_t '/common(/.*)?'
semanage fcontext -a -t httpd_sys_content_t '/var/www/virtual(/.*)?'

# 使用chcom临时修改文件上下文
chcon -u system_u /usr/lib/systemd/system/docker.servcie

# 重建文件上下文(-v 过程；-F force；-R recursively)
restorecon -vFR /common/

# 修改端口上下文(给http的tcp协议增加8908端口)
semanage port -a -t http_port_t -p tcp 8908
```

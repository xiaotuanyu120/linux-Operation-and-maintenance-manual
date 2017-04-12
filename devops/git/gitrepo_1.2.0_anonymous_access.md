---
title: git仓库: 1.2.0 本地服务器开启匿名访问
date: 2016-08-25 15:54:00
categories: devops/git
tags: [devops,git]
---
### git仓库: 1.2.0 本地服务器开启匿名访问

---

### 0. 配置匿名访问之前
#### 1) 目的:
用sshkey的方式访问，用户拥有push和pull的权限，但是有些情况下，我们只需要某些用户仅拥有读取权限，例如测试人员。所以需要开启匿名访问

#### 2) 实现方法
- 采取http协议，这里使用apache服务器
- 开启git的hook

---

### 1. 配置匿名访问
#### 1) 安装apache
``` bash
yum install httpd
```

#### 2) 开启挂钩hook
``` bash
cd /data/git/test.git/
mv hooks/post-update.sample hooks/post-update
chmod a+x hooks/post-update

# 此脚本功能
cat hooks/post-update
#!/bin/sh
#
# An example hook script to prepare a packed repository for use over
# dumb transports.
#
# To enable this hook, rename this file to "post-update".

exec git update-server-info
# 此脚本意思是当通过 SSH 向服务器推送时，Git 将运行这个 git-update-server-info 命令来更新匿名 HTTP 访问获取数据时所需要的文件。

# 提前执行一次，以防等下测试的时候报错
# 报错信息：fatal: http://192.168.1.105/test.git/info/refs not found: did you run git update-server-info on the server?
sh hooks/post-update
```

#### 3) 配置apache
当用户通过ip访问git服务器时，apache来处理web请求，web目录就是/data/git
``` bash
# 创建虚拟主机文件
cd /etc/httpd/conf.d/
vim test.git.conf
**********************
<VirtualHost *:80>
  ServerName 192.168.1.105
  DocumentRoot /data/git
  <Directory /data/git>
    Order allow,deny
    allow from all
  </Directory>
</VirtualHost>
**********************
# 用ip当做ServerName时，要确保此虚机配置是默认主机配置(保证此配置是第一个VirtualHost即可)，否则会出错

# 重启服务
apachectl -t
apachectl restart

# 修改web目录"/data/git"的属组
# 通过查看apache的主配文件，可以得到httpd服务的用户，此例中为默认的apache
chown -R :apache /data/git
```

#### 4) 测试clone项目文件

打开git bash客户端测试
``` bash
git clone http://192.168.1.105/test.git
Cloning into 'test'...
Checking connectivity... done.
```

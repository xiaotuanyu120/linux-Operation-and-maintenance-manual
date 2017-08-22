---
title: svn: 1.3.0 配置svn
date: 2017-08-22 11:06:00
categories: linux/service
tags: [svn]
---
### svn: 1.3.0 svn-配置基础

---

### 0. svn安装
详细过程见[源码安装svn](http://linux.xiao5tech.com/linux/service/svn_1.2.0_centos6_compile_install.html)

---

### 1. svn主配文件
`conf/svnserve.conf`
``` bash
[general]
# 配置匿名用户权限read，write，none
anon-access = none
# 配置svn用户权限read，write，none
auth-access = write
# 配置账号密码文件，可配置相对路径（相对于svnserve.con）或者绝对路径
password-db = passwd
# 配置权限控制文件，可配置相对路径（相对于svnserve.con）或者绝对路径
authz-db = authz
```
> 详细配置说明及未介绍的sasl认证见[文档](http://svnbook.red-bean.com/en/1.7/svn.serverconfig.svnserve.html#svn.serverconfig.svnserve.auth)

---

### 2. 账号密码文件
``` bash
[users]
harry = foopassword
sally = barpassword
```

---

### 3. 权限控制文件
``` bash
[groups]
harry_and_sally = harry,sally

# 纯使用路径的话，回去在所有repo中匹配
[/foo/bar]
harry = rw
* =

# 使用repo_name:路径的话，只在repo_name中匹配路径
[repository:/baz/fuz]
#组名前面需要增加@
@harry_and_sally = rw
* = r
```
> 权限控制文件详细说明见[文档](http://svnbook.red-bean.com/en/1.7/svn.serverconfig.pathbasedauthz.html)

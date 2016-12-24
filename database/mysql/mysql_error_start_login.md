---
title: MYSQL-错误：启动/登录报错
date: 2015-01-12 05:47:00
categories: database/mysql
tags: [database,mysql]
---
### MYSQL-错误：启动/登录报错

---

### 1. mysql报错
#### 1) 登陆报错
报错信息：  
`ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`

解决方案：
- 尝试解决  
查询配置文件中配置的socket文件是否存在；  
重新初始化数据库；

- 最终解决方案  
原来是配置文件中未配置client字段  
/etc/my.cnf添加内容
```
[client]
port=3306
socket=/tmp/mysql.socket
```
结果：成功进入mysql

#### 2) 服务启动错误
报错信息：
``` bash
service mysqld start
Starting MySQL.. ERROR! The server quit without updating PID file (/data/mysql/server.tongchiang.com.pid).
```

解决办法：
1. 检查basedir和datadir的权限设置和属主
2. 检查配置文件中basedir和datadir是否指定
3. 查看错误日志（一般在datadir下）  
发现里面有进一步的错误提示`[ERROR] Plugin 'InnoDB' init function returned error.`

网上查找解决方案  
删除掉datadir下的ib开头的三个文件即可（为了安全起见，我把它们mv到了tmp下）
``` bash
ls /tmp/ib*
/tmp/ibdata1  /tmp/ib_logfile0  /tmp/ib_logfile1```
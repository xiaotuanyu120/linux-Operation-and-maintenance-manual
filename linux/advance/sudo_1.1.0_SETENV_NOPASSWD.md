---
title: sudo 1.1.0 执行sudo时保持env变量
date: 2017-05-30 10:44:00
categories: linux/advance
tags: [sudo,env,java_home]
---
### sudo 1.1.0 执行sudo时保持env变量

---

### 0. 问题背景
测试环境中，我们需要开发人员使用非root用户，这里有一个场景：  
开发人员登入测试环境，然后执行`sudo sh $CATALINA_HOME/bin/startup.sh`命令报错，错误信息大意是没有配置JAVA_HOME变量。但是系统中已经配置了JAVA_HOME变量。
``` bash
sudo sh ./apache-tomcat-7.0.8-src/bin/startup.sh
Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
At least one of these environment variable is needed to run this program

env | grep JAVA_HOME
JAVA_HOME=/usr/local/jdk1.7.0_79/
```

为了研究和解释这个问题，我们来进行以下的实验过程

---

### 1. NOPASSWD
使用root创建一个普通的shell文件, 给user01配置sudo权限
``` bash
echo "echo 'sudotest'" > sudo_test.sh

visudo
*******************************
# 增加对user01的sudo配置
user01  ALL=(root)      /bin/sh
*******************************
```
然后使用普通用户user去`sudo sh`执行它。
``` bash
sudo sh sudo_test.sh
[sudo] password for user01:
sudotest
```
如果我们不希望每次执行sh命令的时候都需要输入user01的密码，我们可以使用NOPASSWD选项，使用root来配置sudo文件
``` bash
visudo
*******************************
# 修改对user01的sudo配置
user01  ALL=(root)      NOPASSWD: /bin/sh
*******************************
```
再次使用user01来执行shell文件
``` bash
sudo sh sudo_test.sh
sudotest
```
> 总结来讲，NOPASSWD就是用来让普通用户不用输入密码来执行sudo里面配置的命令

---

### 2. SETENV
现在我们来探讨普通用户使用sudo时，env环境变量的保持问题，这里我们采用tomcat的启动脚本来测试，使用普通用户来启动tomcat
``` bash
sudo sh ./apache-tomcat-7.0.8-src/bin/startup.sh
Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
At least one of these environment variable is needed to run this program
```
原因就是env中的JAVA_HOME变量没有在执行sudo时保持住。此时，我们需要配置SETENV来配置env保持
``` bash
visudo
*******************************
# 修改对user01的sudo配置
user01  ALL=(root)      SETENV:NOPASSWD: /bin/sh,/bin/env
*******************************
```
然后尝试使用普通用户来启动tomcat，此时不会再报环境变量的错误
> 如果当你执行env时，没有发现JAVA_HOME在系统环境变量中，说明JAVA_HOME不是全局变量，可以增加以下sudo配置
```
Defaults    env_keep += "JAVA_HOME"
```

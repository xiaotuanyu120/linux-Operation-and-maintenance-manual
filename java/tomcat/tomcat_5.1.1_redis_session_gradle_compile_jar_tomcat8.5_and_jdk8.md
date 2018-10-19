---
title: tomcat 5.1.0 gradle编译tomcat-redis-session-manager - tomcat8.5
date: 2018-08-09 14:29:00
categories: java/tomcat
tags: [linux,tomcat,redis,session,tomcat-redis-session-manager]
---
### tomcat 5.1.0 gradle编译tomcat-redis-session-manager - tomcat8.5

---

### 0. 问题背景
顺延上一篇tomcat7的redissession编译的[文章](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/java/tomcat/tomcat_5.1.0_redis_session_gradle_compile_jar.md)，结合[github上的一个commit信息](https://github.com/jcoleman/tomcat-redis-session-manager/pull/84/commits/496729ad7c9224a82e73f778c7ea99d6b465eb48)来尝试tomcat8.5和jdk8配合的编译过程。
> 官方作者说明没有精力去修改tomcat8，并表示如果有公司希望获得支持，需要付费。。。。

---

### 1. gradle编译tomcat-redis-session-manager
#### 1) 安装gradle
``` bash
wget -N https://services.gradle.org/distributions/gradle-2.9-all.zip
mkdir /opt/gradle
unzip gradle-2.9-all.zip
mv gradle-2.9 /opt/gradle/
ln -sfn /opt/gradle/gradle-2.9 /opt/gradle/latest
echo "export GRADLE_HOME=/opt/gradle/latest" > /etc/profile.d/gradle.sh
echo "export PATH=\$PATH:\$GRADLE_HOME/bin" >> /etc/profile.d/gradle.sh
. /etc/profile.d/gradle.sh

# 查看gradle版本
gradle -v

------------------------------------------------------------
Gradle 2.9
------------------------------------------------------------

Build time:   2015-11-17 07:02:17 UTC
Build number: none
Revision:     b463d7980c40d44c4657dc80025275b84a29e31f

Groovy:       2.4.4
Ant:          Apache Ant(TM) version 1.9.3 compiled on December 23 2013
JVM:          1.8.0_144 (Oracle Corporation 25.144-b01)
OS:           Linux 3.10.0-693.5.2.el7.x86_64 amd64
```

#### 2) 编译并打包tomcat-redis-session-manager
原作者的项目已经不更新，是找到了一个fork版本，支持tomcat8.5
``` bash
# 1. 克隆fork作者的源码
git clone https://github.com/mrhop/tomcat-redis-session-manager-8.5.git
cd tomcat-redis-session-manager/

# 2. 修改配置
vim build.gradle
**************************************
# 修改以下内容
"""
version = '2.0.0-8.5.32'

dependencies {
  compile group: 'org.apache.tomcat', name: 'tomcat-catalina', version: '8.5.32'
  compile group: 'redis.clients', name: 'jedis', version: '2.9.0'
  compile group: 'org.apache.commons', name: 'commons-pool2', version: '2.4.2'
"""
# 执行$CATALINA_BASE/bin/version.sh查看tomcat版本，我这里是8.5.32
# jedis，我这边下载的版本是2.9.0
# commons-pool2，我这边使用的版本是2.4.2
**************************************

# 3. 编译并打包
gradle jar
:compileJava UP-TO-DATE
:processResources UP-TO-DATE
:classes UP-TO-DATE
:jar

BUILD SUCCESSFUL

Total time: 5.55 secs

This build could be faster, please consider using the Gradle Daemon: https://docs.gradle.org/2.9/userguide/gradle_daemon.html
```

#### 3) 成果
``` bash
ls build/libs/
tomcat-redis-session-manager-8.5-2.0.0-8.5.32.jar
```
就是这个包了，将它拷贝到线上使用即可  
当然，其他的配置就要参照作者的推荐配置了  
作者给出的tomcat的示例配置($CATALINA_BASE/conf/context.xml)
``` xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />
<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
         host="localhost" <!-- optional: defaults to "localhost" -->
         port="6379" <!-- optional: defaults to "6379" -->
         database="0" <!-- optional: defaults to "0" -->
         maxInactiveInterval="60" <!-- optional: defaults to "60" (in seconds) -->
         sessionPersistPolicies="PERSIST_POLICY_1,PERSIST_POLICY_2,.." <!-- optional -->
         sentinelMaster="SentinelMasterName" <!-- optional -->
         sentinels="sentinel-host-1:port,sentinel-host-2:port,.." <!-- optional --> />
```

个人线上实际使用的
``` xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />
<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
         host="127.0.0.1"
         port="6379"
         database="0"
         password="redis-password"
         maxInactiveInterval="1200"/>
```

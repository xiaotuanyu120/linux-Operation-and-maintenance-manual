---
title: tomcat 5.1.0 gradle编译tomcat-redis-session-manager
date: 2017-02-09 15:58:00
categories: linux/java_env
tags: [linux,tomcat,redis,session,tomcat-redis-session-manager]
---
### tomcat 5.1.0 gradle编译tomcat-redis-session-manager

---

### 0. 问题背景
线上环境为tomcat6+jdk6，集群化后为了实现session共享，于是使用了jcoleman的[tomcat-redis-session-manager](https://github.com/jcoleman/tomcat-redis-session-manager)，此功能需要额外三个jar包，分别为：  
- tomcat-redis-session-manager-${version}.jar
- jedis-${version}.jar
- commons-pool2-${version}.jar
不知道什么原因，作者提供的tomcat-redis-session-manager-tomcat6.jar会出错，当时为了找tomcat6的包，还是百般搜索，在作者github的issue中找到了一个jar包。  
但是，最近公司线上要升级tomcat6到tomcat7，又遇到了同样的问题，于是痛定思痛，决定找到一个能从根源上解决问题的方法

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
JVM:          1.7.0_79 (Oracle Corporation 24.79-b02)
OS:           Linux 2.6.32-642.el6.x86_64 amd64
```

#### 2) 编译并打包tomcat-redis-session-manager
``` bash
# 1. 克隆作者的源码
git clone https://github.com/jcoleman/tomcat-redis-session-manager.git
cd tomcat-redis-session-manager/

# 2. 修改配置
vim build.gradle
**************************************
# 修改以下内容
"""
dependencies {
  compile group: 'org.apache.tomcat', name: 'tomcat-catalina', version: '7.0.75'
  compile group: 'redis.clients', name: 'jedis', version: '2.5.1'
  compile group: 'org.apache.commons', name: 'commons-pool2', version: '2.2'
  ......
"""
# 执行$CATALINA_BASE/bin/version.sh查看tomcat版本，我这里是7.0.75
# jedis，我这边下载的版本是2.5.1
# commons-pool2，我这边使用的版本是2.2
# 我估计之所以作者的包我们无法使用，就是因为这些底包和tomcat的版本问题

# 禁止上传到作者的repos中
"""
//repository(url: "https://oss.sonatype.org/service/local/staging/deploy/maven2/") {
      //  authentication(userName: sonatypeUsername, password: sonatypePassword)
      //}
"""
# 如果不禁止，因为我们没有账户密码，编译的时候会出错
**************************************

# 3. 编译并打包
gradle jar
:compileJava
Note: /usr/local/src/tomcat-redis-session-manager/src/main/java/com/orangefunction/tomcat/redissessions/RedisSessionManager.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
:processResources UP-TO-DATE
:classes
:jar

BUILD SUCCESSFUL

Total time: 10.165 secs

This build could be faster, please consider using the Gradle Daemon: https://docs.gradle.org/2.9/userguide/gradle_daemon.html
```

#### 3) 成果
``` bash
ls build/libs/tomcat-redis-session-manager-2.0.0.jar
build/libs/tomcat-redis-session-manager-2.0.0.jar
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
         port="6389"
         database="0"
         maxInactiveInterval="1200"/>
```

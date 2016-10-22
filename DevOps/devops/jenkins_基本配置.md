jenkins: 基本配置
2016年8月12日
15:18
 
---
title: jenkins: 基本配置
date: 2016-08-12 15:42:00
categories: jenkins
tags: [jenkins,java,linux]
---
### 安全性配置
点击侧边栏 -> manage jenkins -> Configure Global Security

确保以下选项被勾选
- enable security 启用安全模块
- Jenkins' own user database  使用jenkins自有的用户信息database(禁止注册user)
- Logged-in users can do anything  登录者有全部权限
 
### 插件升级及安装
点击侧边栏 -> manage jenkins -> Manage Plugins

此处可执行多种插件操作
- 升级查询及升级
- 卸载
- 搜索插件及安装
 
### jdk+maven+git准备及环境设定
> **jenkins2.7版本的不同**
这是我接触的第一个jenkins版本，与网上教程不同的是，2.7版本中的jdk、maven、ant等工具的配置从configure system中转移到了Global Tool Configuration中
 
点击侧边栏 -> manage jenkins -> Global Tool Configuration

 
**按照下面操作去获取应该要填写的信息**
- jdk
``` bash
# 找出jdk的home信息
readlink -f /usr/bin/java
/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64/jre/bin/java
# 所以说，JAVA_HOME的值应该是/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64/jre
```

需要注意的是，不要勾选install automatically
 
- git
``` bash
# 需要更新git版本到1.7.9以上，不然jenkins2.7.2版本后面会在git认证时报错
yum install epel-release
yum install curl-devel expat-devel gettext-devel openssl-devel perl-devel zlib-devel asciidoc xmlto docbook2X
 
# 下载源码包
wget https://www.kernel.org/pub/software/scm/git/git-1.8.5.tar.gz
tar zxf git-1.8.5.tar.gz
cd git-1.8.5
make configure
./configure --prefix=/usr
make
make install
 
# 查看版本号
git --version
git version 1.8.5
```

如果git命令是在linux系统的PATH变量中，可以只填写git，也可以写git命令的绝对路径
同样需要注意，不要勾选install automatically
 
 
- maven
``` bash
# 安装maven，并找出maven的basedir
vim /etc/profile
**************************************
# 在最后添加
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64/jre
export PATH=$PATH:/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64/jre/bin:/usr/local/maven/bin
**************************************
source /etc/profile
 
wget http://www-eu.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
tar zxf apache-maven-3.3.9-bin.tar.gz
mv apache-maven-3.3.9 /usr/local/maven
 
mvn -v
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-11T00:41:47+08:00)
Maven home: /usr/local/maven
Java version: 1.8.0_101, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.101-3.b13.el6_8.x86_64/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "2.6.32-431.el6.x86_64", arch: "amd64", family: "unix"
 
# 从输出信息知道，maven_home是/usr/local/maven
```

 
同样需要注意，不要勾选install automatically
 
 
### 系统全局配置
点击侧边栏 -> manage jenkins -> Configure System
 
**禁用发送给jenkins数据**

 
**email配置**
配置发送者的邮件地址

 
根据上面的发送者邮件地址，来填写相应的smtp地址及帐号信息

看图中黄色表示提示，测试邮件发送成功
其实我用了gmail测试失败，因为现在gmail安全限制很多，有时候不会成功

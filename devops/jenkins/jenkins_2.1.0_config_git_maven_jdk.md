---
title: jenkins: 2.1.0 git+maven+jdk
date: 2016-08-12 15:42:00
categories: devops/jenkins
tags: [jenkins,java,linux]
---
### jenkins: 2.1.0 git+maven+jdk

---

### 1. jdk+maven+git准备及环境设定
点击侧边栏 -> manage jenkins -> Global Tool Configuration
> 与网上教程不同的是，新版本中的jdk、maven、ant等工具的配置从configure system中转移到了Global Tool Configuration中

#### 1. 按照下面操作去获取应该要填写的信息
**jdk**
``` bash
# 找出jdk的home信息
echo $JAVA_HOME
/usr/local/jdk
```
> 需要注意的是，不要勾选install automatically

**git**
``` bash
# 需要更新git版本到1.7.9以上，不然jenkins2.7.2版本后面会在git认证时报错
yum install epel-release
yum install curl-devel expat-devel gettext-devel openssl-devel perl-devel zlib-devel asciidoc xmlto docbook2X

# 下载源码包
wget https://www.kernel.org/pub/software/scm/git/git-2.9.4.tar.gz
tar zxf git-2.9.4.tar.gz
cd git-2.9.4
make configure
./configure --prefix=/usr
make
make install

# 查看版本号
git --version
git version 2.9.4
```
> 如果git命令是在linux系统的PATH变量中，可以只填写git，也可以写git命令的绝对路径
同样需要注意，不要勾选install automatically

**maven**
``` bash
# 安装maven，并找出maven的basedir
wget http://mirror.rise.ph/apache/maven/maven-3/3.5.0/binaries/apache-maven-3.5.0-bin.tar.gz
tar zxf apache-maven-3.5.0-bin.tar.gz
mv apache-maven-3.5.0 /usr/local/maven

vim /etc/profile
**************************************
# 在最后添加
export PATH=$PATH:/usr/local/maven/bin
**************************************
source /etc/profile

mvn -v
Apache Maven 3.5.0 (ff8f5e7444045639af65f6095c62210b5713f426; 2017-04-03T19:39:06Z)
Maven home: /usr/local/maven
Java version: 1.8.0_131, vendor: Oracle Corporation
Java home: /usr/local/jdk1.8.0_131/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "2.6.32-642.el6.x86_64", arch: "amd64", family: "unix"

# 从输出信息知道，maven_home是/usr/local/maven
```
> 同样需要注意，不要勾选install automatically

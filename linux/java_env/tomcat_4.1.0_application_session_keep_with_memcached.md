---
title: tomcat 4.1.0 应用-memcached会话保持
date: 2016-09-23 15:30:00
categories: linux/java_env
tags: [memcached,session,tomcat,nginx]
---
### tomcat 4.1.0 应用-memcached会话保持

---

## 0. 环境准备
三台主机
- nginx：192.168.110.4 nginx-proxy
- tomcat+memcached：192.168.110.5 ss01
- tomcat+memcached：192.168.110.6 ss02

软件版本
linux: centos6.5
nginx: 1.10.1
JDK: 1.6
tomcat: 6
memcached: 1.4.4
MSM: 1.8.2

---

## 1. 环境搭建
### 1. nginx环境
在nginx-proxy上安装nginx
#### 1) 安装nginx
``` bash
yum install epel-release -y
yum install nginx -y
chkconfig nginx on
```
为了测试方便，直接yum安装，生产环境尽量编译安装

#### 2) 配置nginx
``` bash
# 新建nginx虚拟机配置文件
vim /etc/nginx/conf.d/sstest.conf
******************************
upstream ss {
    server 192.168.110.5:8080;
    server 192.168.110.6:8080;
}

server {
    listen 80;
    server_name 192.168.110.4 default_server;
    location / {
        proxy_pass http://ss;
    }
}
******************************
service nginx restart
```

### 2. tomcat环境
在nginx-proxy上作为跳板机安装ansible，并做ss01和ss02的key信任（此步骤省略），也就是说，下面的操作都是在nginx-proxy上执行的

#### 1) 安装tomcat
``` bash
# 下载并安装jdk1.6
# 需要注册oracle帐号才能在下面下载
http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html
chmod u+x jre-6u45-linux-x64.bin
sh jre-6u45-linux-x64.bin
mv jre1.6.0_45 /usr/local/
ln -s /usr/local/jre1.6.0_45/ /usr/local/jdk
vi /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
source /etc/profile.d/java-env.sh


# 安装tomcat
wget http://mirror.rise.ph/apache/tomcat/tomcat-6/v6.0.45/bin/apache-tomcat-6.0.45.tar.gz
tar zxf apache-tomcat-6.0.45.tar.gz
mv apache-tomcat-6.0.45 /usr/local/tomcat
```

注意，以下操作转到ss01和ss02上执行
#### 2) 启动并配置tomcat
``` bash
# 启动tomcat
cd /usr/local/tomcat
./bin/catalina.sh start

# 配置tomcat虚拟主机
vim /usr/local/tomcat/conf/server.xml
************************
<Host name="localhost"  appBase=""
      unpackWARs="true" autoDeploy="true">
  <Context path="" docBase="/data/webapps" reloadable="true" />
  ......
</Host>
************************

/usr/local/tomcat/bin/catalina.sh stop
/usr/local/tomcat/bin/catalina.sh start
```

#### 3) 编写测试程序
``` bash
# 创建web程序目录
mkdir -p /data/webapps/{WEB-INF,META-INF,classes,lib}
cd /data/webapps

# 编写首页程序
# ss02上把Tomcat01更换成Tomcat02
vim index.jsp
***********************
<%@ page language="java" %>
<html>
  <head><title>Tomcat01</title></head>
  <body>
    <h1><font color="red">Tomcat01.magedu.com</font></h1>
    <table align="centre" border="1">
      <tr>
        <td>Session ID</td>
    <% session.setAttribute("magedu.com","magedu.com"); %>
        <td><%= session.getId() %></td>
      </tr>
      <tr>
        <td>Created on</td>
        <td><%= session.getCreationTime() %></td>
     </tr>
    </table>
  </body>
</html>
***********************
```

#### 4) 访问测试
``` bash
curl -I 192.168.110.5:8080
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Set-Cookie: JSESSIONID=678BAF3DD0E30285B6FC9475ED97800F-n1; Path=/
Content-Type: text/html
Content-Length: 373
Date: Tue, 27 Sep 2016 03:55:33 GMT

curl -I 192.168.110.6:8080
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Set-Cookie: JSESSIONID=2C83509E8F94E944D16ABFDE46C4E22F-n1; Path=/
Content-Type: text/html
Content-Length: 373
Date: Tue, 27 Sep 2016 03:56:01 GMT
```
通过负载均衡查看时为上面两个结果交替出现

## 2. memcached做session共享

以下操作在ss01和ss02执行
### 1. 安装memcached
``` bash
yum install memcached
```

### 2. 安装MSM（memcached session manager）
#### 1) 准备库文件
``` bash
# 下载MSM类库文件，[MSM类库文件下载地址](https://github.com/magro/memcached-session-manager/wiki/SetupAndConfiguration)

mv javolution-5.5.1.jar memcached-session-manager-tc6-1.8.2.jar memcached-session-manager-1.8.2.jar spymemcached-2.11.1.jar msm-javolution-serializer-1.8.2.jar /usr/local/tomcat/lib/
```

#### 2) 在tomcat里配置MSM
``` bash
vim /usr/local/tomcat/conf/server.xml
************************
<Context path="" docBase="/data/webapps" reloadable="true">
    <Manager className="de.javakaffee.web.msm.MemcachedBackupSessionManager"
    memcachedNodes="n1:192.168.110.4:11211,n2:192.168.110.5:11211"
    failoverNodes="n2"
    requestUriIgnorePattern=".*\.(ico|png|gif|jpg|css|js)$"
    transcoderFactoryClass="de.javakaffee.web.msm.serializer.javolution.JavolutionTranscoderFactory"
    />
</Context>
************************
/usr/local/tomcat/bin/catalina.sh stop
/usr/local/tomcat/bin/catalina.sh start
```

---

## 3. 效果测试
``` bash
curl -I localhost
HTTP/1.1 200 OK
Server: nginx/1.10.1
Date: Tue, 27 Sep 2016 04:03:02 GMT
Content-Type: text/html
Content-Length: 373
Connection: keep-alive
Set-Cookie: JSESSIONID=60692852333F53A272F406AFD1120B57-n1; Path=/
```
多次测试皆为一样结果

---

## 4. session过期时间设置
配置完成后，发现session会在短时间内(3mins)过期，可用以下配置设定解决
``` bash
vim /usr/local/tomcat/conf/web.xml
************************
    <session-config>
        <session-timeout>600</session-timeout>
    </session-config>
************************
```
修改timeout数值即可

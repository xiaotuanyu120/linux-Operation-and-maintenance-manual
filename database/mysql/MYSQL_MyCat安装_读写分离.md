MYSQL: MyCat安装\读写分离
2016年9月22日
10:14
 
---
title: MyCat安装及读写分离
date: 2016-09-22 14:36:00
categories: database
tags: [mysql,mycat]
---
### 环境准备
mycat：192.168.110.128
 
<!--more-->
 
### JDK安装
``` bash
wget http://download.oracle.com/otn-pub/java/jdk/8u102-b14/server-jre-8u102-linux-x64.tar.gz?AuthParam=1474528150_d01d99688bc1767305a1d288111bec92
tar zxf server-jre-8u102-linux-x64.tar.gz
mv jdk1.8.0_102/ /usr/local
ln -s /usr/local/jdk1.8.0_102 /usr/local/jdk
vi /etc/profile.d/java-env.sh
*********************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*********************
source /etc/profile.d/java-env.sh
 
# 检查Java环境
Java -version
java version "1.8.0_102"
Java(TM) SE Runtime Environment (build 1.8.0_102-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.102-b14, mixed mode)
 
echo $JAVA_HOME
/usr/local/jdk
```
 
### MyCat安装
``` bash
# 下载并解压mycat
wget 
https://raw.githubusercontent.com/MyCATApache/Mycat-download/master/1.5-RELEASE/Mycat-server-1.5.1-RELEASE-20160816173057-linux.tar.gz
tar zxf Mycat-server-1.5.1-RELEASE-20160816173057-linux.tar.gz
 
# 准备mycat用户
groupadd dba
useradd -g dba mycat
passwd mycat
 
mkdir /home/mycat/app
mv mycat /home/mycat/app
chown -R mycat:dba /home/mycat/app
 
# 设置环境变量
vi /home/mycat/.bash_profile
*****************************
# 在文件的最后添加
export MYCAT_HOME=/home/mycat/app/mycat
export PATH=$PATH:$MYCAT_HOME/bin
*****************************
source /home/mycat/.bash_profile
 
# 检查环境变量
echo $MYCAT_HOME
/home/mycat/app/mycat
```
 
### MySQL准备
mysql配置修改，需要在mysql的主机上修改mysql不区分大小写
``` bash
vi /etc/my.cnf
****************************
lower_case_table_names = 1
****************************
service mysqld restart
```
mysql节点对mycat主机进行访问授权
``` sql
# on master01 & master02
MySQL [(none)]> grant all on *.* to 'root'@'192.168.110.%' identified by '123456';
MySQL [(none)]> flush privileges;
```
若不对mycat主机授权，会出现ERROR 3009或1184，大意是无法从mycat连接其他数据节点
 
 
### MyCat配置
server.xml，主要包含了mycat的系统配置
``` bash
        <user name="test">
                <property name="password">test</property>
                <property name="schemas">example</property>
        </user>
 
        <user name="user">
                <property name="password">user</property>
                <property name="schemas">example</property>
                <property name="readOnly">true</property>
        </user>
```
上面配置了test和user两个用户，指定schema的同时，配置了test可读写，而user只读
 
schema.xml，包含了MyCat的逻辑库、表、分片规则、DataNode以及DataSource
``` bash
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://org.opencloudb/" >
 
        <schema name="example" checkSQLschema="false" sqlMaxLimit="100" dataNode="dn1">
        </schema>
 
        <dataNode name="dn1" dataHost="localhost1" database="test" />
 
        <dataHost name="localhost1" maxCon="1000" minCon="10" balance="3"
                writeType="0" dbType="mysql" dbDriver="native" switchType="-1"  slaveThreshold="100">
                <heartbeat>select user()</heartbeat>
                <writeHost host="hostM1" url="192.168.110.129:3306" user="root"
                        password="123456">
                        <readHost host="hostS2" url="192.168.110.130:3306" user="root" password="123456" />
                </writeHost>
                <!--<writeHost host="hostS1" url="localhost:3316" user="root"-->
                        <!--password="123456" />-->
                <!-- <writeHost host="hostM2" url="localhost:3316" user="root" password="123456"/> -->
        </dataHost>
</mycat:schema>
```
具体配置详情可见mycat站点文档
重点配置介绍
- schema，配置了逻辑库名称，指定了数据节点
- dataNode，配置了数据节点，指定了逻辑物理主机和实际数据库
- dataHost，配置了逻辑物理主机、balance(3是绝对读写分离)、switchType(1是写主节点失败自动切换到备节点)
 
### MyCat启动
``` bash
cd /home/mycat/app/mycat/bin
chmod u+x mycat
 
# 方法1
nohup sh mycat console &
 
# 方法2
mycat install
mycat start
 
# 检查启动情况
netstat -lnpt
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name   
tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      999/sshd            
tcp        0      0 127.0.0.1:32000             0.0.0.0:*                   LISTEN      5891/java           
tcp        0      0 :::22                       :::*                        LISTEN      999/sshd            
tcp        0      0 :::1984                     :::*                        LISTEN      5891/java           
tcp        0      0 :::8066                     :::*                        LISTEN      5891/java           
tcp        0      0 :::39683                    :::*                        LISTEN      5891/java           
tcp        0      0 :::57509                    :::*                        LISTEN      5891/java           
tcp        0      0 :::9066                     :::*                        LISTEN      5891/java     
 
```
 
### MyCat测试
```
# 安装mysql客户端
yum install mysql -y
 
# 使用test测试读写功能
mysql -u test -p -P 8066 -h127.0.0.1
``` sql
MySQL [(none)]> use example
Database changed
 
MySQL [example]> create table persons ( age int(2), name varchar(10) );
Query OK, 0 rows affected (0.05 sec)
 
# 使用user测试只读
MySQL [(none)]> use example
Database changed
 
MySQL [example]> show tables;
+----------------+
| Tables_in_test |
+----------------+
| persons        |
+----------------+
1 row in set (0.00 sec)
 
MySQL [example]> create table persons2 ( age int(2), name varchar(10) );
ERROR 1495 (HY000): User readonly
```
 
 

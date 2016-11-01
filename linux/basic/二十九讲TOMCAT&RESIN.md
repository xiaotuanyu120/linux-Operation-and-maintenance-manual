---
title: 二十九讲TOMCAT&RESIN
date: 2015年1月28日	 下午 12:22:00
---
 
本节内容：TOMCAT&RESIN
 
java环境的搭建
1、下载、解压、移动到/usr/local下
[root@web03 sourcecode]# wget http://download.oracle.com/otn-pub/java/jdk/8u31-b13/jdk-8u31-linux-i586.tar.gz?AuthParam=1422419381_ceb748e2746ae7941d97dbe748bd6853
[root@web03 sourcecode]# tar zxvf jdk-8u31-linux-i586.tar.gz
[root@web03 sourcecode]# mv jdk1.8.0_31 /usr/local/
 
2、在profile.d目录下加入jdk运行环境初始化的脚本
[root@web03 sourcecode]# vim /etc/profile.d/java.sh
=================================================
JAVA_HOME=/usr/local/jdk1.8.0_31
JAVA_BIN=/usr/local/jdk1.8.0_31/bin
JRE_HOME=/usr/local/jdk1.8.0_31/jre
PATH=$PATH:/usr/local/jdk1.8.0_31/bin:/usr/local/jdk1.8.0_31/jre/bin
CLASSPATH=/usr/local/jdk1.8.0_31/jre/lib:/usr/local/jdk1.8.0_31/lib:/usr/local/jdk1.8.0_31/jre/lib/charsets.jar
=================================================
#分析下/etc/profile你就会知道，/etc/profile.d目录下的脚本会在开机时逐一执行
[root@web03 sourcecode]# . /etc/profile.d/java.sh
 
3、安装完毕，查看下版本
[root@web03 sourcecode]# java -version
java version "1.7.0_45"
OpenJDK Runtime Environment (rhel-2.4.3.3.el6-i386 u45-b15)
OpenJDK Client VM (build 24.45-b08, mixed mode, sharing) 
tomcat
1、下载、解压、移动并更名到/usr/local/tomcat
[root@web03 sourcecode]# wget http://mirror.nus.edu.sg/apache/tomcat/tomcat-7/v7.0.57/bin/apache-tomcat-7.0.57.tar.gz
[root@web03 sourcecode]# tar zxvf jdk-8u31-linux-i586.tar.gz
[root@web03 sourcecode]# mv apache-tomcat-7.0.57 /usr/local/tomcat
2、复制启动脚本到/etc/init.d/tamcat，并在脚本中增加chkconfig、jdk路径、tomcat路径初始化语句
[root@web03 sourcecode]# cp -pv /usr/local/tomcat/bin/catalina.sh /etc/init.d/tomcat
[root@web03 sourcecode]# vim /etc/init.d/tomcat
=================================================
#在第二行增加以下代码
# chkconfig: 2345 63 37              #以前讲过，chkconfig后跟着的是开机启动level 启动优先 停止优先。
# description: tomcat server init script
# Source Function Library
. /etc/init.d/functions
JAVA_HOME=/usr/local/jdk1.8.0_31
CATALINA_HOME=/usr/local/tomcat
=================================================
[root@web03 sourcecode]# chmod 755 /etc/init.d/tomcat
[root@web03 sourcecode]# chkconfig --add tomcat
[root@web03 sourcecode]# chkconfig tomcat on
3、启动脚本
[root@web03 sourcecode]# service tomcat start
Using CATALINA_BASE:   /usr/local/tomcat
Using CATALINA_HOME:   /usr/local/tomcat
Using CATALINA_TMPDIR: /usr/local/tomcat/temp
Using JRE_HOME:        /usr/local/jdk1.8.0_31
Using CLASSPATH:       /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin                                                                              /tomcat-juli.jar
Tomcat started.
4、查看启动情况
[root@web03 sourcecode]# ps aux |grep tomcat
root     11549  9.1  4.5 336420 47020 pts/0    Sl   17:42   0:03 /usr/local/jdk1.8.0_31/bin/java -Djava.util.logging.config.file=/usr/local/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.endorsed.dirs=/usr/local/tomcat/endorsed -classpath /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/usr/local/tomcat -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp org.apache.catalina.startup.Bootstrap start
root     11569  0.0  0.0   4356   744 pts/0    S+   17:43   0:00 grep --color=auto tomcat
#端口号的配置
[root@web03 sourcecode]# grep 'port="8080"' /usr/local/tomcat/conf/server.xml
    <Connector port="8080" protocol="HTTP/1.1"
               port="8080" protocol="HTTP/1.1"
#浏览器输入http://192.168.0.26:8080(我的虚拟机ip是192.168.0.26，要按情况而定）

 
5、配置tomcat域名及port，及准备jsp测试文件
[root@web03 ~]# vi /usr/local/tomcat/conf/server.xml
====================================================
#把protocol为http的connector的port从8080更改为80
<Connector port="80" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
#添加virtual host，指定Host name和appBase
<Host name="www.111.com" appBase="/data/tomcatweb"
 unpackWARs="false" autoDeploy="true" xmlValidation="false"
 xmlNamespaceAware="false">
<Context path="" docBase="./" debug="0" reloadable="true" crossContext="true"/>
</Host>
====================================================
[root@web03 ~]# vi /data/tomcatweb/index.jsp
====================================================
<html>
        <body>
        <center> Now time is: <%=new java.util.Date()%> </center>
        </body>
</html>
====================================================
 
6、重启tomcat服务（记得关闭80端口的占用进程）、访问virtual host测试
[root@web03 ~]# service tomcat stop
[root@web03 ~]# service tomcat start
[root@web03 ~]# curl -xlocalhost:80 www.111.com
<html>
        <body>
        <center> Now time is: Thu Jan 29 17:32:20 SGT 2015 </center>
        </body>
</html> 
resin
1、下载、解压、编译安装
[root@web03 sourcecode]# wget http://caucho.com/download/resin-4.0.42.tar.gz
[root@web03 resin-4.0.42]# ./configure --prefix=/usr/local/resin --with-java-home=/usr/local/jdk1.8.0_31
[root@web03 resin-4.0.42]# make
[root@web03 resin-4.0.42]# make install
[root@web03 resin-4.0.42]# ls -l /etc/init.d/resin
-rwxr-xr-x 1 root root 3240 Jan 29 21:24 /etc/init.d/resin    #resin安装后自动创建启动脚本
 
2、启动、查看启动状况
[root@web03 resin-4.0.42]# service resin start
[root@web03 resin-4.0.42]# ps aux |grep resin |cut -c -88
root     14829  2.0  6.3 337056 65852 pts/0    Sl   21:28   0:06 /usr/local/jdk1.8.0_31/
root     14872  2.6  9.4 617756 97760 pts/0    Sl   21:28   0:07 /usr/local/jdk1.8.0_31/
root     14972  0.0  0.0   4356   748 pts/0    S+   21:33   0:00 grep --color=auto resin
 
3、修改配置文件和jsp文件
[root@web03 sourcecode]# cd /usr/local/resin/conf/
[root@web03 conf]# vi resin.xml
=================================================
<!--####add here####-->
    <host id="www.111.com" root-directory=".">
    <web-app id="/" root-directory="/data/resin"/>
    </host>
=================================================
[root@web03 conf]# vi /data/resin/index.jsp
=================================================
<html><body><center>
Now time is: <%=new java.util.Date()%>
</center></body></html>
=================================================
 
4、访问效果
[root@web03 conf]# curl -xlocalhost:8080 www.111.com
<html><body><center>
Now time is: Thu Jan 29 21:56:34 SGT 2015
</center></body></html> 
resin+nginx(代理)
1、nginx代理配置
[root@web03 ~]# vi /usr/local/nginx/conf/vhost/proxy.conf
====================================================server{
listen 80;
server_name www.122.com;
 
location / {
        proxy_pass      http://127.0.0.1:8080/;
        proxy_set_header Host   $host;
        proxy_set_header X-Real-IP      $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
}
====================================================
2、resin配置
[root@web03 ~]# vi /usr/local/resin/conf/resin.xml
===================================================
<host id="www.122.com" root-directory=".">
    <web-app id="/" root-directory="/data/resin"/>
    </host>
===================================================
3、此时的端口状态和进程状态
[root@web03 ~]# ps aux |grep -E 'resin|nginx'
root     15733  0.0  0.1   5576  1476 ?        Ss   22:17   0:00 nginx: master process /usr/local/nginx/sbin/nginx
nobody   15769  0.0  0.2   6828  2292 ?        S    22:26   0:00 nginx: worker process
nobody   15770  0.0  0.2   6828  2524 ?        S    22:26   0:00 nginx: worker process
root     16200  0.2  6.4 337764 66004 pts/0    Sl   22:46   0:06 /usr/local/jdk1.8.0_31/bin/java -Dresin.watchdog=app-0 -Djava.util.logging.manager=com.caucho.log.LogManagerImpl -Djavax.management.builder.initial=com.caucho.jmx.MBeanServerBuilderImpl -Djava.awt.headless=true -Djava.awt.headlesslib=true -Dresin.home=/usr/local/resin/ -Dresin.root=/usr/local/resin -Xrs -Xss256k -Xmx32m -server com.caucho.boot.WatchdogManager -root-directory /usr/local/resin -conf /usr/local/resin/conf/resin.xml -log-directory /usr/local/resin/log start-all --log-directory /usr/local/resin/log
root     16245  0.4  9.7 623020 100884 pts/0   Sl   22:46   0:10 /usr/local/jdk1.8.0_31/bin/java -Dresin.server=app-0 -Djava.util.logging.manager=com.caucho.log.LogManagerImpl -Djava.system.class.loader=com.caucho.loader.SystemClassLoader -Djava.endorsed.dirs=/usr/local/jdk1.8.0_31/jre/lib/endorsed:/usr/local/resin//endorsed:/usr/local/resin/endorsed -Djavax.management.builder.initial=com.caucho.jmx.MBeanServerBuilderImpl -Djava.awt.headless=true -Djava.awt.headlesslib=true -Dresin.home=/usr/local/resin/ -Xss1m -Xmx256m -server com.caucho.server.resin.Resin --root-directory /usr/local/resin -conf /usr/local/resin/conf/resin.xml -server app-0 -socketwait 48365 -root-directory /usr/local/resin -log-directory /usr/local/resin/log start-all --log-directory /usr/local/resin/log
root     16378  0.0  0.0   4356   760 pts/1    S+   23:28   0:00 grep --color=auto -E resin|nginx
[root@web03 ~]# netstat -lntp |grep ':80'
tcp        0      0 0.0.0.0:80                  0.0.0.0:*                   LISTEN      15733/nginx
tcp        0      0 :::8080                     :::*                        LISTEN      16245/java
4、通过访问80和8080来查看代理结果
[root@web03 ~]# curl -xlocalhost:80 www.122.com
<html><body><center>
Now time is: Thu Jan 29 23:34:28 SGT 2015
</center></body></html>
[root@web03 ~]# curl -xlocalhost:8080 www.122.com
<html><body><center>
Now time is: Thu Jan 29 23:34:39 SGT 2015
</center></body></html>

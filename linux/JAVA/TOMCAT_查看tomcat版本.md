TOMCAT: 查看tomcat版本
2016年4月19日
10:49
 
1、进入tomcat主目录，执行java命令
# java -cp lib/catalina.jar org.apache.catalina.util.ServerInfo
Server version: Apache Tomcat/7.0.57
Server built:   Nov 3 2014 08:39:16 UTC
Server number:  7.0.57.0
OS Name:        Linux
OS Version:     2.6.32-431.el6.x86_64
Architecture:   amd64
JVM Version:    1.7.0_71-b14
JVM Vendor:     Oracle Corporation
 
2、进入tomcat主目录，执行version.sh脚本
# bin/version.sh 
Using CATALINA_BASE:   /opt/apache-tomcat-7055-web
Using CATALINA_HOME:   /opt/apache-tomcat-7055-web
Using CATALINA_TMPDIR: /opt/apache-tomcat-7055-web/temp
Using JRE_HOME:        /opt/jdk1.7.0_67
Using CLASSPATH:       /opt/apache-tomcat-7055-web/bin/bootstrap.jar:/opt/apache-tomcat-7055-web/bin/tomcat-juli.jar
Server version: Apache Tomcat/7.0.57
Server built:   Nov 3 2014 08:39:16 UTC
Server number:  7.0.57.0
OS Name:        Linux
OS Version:     2.6.32-431.el6.x86_64
Architecture:   amd64
JVM Version:    1.7.0_71-b14
JVM Vendor:     Oracle Corporation

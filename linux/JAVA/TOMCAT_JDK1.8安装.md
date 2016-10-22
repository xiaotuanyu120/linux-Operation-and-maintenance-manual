TOMCAT: JDK1.8安装
2016年1月7日
21:35
 
0、安装java环境（ JRE：java standard edition runtime environment）
1）下载、安装java环境
# wget -O server-jre-8u66-linux-x64.tar.gz http://download.oracle.com/otn-pub/java/jdk/8u66-b17/server-jre-8u66-linux-x64.tar.gz?AuthParam=1452175431_c5ec2b99aa7c919a9d1c4948b8bef39e
## "jdk" vs "server jre" vs "jre"
o jdk包含jre
o server jre适合长时间运行的服务器环境
o jre适合客户端用户，可快速启动java程序
# tar zxvf server-jre-8u66-linux-x64.tar.gz
# mv jdk1.8.0_66/ /usr/local/
# ln -s /usr/local/jdk1.8.0_102 /usr/local/jdk
 
2）配置java环境变量
# vim /etc/profile.d/java-env.sh
*******************************
JAVA_HOME=/usr/local/jdk
JRE_HOME=${JAVA_HOME}/jre
PATH=$PATH:${JAVA_HOME}/bin:${JRE_HOME}/bin
CLASSPATH=${JAVA_HOME}/lib:${JRE_HOME}/lib
*******************************
## CLASSPATH可指定目录或者".jar"文件
# source /etc/profile.d/java-env.sh
# java -version
java version "1.8.0_66"
Java(TM) SE Runtime Environment (build 1.8.0_66-b17)
Java HotSpot(TM) 64-Bit Server VM (build 25.66-b17, mixed mode)

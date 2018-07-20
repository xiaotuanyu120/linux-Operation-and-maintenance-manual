---
title: tomcat 7.1.0 使用非root用户用daemon运行tomcat
date: 2018-05-30 21:41:00
categories: linux/java_env
tags: [linux,tomcat]
---
### tomcat 7.1.0 使用非root用户用daemon运行tomcat

---

### 0. 背景
因为安全问题，在线上运行tomcat一般不用root权限来运行，而是采用非root用户来运行。  
[tomcat7 官方daemon运行文档](https://tomcat.apache.org/tomcat-7.0-doc/setup.html#Unix_daemon)  

### 1. 官方提供的daemon模式
#### 1) 编译安装jsvc
``` bash
# step 0. 准备java环境 及 编译环境
# 提前下载jdk（本例中将jdk放置在/usr/local/java目录中）
yum install gcc gcc-c++ make autoconf -y

# step 1. 安装tomcat
wget http://mirror.rise.ph/apache/tomcat/tomcat-7/v7.0.88/bin/apache-tomcat-7.0.88.tar.gz
tar zxvf apache-tomcat-7.0.88.tar.gz
mv apache-tomcat-7.0.88 /usr/local/tomcat

# step 2. 编译jsvc
cd /usr/local/tomcat/bin
tar zxvf commons-daemon-native.tar.gz
cd commons-daemon-1.1.0-native-src/unix/
./configure --with-java=/usr/local/java
make
# --with-java参数可手动指定JAVA_HOME路径，若不指定，则默认寻找系统环境中的JAVA_HOME变量

# step 3. 拷贝jsvc到tomcat的bin目录
cp jsvc ../..
cd ../..
```
此时我们的软件环境已经准备完毕，能够用采用unix daemon模式启动tomcat，核心在于jsvc命令。例如我们可以使用以下命令来启动tomcat
``` bash
CATALINA_BASE=$CATALINA_HOME
cd $CATALINA_HOME
./bin/jsvc \
    -classpath $CATALINA_HOME/bin/bootstrap.jar:$CATALINA_HOME/bin/tomcat-juli.jar \
    -outfile $CATALINA_BASE/logs/catalina.out \
    -errfile $CATALINA_BASE/logs/catalina.err \
    -Dcatalina.home=$CATALINA_HOME \
    -Dcatalina.base=$CATALINA_BASE \
    -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager \
    -Djava.util.logging.config.file=$CATALINA_BASE/conf/logging.properties \
    org.apache.catalina.startup.Bootstrap
```
可以使用`jsvc --help`查看更多选项，其中一个比较重要的选项就是`-user`，使用这个参数可以指定另外一个用户来启动tomcat daemon。

#### 2) daemon.sh参数介绍及自定义
jsvc提供了`$CATALINA_HOME/bin/daemon.sh`文件来替代上面的命令行模式来启动tomcat.
我们有两种定义它的方式，
- 一种是直接修改它来达到自定义目的；
- 另外一种是通过创建另外一个脚本，通过调用daemon.sh然后传入变量的方式来自定义。

> `daemon.sh`其他重要参数：  
- `CATALINA_OUT`, catalina.out的位置
- `JAVA_OPTS`, jvm options

个人推荐第二种，下面是可使用的自定义参数
- `--java-home`，会传给jsvc的`-java-home`，默认使用系统环境java命令来判断JAVA_HOME
- `--catalina-home`，会传给jsvc的`-Dcatalina.home`，默认使用当前daemon.sh脚本所在目录的上级目录作为catalina.home
- `--catalina-base`，会传给jsvc的`-Dcatalina.base`，默认和--catalina-home值相同
- `--tomcat-user`，回传给jsvc的`-user`，默认竟然是tomcat用户

自定义部分
``` bash
# 自定义catalina.out日志位置
# 注释下一行内容
# test ".$CATALINA_OUT" = . && CATALINA_OUT="$CATALINA_BASE/logs/catalina-daemon.out"
# 自定义为其他位置
CATALINA_OUT="$CATALINA_BASE/logs/catalina-daemon.out"
```

#### 3) 准备tomcat用户
``` bash
# 增加tomcat用户
groupadd tomcat
useradd -s /sbin/nologin -g tomcat tomcat

# 将tomcat目录属主和属组修改为刚创建的tomcat用户
chown -R tomcat.tomcat /usr/local/tomcat
```

#### 4) 自定义启动脚本
可以通过以下脚本放在`/etc/init.d/`中来充当tomcat的启动脚本
``` bash
#!/bin/bash
# chkconfig: 2345 20 80
# description: script for tomcat start

CATALINA_HOME=/usr/local/tomcat
CATALINA_BASE=$CATALINA_HOME
TOMCAT_USER=tomcat
JAVA_HOME=/usr/local/java

function jsvc_exec() {
    ${CATALINA_HOME}/bin/daemon.sh \
        --java-home $JAVA_HOME \
        --catalina-home $CATALINA_HOME \
        --catalina-base $CATALINA_BASE \
        --tomcat-user $TOMCAT_USER \
        $1
}

case "$1" in
    start   )
      jsvc_exec start
      exit $?
    ;;
    stop    )
      jsvc_exec stop
      exit $?
    ;;
    restart  )
      jsvc_exec stop
      sleep 2
      jsvc_exec start
      exit $?
    ;;
    version    )
      jsvc_exec version
      exit $?
    ;;
    *       )
      echo "Unknown command: \`$1'"
      echo "commands:"
      echo "  restart           Retart Tomcat"
      echo "  start             Start Tomcat"
      echo "  stop              Stop Tomcat"
      echo "  version           What version of commons daemon and Tomcat"
      echo "                    are you running?"
      exit 1
    ;;
esac
```
> [脚本启动时会启动一个root进程和一个我们指定的user的解释](http://grokbase.com/t/tomcat/users/14aebxdq0j/how-can-tomcat-be-started-at-boot-time-as-a-non-root-user)  
另外值得注意的是，root进程负责的是派生我们指定的user来运行的进程，如果杀掉user运行的进程，则root进程会持续派生新的进程出来。

若希望用一个脚本来管理多个同样功能的tomcat，可使用下面的数组脚本
``` bash
#!/bin/bash
# chkconfig: 2345 20 80
# description: script for tomcat start

CATALINA_HOMES=(/usr/local/tomcat01 /usr/local/tomcat02)
TOMCAT_USER=tomcat
JAVA_HOME=/usr/local/java

function jsvc_exec() {
    for CATALINA_HOME in ${CATALINA_HOMES[@]}
    do
        ${CATALINA_HOME}/bin/daemon.sh \
            --java-home $JAVA_HOME \
            --catalina-home $CATALINA_HOME \
            --catalina-base $CATALINA_HOME \
            --tomcat-user $TOMCAT_USER \
            $1
    done
}

case "$1" in
    start   )
      jsvc_exec start
      exit $?
    ;;
    stop    )
      jsvc_exec stop
      exit $?
    ;;
    restart  )
      jsvc_exec stop
      sleep 2
      jsvc_exec start
      exit $?
    ;;
    version    )
      jsvc_exec version
      exit $?
    ;;
    *       )
      echo "Unknown command: \`$1'"
      echo "commands:"
      echo "  restart           Retart Tomcat"
      echo "  start             Start Tomcat"
      echo "  stop              Stop Tomcat"
      echo "  version           What version of commons daemon and Tomcat"
      echo "                    are you running?"
      exit 1
    ;;
esac
```

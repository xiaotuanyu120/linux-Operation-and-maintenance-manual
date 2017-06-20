---
title: systemd 1.0.0 同时启动关停多个服务
date: 2017-06-20 17:13:00
categories: linux/advance
tags: [systemd]
---
### systemd 1.0.0 同时启动关停多个服务

---

### 1. 同时启动多个服务
这里主要使用了两个参数，units配置块里面的Requires和Wants
- Requires: 如果服务本身被启动，其它关联的服务也会被启动，如果其他服务启动失败，则本服务也启动失败。
- Wants: 比Requires弱一点的类似配置，区别在于，当其他服务启动失败时，不会影响到本服务本身的启动。

**tomcat-01.service** 配置
```
[Unit]
Description=Apache Tomcat Web Application Container
After=syslog.target network.target
Wants=tomcat-02.service

[Service]
Type=forking

Environment=JAVA_HOME=/usr/java/jdk1.7.0_80
Environment=CATALINA_PID=/home/tomcat7/temp/tomcat.pid
Environment=CATALINA_HOME=/home/tomcat7
Environment=CATALINA_BASE=/home/tomcat7
Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

ExecStart=/home/tomcat7/bin/startup.sh
ExecStop=/bin/kill -15 $MAINPID

User=root
Group=root
UMask=0007
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
```
> 重点是`Wants=tomcat-02.service`  
限制是只能用于启动服务关联，如果服务关停和重启时，Wants配置的其他服务不受影响

---

### 2. 同时关停和重启多个服务
PartOf: 和Requires类似，但是仅限于关停和重启服务  
**tomcat-02.service** 配置
```
[Unit]
Description=Apache Tomcat Web Application Container
After=syslog.target network.target
PartOf=tomcat-01.service

[Install]
WantedBy=multi-user.target
[Service]
Type=forking

Environment=JAVA_HOME=/usr/java/jdk1.7.0_80
Environment=CATALINA_PID=/home/tomcat7-01/temp/tomcat.pid
Environment=CATALINA_HOME=/home/tomcat7-01
Environment=CATALINA_BASE=/home/tomcat7-01
Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

ExecStart=/home/tomcat7-01/bin/startup.sh
ExecStop=/bin/kill -15 $MAINPID

User=root
Group=root
UMask=0007
RestartSec=10
Restart=always
```

---

### 3. 执行测试
``` bash
ps aux |grep java
root     20353  0.0  0.0 112644   968 pts/2    S+   17:28   0:00 grep --color=auto java

systemctl start tomcat-01
ps aux |grep java
root     20380  348  0.6 3131060 104364 ?      Sl   17:28   0:03 /usr/java/jdk1.7.0_80/bin/java -Djava.util.logging.config.file=/home/tomcat7-01/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom -Djdk.tls.ephemeralDHKeySize=2048 -Xms512M -Xmx1024M -server -XX:+UseParallelGC -Djava.endorsed.dirs=/home/tomcat7-01/endorsed -classpath /home/tomcat7-01/bin/bootstrap.jar:/home/tomcat7-01/bin/tomcat-juli.jar -Dcatalina.base=/home/tomcat7-01 -Dcatalina.home=/home/tomcat7-01 -Djava.io.tmpdir=/home/tomcat7-01/temp org.apache.catalina.startup.Bootstrap start
root     20381  349  0.6 3131060 101932 ?      Sl   17:28   0:03 /usr/java/jdk1.7.0_80/bin/java -Djava.util.logging.config.file=/home/tomcat7/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom -Djdk.tls.ephemeralDHKeySize=2048 -Xms512M -Xmx1024M -server -XX:+UseParallelGC -Djava.endorsed.dirs=/home/tomcat7/endorsed -classpath /home/tomcat7/bin/bootstrap.jar:/home/tomcat7/bin/tomcat-juli.jar -Dcatalina.base=/home/tomcat7 -Dcatalina.home=/home/tomcat7 -Djava.io.tmpdir=/home/tomcat7/temp org.apache.catalina.startup.Bootstrap start
root     20433  0.0  0.0 112644   964 pts/2    S+   17:28   0:00 grep --color=auto java

systemctl stop tomcat-01
ps aux |grep java
root     20501  0.0  0.0 112644   968 pts/2    S+   17:28   0:00 grep --color=auto java

systemctl restart tomcat-01
ps aux |grep java
root     20528  192  0.4 2997932 68336 ?       Sl   17:28   0:01 /usr/java/jdk1.7.0_80/bin/java -Djava.util.logging.config.file=/home/tomcat7/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom -Djdk.tls.ephemeralDHKeySize=2048 -Xms512M -Xmx1024M -server -XX:+UseParallelGC -Djava.endorsed.dirs=/home/tomcat7/endorsed -classpath /home/tomcat7/bin/bootstrap.jar:/home/tomcat7/bin/tomcat-juli.jar -Dcatalina.base=/home/tomcat7 -Dcatalina.home=/home/tomcat7 -Djava.io.tmpdir=/home/tomcat7/temp org.apache.catalina.startup.Bootstrap start
root     20529  191  0.4 2997932 72184 ?       Sl   17:28   0:01 /usr/java/jdk1.7.0_80/bin/java -Djava.util.logging.config.file=/home/tomcat7-01/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom -Djdk.tls.ephemeralDHKeySize=2048 -Xms512M -Xmx1024M -server -XX:+UseParallelGC -Djava.endorsed.dirs=/home/tomcat7-01/endorsed -classpath /home/tomcat7-01/bin/bootstrap.jar:/home/tomcat7-01/bin/tomcat-juli.jar -Dcatalina.base=/home/tomcat7-01 -Dcatalina.home=/home/tomcat7-01 -Djava.io.tmpdir=/home/tomcat7-01/temp org.apache.catalina.startup.Bootstrap start
root     20577  0.0  0.0 112644   968 pts/2    S+   17:28   0:00 grep --color=auto java
```

---

### 4. 扩展配置
除了上面提到的配置，还有一个服务关联性更强的配置是BindsTo，这个配置比Requires配置更强，如果配置a服务BindsTo b服务，如果b停掉了，a会立即也停掉。设想如果我们给a和b都配置上BindsTo彼此，那a和b真的就是"同生共死"了  
[扩展阅读](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)

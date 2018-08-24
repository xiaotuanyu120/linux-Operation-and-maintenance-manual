---
title: nexus: 1.1.0 installation
date: 2018-08-24 09:19:00
categories: linux/java_env
tags: [java,nexus]
---
### nexus: 1.1.0 installation

### 1. Java环境
可参照[jdk8安装文档](https://github.com/xiaotuanyu120/linux-Operation-and-maintenance-manual/blob/master/linux/java_env/jdk_1.1.1_1.8_installation.md)

环境说明：
- 版本： jdk 8u144
- 路径： /usr/java/jdk1.8.0_144

### 2. 安装nexus
``` bash
# step 1. 下载安装nexus
wget https://download.sonatype.com/nexus/3/latest-unix.tar.gz
tar zxvf tar zxvf latest-unix.tar.gz
mv nexus-3.13.0-01 /usr/local
#做软连接，脚本可以识别程序目录的位置
ln -s /usr/local/nexus-3.13.0-01 /usr/local/nexus

# step 2. 准备nexus运行用户
groupadd nexus
useradd -g nexus nexus

# step 3. 配置环境变量
#配置JAVA_HOME
sed -i 's/^# INSTALL4J_JAVA_HOME_OVERRIDE=.*$/INSTALL4J_JAVA_HOME_OVERRIDE=\/usr\/java\/jdk1.8.0_144/g' /usr/local/nexus/bin/nexus
#配置运行用户
sed -i "s/^#run_as_user=""/run_as_user='nexus'/g" /usr/local/nexus/bin/nexus.rc
#配置data_dir位置
sed -i "s/^-Dkaraf.data=.*$/-Dkaraf.data=\/home\/nexus\/sonatype-work\/nexus3/g" /usr/local/nexus/bin/nexus.vmoptions
sed -i "s/^-Djava.io.tmpdir=.*$/-Djava.io.tmpdir=\/home\/nexus\/sonatype-work\/nexus3\/tmp/g" /usr/local/nexus/bin/nexus.vmoptions
sed -i "s/^-XX:LogFile=.*$/-XX:LogFile=\/home\/nexus\/sonatype-work\/nexus3\/log\/jvm.log/g" /usr/local/nexus/bin/nexus.vmoptions

#######################################
# 如果是centos 7，直接执行step4，step6
# 如果是centos 6，执行执行step5，step7
#######################################

# step 4. 准备systemd unit file
echo '[Unit]
Description=nexus service
After=network.target

[Service]
Type=forking
LimitNOFILE=65536
ExecStart=/usr/local/nexus/bin/nexus start
ExecStop=/usr/local/nexus/bin/nexus stop
User=nexus
Restart=on-abort

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/nexus.service

# step 5. 准备SYSV init文件
ln -s /usr/local/nexus/bin/nexus /etc/init.d/nexus

# step 6. 启动nexus(systemd)
systemctl daemon-reload
systemctl enable nexus
systemctl start nexus

# step 7. 启动nexus(SYSV init)
chkconfig nexus on
service nexus start
```

### 3. 配置nexus
默认是8081端口访问，更多配置jvm，data目录，http访问端口，上下文配置等可参照[官方文档](https://help.sonatype.com/repomanager3/installation/configuring-the-runtime-environment)。 另外默认的admin账号密码是amdin:admin123。
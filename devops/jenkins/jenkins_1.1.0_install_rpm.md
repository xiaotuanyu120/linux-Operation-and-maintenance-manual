---
title: jenkins: 1.1.0 安装
date: 2016-08-12 10:45:00
categories: devops/jenkins
tags: [java,jenkins,linux]
---
### jenkins: 1.1.0 安装

---

### 1.  rpm版本
#### 1) rpm版本安装
``` bash
# 安装jenkins稳定版的源和key
wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key

# 安装jenkins
yum install jenkins
yum install java-1.8.0-openjdk
```

#### 2) apache安装与配置
**安装httpd2.2**
``` bash
yum install httpd
```
**配置httpd**
``` bash
# 主配文件，配置
vim /etc/httpd/conf/httpd.conf
**********************************
# 确保下列proxy模块被加载
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule proxy_ftp_module modules/mod_proxy_ftp.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
LoadModule proxy_connect_module modules/mod_proxy_connect.so
...

# 确保主配文件包含了虚拟主机配置目录
Include conf.d/*.conf
**********************************

# 创建虚拟主机文件
vim /etc/httpd/conf.d/jenkins.conf
**********************************
<VirtualHost *:80>
    ServerName demo.jenkins.com
    ProxyRequests Off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    ProxyPreserveHost on
    ProxyPass / http://127.0.0.1:8080/
</VirtualHost>
# 注意"http://127.0.0.1:8080/"要写全，最开始写成"http://127.0.0.1:8080"报错
**********************************
```

**重启httpd服务**
``` bash
service httpd restart
```
> 注意检查报错信息，做出相应修改

### jenkins配置
``` bash
# 配置jenkins只监听本机ip
vim /etc/sysconfig/jenkins
**********************************
JENKINS_LISTEN_ADDRESS="127.0.0.1"
**********************************

# 重启jenkins
service jenkins restart
```

---

### 2. 访问测试
- 修改本机的hosts文件，"10.10.180.11 demo.jenkins.com"，来本机解析测试域名
- web浏览器访问"demo.jenkins.com"
- 按照提示找到默认密码，并记得登录后修改它
``` bash
cat /var/lib/jenkins/secrets/initialAdminPassword
4506575e41914f5791dafac528dff1b5
```

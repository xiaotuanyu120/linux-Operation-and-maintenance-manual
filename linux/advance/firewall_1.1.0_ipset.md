---
title: firewall 1.1.0 ipset使用教程
date: 2017-03-23 13:35:00
categories: linux/advance
tags: [linux,iptables,ipset,firewall]
---
### firewall 1.1.0 ipset使用教程

---

### 1. ipset安装
yum install ipset -y

---

### 2. ipset-ip集合
``` bash
# ipset创建set
ipset create myset hash:net

# ipset给set添加ip
ipset add myset 172.16.0.0/16
```
关于ipset的详细配置文档和set的不同类型，参见下列文档：  
[ipset精品博客](http://bigsec.net/one/tool/ipset.html)  
[ipset官网文档](http://ipset.netfilter.org/)
> 也可以使用hash:net,port的方式，在ip集合的规则中增加端口，这里因为我们是统一的端口，所以选择在iptables规则中一起增加

---

### 3. ipset ip集合的持久化
``` bash
# 启动ipset服务
service ipset start
service ipset save
#文件保存在/etc/sysconfig/ipset

# 重启ipset服务之后再次检查ipset list
service ipset restart
# 查看ipset规则
ipset list
ipset list myset
```

---

### 4. iptables中添加ipset规则
``` bash
# 增加iptables规则
iptables -I INPUT -p tcp -m set --match-set myset src --destination-port 443 -j ACCEPT
```

---
title: network: Centos7-网络服务错误
date: 2015-12-11 09:04:00
categories: linux/advance
tags: [centos7,linux]
---
### network: Centos7-网络服务错误

---

### 0. 错误信息
``` bash
systemctl start network
job for network.service failed. see 'systemctl status network.service' and 'journalctl -xn' for details

journalctl -xn
## 关键信息
RTNETLINK answer: File exists
network.service: control process exited, code=exited styatus=1
failed to start LSB: Bring up/down networking
```

---

### 1. 尝试思路
1. 查看网卡配置文件  
看是否存在"HWADDR"和"MACADDR"同时存在，却又不相同的值的情况
2. 查看NetworkManager服务状态  
如果启动状态的话，暂时先关闭
3. 查看dhclient进程  
如果"ps ef | grep dhc"出现dhclient进程，使用的是networkmanager的文件，kill掉此进程

---

### 2. 解决办法
排查过程:  
报错信息中有关键字"file exists"  
ifconfig结果中只有lo和eno16777736  
nmcli con show 有两个连接eno16777736和eno33554992  
``` bash
# 尝试把eno33554992先备份掉
cd /etc/sysconfig/network-scripts/
mv ifcfg-eno33554992 ifcfg-eno33554992.bak
systemctl start network
# 再没有报错
```

---

### 3. 后续问题
network和NetworkManager服务启动后，nmcli con show 发现还是有两个连接，而且名称全部是"eno16777736"，一个设备名称是"eno16777736"，另一个是"--"。

处理过程：
``` bash
# 删掉旧连接
nmcli con delete eno16777736
# 发现两个连接都消失掉，重建连接
nmcli con add type ethernet con-name eth0 ifname eno16777736
nmcli con reload
nmcli con down eth0
nmcli con up eth0
ping 8.8.8.8
# 成功解决```
---
title: 1.1.2 为docker创建docker0以外的网桥
date: 2017-11-01 17:27:00
categories: virtualization/docker
tags: [docker,bridge]
---
### 1.1.2 为docker创建docker0以外的网桥

---

### 1. 删除旧网桥
``` bash
yum install bridge-utils -y
service docker stop
ip link set dev docker0 down
brctl delbr docker0
iptables -t nat -F POSTROUTING
```

---

### 2. 创建新网桥
``` bash
brctl addbr cbr0
ip addr add 172.16.10.1/24 dev cbr0
ip link set dev cbr0 up
ip addr show cbr0


cat > /etc/sysconfig/network-scripts/ifcfg-cbr0 << EOF
TYPE=Bridge
DEVICE=cbr0
NETMASK=255.255.255.0
IPADDR=172.16.10.1
ONBOOT=yes
BOOTPROTO=none
NM_CONTROLLED=no
DELAY=0
EOF
```

---

### 3. docker启动参数修改
``` bash
vi /usr/lib/systemd/system/docker.service
*****************************
# docker 启动参数中增加-b=cbr0
# 将ExecStart=/usr/bin/dockerd -H fd://修改为
ExecStart=/usr/bin/dockerd -b=cbr0 -H fd://
*****************************

systemctl daemon-reload
service docker start
iptables -t nat -L -n
```

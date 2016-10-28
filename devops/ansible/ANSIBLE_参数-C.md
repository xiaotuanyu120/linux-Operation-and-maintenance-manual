---
title: ANSIBLE: 参数-C
date: 2016-10-6 15:50:00
categories: devops/ansible
tags:
---

### 参数 -C
此参数只模拟task的执行，并不去实际执行task
``` bash
ansible -i hosts localhost -m service -a "name=iptables state=started" -C
localhost | SUCCESS => {
    "changed": true,
    "msg": "service state changed"
}

 ansible -i hosts localhost -m service -a "name=iptables state=stopped" -C
localhost | SUCCESS => {
    "changed": false,
    "name": "iptables",
    "state": "stopped"
```

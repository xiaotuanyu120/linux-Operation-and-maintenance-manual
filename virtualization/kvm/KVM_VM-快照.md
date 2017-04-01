---
title: KVM 1.3.4 VM-快照
date: 2016-03-30 16:30:00
categories: virtualization/kvm
tags: [kvm,snapshot]
---
### KVM 1.3.4 VM-快照

---

### 1. 创建快照
``` bash
virsh snapshot-create-as vm1 pure-installed
Domain snapshot pure-installed created
```

---

### 2. 查看快照
``` bash
# 快照文件位置
find / -name *pure-installed*
/var/lib/libvirt/qemu/snapshot/vm1/pure-installed.xml
 
# 查看虚机快照信息
virsh snapshot-list vm1
```

---

### 3. 删除快照
``` bash
virsh snapshot-delete vm1 pure-installed
```
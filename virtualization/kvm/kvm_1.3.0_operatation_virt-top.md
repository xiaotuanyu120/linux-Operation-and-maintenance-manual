---
title: KVM 1.3.0 kvm管理-virt-top
date: 2016-04-02 11:32:00
categories: virtualization/kvm
tags: [kvm,virt-top]
---
### KVM 1.3.0 kvm管理-virt-top

---

### 1. 安装virt-top
``` bash
yum install virt-top
```

### 2. 使用方法
``` bash
virt-top
# 和top工具一样，此时会进入virt-top控制台
virt-top 10:36:41 - x86_64 16/16CPU 1202MHz 49046MB
5 domains, 4 active, 4 running, 0 sleeping, 0 paused, 1 inactive D:0 O:0 X:0
CPU: 0.0%  Mem: 16384 MB (16384 MB by guests)

   ID S RDRQ WRRQ RXBY TXBY %CPU %MEM    TIME   NAME
    5 R                      0.0  0.0   6:08.27 6node1
    4 R                      0.0  0.0   5:42.90 6node2
    6 R                      0.0  0.0   5:33.91 6node3
    7 R                      0.0  0.0   9:34.16 6node4
    -                                           (template)
```

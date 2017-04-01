---
title: KVM 1.3.2 kvm管理-advance
date: 2016-03-30 15:27:00
categories: virtualization/kvm
tags: [kvm]
---
### KVM 1.3.2 kvm管理-advance

---

### 1. KVM 管理VM 进阶
#### 1) 查看Hypervisor的信息
``` bash
# 1.查看Hypervisor的版本
virsh version
Compiled against library: libvirt 1.2.17
Using library: libvirt 1.2.17
Using API: QEMU 1.2.17
Running hypervisor: QEMU 1.5.3

# 2.查看当前Hypervisor节点信息
virsh nodeinfo
CPU model:           x86_64
CPU(s):              4
CPU frequency:       815 MHz
CPU socket(s):       1
Core(s) per socket:  4
Thread(s) per core:  1
NUMA cell(s):        1
Memory size:         3739508 KiB

# 3.查看Hypervisor的内存信息(因为是第一个节点，cell参数是0)
virsh nodememstats 0
total  :              3739508 KiB
free   :               954480 KiB
buffers:                  568 KiB
cached :              1958840 KiB

# 4.查看Hypervisor的cpu信息(第一个cpu，参数是0，第二个cpu就是1)
virsh nodecpustats 0
user:                   218260000000
system:                  43980000000
idle:                 24847180000000
iowait:                  66780000000

# 5.按百分比查看cpu状态
virsh nodecpustats 1 --percent
usage:            0.0%
user:             0.0%
system:           0.0%
idle:           100.0%
iowait:           0.0%
```

#### 2) 查看虚拟机的某些信息
``` bash
# 1.查看虚拟机信息
virsh dominfo vm1
Id:             4
Name:           vm1
UUID:           2b2a6006-6834-47d1-b5c5-5090aa0dd101
OS Type:        hvm
State:          running
CPU(s):         1
CPU time:       14.8s
Max memory:     1048576 KiB
Used memory:    1048576 KiB
Persistent:     yes
Autostart:      disable
Managed save:   no
Security model: selinux
Security DOI:   0
Security label: system_u:system_r:svirt_t:s0:c594,c917 (enforcing)

# 2.查看虚机cpu信息
virsh vcpucount vm2
maximum      config         1
maximum      live           1
current      config         1
current      live           1

# 3.查看虚机mem信息(单位是KB)
virsh dommemstat vm2
actual 1048576
swap_in 0
rss 320472

# 4.查看虚机可用的网络信息
virsh domiflist vm2
Interface  Type       Source     Model       MAC
-------------------------------------------------------
vnet1      bridge     br0        virtio      52:54:00:d5:5a:d6

# 5.查看虚机img文件信息
qemu-img info /data/kvm/images/vm1.img
image: /data/kvm/images/vm1.img
file format: qcow2
virtual size: 10G (10737418240 bytes)
disk size: 1.3G
cluster_size: 65536
Snapshot list:
ID        TAG                 VM SIZE                DATE       VM CLOCK
1         pure-installed         206M 2016-03-30 16:33:35   00:45:27.709
Format specific information:
    compat: 1.1
    lazy refcounts: true```
---
title: KVM 1.3.3 kvm管理-克隆
date: 2016-04-02 10:12:00
categories: virtualization/kvm
tags: [kvm]
---
### KVM 1.3.3 kvm管理-克隆

---

### 0. 关闭待克隆虚机
``` bash
virsh suspend vm3-win
Domain vm3-win suspended
```

---

### 1. 默认本地连接下，克隆虚机
``` bash
virt-clone --original vm3-win --name vm3-win-clone --file /data/kvm/images/vm3-win-clone.img

# 修改vnc port，避免冲突
vim /etc/libvirt/qemu/vm3-win-clone.xml
**************************************************
    <graphics type='vnc' port='5900' autoport='yes' listen='0.0.0.0'>
**************************************************
# 同样也修改一下uuid（用"uuidgen"命令自动生成uuid值）和mac地址

## 因为这里是windows，启动vnc连接上去设置一下网络就好了
```
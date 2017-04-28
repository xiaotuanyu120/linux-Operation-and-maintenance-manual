---
title: coreos 2.1.0 ignition简介
date: 2017-04-28 10:54:00
categories: virtualization/container
tags: [container,coreos,ignition]
---
### coreos 2.1.0 ignition简介

---

### 0. ignition字面含义及资料
1. ignition语义: 点火器
2. ignition工具[参考资料](https://coreos.com/ignition/docs/latest/): coreos的一个系统配置工具

---

### 1. 什么是ignition？
Ignition是专为CoreOS Container Linux设计的新的配置实用程序。 在最基本的层面上，它是一种在早期引导期间操作磁盘的工具。 这包括磁盘分区，磁盘分区格式化，编写文件（普通文件，systemd units，networkd units等）和配置用户。 在第一次启动时，Ignition从特定源（remote URL, network metadata service, hypervisor bridge, etc.）上读取其配置，并应用它。 虽然ignition只运行一次，但它十分实用。 因为Ignition在引导过程（准确的讲是在initramfs时）中很早就运行起来，所以它可以在用户空间开始引导之前完成配置，这样可以实现Container Linux管理员所需的高级功能。

---

### 2. ignition 对比 coreos-cloudinit
coreos-cloudinit是coreos安装时需要指定的cloud-config.yaml文件，详情参见之前的[coreos安装文档](http://linux.xiao5tech.com/virtualization/container/coreos_1.1.0_install.html)。  
ignition完成了许多跟coreos-cloudinit相同的工作，但是更简单，更可预测和更灵活。这些特性主要是因为两个主要的改变：ignition只运行一次和ignition不处理变量替换。iginition同时也解决了很多配置的痛点。比如ignition使用json代替了yaml。

---

### 3. ignition何时运行？
在启动时，GRUB将检查EFI System Partition中的coreos/first_boot文件，如果发现了，就设置coreos.first_boot=detected。coreos.first_boot参数由initramfs中的systemd-generator处理，如果参数值不为零，则Ignition units将被设置为initrd.target的依赖项，这样会引起Ignition运行。如果coreos.first_boot被设定为特殊值detected，在ignition成功运行后会删除coreos/first_boot文件。  
注意：PXE部署方式由于不适用GRUB引导，则需要设置coreos.first_boot=1，来让ignition运行。不应该配置detected，这样ignition就不会尝试去删除coreos/first_boot文件。

---

### 4. 给ignition提供配置文件
ignition可以从多个不同的位置读取其配置，虽然一次只能使用一个配置。 在支持的云服务商上运行Container Linux时，Ignition将从实例的userdata读取其配置。 这意味着如果正在使用ignition，则不可以使用那些也可以使用该userdata的其他工具（例如，coreos-cloudinit）。 裸机安装和PXE引导可以配置内核引导参数指向Ignition。

---

### 5. ignition的支持平台列表
https://coreos.com/ignition/docs/0.14.0/supported-platforms.html

---

### 6. iginition配置示例
https://coreos.com/ignition/docs/0.14.0/examples.html

---
title: kubernetes 1.2.0 裸机离线安装(coreos,flannel)
date: 2017-03-19 14:30:00
categories: virtualization/container
tags: [container,docker,kubernetes,coreos,flannel]
---
### kubernetes 1.2.0 裸机离线安装(coreos,flannel)

---

### 1. 选择正确的安装方式
在[官网的安装引导上](https://kubernetes.io/docs/getting-started-guides/)，有很多选择，其中包括各种云平台、各种虚拟化工具、各种linux发行版(主要是ubuntu、coreos和redhat一系)，包括推荐给开发和测试的minikube。  
如果你的需求和我一样，是选择一种裸机安装，却又可批量操作的方式的话，这种[offline裸机](https://kubernetes.io/docs/getting-started-guides/coreos/bare_metal_offline/)的方案可能是最适合的。

---

### 2. offline 裸机安装的主要步骤
- Prerequisites
- High Level Design
- This Guides variables
- Setup PXELINUX CentOS
- Adding CoreOS to PXE
- DHCP configuration
- Kubernetes
- Cloud Configs
- master.yml
- node.yml
- New pxelinux.cfg file
- Specify the pxelinux targets
- Creating test pod
- Helping commands for debugging
- Support Level

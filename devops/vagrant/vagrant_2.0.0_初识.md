---
title: vagrant: 2.0.0 初识
date: 2016-08-27 10:09:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 2.0.0 初识

---

### 1. 什么是vagrant？
vagrant是基于virtualbox(默认情况)、vmware、kvm等虚拟机技术，开发出来一种易于配置、复用的虚拟机管理工具。

---

### 2. vagrant解决了什么问题？
vagrant解决了不同开发人员之间由于系统环境不同而出现的程序不能顺利执行的问题。

---

### 3. vagrant与docker的不同？
与docker的不同在于，docker是一种微服务结构，它将服务打包成镜像，镜像中的服务还是在共享使用本机的系统。
而vagrant是在虚拟机的基础上进行管理的一种工具，本质上依然是虚拟机，只不过是解决了开发人员中虚拟机环境一致的问题。

---

### 4. 站在运维的角度上看vagrant？
vagrant的价值体现在在开发人员之间快速的共享开发环境，避免开发人员因为开发环境不一而产生的奇葩问题。

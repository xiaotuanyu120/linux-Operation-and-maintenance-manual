vagrant: 初识
Saturday, 27 August 2016
9:46 AM
 
---
title: vagrant初识
date: 2016-08-27 10:09:00
categories: devops
tags: [devops,vagrant]
---
## 什么是vagrant？
vagrant是基于vmbox(默认情况)、vmware、kvm等虚拟机技术，开发出来一种易于配置、复用的虚拟机管理工具。
 
## vagrant解决了什么问题？
vagrant解决了不同开发人员之间由于系统环境不同而出现的程序不能顺利执行的问题。
 
## vagrant与docker的不同？
与docker的不同在于，docker是一种微服务结构，它将服务打包成镜像，镜像中的服务还是在共享使用本机的系统。
而vagrant是在虚拟机的基础上进行管理的一种工具，本质上依然是虚拟机，只不过是解决了开发人员中虚拟机环境一致的问题。
 
## 站在运维的角度上看vagrant？
其实在开发将代码交付给运维部署这个过程中，docker显然更能解决部署环境的问题，但是假如能推广开发使用vagrant，将开发人员的开发环境统一的话(很难)，接下来我们可以使用vagrant配合docker使用(理论上)，这样也算是运维的一种价值体现。

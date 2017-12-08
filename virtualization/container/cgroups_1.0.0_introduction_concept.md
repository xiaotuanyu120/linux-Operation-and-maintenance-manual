---
title: cgroups 1.0.0 什么是cgroups？
date: 2017-12-08 10:40:00
categories: virtualization/container
tags: [container,cgroups]
---
### cgroups 1.0.0 什么是cgroups？

---

### 0. 参考链接
**[redhat enterprise linux 7 关于cgroups的文档](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/resource_management_guide/chap-introduction_to_control_groups#sec-What_are_Control_Groups)**

---

### 1. 什么是cgroups？
control groups（缩写cgroups）是linux内核的一个特性。使用cgroups特性，可以控制资源(例如cpu time、系统内存、网络带宽或或是这些资源的组合)在系统上运行的按层次排序的进程组中分配。通过使用cgroups，系统管理员可以对资源分配、优先级调整、拒绝、管理和监控做细粒度的管控。硬件资源可以在应用程序和用户之间巧妙地分配，提高整体效率。

cgroups提供了对进程进行分层分组和标记的方法，并对其进行资源限制。按照传统老的方式，所有进程都会分配到近似数量的系统资源，管理员可以使用进程的nice值来进行调整。采用这种方法，不管这些应用程序的相对重要性如何，拥有进程数量多的应用程序总会比拥有进程数量少的应用程序获得更多的资源。

> RHEL7通过将cgroup层次结构的系统与systemd单元树结合起来，将资源管理的层级从进程提高到了应用程序。因此，你可以使用systemctl命令来管理系统资源，也可以通过修改systemd单元文件来管理系统资源。

> 在RHEL7之前的版本中，系统管理员通过`libcgroup`包中的`cgconfig`命令来创建自定义的cgroups层次结构。这个包现在已经弃用，之所以不推荐使用它，是因为使用它创建的自定义cgroups层次结构和默认的cgroups层次结构很容易发生冲突。

---

### 2. cgroups管理方法
- By accessing the `cgroup filesystem` directly.
- Using the `cgm` client (part of the `cgmanager` package).
- Via tools like `cgcreate`, `cgexec` and `cgclassify` (part of the `libcgroupAUR` package).
- the "rules engine daemon", to automatically move certain users/groups/commands to groups (`/etc/cgrules.conf` and `/usr/lib/systemd/system/cgconfig.service`) (part of the `libcgroupAUR` package).
- through other software such as `Linux Containers (LXC)` virtualization, tools like `playpen` or `systemd`.
>注： [content from arch wiki](https://wiki.archlinux.org/index.php/cgroups)

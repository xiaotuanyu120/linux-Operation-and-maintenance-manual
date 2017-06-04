---
title: kubernetes 1.1.0 简介
date: 2017-03-19 11:37:00
categories: virtualization/container
tags: [container,docker,kubernetes]
---
### kubernetes 1.1.0 简介

---

### 1. 什么是kubernetes？
[kubernetes](https://kubernetes.io/docs/user-guide/)是一个开源的容器集群管理工具，由Google开发，现捐献给了Cloud Native Computing Foundation。此工具旨在提供一个自动部署、扩展、容器应用操作的平台。

---

### 2. kubernetes中的相关概念
- Cluster  
是指一组物理或虚拟机以及Kubernetes用来运行应用程序的其他基础架构资源。
- Node  
是指运行着kubernetes的物理机或者虚拟机，可以在其上调度pods。
- Pod  
是容器和卷共同定位的组
- Label  
标签是附加到资源（例如pod）的键/值对，以传达用户定义的标识属性。标签可用于组织和选择资源子集。
- Selector  
选择器是匹配标签以便标识相关资源的表达式，例如负载平衡服务定位哪些pod。
- Replication Controller  
replication controller可以确保指定数量的pod副本一直在运行。它允许容易地扩展系统，同时当机器重新启动或因任何原因失败时重新创建pod。
- Service  
service定义一组pod以及访问它们的方法，例如单个稳定的IP地址和相应的DNS名称。
- Volume  
volume是一个目录，可能包含一些数据在里面，container可把其作为自己文件系统的一部分访问。 Kubernetes volume建立在Docker volume之上，增加volume目录和/或设备的配置。
- Secrets  
secrets存储敏感数据，例如认证令牌，其可以在请求时对容器可用。
- Name  
资源的用户或客户端提供的名称。
- Namespace  
namespace就像资源名称的前缀。命名空间帮助不同的项目，团队或客户共享集群，例如防止不相关团队之间的名称冲突
- Annotation
可用于存储非标识辅助数据（特别是由工具和系统扩展操纵的数据）的较大（与标签相比）且可能不是人类可读的数据的键/值对。 不支持通过annotation进行有效过滤。

---

### 3. kubernetes的架构
Kubernetes遵循主从结构。Kubernetes的组件可以分为管理单个节点的和作为控制端一部分的组件。  
![](/static/images/docs/virtualization/container/container_kubernetes_1.1.0_intro_01.png)

#### 1) kubernetes控制端
Kubernetes控制端由各种组件组成，每个组件都有自己的进程，可以在单个主节点或支持高可用性集群的多个主机上运行。 Kubernetes控制端的各个组件如下：
- etcd  
etcd是由CoreOS开发的持久轻量级的分布式键值数据存储，可靠地存储集群的配置数据，表示集群在任何给定时间点的整体状态。 其他组件监视此存储的更改，以使自己进入所需的状态。
- API server  
API服务器是一个关键组件，使用JSON over HTTP服务Kubernetes API，它提供了Kubernetes的内部和外部接口。API服务器处理和验证REST请求并更新etcd中的API对象的状态，从而允许客户端跨Worker节点配置工作负载和容器。
- Scheduler  
调度程序是可插拔组件，根据资源可用性选择哪个节点应该运行未调度的pod。 调度程序跟踪每个节点上的资源利用率，以确保工作负载不会超过可用资源。 为此，调度程序必须知道资源可用性及其跨服务器分配的现有工作负载。
- Controller manager  
控制器管理器是核心Kubernetes控制器（如DaemonSet Controller和Replication Controller）运行于其中的进程。控制器与API服务器通信以创建，更新和删除其管理的资源（pod，服务端点等）

#### 2) kubernetes节点
节点也称为Worker或Minion，是部署容器（工作负载）的单个机器（或虚拟机）。 集群中的每个节点必须运行容器（例如Docker）以及下面提到的组件，以便与主站进行这些容器的网络配置的通信。
- Kubelet  
Kubelet负责每个节点的运行状态（即，确保节点上的所有容器都是正常的）。 它负责按照控制平面的指示启动，停止和维护应用程序容器（组织为pod）。  
Kubelet监视pod的状态，如果不是在所需的状态，pod将被重新部署到同一个节点。 节点状态每几秒钟通过心跳消息中继到主机。 一旦主节点检测到节点故障，Replication Controller会观察到此状态更改并在其他正常节点上启动pod。
- Kube-proxy  
kube-proxy是网络代理和负载均衡器的实现，它支持服务抽象以及其他网络操作。它负责根据传入请求的IP和端口号将流量路由到适当的容器。
- cAdvisor  
cAdvisor是一个代理，用于监视和收集资源使用情况和性能指标，如每个节点上的容器的CPU，内存，文件和网络使用情况。

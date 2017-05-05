---
title: kubernetes 1.2.0 裸机离线安装(coreos,flannel)
date: 2017-03-19 14:30:00
categories: virtualization/container
tags: [container,docker,kubernetes,coreos,flannel]
---
### kubernetes 1.2.0 裸机离线安装(coreos,flannel)

---

### 0. 选择正确的安装方式
在[官网的安装引导上](https://kubernetes.io/docs/getting-started-guides/)，有很多选择，其中包括各种云平台、各种虚拟化工具、各种linux发行版(主要是ubuntu、coreos和redhat)，包括推荐用于开发和测试的minikube。  
如果仅仅为了测试kubernetes集群，这种[vagrant+coreos](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)的方案可能是最适合的。

按照此教程，最终可以得到一个多节点的kubernetes集群，可以在工作站上使用kubectl工具通过kubernetes API来与节点交互。
> 我的工作站使用的是windows10，但是我使用了git-bash来进行操作

---

### 1. 安装vagrant
此教程中使用的工作站是windows10系统，已经安装了vagrant+virtualbox，其他系统可参照[vagrant安装指引](https://www.vagrantup.com/docs/installation/)

---

### 2. 部署kubectl
- 下载[kubectl.exe](https://storage.googleapis.com/kubernetes-release/release/v1.6.1/bin/windows/amd64/kubectl.exe)  
- 将kubectl.exe增加到PATH中

``` bash
kubectl.exe version
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.1", GitCommit:"b0b7a323cc5a4a2019b2e9520c21c7830b7f708e", GitTreeState:"clean", BuildDate:"2017-04-03T20:44:38Z", GoVersion:"go1.7.5", Compiler:"gc", Platform:"windows/amd64"}
Unable to connect to the server: dial tcp [::1]:8080: connectex: No connection could be made because the target machine actively refused it.
```
> 其他平台参照上面的安装教程

---

### 3. coreos-kubernetes(vagrant)
#### 1) clone coreos-kubernetes
``` bash
git clone https://github.com/coreos/coreos-kubernetes.git
cd coreos-kubernetes/multi-node/vagrant/
```

#### 2) 配置虚机
``` bash
cp config.rb.sample config.rb
vim config.rb
**********************************
$update_channel="alpha"

$controller_count=1
$controller_vm_memory=512

$worker_count=2
$worker_vm_memory=1024

$etcd_count=1
$etcd_vm_memory=512
**********************************
```
> 配置1个master节点，2个worker节点，1个etcd节点

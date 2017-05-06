---
title: kubernetes 1.2.0 vagrant+coreos(flannel)
date: 2017-03-19 14:30:00
categories: virtualization/container
tags: [container,docker,kubernetes,coreos,flannel]
---
### kubernetes 1.2.0 vagrant+coreos(flannel)

---

### 0. 选择正确的安装方式
在[官网的安装引导上](https://kubernetes.io/docs/getting-started-guides/)，有很多选择，其中包括各种云平台、各种虚拟化工具、各种linux发行版(主要是ubuntu、coreos和redhat)，包括推荐用于开发和测试的minikube。  
如果仅仅为了测试kubernetes集群，这种[vagrant+coreos](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)的方案可能是最适合的。

按照此教程，最终可以得到一个多节点的kubernetes集群，可以在工作站上使用kubectl工具通过kubernetes API来与节点交互。
> 我的工作站使用的是fedora 25

---

### 1. 安装vagrant
此教程中使用的工作站是fedora，已经安装了vagrant+virtualbox，其他系统可参照[vagrant安装指引](https://www.vagrantup.com/docs/installation/)

---

### 2. 部署kubectl
``` bash
# 下载kubectl客户端
curl -O https://storage.googleapis.com/kubernetes-release/release/v1.6.1/bin/linux/amd64/kubectl

# 将kubectl加到PATH变量目录中
mv kubectl /usr/local/bin
chmod +x kubectl
mv kubectl /usr/local/bin/
kubectl version
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.1", GitCommit:"b0b7a323cc5a4a2019b2e9520c21c7830b7f708e", GitTreeState:"clean", BuildDate:"2017-04-03T20:44:38Z", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```
> 其他平台参照上面的安装教程

---

### 3. coreos-kubernetes(vagrant)
#### 1) 下载coreos-kubernetes
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

#### 3) 启动虚拟机
``` bash
vagrant up
```
> 报错解决
    # 报错信息
    vagrant up
    WARNING: can't open config file: /opt/vagrant/embedded/openssl.cnf
    Generating RSA private key, 2048 bit long modulus
    ......................+++
    ......+++
    e is 65537 (0x10001)
    WARNING: can't open config file: /opt/vagrant/embedded/openssl.cnf
    Unable to load config info from /opt/vagrant/embedded/openssl.cnf
    failed generating SSL artifacts
>
    mv openssl openssl.bak.20170506
    ln -sf /usr/bin/openssl /opt/vagrant/embedded/bin/openssl

#### 4) 配置kubectl
``` bash
export KUBECONFIG="${KUBECONFIG}:$(pwd)/kubeconfig"
kubectl config use-context vagrant-multi

# 获取nodes信息的时候，发生这个错误，其实是因为第一次集群启动需要下载容器镜像(Kubernetes, dns, heapster, etc)
kubectl get nodes
The connection to the server 172.17.4.101:443 was refused - did you specify the right host or port?
kubectl get nodesNAME           STATUS                     AGE       VERSION
172.17.4.101   Ready,SchedulingDisabled   45s       v1.5.4+coreos.0
172.17.4.201   Ready                      46s       v1.5.4+coreos.0
172.17.4.202   Ready                      42s       v1.5.4+coreos.0
```

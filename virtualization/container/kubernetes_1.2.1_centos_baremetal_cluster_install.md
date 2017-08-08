---
title: kubernetes 1.2.1 kubernetes集群安装(centos7裸机)
date: 2017-07-27 10:55:00
categories: virtualization/container
tags: [container,docker,kubernetes,flannel]
---
### kubernetes 1.2.1 kubernetes集群安装(centos7裸机)

---

### 0. 背景介绍
#### 1) 参照文档
[[Creating a Custom Cluster from Scratch]](https://kubernetes.io/docs/getting-started-guides/scratch/)  
> 不参照[【CentOS】](https://kubernetes.io/docs/getting-started-guides/centos/centos_manual_config/)和[【Using kubeadm to Create a Cluster】](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/)的原因是，前者已经废弃，后者在beta阶段。另外此文档只是一个大纲，这样能够更深入的了解kubernetes的组件和原理。  

> 文档中有很多细节，实际操作之外的步骤大部分忽略掉了，推荐详读一遍文档。

#### 2) 软件版本
items|version|comment
---|---|---
OS|centos7|
kubernetes|1.7.2|20170727时的最新版本
docker|17.06.0-ce|
etcd||
flannel||使用flannel搭配k8s完成pods间网络互通
> 其中docker（或者rkt）是必备的，因为kubernetes本身就是一个容器的编排工具  
etcd给kubernetes提供数据存储支持  
flannel给kubernetes提供了网络支持（可选，也有其他选择，详细见文章开头的文档链接中的描述）

#### 3) 节点规划
hostname|ip address|service|comment
---|---|---|---
centos-master|192.168.33.30|etcd,kube-apiserver,kube-controller-manager,kube-scheduler,flannel,docker|主节点
centos-minion-1|192.168.33.31|flannel,docker,kubelet,kube-proxy|node 1
centos-minion-2|192.168.33.32|flannel,docker,kubelet,kube-proxy|node 2
centos-minion-3|192.168.33.33|flannel,docker,kubelet,kube-proxy|node 3
> 实际上kubernetes的master节点也可以当作minion节点  
所有节点上都需要装flannel(网络),docker  
主节点上装kubernetes的master服务、etcd  
minion节点上装kubelet,kube-proxy

---

### 1. 主机环境
为了将系统环境和软件环境对安装的影响度降低，需要确保以下几项需求满足
- 安装"Development tools"和base包
- 关闭selinux
- 关闭iptables-services和firewalld
- 设定hostname到hosts文件中
``` bash
echo "192.168.33.30  centos-master
192.168.33.31  centos-minion-1
192.168.33.32  centos-minion-2
192.168.33.33  centos-minion-3" >> /etc/hosts
```
- 设定sysctl中的net.ipv4.ip_forward = 1
> net.ipv4.ip_forward = 1的配置确保了可以通过映射docker容器端口到外网，否则我们无法通过外网ip访问容器

---

### 2. 规划和准备
#### 0) 规划
- 网络模型：使用flannel封装kubernetes的pod网络
- 软件分布：根据节点规划中的描述，我们需要在所有节点上部署docker,flannel，在所有minion节点增加部署kubelet,kube-proxy，而在master节点上需要额外部署etcd,kube-apiserver,kube-controller-manager,kube-scheduler   

#### 1) 配置kubernetes环境变量（master节点）
``` bash
echo "export MASTER_IP=192.168.33.30
export SERVICE_CLUSTER_IP_RANGE=172.17.8.1/24
export CLUSTER_NAME=KubeTest" > /etc/profile.d/kubernetes
source /etc/profile.d/kubernetes
```

#### 2) 获取kubernetes（master节点）
kubernetes的二进制包里面包含了kubernetes的二进制文件和支持的etcd版本
``` bash
# 下载kubernetes
wget https://github.com/kubernetes/kubernetes/releases/tag/v1.7.2
tar zxvf kubernetes.tar.gz

# 下载二进制文件
./kubernetes/cluster/get-kube-binaries.sh
#检查下载的文件
ll -h kubernetes/*/*-linux-amd64.tar.gz
-rw-r--r--. 1 root root  32M Jul 27 06:58 kubernetes/client/kubernetes-client-linux-amd64.tar.gz
-rw-r--r--. 1 root root 418M Jul 27 06:57 kubernetes/server/kubernetes-server-linux-amd64.tar.gz

# 拷贝二进制文件到server端
mkdir -p /usr/local/kubernetes/{bin,security}
tar zxvf kubernetes/server/kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/{kube-apiserver,kube-scheduler,kube-controller-manager,kubectl} /usr/local/kubernetes/bin/
chmod 750 /usr/local/kubernetes/bin/*

# 拷贝二进制文件到minion端
scp kubernetes/server/bin/{kubelet,kube-proxy} root@centos-minion-1:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@centos-minion-2:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@centos-minion-3:/usr/local/bin
```
> 因为kubernetes这个项目是使用go语言编写，而go语言程序的部署方式很简单，就是拷贝二进制文件就可以，所以在这里，我们通过简单的复制各服务的二进制文件，就可以通过启动它们来启动相应的服务。  
本文开头的参照文档中说，minion需要运行的kubelet,kube-proxy,docker，推荐直接在系统层面上启动服务，而对于etcd, kube-apiserver, kube-controller-manager, 和 kube-scheduler，它推荐我们使用容器来运行它们，文档中给出了几种镜像的获取方式，当然，我们下载的二进制文件中也有这样的镜像文件（bin目录中tar结尾的文件）可以本地加载（使用docker load命令）

#### 3) 安全策略（master节点）
- 如果用http，安装简单，但需要使用防火墙去控制访问
- 如果用https，配置安全认证文件即可，推荐使用

准备安全认证文件(master节点做https服务器)
``` bash
# 获取easyrsa
curl -L -O https://storage.googleapis.com/kubernetes-release/easy-rsa/easy-rsa.tar.gz
tar xzf easy-rsa.tar.gz

# 初始化
cd easy-rsa-master/easyrsa3
./easyrsa init-pki

init-pki complete; you may now create a CA or requests.
Your newly created PKI dir is: /root/easy-rsa-master/easyrsa3/pki

# 生成ca.key
./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass

# 生成server.key和server.crt
./easyrsa --subject-alt-name="IP:${MASTER_IP}" build-server-full server nopass

# 拷贝认证文件到自定义目录
cp pki/ca.crt pki/issued/server.crt pki/private/server.key /usr/local/kubernetes/security
```
> 这些认证文件在apiserver启动时需要指定，可以通过增加以下参数
--client-ca-file=/yourdirectory/ca.crt
--tls-cert-file=/yourdirectory/server.crt
--tls-private-key-file=/yourdirectory/server.key

> [使用easyrsa生成认证文件的文档](https://kubernetes.io/docs/admin/authentication/#easyrsa)

---

### 3. 配置和安装master节点
#### 1) 部署docker
安装可参照[docker yum安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)和[docker 二进制安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.1_installation_binary.html)，也可以使用发行版自己安装的docker版本(只要不是太旧)。
> 二进制安装方法里面开启了selinux，这里可以关闭

#### 2) 部署etcd去存储kubernetes
```
mkdir -p /var/lib/etcd
export HostIP="192.168.33.30"
docker run -d -v /var/lib/etcd:/var/lib/etcd -p 4001:4001 -p 2380:2380 -p 2379:2379 \
 --name etcd quay.io/coreos/etcd:v2.3.8 \
 -name etcd0 \
 -advertise-client-urls http://${HostIP}:2379,http://${HostIP}:4001 \
 -listen-client-urls http://0.0.0.0:2379,http://0.0.0.0:4001 \
 -initial-advertise-peer-urls http://${HostIP}:2380 \
 -listen-peer-urls http://0.0.0.0:2380 \
 -initial-cluster-token etcd-cluster-1 \
 -initial-cluster etcd0=http://${HostIP}:2380 \
 -initial-cluster-state new
```
> 为了测试，在主节点上只启动一个节点的etcd

#### 3) 启动kubernets Apiserver, Controller Manager, 和 Scheduler服务

#### 3) 部署flannel
``` bash
# 获取最新的etcd二进制包（主要是为了在master节点上直接etcdctl命令）
wget https://github.com/coreos/etcd/releases/download/v3.2.4/etcd-v3.2.4-linux-amd64.tar.gz
tar zxvf etcd-v3.2.4-linux-amd64.tar.gz
cp etcd-v3.2.4-linux-amd64/etcdctl /usr/bin
# 配置flannel的网络配置
etcdctl --endpoints http://192.168.33.30:2379 set /kube-centos/network/config '{ "Network": "10.5.0.0/16", "Backend": {"Type": "vxlan"}}'

wget https://github.com/coreos/flannel/releases/download/v0.8.0/flannel-v0.8.0-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-v0.8.0-linux-amd64.tar.gz -C flannel
cp flannel/flanneld /usr/bin
mkdir -p /usr/libexec/flannel
cp flannel/mk-docker-opts.sh /usr/libexec/flannel/
cat > /etc/sysconfig/flanneld << EOF
FLANNELD_PUBLIC_IP="192.168.33.30"
FLANNELD_ETCD_ENDPOINTS="http://192.168.33.30:2379"
FLANNELD_ETCD_PREFIX="/kube-centos/network"
# Any additional options that you want to pass
FLANNELD_OPTIONS=""
EOF

cat > /usr/lib/systemd/system/flannel.service << EOF
[Unit]
Description=Flanneld overlay address etcd agent
After=network.target
After=network-online.target
Wants=network-online.target
After=etcd.service
Before=docker.service

[Service]
Type=notify
EnvironmentFile=/etc/sysconfig/flanneld
ExecStart=/usr/bin/flanneld \$FLANNELD_OPTIONS
ExecStartPost=/usr/libexec/flannel/mk-docker-opts.sh -c
Restart=on-failure

[Install]
WantedBy=multi-user.target
RequiredBy=docker.service
EOF
```

### 4. 配置和安装基本软件
1. 在minion节点上操作（包含master节点，因为我们将其作为一个minion节点来对待）
2. 我们需要配置和安装四个服务
    - flannel
    - docker
    - kubelet
    - kube-proxy
#### flannel安装

---
title: kubernetes 1.2.1 kubernetes集群安装(centos7裸机)
date: 2017-07-27 10:55:00
categories: virtualization/container
tags: [container,docker,kubernetes,flannel]
---
### kubernetes 1.2.1 kubernetes集群安装(centos7裸机)

---

## 0. 背景介绍
### 1) 参照文档
[[Creating a Custom Cluster from Scratch]](https://kubernetes.io/docs/getting-started-guides/scratch/)  
> 不参照[【CentOS】](https://kubernetes.io/docs/getting-started-guides/centos/centos_manual_config/)和[【Using kubeadm to Create a Cluster】](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/)的原因是，前者已经废弃，后者在beta阶段。另外此文档只是一个大纲，这样能够更深入的了解kubernetes的组件和原理。  

> 文档中有很多细节，实际操作之外的步骤大部分忽略掉了，推荐详读一遍文档。

### 2) 软件版本
items|version|comment
---|---|---
OS|centos7|
kubernetes|1.8.3|最新稳定版本
docker|17.09.0-ce|
etcd||
flannel||使用flannel做overlay网络，支持不同主机间pods间网络互通
> - docker（或者rkt）是必备的，因为kubernetes本身就是一个容器的编排工具  
- etcd给kubernetes和flannel提供数据存储支持，可部署在kubernetes master节点上，也可以单独启用一个集群  
- flannel给kubernetes提供了overlay网络支持（可选，也有其他选择，详细见文章开头的文档链接中的描述），实现了不同主机pods之间的直接互通
- kubernetes包含以下组件
    - 在master节点上运行的kube-apiserver,kube-controller-manager,kube-scheduler
    - 在node节点上运行的kubelet,kube-proxy

### 3) 节点规划
hostname|ip address|service|comment
---|---|---|---
master|172.16.1.100|etcd,kube-apiserver,kube-controller-manager,kube-scheduler,flannel,docker|主节点
node1|172.16.1.101|flannel,docker,kubelet,kube-proxy|node 1
node2|172.16.1.102|flannel,docker,kubelet,kube-proxy|node 2
node3|172.16.1.103|flannel,docker,kubelet,kube-proxy|node 3
> 实际上kubernetes的master节点也可以当作node节点，但生产环境中最好分开  
所有node节点上都需要装flannel(网络),docker，这是基础组件  
主节点上装kubernetes的master服务kube-apiserver,kube-controller-manager,kube-scheduler  
etcd生产环境中需要单独部署集群，做高可用，此处测试环境只启用单节点  
node节点上装kubelet,kube-proxy

---

## 1. 主机环境
为了将系统环境和软件环境对安装的影响度降低，需要确保以下几项需求满足
- 安装"Development tools"和base包  
`yum install -y wget vim iptables iptables-services`

- 关闭selinux  
``` bash
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
setenforce 0
```

- 关闭iptables-services和firewalld
`systemctl stop firewalld;systemctl stop iptables`

- 设定hostname到hosts文件中
``` bash
echo "172.16.1.100  master
172.16.1.101  node1
172.16.1.102  node2
172.16.1.103  node3" >> /etc/hosts
```

- 设定sysctl中的net.ipv4.ip_forward = 1
``` bash
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```
> net.ipv4.ip_forward = 1的配置确保了可以通过映射docker容器端口到外网，否则我们无法通过外网ip访问容器

---

## 2. kubernetes master节点
### 1) 配置kubernetes环境变量（master节点）
``` bash
echo "export MASTER_IP=172.16.1.100
export SERVICE_CLUSTER_IP_RANGE=172.17.8.1/24
export CLUSTER_NAME=KubeTest
export CA_CERT=/usr/local/kubernetes/security/ca.crt
export MASTER_CERT=/usr/local/kubernetes/security/server.crt
export MASTER_KEY=/usr/local/kubernetes/security/server.key" > /etc/profile.d/kubernetes
source /etc/profile.d/kubernetes
```
> 规划集群中需要重复使用的内容为变量
- MASTER_IP kubernetes master的静态ip
- SERVICE_CLUSTER_IP_RANGE service对象使用的ip范围
- CLUSTER_NAME kubernetes集群的名称
- 认证变量（后面https支持会用到）：
    - CA_CERT 放在apiserver节点上
    - MASTER_CERT 放在apiserver节点上
    - MASTER_KEY 放在apiserver节点上

### 2) 获取kubernetes（master节点）
kubernetes的二进制包里面包含了kubernetes的二进制文件和支持的etcd版本
``` bash
# 下载kubernetes
wget https://github.com/kubernetes/kubernetes/releases/download/v1.8.3/kubernetes.tar.gz
tar zxvf kubernetes.tar.gz

# 下载二进制文件
./kubernetes/cluster/get-kube-binaries.sh
#检查下载的文件
ll -h kubernetes/*/*-linux-amd64.tar.gz
-rw-r--r--. 1 root root  25M Nov 19 05:03 kubernetes/client/kubernetes-client-linux-amd64.tar.gz
-rw-r--r--. 1 root root 386M Nov 19 05:03 kubernetes/server/kubernetes-server-linux-amd64.tar.gz

# 拷贝二进制文件到server端
mkdir -p /usr/local/kubernetes/{bin,security}
tar zxvf kubernetes/server/kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/{kube-apiserver,kube-scheduler,kube-controller-manager,kubectl} /usr/local/kubernetes/bin/
chmod 750 /usr/local/kubernetes/bin/*
export PATH=$PATH:/usr/local/kubernetes/bin
# 如果使用docker启动kube-apiserver,kube-scheduler,kube-controller-manager这三个服务的话，不需要拷贝它们的二进制文件，只需要拷贝kubectl即可

# 拷贝二进制文件到node端
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node1:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node2:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node3:/usr/local/bin
```
> 因为kubernetes这个项目是使用go语言编写，而go语言程序的部署方式很简单，就是拷贝二进制文件就可以，所以在这里，我们通过简单的复制各服务的二进制文件，就可以通过启动它们来启动相应的服务。  
本文开头的参照文档中说，node需要运行的kubelet,kube-proxy,docker，推荐直接在系统层面上启动服务，而对于etcd, kube-apiserver, kube-controller-manager, 和 kube-scheduler，它推荐我们使用容器来运行它们，文档中给出了几种镜像的获取方式，当然，我们下载的二进制文件中也有这样的镜像文件（bin目录中tar结尾的文件）可以本地加载（使用docker load命令）

### 3) 安全策略（master节点）
#### (1) 准备https安全证书
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

# 生成ca.key
./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass

# 生成server.key和server.crt
./easyrsa --subject-alt-name="IP:${MASTER_IP}" build-server-full server nopass

# 拷贝认证文件到自定义目录
cp pki/ca.crt pki/issued/server.crt pki/private/server.key /usr/local/kubernetes/security
```
> 这些认证文件在apiserver启动时需要指定，可以通过增加以下参数
--client-ca-file=/usr/local/kubernetes/security/ca.crt
--tls-cert-file=/usr/local/kubernetes/security/server.crt
--tls-private-key-file=/usr/local/kubernetes/security/server.key

> [使用easyrsa生成认证文件的文档](https://k8smeetup.github.io/docs/admin/authentication/#easyrsa)

#### 4) 准备凭证（admin）
``` bash
```

---

### 4). 配置和安装kubernetes master服务
#### 1) 部署docker
安装可参照[docker yum安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)和[docker 二进制安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.1_installation_binary.html)，也可以使用发行版自己安装的docker版本(只要不是太旧)。
> 二进制安装方法里面开启了selinux，这里需要关闭

#### 2) 部署etcd
``` bash
mkdir -p /var/lib/etcd
export HostIP="172.16.1.100"
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
> 为了测试，在主节点上只启动一个节点的etcd，etcd集群参照[etcd集群安装](http://linux.xiao5tech.com/virtualization/container/etcd_1.3.0_discovery_systemd.html)

#### 3) 启动kubernets Apiserver, Controller Manager, 和 Scheduler服务
``` bash
docker load -i kubernetes/server/bin/kube-apiserver.tar
docker load -i kubernetes/server/bin/kube-controller-manager.tar
docker load -i kubernetes/server/bin/kube-scheduler.tar

docker run -d --name=apiserver -p 8080:8080 gcr.io/google_containers/kube-apiserver:v1.8.3 \
 kube-apiserver \
 --bind-address=${MASTER_IP} \
 --service-cluster-ip-range=${SERVICE_CLUSTER_IP_RANGE} \
 --etcd-servers=http://127.0.0.1:4001 \
 kube-apiserver \
 --token-auth-file=/dev/null \
 --bind-address=${MASTER_IP} \
 --insecure-bind-address=${MASTER_IP} \
 --insecure-port=8080 \
 --advertise-address=${MASTER_IP} \
 --service-cluster-ip-range=${SERVICE_CLUSTER_IP_RANGE} \
 --etcd-servers=http://127.0.0.1:4001 \
 --client-ca-file=${CA_CERT} \
 --tls-cert-file=${MASTER_CERT} \
 --tls-private-key-file=${MASTER_KEY}

docker run -d --name=ControllerM gcr.io/google_containers/kube-controller-manager:v1.8.3 \
 kube-controller-manager \
 --master=${MASTER_IP}:8080

docker run -d --name=scheduler gcr.io/google_containers/kube-scheduler:v1.8.3 \
 kube-scheduler \
 --master=${MASTER_IP}:8080
```

---

## 3. node节点配置和安装基本软件
1. 在node节点上操作
2. 我们需要配置和安装四个服务
    - flannel
    - docker
    - kubelet
    - kube-proxy
#### flannel安装


#### 3) 部署flannel
``` bash
# 获取最新的etcd二进制包（主要是为了在master节点上直接etcdctl命令）
wget https://github.com/coreos/etcd/releases/download/v3.2.4/etcd-v3.2.4-linux-amd64.tar.gz
tar zxvf etcd-v3.2.4-linux-amd64.tar.gz
cp etcd-v3.2.4-linux-amd64/etcdctl /usr/bin
# 配置flannel的网络配置
etcdctl --endpoints http://172.16.1.100:2379 set /kube-centos/network/config '{ "Network": "10.5.0.0/16", "Backend": {"Type": "vxlan"}}'

wget https://github.com/coreos/flannel/releases/download/v0.8.0/flannel-v0.8.0-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-v0.8.0-linux-amd64.tar.gz -C flannel
cp flannel/flanneld /usr/bin
mkdir -p /usr/libexec/flannel
cp flannel/mk-docker-opts.sh /usr/libexec/flannel/
cat > /etc/sysconfig/flanneld << EOF
FLANNELD_PUBLIC_IP="172.16.1.100"
FLANNELD_ETCD_ENDPOINTS="http://172.16.1.100:2379"
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

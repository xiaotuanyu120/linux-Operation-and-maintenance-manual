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
- 教程参照文档-[[Creating a Custom Cluster from Scratch]](https://kubernetes.io/docs/getting-started-guides/scratch/)
- 网络参考-[理解Kubernetes网络之Flannel网络](http://tonybai.com/2017/01/17/understanding-flannel-network-for-kubernetes/)

> 不参照[[CentOS]](https://kubernetes.io/docs/getting-started-guides/centos/centos_manual_config/)和[[Using kubeadm to Create a Cluster]](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/)的原因是，前者已经废弃，后者在beta阶段。另外此文档只是一个大纲，这样能够更深入的了解kubernetes的组件和原理。  

> 文档中有很多细节，实际操作之外的步骤大部分忽略掉了，推荐详读一遍文档。

### 2) 软件版本
items|version|comment
---|---|---
OS|centos7|
kubernetes|1.8.3|最新稳定版本
docker|17.09.0-ce|
etcd|3.0.7|
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
master|172.16.1.100|etcd,kube-apiserver,kube-controller-manager,kube-scheduler,docker|主节点
node1|172.16.1.101|flannel,docker,kubelet,kube-proxy|node 1
node2|172.16.1.102|flannel,docker,kubelet,kube-proxy|node 2
node3|172.16.1.103|flannel,docker,kubelet,kube-proxy|node 3

---

## 1. 主机环境
为了将系统环境和软件环境对安装的影响度降低，需要确保以下几项需求满足
- 安装必要的工具包  
`yum install -y wget vim iptables iptables-services`

- 关闭selinux  
``` bash
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
setenforce 0
```

- 关闭iptables-services和firewalld  
`systemctl stop firewalld;systemctl stop iptables`  
> 防火墙后期需要开启，并开放api服务的端口

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

- 关闭系统swap  
``` bash
swapoff -a
```
> 关闭系统swap，是为了严格的按照cpu和内存的限制，这样scheduler在规划pod的时候就不会把pod放进swap中了，这是为了性能考虑。

---

## 2. kubernetes master节点
### 1) 配置kubernetes环境变量（master节点）
``` bash
echo 'export MASTER_IP=172.16.1.100
export SERVICE_CLUSTER_IP_RANGE=10.254.0.0/16
export CLUSTER_NAME=KubeTest
export CA_CERT=/usr/local/kubernetes/security/ca.crt
export MASTER_CERT=/usr/local/kubernetes/security/server.crt
export MASTER_KEY=/usr/local/kubernetes/security/server.key
export PATH=$PATH:/usr/local/kubernetes/bin' > /etc/profile.d/kubernetes.sh
source /etc/profile.d/kubernetes.sh
```
> 规划集群中需要重复使用的内容为变量
- `MASTER_IP` - master的静态ip
- `SERVICE_CLUSTER_IP_RANGE` - service对象使用的ip范围
- `CLUSTER_NAME` - kubernetes集群的名称
- 认证变量（后面https支持会用到）：
    - `CA_CERT` - 放在apiserver节点上
    - `MASTER_CERT` - 放在apiserver节点上
    - `MASTER_KEY` - 放在apiserver节点上

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
mkdir -p /usr/local/kubernetes/{bin,security,conf}
tar zxvf kubernetes/server/kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/{kube-apiserver,kube-scheduler,kube-controller-manager,kubectl} /usr/local/kubernetes/bin/
chmod 750 /usr/local/kubernetes/bin/*
# 如果使用docker启动kube-apiserver,kube-scheduler,kube-controller-manager这三个服务的话，不需要拷贝它们的二进制文件，只需要拷贝kubectl即可

# 拷贝二进制文件到node端
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node1:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node2:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node3:/usr/local/bin
```
> 因为kubernetes这个项目是使用go语言编写，而go语言程序的部署方式很简单，就是拷贝二进制文件就可以，所以在这里，我们通过简单的复制各服务的二进制文件，就可以通过启动它们来启动相应的服务。  

> 本文开头的参照文档中说:  
node需要运行的kubelet,kube-proxy,docker，推荐直接在系统层面上启动服务;  
而对于etcd, kube-apiserver, kube-controller-manager 和 kube-scheduler，推荐我们使用容器来运行它们，文档中给出了几种镜像的获取方式，当然，我们下载的二进制文件中也有这样的镜像文件（bin目录中tar结尾的文件）可以本地加载（使用docker load命令）镜像到本机的docker中。

<!--
### 3) 安全策略（master节点）
#### (1) 准备https安全证书
- 如果用http，安装简单，但需要使用防火墙去控制访问
- 如果用https，配置安全认证文件即可，推荐使用

准备certs(master节点做https服务器)
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
./easyrsa --subject-alt-name="IP:${MASTER_IP}" --days=10000 build-server-full server nopass

# 拷贝认证文件到自定义目录
cp pki/ca.crt pki/issued/server.crt pki/private/server.key /usr/local/kubernetes/security
```
> 这些认证文件在apiserver启动时需要指定，可以通过增加以下参数
--client-ca-file=/usr/local/kubernetes/security/ca.crt
--tls-cert-file=/usr/local/kubernetes/security/server.crt
--tls-private-key-file=/usr/local/kubernetes/security/server.key

> [使用easyrsa生成认证文件的文档](https://k8smeetup.github.io/docs/admin/authentication/#easyrsa)
-->

---

### 3). 配置和安装kubernetes master服务
<!--
#### 1) 部署docker
安装可参照[docker yum安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)和[docker 二进制安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.1_installation_binary.html)，也可以使用发行版自己安装的docker版本(只要不是太旧)。
> 二进制安装方法里面开启了selinux，这里需要关闭
-->

#### 1) 部署etcd
在`kubernetes/cluster/images/etcd/Makefile`中查找到对应的etcd版本  

etcd 单点的安装可以参照[etcd install single node with systemd](http://linux.xiao5tech.com/virtualization/container/etcd_1.1.2_install_single_node_systemd.html)  

<!--
``` bash
# mkdir -p /var/lib/etcd
# export HostIP="172.16.1.100"
# docker run -d -v /var/lib/etcd:/var/lib/etcd -p 4001:4001 -p 2380:2380 -p 2379:2379 \
#  --name etcd quay.io/coreos/etcd:v2.3.8 \
#  --advertise-client-urls http://$HostIP:2379 \
#  --listen-client-urls http://0.0.0.0:2379,http://0.0.0.0:4001
```
-->

使用etcd储存flannel的网络配置
``` bash
etcdctl --endpoints http://$MASTER_IP:2379 set /kube-centos/network/config '{ "Network": "10.5.0.0/16", "Backend": {"Type": "vxlan"}}'
```
> 为了测试，在主节点上只启动一个节点的etcd，etcd集群参照[etcd 集群文档](http://linux.xiao5tech.com/virtualization/container)

#### 2) 启动kubernets Apiserver, Controller Manager, 和 Scheduler服务
<!--
``` bash
# docker load -i kubernetes/server/bin/kube-apiserver.tar
# docker load -i kubernetes/server/bin/kube-controller-manager.tar
# docker load -i kubernetes/server/bin/kube-scheduler.tar
#
# docker run -d --name=apiserver -p 8080:8080 gcr.io/google_containers/kube-apiserver:v1.8.3 \
#  kube-apiserver \
#  --insecure-bind-address=0.0.0.0 \
#  --insecure-port=8080 \
#  --advertise-address=0.0.0.0 \
#  --service-cluster-ip-range=${SERVICE_CLUSTER_IP_RANGE} \
#  --etcd-servers=http://127.0.0.1:4001 \
#  --service-node-port-range=1-65535 \
#  # --client-ca-file=${CA_CERT} \
#  # --tls-cert-file=${MASTER_CERT} \
#  # --tls-private-key-file=${MASTER_KEY}
#
# docker run -d --name=ControllerM gcr.io/google_containers/kube-controller-manager:v1.8.3 \
#  kube-controller-manager \
#  --master=${MASTER_IP}:8080
#
# docker run -d --name=scheduler gcr.io/google_containers/kube-scheduler:v1.8.3 \
#  kube-scheduler \
#  --master=${MASTER_IP}:8080
```
-->

准备配置文件：
- config, 通用配置
- apiserver, kube-apiserver配置
- controller-manager, kube-controller-manager配置
- scheduler, kube-scheduler配置

``` bash
cat > /usr/local/kubernetes/conf/config << EOF
###
# kubernetes system config
#
# The following values are used to configure various aspects of all
# kubernetes services, including
#
#   kube-apiserver.service
#   kube-controller-manager.service
#   kube-scheduler.service
#   kubelet.service
#   kube-proxy.service
# logging to stderr means we get it in the systemd journal
KUBE_LOGTOSTDERR="--logtostderr=true"


# journal message level, 0 is debug
KUBE_LOG_LEVEL="--v=0"

# Should this cluster be allowed to run privileged docker containers
KUBE_ALLOW_PRIV="--allow-privileged=false"

# How the controller-manager, scheduler, and proxy find the apiserver
KUBE_MASTER="--master=http://127.0.0.1:8080"
EOF

cat > /usr/local/kubernetes/conf/apiserver << EOF
###
# kubernetes system config
#
# The following values are used to configure the kube-apiserver
#

# The address on the local server to listen to.
KUBE_API_ADDRESS="--insecure-bind-address=0.0.0.0"

# The port on the local server to listen on.
KUBE_API_PORT="--insecure-port=8080"

# Port minions listen on
# KUBELET_PORT="--kubelet-port=10250"

# Comma separated list of nodes in the etcd cluster
KUBE_ETCD_SERVERS="--etcd-servers=http://127.0.0.1:2379,http://127.0.0.1:4001"

# Address range to use for services
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=$SERVICE_CLUSTER_IP_RANGE"

# default admission control policies
KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"

# Add your own!
KUBE_API_ARGS="--service-node-port-range=1-65535"
EOF

cat > /usr/local/kubernetes/conf/controller-manager << EOF
###
# The following values are used to configure the kubernetes controller-manager

# defaults from config and apiserver should be adequate

# Add your own!
KUBE_CONTROLLER_MANAGER_ARGS=""
EOF

cat > /usr/local/kubernetes/conf/scheduler << EOF
###
# kubernetes scheduler config

# default config should be adequate

# Add your own!
KUBE_SCHEDULER_ARGS=""
EOF
```

准备systemd unit文件:
- kube-apiserver.service
- kube-controller-manager.service
- kube-scheduler.service

``` bash
echo '[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target
After=etcd.service

[Service]
EnvironmentFile=-/usr/local/kubernetes/conf/config
EnvironmentFile=-/usr/local/kubernetes/conf/apiserver
User=kube
ExecStart=/usr/local/kubernetes/bin/kube-apiserver \
	    $KUBE_LOGTOSTDERR \
	    $KUBE_LOG_LEVEL \
	    $KUBE_ETCD_SERVERS \
	    $KUBE_API_ADDRESS \
	    $KUBE_API_PORT \
	    $KUBELET_PORT \
	    $KUBE_ALLOW_PRIV \
	    $KUBE_SERVICE_ADDRESSES \
	    $KUBE_ADMISSION_CONTROL \
	    $KUBE_API_ARGS
Restart=on-failure
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kube-apiserver.service


echo '[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
EnvironmentFile=-/usr/local/kubernetes/conf/config
EnvironmentFile=-/usr/local/kubernetes/conf/controller-manager
User=kube
ExecStart=/usr/local/kubernetes/bin/kube-controller-manager \
	    $KUBE_LOGTOSTDERR \
	    $KUBE_LOG_LEVEL \
	    $KUBE_MASTER \
	    $KUBE_CONTROLLER_MANAGER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kube-controller-manager.service


echo '[Unit]
Description=Kubernetes Scheduler Plugin
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
EnvironmentFile=-/usr/local/kubernetes/conf/config
EnvironmentFile=-/usr/local/kubernetes/conf/scheduler
User=kube
ExecStart=/usr/local/kubernetes/bin/kube-scheduler \
	    $KUBE_LOGTOSTDERR \
	    $KUBE_LOG_LEVEL \
	    $KUBE_MASTER \
	    $KUBE_SCHEDULER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kube-scheduler.service
```

依次启动`kube-apiserver.service`, `kube-controller-manager.service`, `kube-scheduler.service`
``` bash
# 重载systemd unit文件
systemctl daemon-reload

# 创建spawn服务的用户kube（在配置文件中配置）
useradd -r -s /sbin/nologin kube
chown :kube /usr/local/kubernetes/bin/*
mkdir /var/run/kubernetes
chown kube:kube /var/run/kubernetes

systemctl start kube-apiserver.service
systemctl start kube-controller-manager.service
systemctl start kube-scheduler.service
```

---

## 3. node节点配置和安装基本软件
### 1) 部署flannel(node节点)
``` bash
# 下载flannel
wget https://github.com/coreos/flannel/releases/download/v0.8.0/flannel-v0.8.0-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-v0.8.0-linux-amd64.tar.gz -C flannel
cp flannel/flanneld /usr/local/bin
mkdir -p /usr/libexec/flannel
cp flannel/mk-docker-opts.sh /usr/libexec/flannel/

# 准备flannel配置文件
cat > /etc/sysconfig/flanneld << EOF
FLANNELD_PUBLIC_IP="172.16.1.100"
FLANNELD_ETCD_ENDPOINTS="http://172.16.1.100:2379"
FLANNELD_ETCD_PREFIX="/kube-centos/network"
# Any additional options that you want to pass
FLANNELD_OPTIONS=""
EOF

# 准备flannel systemd unit文件
echo '[Unit]
Description=Flanneld overlay address etcd agent
After=network.target
After=network-online.target
Wants=network-online.target
Before=docker.service

[Service]
Type=notify
EnvironmentFile=/etc/sysconfig/flanneld
ExecStart=/usr/local/bin/flanneld $FLANNELD_OPTIONS
ExecStartPost=/usr/libexec/flannel/mk-docker-opts.sh -c
Restart=on-failure

[Install]
WantedBy=multi-user.target
RequiredBy=docker.service' > /usr/lib/systemd/system/flannel.service

systemctl daemon-reload
systemctl enable flannel
systemctl start flannel
```
> flannel启动后生成了以下文件：  
- /var/run/flannel/subnet.env, 从etcd中获取信息然后生成的flanneld配置文件
- /run/docker_opts.env, flannel service文件中指定的/usr/libexec/flannel/mk-docker-opts.sh生成的docker环境变量文件

### 2) 安装docker(node节点)
``` bash
# 安装docker底包
yum install -y git libcgroup libcgroup-tools
systemctl enable cgconfig
systemctl start cgconfig

# 下载安装docker
DOCKER_VER=17.09.0
wget https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VER}-ce.tgz
tar zxvf docker-${DOCKER_VER}-ce.tgz
cp docker/* /usr/local/bin/
wget https://github.com/docker/compose/releases/download/1.17.1/docker-compose-Linux-x86_64
cp docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod 755 /usr/local/bin/*

# 准备systemd unit文件
echo '[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target docker.socket flannel.service
Wants=network-online.target
Requires=docker.socket

[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
EnvironmentFile=/run/docker_opts.env
ExecStart=/usr/bin/dockerd -H fd:// $DOCKER_OPTS
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=1048576
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNPROC=infinity
LimitCORE=infinity
# Uncomment TasksMax if your systemd version supports it.
# Only systemd 226 and above support this version.
#TasksMax=infinity
TimeoutStartSec=0
# set delegate yes so that systemd does not reset the cgroups of docker containers
Delegate=yes
# kill only the docker process, not all processes in the cgroup
KillMode=process
# restart the docker process if it exits prematurely
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/docker.service


echo '[Unit]
Description=Docker Socket for the API
PartOf=docker.service

[Socket]
ListenStream=/var/run/docker.sock
SocketMode=0660
SocketUser=root
SocketGroup=docker

[Install]
WantedBy=sockets.target' > /usr/lib/systemd/system/docker.socket

groupadd docker

systemctl daemon-reload
systemctl enable docker
systemctl start docker
```
> docker systemd

### 3) 安装kubelet(node节点)
准备配置文件：
- config, 通用配置
- kubelet, kubelet配置
- controller-manager, kube-controller-manager配置

``` bash
mkdir /usr/local/kubernetes/conf -p

cat > /usr/local/kubernetes/conf/config << EOF
###
# kubernetes system config
#
# The following values are used to configure various aspects of all
# kubernetes services, including
#
#   kube-apiserver.service
#   kube-controller-manager.service
#   kube-scheduler.service
#   kubelet.service
#   kube-proxy.service
# logging to stderr means we get it in the systemd journal
KUBE_LOGTOSTDERR="--logtostderr=true"


# journal message level, 0 is debug
KUBE_LOG_LEVEL="--v=0"

# Should this cluster be allowed to run privileged docker containers
KUBE_ALLOW_PRIV="--allow-privileged=false"

# How the controller-manager, scheduler, and proxy find the apiserver
KUBE_MASTER="--master=http://172.16.1.100:8080"
EOF

cat > /usr/local/kubernetes/conf/kubelet << EOF
###
# kubernetes kubelet (minion) config

# --kubeconfig for kubeconfig
KUBELET_KUBECONFIG="--kubeconfig=/usr/local/kubernetes/conf/node-kubeconfig.yaml"

# The address for the info server to serve on (set to 0.0.0.0 or "" for all interfaces)
KUBELET_ADDRESS="--address=0.0.0.0"

# The port for the info server to serve on
# KUBELET_PORT="--port=10250"

# You may leave this blank to use the actual hostname
KUBELET_HOSTNAME="--hostname-override="

# Add your own!
KUBELET_ARGS=""
EOF

cat > /usr/local/kubernetes/conf/proxy << EOF
###
# kubernetes proxy config

# default config should be adequate

# Add your own!
KUBE_PROXY_ARGS=""
EOF

cat > /usr/local/kubernetes/conf/node-kubeconfig.yaml << EOF
apiVersion: v1
kind: Config
clusters:
- name: local
  cluster:
    server: http://master:8080
contexts:
- context:
    cluster: local
  name: kubelet-cluster.local
current-context: kubelet-cluster.local
EOF
```

准备systemd unit文件:
- kubelet.service
- kube-proxy.service

``` bash
echo '[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=/var/lib/kubelet
EnvironmentFile=-/usr/local/kubernetes/conf/config
EnvironmentFile=-/usr/local/kubernetes/conf/kubelet
ExecStart=/usr/local/bin/kubelet \
	    $KUBE_LOGTOSTDERR \
	    $KUBE_LOG_LEVEL \
	    $KUBELET_KUBECONFIG \
	    $KUBELET_ADDRESS \
	    $KUBELET_PORT \
	    $KUBELET_HOSTNAME \
	    $KUBE_ALLOW_PRIV \
	    $KUBELET_ARGS
Restart=on-failure
KillMode=process

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kubelet.service

echo '[Unit]
Description=Kubernetes Kube-Proxy Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target

[Service]
EnvironmentFile=-/usr/local/kubernetes/conf/config
EnvironmentFile=-/usr/local/kubernetes/conf/proxy
ExecStart=/usr/local/bin/kube-proxy \
	    $KUBE_LOGTOSTDERR \
	    $KUBE_LOG_LEVEL \
	    $KUBE_MASTER \
	    $KUBE_PROXY_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/kube-proxy.service
```

依次启动`kubelet`,`kube-proxy`服务
``` bash
# 重载systemd units文件
systemctl daemon-reload

# 创建kubelet工作目录
mkdir /var/lib/kubelet

# 启动服务
systemctl enable kubelet
systemctl enable kube-proxy
systemctl start kubelet
systemctl start kube-proxy
```

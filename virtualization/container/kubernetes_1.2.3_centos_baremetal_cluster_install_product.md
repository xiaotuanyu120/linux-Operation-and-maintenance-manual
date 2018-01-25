---
title: kubernetes 1.2.3 kubernetes集群安装(生产环境)
date: 2018-01-25 10:55:00
categories: virtualization/container
tags: [container,docker,kubernetes,flannel]
---
### kubernetes 1.2.1 kubernetes集群安装(centos7裸机)

---

## 0. 背景介绍
### 1) 参照文档
- 教程参照文档-[[Creating a Custom Cluster from Scratch]](https://www.kubernetes.org.cn/3336.html)

### 2) 软件版本
items|version|comment
---|---|---
OS|centos7|内核版本:	4.4(支持overlay2)
kubernetes|1.9.1|
docker|17.09.0-ce|Storage	Driver: overlay2 <br>Logging	Driver: journald <br>Cgroup	Driver: systemd
etcd|v3.2.11|
flannel||使用flannel做overlay网络，支持不同主机间pods间网络互通

### 3) 节点规划
hostname|ip address|service|comment
---|---|---|---
master1|172.16.1.73|kube-apiserver,kube-controller-manager,kube-scheduler|主节点1
master2|172.16.1.74|kube-apiserver,kube-controller-manager,kube-scheduler|主节点2
master3|172.16.1.75|kube-apiserver,kube-controller-manager,kube-scheduler|主节点3
etcd1|172.16.1.76|etcd|etcd 节点1
etcd2|172.16.1.77|etcd|etcd 节点2
etcd3|172.16.1.78|etcd|etcd 节点3
node01|172.16.1.79|flannel,docker,kubelet,kube-proxy|node 节点1
node02|172.16.1.82|flannel,docker,kubelet,kube-proxy|node 节点2
node03|172.16.1.83|flannel,docker,kubelet,kube-proxy|node 节点3

### 4) 网络规划
网络名称|网段范围
---|---
pod网络|10.5.0.0/16
service网络|10.254.0.0/16
主机网络|172.16.1.0/24

---

## 1. 主机环境
为了将系统环境和软件环境对安装的影响度降低，需要确保以下几项需求满足
- 升级内核(overlay2需求)  
`rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm; yum --enablerepo=elrepo-kernel install kernel-lt-devel kernel-lt -y`  
查看内核启动顺序,确认默认是新内核  
`awk -F\' '$1=="menuentry " {print $2}' /etc/grub2.cfg;grub2-set-default 0;reboot`


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
echo "172.16.1.73 master1
172.16.1.74 master2
172.16.1.75 master3
172.16.1.76 etcd1
172.16.1.77 etcd2
172.16.1.78 etcd3
172.16.1.79 node01
172.16.1.82 node02
172.16.1.83 node03" >> /etc/hosts
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
注释swap的开机挂载项，修改`/etc/fstab`
```
#/dev/mapper/VolGroup00-LogVol01 swap                    swap    defaults        0 0
```
> 关闭系统swap，是为了严格的按照cpu和内存的限制，这样scheduler在规划pod的时候就不会把pod放进swap中了，这是为了性能考虑。

- 安装ipvsadm  
`yum install ipvsadm -y`

---

## 2. 准备 k8s、etcd、flanneld、docker二进制文件
master1上准备二进制文件，统一下发给所有其他机器，所以提前做好ssh信任
### 0) 准备各节点二进制文件目录
``` bash
mkdir -p /root/k8s/{node,master,etcd}/bin
```

### 1) 下载二进制文件
``` bash
cd /root
# 下载kubernetes
K8S_VER=v1.9.1
wget https://dl.k8s.io/${K8S_VER}/kubernetes-server-linux-amd64.tar.gz
tar zxvf kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/{kube-apiserver,kube-scheduler,kube-controller-manager,kubectl} k8s/master/bin
cp kubernetes/server/bin/{kubelet,kube-proxy} k8s/node/bin

# 下载etcd
ETCD_VER=v3.2.11
DOWNLOAD_URL=https://github.com/coreos/etcd/releases/download
curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o etcd-${ETCD_VER}-linux-amd64.tar.gz
tar xzvf etcd-${ETCD_VER}-linux-amd64.tar.gz
cp etcd-${ETCD_VER}-linux-amd64/{etcd,etcdctl} k8s/etcd/bin/

# 下载flannel
FLANNEL_VER=v0.9.1
wget https://github.com/coreos/flannel/releases/download/v0.9.1/flannel-${FLANNEL_VER}-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-${FLANNEL_VER}-linux-amd64.tar.gz -C flannel
cp flannel/{flanneld,mk-docker-opts.sh} k8s/node/bin

# 下载docker
DOCKER_VER=17.09.0
wget https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VER}-ce.tgz
wget https://github.com/docker/compose/releases/download/1.17.1/docker-compose-Linux-x86_64 -O k8s/node/bin/docker-compose
tar zxvf docker-${DOCKER_VER}-ce.tgz
cp docker/* k8s/node/bin
```

### 2) 分发二进制文件
``` bash
chmod +x k8s/etcd/bin/*
chmod +x k8s/node/bin/*
chmod +x k8s/master/bin/*

# 下发master二进制文件
cp /root/k8s/master/bin/* /usr/local/bin
for master in {master2,master3};do
  rsync -av /root/k8s/master/bin/ ${master}:/usr/local/bin/
done

# 下发node二进制文件
for node in {node01,node02,node03};do
  rsync -av /root/k8s/node/bin/ ${node}:/usr/local/bin/
done

# 下发etcd二进制文件
for etcd in {etcd1,etcd2,etcd3};do
  rsync -av /root/k8s/etcd/bin/ ${etcd}:/usr/local/bin/
done
```

---

## 3. 准备master、node、etcd - systemd unit文件
### 0) 创建各节点unit文件目录
``` bash
mkdir -p /root/k8s/{node,master,etcd}/service
```

### 1) 创建master所需unit文件
需要各master节点根据自身调整ip地址
``` bash
#kube-apiserver.service
cat > /root/k8s/master/service/kube-apiserver.service <<EOF
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/kube-apiserver \
  --admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,ResourceQuota,NodeRestriction \
  --advertise-address=172.16.1.73 \
  --bind-address=172.16.1.73 \
  --insecure-bind-address=127.0.0.1 \
  --kubelet-https=true \
  --runtime-config=rbac.authorization.k8s.io/v1beta1 \
  --authorization-mode=RBAC,Node \
  --enable-bootstrap-token-auth \
  --token-auth-file=/etc/kubernetes/ssl/token.csv \
  --service-cluster-ip-range=10.254.0.0/16 \
  --service-node-port-range=30000-32767 \
  --tls-cert-file=/etc/kubernetes/ssl/kubernetes.pem \
  --tls-private-key-file=/etc/kubernetes/ssl/kubernetes-key.pem \
  --client-ca-file=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --service-account-key-file=/etc/kubernetes/ssl/k8s-root-ca-key.pem \
  --etcd-cafile=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --etcd-certfile=/etc/kubernetes/ssl/kubernetes.pem \
  --etcd-keyfile=/etc/kubernetes/ssl/kubernetes-key.pem \
  --etcd-servers=https://172.16.1.76:2379,https://172.16.1.77:2379,https://172.16.1.78:2379 \
  --enable-swagger-ui=true \
  --allow-privileged=true \
  --apiserver-count=3 \
  --audit-log-maxage=30 \
  --audit-log-maxbackup=3 \
  --audit-log-maxsize=100 \
  --audit-log-path=/var/lib/audit.log \
  --event-ttl=1h \
  --v=2
Restart=on-failure
RestartSec=5
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# #kube-controller-manager.service
cat > /root/k8s/master/service/kube-controller-manager.service  <<EOF
[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-controller-manager \
  --address=127.0.0.1 \
  --master=http://127.0.0.1:8080 \
  --allocate-node-cidrs=true \
  --service-cluster-ip-range=10.254.0.0/16 \
  --cluster-cidr=10.5.0.0/16 \
  --cluster-name=kubernetes \
  --cluster-signing-cert-file=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --cluster-signing-key-file=/etc/kubernetes/ssl/k8s-root-ca-key.pem \
  --service-account-private-key-file=/etc/kubernetes/ssl/k8s-root-ca-key.pem \
  --root-ca-file=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --leader-elect=true \
  --v=2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# kube-scheduler.service
cat > /root/k8s/master/service/scheduler.service  <<EOF
[Unit]
Description=Kubernetes Scheduler
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-scheduler \
  --address=127.0.0.1 \
  --master=http://127.0.0.1:8080 \
  --leader-elect=true \
  --v=2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 2) 创建etcd所需unit文件
``` bash
cat > /root/k8s/etcd/service/etcd.service  <<EOF
[Unit]
Description=Etcd Server
After=network.target
After=network-online.target
Wants=network-online.target
Documentation=https://github.com/coreos

[Service]
Type=notify
WorkingDirectory=/var/lib/etcd/
EnvironmentFile=-/etc/etcd/etcd.conf
ExecStart=/usr/local/bin/etcd \
  --name=etcd01 \
  --cert-file=/etc/kubernetes/ssl/kubernetes.pem \
  --key-file=/etc/kubernetes/ssl/kubernetes-key.pem \
  --peer-cert-file=/etc/kubernetes/ssl/kubernetes.pem \
  --peer-key-file=/etc/kubernetes/ssl/kubernetes-key.pem \
  --trusted-ca-file=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --peer-trusted-ca-file=/etc/kubernetes/ssl/k8s-root-ca.pem \
  --initial-advertise-peer-urls=https://172.16.1.76:2380 \
  --listen-peer-urls=https://172.16.1.76:2380 \
  --listen-client-urls=https://172.16.1.76:2379,http://127.0.0.1:2379 \
  --advertise-client-urls=https://172.16.1.76:2379 \
  --initial-cluster-token=etcd-cluster-0 \
  --initial-cluster=etcd01=https://172.16.1.76:2380,etcd02=https://172.16.1.77:2380,etcd03=https://172.16.1.78:2380 \
  --initial-cluster-state=new \
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

### 3) 创建node所需unit文件
``` bash
# docker配置文件
echo "{
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}" > /root/k8s/node/daemon.json

# docker.service
cat > /root/k8s/node/service/docker.service <<EOF
[Unit]
Description=Docker Application Container Engine
Documentation=http://docs.docker.com
After=network-online.target docker.socket flannel.service
Wants=network-online.target
Requires=docker.socket

[Service]
Type=notify
NotifyAccess=all
KillMode=process
EnvironmentFile=/run/docker_opts.env
Environment=GOTRACEBACK=crash
Environment=DOCKER_HTTP_HOST_COMPAT=1
Environment=PATH=/usr/libexec/docker:/usr/bin:/usr/sbin
ExecStart=/usr/local/bin/dockerd \
  --exec-opt native.cgroupdriver=systemd \
  --config-file=/etc/docker/daemon.json \
  -H fd:// $DOCKER_OPTS
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=1048576
LimitNPROC=1048576
LimitCORE=infinity
TimeoutStartSec=0
Delegate=yes
Restart=on-failure
MountFlags=slave

[Install]
WantedBy=multi-user.target
EOF

# kubelet.service
cat > /root/k8s/node/service/kubelet.service <<EOF
[Unit]
Description=Kubernetes Kubelet
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=/var/lib/kubelet
ExecStart=/usr/local/bin/kubelet \
  --address=172.16.1.79 \
  --hostname-override=node01 \
  --pod-infra-container-image=k8s-registry.local/public/pod-infrastructure:sfv1 \
  --experimental-bootstrap-kubeconfig=/etc/kubernetes/ssl/bootstrap.kubeconfig \
  --kubeconfig=/etc/kubernetes/ssl/kubelet.kubeconfig \
  --cert-dir=/etc/kubernetes/ssl \
  --hairpin-mode promiscuous-bridge \
  --allow-privileged=true \
  --serialize-image-pulls=false \
  --logtostderr=true \
  --cgroup-driver=systemd \
  --cluster_dns=10.254.0.2 \
  --cluster_domain=cluster.local \
  --v=2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# flanneld.service
cat > /root/k8s/node/service/flanneld.service <<EOF
[Unit]
Description=Flanneld overlay address etcd agent
After=network.target
After=network-online.target
Wants=network-online.target
After=etcd.service
Before=docker.service

[Service]
Type=notify
ExecStart=/usr/local/bin/flanneld \
  -etcd-cafile=/etc/kubernetes/ssl/k8s-root-ca.pem \
  -etcd-certfile=/etc/kubernetes/ssl/kubernetes.pem \
  -etcd-keyfile=/etc/kubernetes/ssl/kubernetes-key.pem \
  -etcd-endpoints=https://172.16.1.76:2379,https://172.16.1.77:2379,https://172.16.1.78:2379 \
  -etcd-prefix=/kubernetes/network \
  -iface=eth1
ExecStartPost=/usr/libexec/flannel/mk-docker-opts.sh -c
Restart=on-failure

[Install]
WantedBy=multi-user.target
RequiredBy=docker.service
EOF
```

### 4) 下发systemd unit文件
``` bash
# 下发master unit文件
cp /root/k8s/master/service/* /usr/lib/systemd/system
for master in {master2,master3};do
  rsync -av /root/k8s/master/service/ ${master}:/usr/lib/systemd/system
done
#注意更改master里面的ip为各节点ip

# 下发node unit文件
for node in {node01,node02,node03};do
  rsync -av /root/k8s/node/service/ ${node}:/usr/lib/systemd/system
done
#注意更改node里面的ip为各节点ip

# 下发etcd unit文件
for etcd in {etcd1,etcd2,etcd3};do
  rsync -av /root/k8s/etcd/service/ ${etcd}:/usr/lib/systemd/system
done
#注意更改etcd里面的ip为各节点ip
```

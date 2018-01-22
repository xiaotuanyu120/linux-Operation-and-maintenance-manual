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
kubernetes|1.9.1|最新稳定版本
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
node01|172.16.1.101|flannel,docker,kubelet,kube-proxy|node 1
node02|172.16.1.102|flannel,docker,kubelet,kube-proxy|node 2
node03|172.16.1.103|flannel,docker,kubelet,kube-proxy|node 3

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
172.16.1.101  node01
172.16.1.102  node02
172.16.1.103  node03" >> /etc/hosts
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

---

## 2. kubernetes master节点
### 1) 配置kubernetes环境变量（master节点）
``` bash
echo 'export MASTER_IP=172.16.1.100
export SERVICE_CLUSTER_IP_RANGE=10.254.0.0/16
export CLUSTER_NAME=KubeTest
export PATH=$PATH:/usr/local/kubernetes/bin' > /etc/profile.d/kubernetes.sh
source /etc/profile.d/kubernetes.sh
```
> 规划集群中需要重复使用的内容为变量
- `MASTER_IP` - master的静态ip
- `SERVICE_CLUSTER_IP_RANGE` - service对象使用的ip范围
- `CLUSTER_NAME` - kubernetes集群的名称

<!--
``` bash
echo 'export MASTER_IP=172.16.1.100
export SERVICE_CLUSTER_IP_RANGE=10.254.0.0/16
export CLUSTER_NAME=KubeTest
export CA_CERT=/usr/local/kubernetes/security/ca.crt
export MASTER_CERT=/usr/local/kubernetes/security/server.crt
export MASTER_KEY=/usr/local/kubernetes/security/server.key
export KUBELET_CERT
export KUBELET_KEY
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
-->

### 2) 获取kubernetes（master节点）
kubernetes的二进制包里面包含了kubernetes的二进制文件和支持的etcd版本
``` bash
# 下载kubernetes
wget https://dl.k8s.io/v1.9.1/kubernetes-server-linux-amd64.tar.gz
tar zxvf kubernetes-server-linux-amd64.tar.gz

# 拷贝二进制文件到server端
mkdir -p /usr/local/kubernetes/{bin,security,conf}
cp kubernetes/server/bin/{kube-apiserver,kube-scheduler,kube-controller-manager,kubectl} /usr/local/kubernetes/bin/
chmod 750 /usr/local/kubernetes/bin/*
# 如果使用docker启动kube-apiserver,kube-scheduler,kube-controller-manager这三个服务的话，不需要拷贝它们的二进制文件，只需要拷贝kubectl即可

# 拷贝二进制文件到node端(提前做好ssh信任)
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node01:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node02:/usr/local/bin
scp kubernetes/server/bin/{kubelet,kube-proxy} root@node03:/usr/local/bin
```
> 因为kubernetes这个项目是使用go语言编写，而go语言程序的部署方式很简单，就是拷贝二进制文件就可以，所以在这里，我们通过简单的复制各服务的二进制文件，就可以通过启动它们来启动相应的服务。  

> 本文开头的参照文档中说:  
node需要运行的kubelet,kube-proxy,docker，推荐直接在系统层面上启动服务;  
而对于etcd, kube-apiserver, kube-controller-manager 和 kube-scheduler，推荐我们使用容器来运行它们，文档中给出了几种镜像的获取方式，当然，我们下载的二进制文件中也有这样的镜像文件（bin目录中tar结尾的文件）可以本地加载（使用docker load命令）镜像到本机的docker中。

### 3) 安全策略（master节点）
#### (1) 准备https安全证书
- 如果用http，安装简单，但需要使用防火墙去控制访问
- 如果用https，配置安全认证文件即可，推荐使用

生成的 CA 证书和秘钥文件如下：
- ca-key.pem
- ca.pem
- kubernetes-key.pem
- kubernetes.pem
- kube-proxy.pem
- kube-proxy-key.pem
- admin.pem
- admin-key.pem

使用证书的组件如下：
- etcd：使用 ca.pem、kubernetes-key.pem、kubernetes.pem；
- kube-apiserver：使用 ca.pem、kubernetes-key.pem、kubernetes.pem；
- kubelet：使用 ca.pem；
- kube-proxy：使用 ca.pem、kube-proxy-key.pem、kube-proxy.pem；
- kubectl：使用 ca.pem、admin-key.pem、admin.pem；
- kube-controller-manager：使用 ca-key.pem、ca.pem

安装cfssl
``` bash
curl -s -L -o /usr/local/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
curl -s -L -o /usr/local/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
curl -s -L -o /usr/local/bin/cfssl-certinfo https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64
chmod +x /usr/local/bin/*
export PATH=$PATH:/usr/local/bin
```

创建k8s-ssl目录
``` bash
mkdir ~/k8s-ssl
cd ~/k8s-ssl
```
> 此目录只是临时存放ca生成文件，可随意更换位置

创建 CA 证书签名请求
``` bash
cat > ca-csr.json << EOF
{
  "CN": "kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "System"
    }
  ]
}
EOF
```
> 字段说明  
"CN"：Common Name，kube-apiserver 从证书中提取该字段作为请求的用户名 (User Name)；浏览器使用该字段验证网站是否合法；  
"O"：Organization，kube-apiserver 从证书中提取该字段作为请求用户所属的组 (Group)；  

生成 CA 证书和私钥
``` bash
cfssl gencert -initca ca-csr.json | cfssljson -bare ca

ls ca*
ca-config.json  ca-csr.json  ca-key.pem  ca.csr  ca.pem
```

创建CA配置文件
``` bash
cat > ca-config.json <<EOF
{
  "signing": {
    "default": {
      "expiry": "87600h"
    },
    "profiles": {
      "kubernetes": {
        "usages": [
            "signing",
            "key encipherment",
            "server auth",
            "client auth"
        ],
        "expiry": "87600h"
      }
    }
  }
}
EOF
```
> 字段说明  
ca-config.json：可以定义多个 profiles，分别指定不同的过期时间、使用场景等参数；后续在签名证书时使用某个 profile；  
signing：表示该证书可用于签名其它证书；生成的 ca.pem 证书中 CA=TRUE；  
server auth：表示client可以用该 CA 对server提供的证书进行验证；  
client auth：表示server可以用该CA对client提供的证书进行验证；

创建 server 证书
``` bash
cat > server-csr.json << EOF
{
    "CN": "kubernetes",
    "hosts": [
      "127.0.0.1",
      "172.16.1.100",
      "172.16.1.101",
      "172.16.1.102",
      "172.16.1.103",
      "10.254.0.1",
      "kubernetes",
      "kubernetes.default",
      "kubernetes.default.svc",
      "kubernetes.default.svc.cluster",
      "kubernetes.default.svc.cluster.local"
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "BeiJing",
            "L": "BeiJing",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
> 如果 hosts 字段不为空则需要指定授权使用该证书的 IP 或域名列表，由于该证书后续被 etcd 集群和 kubernetes master 集群使用，所以上面分别指定了 etcd 集群、kubernetes master 集群的主机 IP 和 kubernetes 服务的服务 IP（一般是 kube-apiserver 指定的 service-cluster-ip-range 网段的第一个IP，如 10.254.0.1），另外还有kubenetes的集群节点ip[注](https://kubernetes.io/docs/concepts/cluster-administration/certificates/)。以上物理节点的IP也可以更换为主机名。

生成 kubernetes 证书和私钥
``` bash
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes server-csr.json | cfssljson -bare server

ls server*
server-csr.json  server-key.pem  server.csr  server.pem
```

创建 admin 证书
``` bash
cat > admin-csr.json << EOF
{
  "CN": "admin",
  "hosts": [],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "system:masters",
      "OU": "System"
    }
  ]
}
EOF
```
> 后续 kube-apiserver 使用 RBAC 对客户端(如 kubelet、kube-proxy、Pod)请求进行授权；  
kube-apiserver 预定义了一些 RBAC 使用的 RoleBindings，如 cluster-admin 将 Group system:masters 与 Role cluster-admin 绑定，该 Role 授予了调用kube-apiserver 的所有 API的权限；  
O 指定该证书的 Group 为 system:masters，kubelet 使用该证书访问 kube-apiserver 时 ，由于证书被 CA 签名，所以认证通过，同时由于证书用户组为经过预授权的 system:masters，所以被授予访问所有 API 的权限；  
注意：这个admin 证书，是将来生成管理员用的kube config 配置文件用的，现在我们一般建议使用RBAC 来对kubernetes 进行角色权限控制， kubernetes 将证书中的CN 字段 作为User， O 字段作为 Group（具体参考 Kubernetes中的用户与身份认证授权中 X509 Client Certs 一段）。

> 在搭建完 kubernetes 集群后，我们可以通过命令: kubectl get clusterrolebinding cluster-admin -o yaml ,查看到 clusterrolebinding cluster-admin 的 subjects 的 kind 是 Group，name 是 system:masters。 roleRef 对象是 ClusterRole cluster-admin。 意思是凡是 system:masters Group 的 user 或者 serviceAccount 都拥有 cluster-admin 的角色。 因此我们在使用 kubectl 命令时候，才拥有整个集群的管理权限。可以使用 kubectl get clusterrolebinding cluster-admin -o yaml 来查看。

生成 admin 证书和私钥：
``` bash
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes admin-csr.json | cfssljson -bare admin

ls admin*
admin-csr.json  admin-key.pem  admin.csr  admin.pem
```

创建 kube-proxy 证书
``` bash
cat > kube-proxy-csr.json << EOF
{
  "CN": "system:kube-proxy",
  "hosts": [],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
    {
      "C": "CN",
      "ST": "BeiJing",
      "L": "BeiJing",
      "O": "k8s",
      "OU": "System"
    }
  ]
}
EOF
```
> CN 指定该证书的 User 为 system:kube-proxy；  
kube-apiserver 预定义的 RoleBinding cluster-admin 将User system:kube-proxy 与 Role system:node-proxier 绑定，该 Role 授予了调用 kube-apiserver Proxy 相关 API 的权限；

生成 kube-proxy 客户端证书和私钥
``` bash
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes  kube-proxy-csr.json | cfssljson -bare kube-proxy

ls kube-proxy*
kube-proxy-csr.json  kube-proxy-key.pem  kube-proxy.csr  kube-proxy.pem
```

校验证书
``` bash
cfssl-certinfo -cert server.pem
{
  "subject": {
    "common_name": "kubernetes",
    "country": "CN",
    "organization": "k8s",
    "organizational_unit": "System",
    "locality": "BeiJing",
    "province": "BeiJing",
    "names": [
      "CN",
      "BeiJing",
      "BeiJing",
      "k8s",
      "System",
      "kubernetes"
    ]
  },
  "issuer": {
    "common_name": "kubernetes",
    "country": "CN",
    "organization": "k8s",
    "organizational_unit": "System",
    "locality": "BeiJing",
    "province": "BeiJing",
    "names": [
      "CN",
      "BeiJing",
      "BeiJing",
      "k8s",
      "System",
      "kubernetes"
    ]
  },
  "serial_number": "424094439737352687284679460316316317005227399373",
  "sans": [
    "kubernetes",
    "kubernetes.default",
    "kubernetes.default.svc",
    "kubernetes.default.svc.cluster",
    "kubernetes.default.svc.cluster.local",
    "127.0.0.1",
    "172.16.1.100",
    "172.16.1.101",
    "172.16.1.102",
    "172.16.1.103",
    "10.254.0.1"
  ],
  "not_before": "2018-01-20T14:21:00Z",
  "not_after": "2028-01-18T14:21:00Z",
  "sigalg": "SHA256WithRSA",
  "authority_key_id": "93:B8:B7:BB:D1:1B:8A:C4:BA:6F:C2:E3:5C:EA:1E:1:66:D6:3F:B4",
  "subject_key_id": "73:B4:8:D8:2A:E7:B2:5B:15:F1:26:DE:6C:26:1:F2:AB:CB:D1:5D",
  "pem": "-----BEGIN CERTIFICATE-----证书内容-----END CERTIFICATE-----\n"
}
```

拷贝证书到指定位置
``` bash
cp *.pem /usr/local/kubernetes/security
```
> 路径可以随意指定，只要上下文中一致即可

> [使用cfssl生成认证文件的文档](https://jimmysong.io/kubernetes-handbook/practice/create-tls-and-secret-key.html)

#### 2) 创建 kubeconfig 文件

kubelet、kube-proxy 等 Node 机器上的进程与 Master 机器的 kube-apiserver 进程通信时需要认证和授权；

kubernetes 1.4 开始支持由 kube-apiserver 为客户端生成 TLS 证书的 [TLS Bootstrapping](https://kubernetes.io/docs/admin/kubelet-tls-bootstrapping/) 功能，这样就不需要为每个客户端生成证书了；该功能当前仅支持为 kubelet 生成证书；

以下操作只需要在master节点上执行，生成的*.kubeconfig文件可以直接拷贝到node节点的/etc/kubernetes目录下。

**创建 TLS Bootstrapping Token**

Token auth file

创建k8s-config目录
``` bash
mkdir -p ~/k8s-config
cd ~/k8s-config
```
Token可以是任意的包涵128 bit的字符串，可以使用安全的随机数发生器生成。
``` bash
export BOOTSTRAP_TOKEN=$(head -c 16 /dev/urandom | od -An -t x | tr -d ' ')
cat > token.csv <<EOF
${BOOTSTRAP_TOKEN},kubelet-bootstrap,10001,"system:kubelet-bootstrap"
EOF

cat token.csv
aa0ed3c0a...4910c61a9f1,kubelet-bootstrap,10001,"system:kubelet-bootstrap"
```
> 注意：在进行后续操作前请检查 token.csv 文件，确认其中的 ${BOOTSTRAP_TOKEN} 环境变量已经被真实的值替换。

> `BOOTSTRAP_TOKEN` 将被写入到 kube-apiserver 使用的 token.csv 文件和 kubelet 使用的 bootstrap.kubeconfig 文件，如果后续重新生成了 BOOTSTRAP_TOKEN，则需要：
> - 更新 token.csv 文件，分发到所有机器 (master 和 node），分发到node节点上非必需；
- 重新生成 bootstrap.kubeconfig 文件，分发到所有 node 机器；
- 重启 kube-apiserver 和 kubelet 进程；
- 重新 approve kubelet 的 csr 请求；

``` bash
cp token.csv /usr/local/kubernetes/
```

**创建 kubelet bootstrapping kubeconfig 文件**
``` bash
cd /usr/local/kubernetes
export KUBE_APISERVER="https://127.0.0.1:6443"

# 设置集群参数
kubectl config set-cluster KubeTest \
  --certificate-authority=/usr/local/kubernetes/security/ca.pem \
  --embed-certs=true \
  --server=${KUBE_APISERVER} \
  --kubeconfig=bootstrap.kubeconfig

cat bootstrap.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []

# 设置客户端认证参数
kubectl config set-credentials kubelet-bootstrap \
  --token=${BOOTSTRAP_TOKEN} \
  --kubeconfig=bootstrap.kubeconfig

cat bootstrap.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts: []
current-context: ""
kind: Config
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    as-user-extra: {}
    token: aa0ed3c0acc4cfc30a2cd4910c61a9f1

# 设置上下文参数
kubectl config set-context default \
  --cluster=KubeTest \
  --user=kubelet-bootstrap \
  --kubeconfig=bootstrap.kubeconfig

cat bootstrap.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts:
- context:
    cluster: KubeTest
    user: kubelet-bootstrap
  name: default
current-context: ""
kind: Config
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    as-user-extra: {}
    token: aa0ed3c0acc4cfc30a2cd4910c61a9f1

# 设置默认上下文
kubectl config use-context default --kubeconfig=bootstrap.kubeconfig

cat bootstrap.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts:
- context:
    cluster: KubeTest
    user: kubelet-bootstrap
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    as-user-extra: {}
    token: aa0ed3c0acc4cfc30a2cd4910c61a9f1
```
> `--embed-certs` 为 true 时表示将 certificate-authority 证书写入到生成的 bootstrap.kubeconfig 文件中；  
设置客户端认证参数时没有指定秘钥和证书，后续由 kube-apiserver 自动生成；

**创建 kube-proxy kubeconfig 文件**
``` bash
# 设置集群参数
kubectl config set-cluster KubeTest \
  --certificate-authority=/usr/local/kubernetes/security/ca.pem \
  --embed-certs=true \
  --server=${KUBE_APISERVER} \
  --kubeconfig=kube-proxy.kubeconfig

cat kube-proxy.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []

# 设置客户端认证参数
kubectl config set-credentials kube-proxy \
  --client-certificate=/usr/local/kubernetes/security/kube-proxy.pem \
  --client-key=/usr/local/kubernetes/security/kube-proxy-key.pem \
  --embed-certs=true \
  --kubeconfig=kube-proxy.kubeconfig

cat kube-proxy.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts: []
current-context: ""
kind: Config
preferences: {}
users:
- name: kube-proxy
  user:
    as-user-extra: {}
    client-certificate-data: LS0t...LQo=
    client-key-data: LS0t...Cg==

# 设置上下文参数
kubectl config set-context default \
  --cluster=KubeTest \
  --user=kube-proxy \
  --kubeconfig=kube-proxy.kubeconfig

cat kube-proxy.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts:
- context:
    cluster: KubeTest
    user: kube-proxy
  name: default
current-context: ""
kind: Config
preferences: {}
users:
- name: kube-proxy
  user:
    as-user-extra: {}
    client-certificate-data: LS0t...LQo=
    client-key-data: LS0t...Cg==

# 设置默认上下文
kubectl config use-context default --kubeconfig=kube-proxy.kubeconfig
cat kube-proxy.kubeconfig
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0t...LS0K
    server: https://127.0.0.1:6443
  name: KubeTest
contexts:
- context:
    cluster: KubeTest
    user: kube-proxy
  name: default
current-context: "default"
kind: Config
preferences: {}
users:
- name: kube-proxy
  user:
    as-user-extra: {}
    client-certificate-data: LS0t...LQo=
    client-key-data: LS0t...Cg==
```
> 设置集群参数和客户端认证参数时 --embed-certs 都为 true，这会将 certificate-authority、client-certificate 和 client-key 指向的证书文件内容写入到生成的 kube-proxy.kubeconfig 文件中；  
kube-proxy.pem 证书中 CN 为 system:kube-proxy，kube-apiserver 预定义的 RoleBinding cluster-admin 将User system:kube-proxy 与 Role system:node-proxier 绑定，该 Role 授予了调用 kube-apiserver Proxy 相关 API 的权限；

**分发 kubeconfig 文件**
将两个 kubeconfig 文件分发到所有 Node 机器
``` bash
cp bootstrap.kubeconfig kube-proxy.kubeconfig /usr/local/kubernetes/conf
```

---

### 3). 配置和安装kubernetes master服务

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
# KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"
KUBE_ADMISSION_CONTROL=""

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
> [错误: No API token found for service account "default", retry after the token](https://github.com/kubernetes/kubernetes/issues/33714)，解决办法是配置`KUBE_ADMISSION_CONTROL=""`禁用`KUBE_ADMISSION_CONTROL`

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

mkdir /usr/lib/systemd/system/kube-apiserver.service.d
echo '[Service]
PermissionsStartOnly=yes
ExecStartPre=/usr/bin/mkdir -p /var/run/kubernetes
ExecStartPre=/usr/bin/chown kube.kube /var/run/kubernetes' > /usr/lib/systemd/system/kube-apiserver.service.d/pre-start.conf

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

systemctl enable kube-apiserver.service
systemctl enable kube-controller-manager.service
systemctl enable kube-scheduler.service
systemctl start kube-apiserver.service
systemctl start kube-controller-manager.service
systemctl start kube-scheduler.service
```

---

## 3. node节点配置和安装基本软件
### 1) 部署flannel(node节点)
``` bash
# 下载flannel
FLANNEL_VER=v0.9.1
wget https://github.com/coreos/flannel/releases/download/v0.9.1/flannel-${FLANNEL_VER}-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-${FLANNEL_VER}-linux-amd64.tar.gz -C flannel
cp flannel/flanneld /usr/local/bin
mkdir -p /usr/libexec/flannel
cp flannel/mk-docker-opts.sh /usr/libexec/flannel/

# 准备flannel配置文件
## !!重点!! ##
# -iface，根据实际情况设定
# FLANNELD_PUBLIC_IP，每个节点不同
#############
cat > /etc/sysconfig/flanneld << EOF
FLANNELD_PUBLIC_IP="172.16.1.101"
FLANNELD_ETCD_ENDPOINTS="http://172.16.1.100:2379"
FLANNELD_ETCD_PREFIX="/kube-centos/network"
# Any additional options that you want to pass
FLANNELD_OPTIONS="-iface=eth1"
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
> 每个节点的flannel需要根据自己情况来填写配置文件

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
ExecStart=/usr/local/bin/dockerd -H fd:// $DOCKER_OPTS
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

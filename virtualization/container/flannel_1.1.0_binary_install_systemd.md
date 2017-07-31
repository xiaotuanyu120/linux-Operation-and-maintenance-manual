---
title: flannel 1.1.0 二进制安装（systemd）
date: 2017-07-31 13:49:00
categories: virtualization/container
tags: [flannel,docker,etcd]
---
### flannel 1.1.0 二进制安装（systemd）

---

### 1. 安装etcd
这里仅启动单节点的etcd，并且使用最简单快捷的手动命令启动方式，为的是快速的测试flannel，详细的etcd集群的搭建参照[这篇文档](http://linux.xiao5tech.com/virtualization/container/etcd_1.3.0_discovery_systemd.html)
``` bash
# 下载etcd
wget https://github.com/coreos/etcd/releases/download/v3.2.4/etcd-v3.2.4-linux-amd64.tar.gz
tar zxvf etcd-v3.2.4-linux-amd64.tar.gz

# 启动etcd服务
./etcd-v3.2.4-linux-amd64/etcd &

# 写入flannel配置
./etcd-v3.2.4-linux-amd64/etcdctl set /kube-centos/network/config '{ "Network": "10.5.0.0/16", "Backend": {"Type": "vxlan"}}'
```
> 这里的etcd仅会监听127.0.0.1 2379和2380端口，如果需要指定监听的ip和端口，参照上面的etcd文档链接

---

### 2. 安装配置flannel
``` bash
wget https://github.com/coreos/flannel/releases/download/v0.8.0/flannel-v0.8.0-linux-amd64.tar.gz
mkdir flannel
tar zxvf flannel-v0.8.0-linux-amd64.tar.gz -C flannel
cp flannel/flanneld /usr/bin
mkdir -p /usr/libexec/flannel
cp flannel/mk-docker-opts.sh /usr/libexec/flannel/

cat > /etc/sysconfig/flanneld << EOF
FLANNELD_ETCD_ENDPOINTS="http://127.0.0.1:2379"
FLANNELD_ETCD_PREFIX="/kube-centos/network"
# Any additional options that you want to pass
FLANNELD_OPTIONS=""
EOF
```
> `/etc/sysconfig/flanneld`会在systemd unit file中被用作环境变量文件  

> 此配置文件中`FLANNEL_ETCD_ENDPOINTS`配置了储存flannel配置的链接，`FLANNEL_ETCD_PREFIX`配置了存储flannel配置的前缀，而`FLANNEL_OPTIONS`配置了传入systemd unit file中的自定义选项，详细flannel选项见[coreos官方说明](https://github.com/coreos/flannel/blob/master/Documentation/configuration.md)。

> 关键环境变量的名称，规则见[coreos关于flannel配置中的environment-variables说明。](https://github.com/coreos/flannel/blob/master/Documentation/configuration.md#environment-variables)
例如--etcd-endpoints转换为FLANNEL_ETCD_ENDPOINTS

---

### 3. 启动flannel（systemd）
``` bash
# 创建systemd unit file
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

# 可选，如果开启了selinux，需要执行此命令
chcon -u system_u /usr/lib/systemd/system/flannel.service

# 启动flannel
systemctl daemon-reload
systemctl start flannel

# 启动flannel发生了什么？
# 首先生成了每个节点不同的flannel网络配置文件
cat /var/run/flannel/subnet.env
FLANNEL_NETWORK=10.5.0.0/16
FLANNEL_SUBNET=10.5.56.1/24
FLANNEL_MTU=1450
FLANNEL_IPMASQ=false
# 而且还增加了一个flannel.1的interface
ip a |grep flannel -A 5
5: flannel.1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue state UNKNOWN
    link/ether 9e:de:7e:36:74:cb brd ff:ff:ff:ff:ff:ff
    inet 10.5.56.0/32 scope global flannel.1
       valid_lft forever preferred_lft forever
    inet6 fe80::9cde:7eff:fe36:74cb/64 scope link
       valid_lft forever preferred_lft forever

# 然后根据上面的配置文件通过mk-docker-opts.sh脚本生成docker使用的配置文件
cat /run/docker_opts.env
DOCKER_OPTS=" --bip=10.5.56.1/24 --ip-masq=true --mtu=1450"
```
> `ExecStartPost=/usr/libexec/flannel/mk-docker-opts.sh -c`这个配置是在flannel启动之后生成docker的配置文件，默认在/run/docker_opts.env  
```
OPTIONS:
	-f	Path to flannel env file. Defaults to /run/flannel/subnet.env
	-d	Path to Docker env file to write to. Defaults to /run/docker_opts.env
	-i	Output each Docker option as individual var. e.g. DOCKER_OPT_MTU=1500
	-c	Output combined Docker options into DOCKER_OPTS var
	-k	Set the combined options key to this value (default DOCKER_OPTS=)
	-m	Do not output --ip-masq (useful for older Docker version)
```

---

### 4. 启动docker
#### 1) 安装docker（可选）
如果之前没有安装docker服务，可以参照[yum安装docker](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)或[二进制文件安装docker](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.1_installation_binary.html)

#### 2) 重启docker服务
``` bash
# 修改docker的systemd unit file，进行如下修改
vim /usr/lib/systemd/system/docker.service
*************************************************
# 增加新的配置文件
EnvironmentFile=/run/docker_opts.env
# 修改启动命令，增加$DOCKER_OPTS
ExecStart=/usr/bin/dockerd $DOCKER_OPTS
*************************************************

systemctl daemon-reload
systemctl restart docker
```
> `EnvironmentFile`指定的是上面我们使用mk-docker-opts.sh脚本生成的docker网络配置文件  
`$DOCKER_OPTS`指的是/run/docker_opts.env中的对应变量

#### 3) 查看网络情况
``` bash
ip a show flannel.1
5: flannel.1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue state UNKNOWN
    link/ether 9e:de:7e:36:74:cb brd ff:ff:ff:ff:ff:ff
    inet 10.5.56.0/32 scope global flannel.1
       valid_lft forever preferred_lft forever
    inet6 fe80::9cde:7eff:fe36:74cb/64 scope link
       valid_lft forever preferred_lft forever

ip a show docker0
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN
   link/ether 02:42:b5:cf:de:e2 brd ff:ff:ff:ff:ff:ff
   inet 10.5.56.1/24 scope global docker0
      valid_lft forever preferred_lft forever
```
> 此时docker0就已经在flannel.1的网段里面了

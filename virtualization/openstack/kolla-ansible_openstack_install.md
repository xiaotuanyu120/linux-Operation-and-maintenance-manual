---
title:
date: 2017-04-19 16:21:00
categories: virtualization/openstack
tags: [openstack,ansible,kolla,container,docker]
---
###

---

### 0. 环境
OS:centos 7.2
虚拟机软件：vagrant+virtualbox
文档：https://docs.openstack.org/project-deploy-guide/kolla-ansible/ocata/quickstart.html
主机最低需求：
- 2个网卡
- 8G内存
- 40G硬盘

---

### 1. 环境准备
#### 1) 网卡
检查网卡必须有两个以上

#### 2) 安装依赖包
默认的系统安装库中的软件可能已经过时，默认需要满足以下条件
stable/mitaka分支对依赖包版本的需求:

Component|Min Version|Max Version|Comment
---|---|---|---
Ansible|1.9.4|<2.0.0|On deployment host
Docker|1.10.0|none|On target nodes
Docker Python|1.6.0|none|On target nodes
Python Jinja2|2.6.0|none|On deployment host

stable/newton分支对依赖包版本的需求:

Component|Min Version|Max Version|Comment
---|---|---|---
Ansible|2.0.0|none|On deployment host
Docker|1.10.0|none|On target nodes
Docker Python|1.6.0|none|On target nodes
Python Jinja2|2.8.0|none|On deployment host

1. 安装pip
``` bash
yum install epel-release
yum install python-pip
pip install -U pip
yum install python-devel libffi-devel gcc openssl-devel
```

2. 安装ansible
``` bash
yum install ansible
```

3. 安装docker
推荐安装官方的docker，不要yum安装，版本必须要大于1.10.0，不等于1.13.0
``` bash
# 1. 安装docker
curl -sSL https://get.docker.io | bash
# 检查版本
docker --version

# 2. 配置docker的systemd unit
# 配置dcoker的systemd unit，如果MountFlags选项配置错误，kolla-ansible部署neutron-dhcp-agent的时候会出错
# Create the drop-in unit directory for docker.service
mkdir -p /etc/systemd/system/docker.service.d

# Create the drop-in unit file
tee /etc/systemd/system/docker.service.d/kolla.conf <<-'EOF'
[Service]
MountFlags=shared
EOF

# 3. 重启docker
systemctl daemon-reload
systemctl restart docker

# 4. 安装docker python的库
yum install python-docker-py
```

4. 时间同步
openstack，rabbitMQ和ceph需要所有的主机时间同步来确保正确的消息通信，拿ceph来说，如果主机之间时间差了0.05秒以上，ceph就会不爽了。这种情况下，特别需要安装时间同步服务ntpd
``` bash
yum install ntp
systemctl enable ntpd.service
systemctl start ntpd.service
```

5. disable libvirt
libvirt默认在许多linux发行版上启动，需要在所有的目标主机上禁用它，因为同时只有一个libvirt可以运行
``` bash
systemctl stop libvirtd.service
systemctl disable libvirtd.service
```

#### 3) 安装kolla
``` bash
# 1. 安装kolla and kolla-ansible
pip install kolla
pip install kolla-ansible
# 2. 拷贝配置文件
cp -r /usr/share/kolla-ansible/etc_examples/kolla /etc/kolla/
# 3. 拷贝inventory文件到当前目录
cp /usr/share/kolla-ansible/ansible/inventory/* .
```
> 单点安装无需配置local registry，多点需要安装

#### 4) 配置自动主机引导
``` bash
vi /etc/kolla/globals.yml
**************************************
network_interface: "enp0s8"
neutron_external_interface: "enp0s9"
**************************************
# 网卡名称需要配置你自己的

# 自动填充密码给/etc/kolla/passwords.yml
kolla-genpwd

# kolla-ansible部署
kolla-ansible -i all-in-one bootstrap-servers
```

#### 5) build container imagtes
``` bash
# 配置mtu
vi /etc/systemd/system/docker.service.d/kolla.conf
**************************************
[Service]
MountFlags=shared
ExecStart=
ExecStart=/usr/bin/docker daemon \
 -H fd:// \
 --mtu 1400
**************************************
# 增加了mtu配置之后，docker服务无法启动，这步跳过了

# 重启docker
systemctl daemon-reload
systemctl restart docker

# pull docker images
kolla-ansible pull
docker images
docker images
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
kolla/centos-binary-neutron-server              4.0.0               8dedaf87d819        4 weeks ago         727MB
kolla/centos-binary-nova-compute                4.0.0               35da27fc5586        4 weeks ago         1.23GB
kolla/centos-binary-neutron-openvswitch-agent   4.0.0               d276dcdfcbb6        4 weeks ago         727MB
kolla/centos-binary-neutron-metadata-agent      4.0.0               e1c0bf5f7745        4 weeks ago         703MB
kolla/centos-binary-heat-api                    4.0.0               66332a0e6ad4        4 weeks ago         644MB
kolla/centos-binary-neutron-dhcp-agent          4.0.0               445442cd0f01        4 weeks ago         703MB
kolla/centos-binary-neutron-l3-agent            4.0.0               445442cd0f01        4 weeks ago         703MB
kolla/centos-binary-heat-api-cfn                4.0.0               ce92766d3ff1        4 weeks ago         644MB
kolla/centos-binary-nova-ssh                    4.0.0               3b0f5591ecc8        4 weeks ago         723MB
kolla/centos-binary-nova-placement-api          4.0.0               8a16c227e835        4 weeks ago         755MB
kolla/centos-binary-nova-conductor              4.0.0               65a844b9889e        4 weeks ago         703MB
kolla/centos-binary-nova-api                    4.0.0               d90b06229654        4 weeks ago         755MB
kolla/centos-binary-nova-consoleauth            4.0.0               487d0b6926d3        4 weeks ago         704MB
kolla/centos-binary-nova-scheduler              4.0.0               92bdcfc854ac        4 weeks ago         703MB
kolla/centos-binary-nova-novncproxy             4.0.0               7f246ab0d8f5        4 weeks ago         704MB
kolla/centos-binary-kolla-toolbox               4.0.0               d771b993a59b        4 weeks ago         730MB
kolla/centos-binary-keystone                    4.0.0               9b0c48681973        4 weeks ago         677MB
kolla/centos-binary-glance-registry             4.0.0               68da81d330c4        4 weeks ago         757MB
kolla/centos-binary-horizon                     4.0.0               dc5a666631eb        4 weeks ago         863MB
kolla/centos-binary-haproxy                     4.0.0               420fb3e8ce55        4 weeks ago         439MB
kolla/centos-binary-cron                        4.0.0               74a89fe112f0        4 weeks ago         418MB
kolla/centos-binary-openvswitch-db-server       4.0.0               37f21379cad8        4 weeks ago         440MB
kolla/centos-binary-heat-engine                 4.0.0               ab9138c4719c        4 weeks ago         644MB
kolla/centos-binary-glance-api                  4.0.0               bc61de7fba03        4 weeks ago         816MB
kolla/centos-binary-fluentd                     4.0.0               5b98e39f1285        4 weeks ago         720MB
kolla/centos-binary-nova-libvirt                4.0.0               b21c5bacfbcf        4 weeks ago         966MB
kolla/centos-binary-openvswitch-vswitchd        4.0.0               b047dd6e83cd        4 weeks ago         440MB
kolla/centos-binary-memcached                   4.0.0               927246be7bd2        4 weeks ago         418MB
kolla/centos-binary-rabbitmq                    4.0.0               c9e9af5a39b9        4 weeks ago         477MB
kolla/centos-binary-mariadb                     4.0.0               7c9305397257        4 weeks ago         808MB
kolla/centos-binary-keepalived                  4.0.0               b8fb9f966ac4        4 weeks ago         423MB

kolla-build
```
> 此处一直build不成功，网查有两个解决方案
1. 重试多次，因为是从网上获取docker的镜像，可能由于网络问题导致build不成功(但是我多次尝试均未成功)
2. 可以直接网上自己下载完整镜像包，然后导入本地(未来得及测试)

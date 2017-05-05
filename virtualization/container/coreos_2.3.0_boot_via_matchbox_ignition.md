---
title: coreos 2.3.0 ignition+matchbox安装coreos集群
date: 2017-04-27 10:42:00
categories: virtualization/container
tags: [container,docker,coreos,flannel]
---
### 0. 环境及文档
实验目的是搭建多节点的coreos，教程是baremetal，这里使用vagrant+virtualbox虚拟机模拟baremetal

items|name
---|---
虚拟机|virtualbox
虚拟机管理工具|vagrant
OS|coreos

安装大体上是按照[参考文档](https://coreos.com/matchbox/docs/latest/getting-started.html)，但是根据我自己的环境进行了相应调整。

---

### 0. 安装准备与介绍
1. coreos版本需要大于等于CoreOS version 962.0.0
2. 此教程使用flannel来管理pod网络(当然，也可以使用calico)
3. 使用matchbox来启动和配置coreos集群

---

### 1. 安装matchbox
#### 1) 安装provisioner主机(CoreOS for matchbox use)
安装过程参照[CoreOS+vagrant安装教程](http://linux.xiao5tech.com/virtualization/container/coreos_1.2.0_vagrant_install.html)
> 默认对core用户做了sshkey认证，可以将pub key拷贝到root下，以下操作都是使用root操作

#### 2) matchbox安装配置
``` bash
# 下载
wget https://github.com/coreos/matchbox/releases/download/v0.6.0/matchbox-v0.6.0-linux-amd64.tar.gz

# 解包
tar zxvf matchbox-v0.6.0-linux-amd64.tar.gz

# 拷贝systemcd unit文件去系统
cd matchbox-v0.6.0-linux-amd64
cp contrib/systemd/matchbox-on-coreos.service /etc/systemd/system/matchbox.service
# 文件的内容如下
# ***********************************************************
# [Unit]
# Description=CoreOS matchbox Server
# Documentation=https://github.com/coreos/matchbox
#
# [Service]
# Environment="IMAGE=quay.io/coreos/matchbox"
# Environment="VERSION=v0.6.0"
# Environment="MATCHBOX_ADDRESS=0.0.0.0:8080"
# ExecStartPre=/usr/bin/mkdir -p /etc/matchbox
# ExecStartPre=/usr/bin/mkdir -p /var/lib/matchbox/assets
# ExecStart=/usr/bin/rkt run \
#   --net=host \
#   --inherit-env \
#   --trust-keys-from-https \
#   --mount volume=data,target=/var/lib/matchbox \
#   --mount volume=config,target=/etc/matchbox \
#   --volume data,kind=host,source=/var/lib/matchbox \
#   --volume config,kind=host,source=/etc/matchbox \
#   ${IMAGE}:${VERSION}
#
# [Install]
# WantedBy=multi-user.target
# ***********************************************************
#
# 这里我们只使用http提供服务，其实还可以通过gRPC提供服务，那个需要配置证书，详情可见上面的教程链接

# 自定义systemd units，增加gRPC协议
mkdir /etc/systemd/system/matchbox.service.d
vim /etc/systemd/system/matchbox.service.d/override.conf
***********************************************************
[Service]
Environment="MATCHBOX_ADDRESS=0.0.0.0:8080"
Environment="MATCHBOX_RPC_ADDRESS=0.0.0.0:8081"
***********************************************************
cd scripts/tls/
export SAN=DNS.1:matchbox.example.com,IP.1:172.17.8.101
./cert-gen
mkdir -p /etc/matchbox
cp ca.crt server.crt server.key /etc/matchbox

# 启动服务
sudo systemctl daemon-reload
sudo systemctl start matchbox
sudo systemctl enable matchbox
```

#### 3) 下载coreos镜像
下载coreos镜像，之后pxe安装的时候能快些
``` bash
# 下载最新的stable版本
cd /root/matchbox-v0.6.0-linux-amd64
./scripts/get-coreos stable 1353.7.0 .
# 别忘记最后的"."

# 拷贝coreos到/var/lib/matchbox/assets
cp -r coreos /var/lib/matchbox/assets
# 检测服务
curl http://172.17.8.101:8080/assets/coreos/1353.7.0/
<pre>
<a href="CoreOS_Image_Signing_Key.asc">CoreOS_Image_Signing_Key.asc</a>
<a href="coreos_production_image.bin.bz2">coreos_production_image.bin.bz2</a>
<a href="coreos_production_image.bin.bz2.sig">coreos_production_image.bin.bz2.sig</a>
<a href="coreos_production_pxe.vmlinuz">coreos_production_pxe.vmlinuz</a>
<a href="coreos_production_pxe.vmlinuz.sig">coreos_production_pxe.vmlinuz.sig</a>
<a href="coreos_production_pxe_image.cpio.gz">coreos_production_pxe_image.cpio.gz</a>
<a href="coreos_production_pxe_image.cpio.gz.sig">coreos_production_pxe_image.cpio.gz.sig</a>
</pre>
```

#### 4) 配置DHCP,TFTP和DNS
coreos提供dnsmasq这样一个镜像来提供DHCP,TFTP和DNS服务，可以使用rkt或者docker启动这个镜像
``` bash
# 使用rkt
sudo rkt run --net=host quay.io/coreos/dnsmasq \
  --caps-retain=CAP_NET_ADMIN,CAP_NET_BIND_SERVICE,CAP_SETGID,CAP_SETUID,CAP_NET_RAW \
  -- -d -q \
  --dhcp-range=172.17.8.102,172.17.8.110 \
  --enable-tftp \
  --tftp-root=/var/lib/tftpboot \
  --dhcp-userclass=set:ipxe,iPXE \
  --dhcp-boot=tag:#ipxe,undionly.kpxe \
  --dhcp-boot=tag:ipxe,http://172.17.8.101:8080/boot.ipxe \
  --address=/matchbox.example.com/172.17.8.101 \
  --log-queries \
  --log-dhcp

# 或者使用docker
docker run --rm --cap-add=NET_ADMIN --net=host quay.io/coreos/dnsmasq \
  -d -q \
  --dhcp-range=172.17.8.102,172.17.8.110 \
  --enable-tftp --tftp-root=/var/lib/tftpboot \
  --dhcp-userclass=set:ipxe,iPXE \
  --dhcp-boot=tag:#ipxe,undionly.kpxe \
  --dhcp-boot=tag:ipxe,http://172.17.8.101:8080/boot.ipxe \
  --address=/matchbox.example/172.17.8.101 \
  --log-queries \
  --log-dhcp
```
> 参考链接：  
https://github.com/coreos/matchbox/tree/master/contrib/dnsmasq

---

### 3. terraform
#### 1) 安装terraform
``` bash
wget https://releases.hashicorp.com/terraform/0.9.4/terraform_0.9.4_linux_amd64.zip
unzip terraform_0.9.4_linux_amd64.zip
./terraform version
Terraform v0.9.4

wget https://github.com/coreos/terraform-provider-matchbox/releases/download/v0.1.0/terraform-provider-matchbox-v0.1.0-linux-amd64.tar.gz
tar zxvf terraform-provider-matchbox-v0.1.0-linux-amd64.tar.gz

vim ~/.terraformrc
**********************************************************
providers {
  matchbox = "/root/terraform-provider-matchbox-v0.1.0-linux-amd64/terraform-provider-matchbox"
}
**********************************************************
```

#### 2) 使用terraform提供matchbox资源
``` bash
mkdir ~/.matchbox
cp ~/matchbox-v0.6.0-linux-amd64/scripts/tls/ca.crt ~/.matchbox/
cp ~/matchbox-v0.6.0-linux-amd64/scripts/tls/client.crt ~/.matchbox/
cp ~/matchbox-v0.6.0-linux-amd64/scripts/tls/client.key ~/.matchbox/

git clone https://github.com/coreos/matchbox.git
cd matchbox/examples/terraform
cd simple-install
cp terraform.tfvars.example terraform.tfvars

vim terraform.tfvars
**********************************************************
matchbox_http_endpoint = "http://172.17.8.101:8080"
matchbox_rpc_endpoint = "172.17.8.101:8081"
ssh_authorized_key = "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAv7 ... == root@myvagrant"
**********************************************************

vim profiles.tf
**********************************************************
// Create a CoreOS-install profile
resource "matchbox_profile" "coreos-install" {
  name = "coreos-install"
  kernel = "http://172.17.8.101:8080/assets/coreos/1353.7.0/coreos_production_pxe.vmlinuz"
  initrd = [
    "http://172.17.8.101:8080/assets/coreos/1353.7.0/coreos_production_pxe_image.cpio.gz"
  ]
  args = [
    "coreos.config.url=${var.matchbox_http_endpoint}/ignition?uuid=$${uuid}&mac=$${mac:hexhyp}",
    "coreos.first_boot=yes",
    "console=tty0",
    "console=ttyS0",
  ]
  container_linux_config = "${file("./cl/coreos-install.yaml.tmpl")}"
}

// Create a simple profile which just sets an SSH authorized_key
resource "matchbox_profile" "simple" {
  name = "simple"
  container_linux_config = "${file("./cl/simple.yaml.tmpl")}"
}
**********************************************************

~/terraform plan
~/terraform apply
```

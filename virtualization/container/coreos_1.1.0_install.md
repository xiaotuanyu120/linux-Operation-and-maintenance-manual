---
title: coreos 1.1.0 系统安装-bare metal
date: 2017-03-19 21:26:00
categories: virtualization/container
tags: [container,coreos]
---
### coreos 1.1.0 系统安装-bare metal

---

### 0. 参考文档
[coreos官方安装文档](https://coreos.com/os/docs/latest/installing-to-disk.html)
[cloud-config官方说明文档](https://coreos.com/os/docs/1353.0.0/cloud-config.html)

---

### 1. 裸机(bare metal)的安装方式
#### 1) 下载ISO镜像
https://coreos.com/os/docs/latest/booting-with-iso.html

#### 2) SSH到coreos的livecd(选做)
这里我使用的是虚拟机，为了后面配置更方便，所以需要打开ssh连接，而coreos默认是禁止root登陆的，所以需要去配置一下
``` bash
# 切换到root用户，去到ssh配置目录
sudo su
cd /etc/ssh

# 这里是无法编辑sshd_config文件的，因为该文件是/usr/share/ssh/sshd_config的软连接
# 因为源文件不可写，所以我们需要重新创建一个配置文件
mv sshd_config sshd_config.bak
cat sshd_config.bak > sshd_config
vim sshd_config
*******************************************************
# 增加root登陆的配置
PermitRootLogin yes
*******************************************************

# 重启sshd服务
systemctl restart sshd

# 给root配置一个密码
sudo passwd root

# 查看当前ip地址，然后使用它ssh进来
ip a
# 如果你使用的是nat的网卡方式的话，需要设置端口转发才可以ssh进来
```

#### 3) 获取安装脚本
``` bash
wget https://raw.githubusercontent.com/coreos/init/master/bin/coreos-install
```

#### 4) 配置cloud-config
``` bash
# 1. 首先，创建一个key，用来后期访问你的coreos
# 确保你生成后此密钥对你会持久化保存下来
# coreos livecd中生成的key会随着重启丢失掉，所以推荐在你的linux或mac系统中生成它
ssh-keygen -t rsa -b 1024
# 此时我们就可以通过cat你生成的~/.ssh/id_rsa.pub，然后将公玥内容配置到cloud-config中
# 来达到我们装完coreos系统，然后可以直接使用key访问的目的

# 2. 因为coreos使用etcd服务，而推荐的etcd部署方式是集群
# 为了使etcd集群中的节点可以发现彼此，我们选择etcd官方提供的云端api
# 即去访问如下网址，通过制定size的数目来确定集群的节点数目，当然这个也可以后期在集群中配置更改
curl https://discovery.etcd.io/new?size=3
https://discovery.etcd.io/2126a604d62d838d22b7e81f4b370e38
# 获得了这个token后，我们可以将其配置在cloud-config中

vim cloud-config.yaml
*******************************************************
#cloud-config

# include one or more SSH public keys
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAIEAnIZFP4F+IW5+ii9X59ggYpZqIEG7OryZQcqgXTpQ5ePt8awxRYxMARhR2yKYGZtBHb/E7eCTqL+b2R08oduW3HB/VFE0/GSnDcaIgKWaDBMBY1fblqA3jzBeZqvrGaYii4B3a4jrlt85JdOphowZLQGpdcq0c1hhkfJNEi26+Pc= root@zack.xiao5tech.com
coreos:
  etcd2:
    # generate a new token for each unique cluster from https://discovery.etcd.io/new?size=3
    # specify the initial size of your cluster with ?size=X
    discovery: https://discovery.etcd.io/2126a604d62d838d22b7e81f4b370e38
    advertise-client-urls: http://192.168.0.25:2379,http://192.168.0.25:4001
    initial-advertise-peer-urls: http://192.168.0.25:2380
    # listen on both the official ports and the legacy ports
    # legacy ports can be omitted if your application doesn't depend on them
    listen-client-urls: http://0.0.0.0:2379,http://0.0.0.0:4001
    listen-peer-urls: http://192.168.0.25:2380
  units:
    - name: 00-eth0.network
      runtime: true
      content: |
        [Match]
        Name=eth0

        [Network]
        DNS=8.8.8.8
        Address=192.168.0.25/32
        Gateway=192.158.0.1
    - name: etcd2.service
      command: start
    - name: fleet.service
      command: start
    - name: flanneld.service
      command: start
      drop-ins:
      - name: 50-network-config.conf
        content: |
          [Service]
          ExecStartPre=/usr/bin/etcdctl set /coreos.com/network/config '{"Network":"10.1.0.0/16", "Backend": {"Type": "vxlan"}}'
*******************************************************
# 值得注意的是
# 官方示例中的$private_ipv4 和 $public_ipv4这两个变量只在以下平台有效
# Amazon EC2, Google Compute Engine, OpenStack, Rackspace, DigitalOcean, and Vagrant.
# 这就意味着，如果你不是使用这些平台，请将此变量替换为该coreos对应的公用ip和私有ip
```

#### 5) 安装coreos系统
``` bash
# 给coreos-install添加执行权限
chmod +x coreos-install

# 使用fdisk -l命令发现目标磁盘，-C选择系统版本(我们选择稳定版)，-c指定配置文件
./coreos-install -d /dev/sda -C stable -c ./cloud-config.yaml
2017/03/25 13:41:38 Checking availability of "local-file"
2017/03/25 13:41:38 Fetching user-data from datasource of type "local-file"
Downloading the signature for https://stable.release.core-os.net/amd64-usr/1298.6.0/coreos_production_image.bin.bz2...
2017-03-25 13:41:46 URL:https://stable.release.core-os.net/amd64-usr/1298.6.0/coreos_production_image.bin.bz2.sig [564/564] -> "/tmp/coreos-install.5Vs9gpsKH1/coreos_production_image.bin.bz2.sig" [1]
Downloading, writing and verifying coreos_production_image.bin.bz2...
2017-03-25 14:31:27 URL:https://stable.release.core-os.net/amd64-usr/1298.6.0/coreos_production_image.bin.bz2 [281054307/281054307] -> "-" [1]
gpg: Signature made Tue Mar 14 21:34:55 2017 UTC
gpg:                using RSA key 48F9B96A2E16137F
gpg:                issuer "buildbot@coreos.com"
gpg: key 50E0885593D2DCB4 marked as ultimately trusted
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: Good signature from "CoreOS Buildbot (Offical Builds) <buildbot@coreos.com>" [ultimate]
Installing cloud-config...
Success! CoreOS stable 1298.6.0 is installed on /dev/sda
```

#### 6) 重启coreos，并使用ssh连接
``` bash
# 在livecd界面执行重启命令
systemctl reboot
# 重新启动系统，确保livecd镜像已经推出才会进入真正的coreos正式系统
# 启动界面完成后，会在登陆命令行上面看到ip地址，如果你忘记自己配置的ip的话。

# 默认的用户是core
ssh core@192.168.0.25
```

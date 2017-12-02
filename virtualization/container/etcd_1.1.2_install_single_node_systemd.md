---
title: etcd 1.1.2 etcd install single node(systemd)
date: 2017-12-02 13:11:00
categories: virtualization/container
tags: [etcd]
---
### etcd 1.1.2 etcd install single node(systemd)

---

### 1. install etcd single node with systemd
``` bash
# step 1 下载安装etcd
ETCD_VER=v3.0.17
DOWNLOAD_URL=https://github.com/coreos/etcd/releases/download
curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o etcd-${ETCD_VER}-linux-amd64.tar.gz
tar xzvf etcd-${ETCD_VER}-linux-amd64.tar.gz
mv etcd-${ETCD_VER}-linux-amd64/etcd* /usr/local/bin

# step 2 准备systemd unit文件
echo '[Unit]
Description=etcd key-value store
Documentation=https://github.com/coreos/etcd
After=network.target

[Service]
User=etcd
Type=notify
Environment=ETCD_DATA_DIR=/var/lib/etcd
Environment=ETCD_NAME=%m
Environment=ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379,http://0.0.0.0:4001
Environment=ETCD_ADVERTISE_CLIENT_URLS=http://0.0.0.0:2379
ExecStart=/usr/local/bin/etcd
Restart=always
RestartSec=10s
LimitNOFILE=40000

[Install]
WantedBy=multi-user.target' > /usr/lib/systemd/system/etcd.service

# step 3 准备etcd用户
useradd -r -s /sbin/nologin etcd

# step 4 准备etcd数据目录
mkdir -p /var/lib/etcd
chown -R etcd:etcd /var/lib/etcd

# step 5 启动etcd
systemctl daemon-reload
systemctl enable etcd.service
systemctl start etcd.service
```
> 因为只是单点etcd，所以需要的参数较少，更多启动的选项参数参照[etcd选项官方说明](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md)

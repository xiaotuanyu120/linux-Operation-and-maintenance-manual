---
title: flannel 1.2.0 configuration ans option
date: 2018-01-16 14:29:00
categories: virtualization/container
tags: [flannel]
---
### flannel 1.2.0 configuration ans option

---

### 0. 前言
[官方文档链接](https://github.com/coreos/flannel/blob/master/Documentation/configuration.md)

### 1. flannel 服务启动的主要 option
- `--public-ip=""`: 可被其他节点访问以进行主机间通信的ip
- `--etcd-endpoints=http://127.0.0.1:4001`: 以逗号分隔的etcd端点列表
- `--etcd-prefix=/coreos.com/network`: etcd 前缀
- `--etcd-keyfile=""`: 用于和etcd加密通信的SSL key
- `--etcd-certfile=""`: 用于和etcd加密通信的SSL 证书文件
- `--etcd-cafile=""`: 用于和etcd加密通信的SSL CA 文件
- `--kube-subnet-mgr`: 访问Kubernetes API来进行子网分配，而不是使用etcd.
- `--iface=""`: 用于主机间通信的interface(IP or name)。默认为机器上默认路由的接口。这个选项可以指定多次，flannel会按照顺序去查找，并返回第一个找到的接口。
- `--iface-regex=""`: 和`--iface`的区别在于，用正则的方式去寻找匹配用于主机间通信接口，也可以被指定多次，但优先级低于iface，只有iface全部未匹配才会生效。
- `--subnet-file=/run/flannel/subnet.env`: 环境变量写入文件路径
- `--subnet-lease-renew-margin=60`: 子网租赁续租时间, 单位是分钟.
- `--ip-masq=false`: setup IP masquerade for traffic destined for outside the flannel network. Flannel assumes that the default policy is ACCEPT in the NAT POSTROUTING chain.
- `-v=0`: log level for V logs. Set to 1 to see messages related to data path.
- `--healthz-ip="0.0.0.0"`: The IP address for healthz server to listen (default "0.0.0.0")
- `--healthz-port=0`: The port for healthz server to listen(0 to disable)
- `--version`: print version and exit

### 2. flannel 网络配置
`Network` (string): IPv4 network in CIDR format to use for the entire flannel network. (This is the only mandatory key.)

`SubnetLen` (integer): The size of the subnet allocated to each host. Defaults to 24 (i.e. /24) unless Network was configured to be smaller than a /24 in which case it is one less than the network.

`SubnetMin` (string): The beginning of IP range which the subnet allocation should start with. Defaults to the first subnet of Network.

`SubnetMax` (string): The end of the IP range at which the subnet allocation should end with. Defaults to the last subnet of Network.

`Backend` (dictionary): Type of backend to use and specific configurations for that backend. The list of available backends and the keys that can be put into the this dictionary are listed below. Defaults to udp backend.

例子
``` json
{
	"Network": "10.0.0.0/8",
	"SubnetLen": 20,
	"SubnetMin": "10.10.0.0",
	"SubnetMax": "10.99.0.0",
	"Backend": {
		"Type": "udp",
		"Port": 7890
	}
}
```

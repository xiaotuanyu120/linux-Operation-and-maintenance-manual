vmware+RDO2
2016年6月28日
21:58
 
0，demo准备和系统环境查看
============================================
## 系统信息
# cat /etc/redhat-release
CentOS Linux release 7.1.1503 (Core)
# uname --a
Linux controller 3.10.0-229.el7.x86_64 #1 SMP Fri Mar 6 11:36:42 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
 
## demo规划：此次demo只是单点openstack演示，也就是controller和compute在一台
## 做完此demo之后会研究如何添加compute node 
1，准备
============================================
## 禁用网络管理工具和防火墙
# systemctl disable NetworkManager firewalld
# systemctl enable network
 
## 禁用selinux
# vim /etc/selinux/config
*************************
SELINUX=disabled
*************************
 
## 修改hostname并做本机解析
# hostnamectl set-hostname controller
# vim /etc/hosts
*************************
10.10.180.45 controller
*************************
 
## 重启机器
# sync;reboot 
2，安装openstack
============================================
## 环境变量文件
# vim /etc/environment
*************************
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
*************************
 
## 安装repo和相关包
# yum install -y https://www.rdoproject.org/repos/rdo-release.rpm
# yum update -y
# yum install -y openstack-packstack
# sync; reboot
 
## packstack生成answer文件，并修改该文件自定义安装
# packstack --gen-answer-file=answer.txt
# vim answer.txt
*************************
CONFIG_CINDER_INSTALL=n
CONFIG_SWIFT_INSTALL=n
CONFIG_CEILOMETER_INSTALL=n
CONFIG_AODH_INSTALL=n
CONFIG_GNOCCHI_INSTALL=n
CONFIG_NAGIOS_INSTALL=n
*************************
# packstack --answer-file=answer.txt
 
## 当前目录下会生成相应文件储存安装后的信息
# cat keystonerc_admin
unset OS_SERVICE_TOKEN
export OS_USERNAME=admin
export OS_PASSWORD=74167fefa60b4d8c
export OS_AUTH_URL=http://10.10.180.45:5000/v2.0
export PS1='[\u@\h \W(keystone_admin)]\$ '
 
export OS_TENANT_NAME=admin
export OS_REGION_NAME=RegionOne 
3，网络配置
============================================
# ip a | grep "^[0-9]:"
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast master ovs-system state UP qlen 1000
3: ovs-system: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
4: br-tun: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
5: br-ex: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN
6: br-int: <BROADCAST,MULTICAST> mtu 1450 qdisc noop state DOWN
 
## 装完rdo后，会发现网络多了几个
ovs open vswitch
内部网桥br-int
外部网桥br-ex
隧道网桥br-tun
## 如何用open vswitch看状态
# ovs-vsctl show
 
## 用ifconfig scripts配置外部网桥网络
# vim /etc/sysconfig/network-scripts/ifcfg-br-ex
*************************
NAME="br-ex"
DEVICE="br-ex"
DEVICETYPE=ovs
TYPE=OVSBridge
ONBOOT=yes
BOOTPROTO=none
IPV6INIT=no
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPADDR=10.10.180.45
PREFIX=24
GATEWAY=10.10.180.1
DNS1=8.8.8.8
*************************
# vim /etc/sysconfig/network-scripts/ifcfg-eno16777736
*************************
NAME=eno16777736
DEVICE=eno16777736
ONBOOT=yes
IPV6INIT=no
BOOTPROTO=none
DEVICETYPE=ovs
TYPE=OVSPort
OVS_BRIDGE=br-ex
*************************
# sync;reboot
 
## 查看网络状态
# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eno16777736: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast master ovs-system state UP qlen 1000
    link/ether 00:0c:29:d3:08:0b brd ff:ff:ff:ff:ff:ff
    inet6 fe80::20c:29ff:fed3:80b/64 scope link
       valid_lft forever preferred_lft forever
3: ovs-system: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
    link/ether 4e:df:af:11:09:4f brd ff:ff:ff:ff:ff:ff
4: br-int: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
    link/ether 2e:9e:44:44:cd:42 brd ff:ff:ff:ff:ff:ff
6: br-tun: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
    link/ether 46:98:c2:41:35:44 brd ff:ff:ff:ff:ff:ff
10: br-ex: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN
    link/ether 00:0c:29:d3:08:0b brd ff:ff:ff:ff:ff:ff
    inet 10.10.180.45/24 brd 10.10.180.255 scope global br-ex
       valid_lft forever preferred_lft forever
    inet6 fe80::9cd3:ddff:fe35:474c/64 scope link
       valid_lft forever preferred_lft forever

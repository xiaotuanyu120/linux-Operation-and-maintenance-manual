vmware+RDO
2016年4月16日
9:35
 
虚机准备：
vmware虚机(2台)
1G内存
20G硬盘
CPU开启intel vt 和amd vt
双网卡，1桥接1NAT
 
环境准备：
## 网络环境
/etc/sysconfig/network-scripts/ifcfg-eno1677736
*********************************************
TYPE=Ethernet
BOOTPROTO=none
NAME=eno16777736
UUID=3c8a495e-7911-4e20-9ff2-e37cbd311450
DEVICE=eno16777736
ONBOOT=yes
IPADDR=172.16.2.170
PREFIX=24
DNS1=8.8.8.8
*********************************************
/etc/sysconfig/network-scripts/ifcfg-eno33554984
*********************************************
TYPE=Ethernet
BOOTPROTO=none
NAME=eno33554984
DEVICE=eno33554984
ONBOOT=yes
IPADDR=10.0.0.10
PREFIX=24
*********************************************
 
节点外网ip内网ip虚拟化支持selinuxNetworkManagercontroller172.16.2.17010.0.0.10是关闭关闭compute1172.16.2.17110.0.0.11是关闭关闭 
## 确保下列文件包含以下两条
# echo LANG=en_US.utf-8 >> /etc/environment
# echo LC_ALL=en_US.utf-8 >> /etc/environment
 
## 软件仓库
# yum install -y https://www.rdoproject.org/repos/rdo-release.rpm
# yum update -y
 
## 安装openstack的packstack安装器
 
 

KVM: 增加网卡
2016年4月6日
15:03
 
问题背景：
====================================
目前vm通过br0直接连接internet，希望通过新建br1将vm组成局域网内部管理
 
宿主机上创建新的br1
====================================
## 编辑网桥配置文件
# vim /etc/sysconfig/network-scripts/ifcfg-br1
DEVICE=br1
TYPE=Bridge
ONBOOT=yes
BOOTPROTO=static
NM_CONTROLLED=no
DELAY=0
STP=yes
IPADDR=10.10.222.2
NETMASK=255.255.255.0
GATEWAY=10.10.222.1
 
## 重启network服务
# systemctl restart network
 
## 检查网桥状态
# brctl show
bridge name     bridge id               STP enabled     interfaces
br0             8000.c03fd5f3f1d9       yes             enp2s0f0
                                                        vnet0
                                                        vnet1
br1             8000.000000000000       yes
 
给VM增加基于br1的网卡
======================================
方法1、使用XML配置文件
## 生成mac地址
# macaddr=52:54:$(dd if=/dev/urandom count=1 2>/dev/null |md5sum|sed 's/^\(..\)\(..\)\(..\)\(..\).*$/\1:\2:\3:\4/')
# echo $macaddr
52:54:42:0a:5c:3e
## 内部局域网的MAC地址多以52:54开头
## 外网通过桥接的MAC地址多以fa:95开头
 
# vim hot_net.xml
****************************************
<interface type='bridge'>
      <mac address='52:54:42:0a:5c:3e'/>
      <source bridge='br1'/>
      <model type='virtio'/>
</interface>
****************************************
# virsh attach-device controller hot_net.xml
Device attached successfully
 
## 利用ssh、console或者vnc登陆上vm
# ip a show eth1
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN qlen 1000
    link/ether 52:54:42:0a:5c:3e brd ff:ff:ff:ff:ff:ff
 
 
方法2、使用virsh命令参数添加
# virsh attach-interface compute01 --type bridge --source br1 --mac 52:54:79:16:70:16 --live
Interface attached successfully
 
## 利用ssh、console或者vnc登陆上vm
# ip a show eth1
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN qlen 1000
    link/ether 52:54:79:16:70:16 brd ff:ff:ff:ff:ff:ff
 
## 增加网卡成功之后，就在VM上创建配置文件，采用br1的10.10.222.0/24网段
## 但是因为br1我们并没有绑定任何物理网卡，所以vm上基于br1的网卡都只能和同样基于br1的虚拟网卡进行沟通，ping网关同样是ping不通的
 
 
 

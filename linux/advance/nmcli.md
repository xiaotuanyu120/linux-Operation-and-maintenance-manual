---
title: nmcli
date: 2015年6月19日
categories: 19:57
---
 
IP设定（nmcli工具）
===========================================================
##查看连接
[root@kvm ~]#nmcli connection show                      
NAME         UUID                                  TYPE            DEVICE
eno16777736  2c818882-b72e-486d-b994-cdcafc17bc7b  802-3-ethernet  eno16777736
 
##创建连接
[root@kvm ~]# nmcli con add con-name eth0-static type ethernet ifname eno16777736
Connection 'eth0-static' (0390c01b-84b1-430f-aac3-6ce7ccaf2be2) successfully added.
 
[root@kvm ~]# ls /etc/sysconfig/network-scripts/ifcfg-e*
/etc/sysconfig/network-scripts/ifcfg-eno16777736
/etc/sysconfig/network-scripts/ifcfg-eth0-static
 
[root@kvm ~]# cat /etc/sysconfig/network-scripts/ifcfg-eth0-static
TYPE=Ethernet
BOOTPROTO=dhcp
DEFROUTE=yes
PEERDNS=yes
PEERROUTES=yes
......
NAME=eth0-static
UUID=0390c01b-84b1-430f-aac3-6ce7ccaf2be2
DEVICE=eno16777736
ONBOOT=yes               ##默认是自动连接
 
[root@kvm ~]# nmcli con mod "eth0-static" connection.autoconnect no
[root@kvm ~]# cat /etc/sysconfig/network-scripts/ifcfg-eth0-static
TYPE=Ethernet
BOOTPROTO=dhcp
DEFROUTE=yes
......
NAME=eth0-static
UUID=0390c01b-84b1-430f-aac3-6ce7ccaf2be2
DEVICE=eno16777736
ONBOOT=no            ##修改现有的连接为不自动连接
PEERDNS=yes
PEERROUTES=yes
IPV6_PEERDNS=yes
IPV6_PEERROUTES=yes
 
#由此我们可以发现，nmcli是通过操纵/etc/sysconfig/network-scripts下的网卡配置文件来修改配置的。
#同时rhel7里对网络的管理是并不是通过网卡，而是通过连接（connection）来管理的，这样的好处就是我们可以多备几套方案来随时用nmcli命令切换。
 
##修改现有连接
[root@kvm ~]# nmcli con mod "eth0-static"
Error: <setting>.<property> argument is missing.
##修改的时候后面跟<setting>.<property> argument
##可通过"#nmcli con show eth0-static"命令查看上面可用的argument
 
##也可以用nmcli con edit "device name"
# nmcli con edit enp2s0
 
===| nmcli interactive connection editor |===
 
Editing existing '802-3-ethernet' connection: 'enp2s0'
 
Type 'help' or '?' for available commands.
Type 'describe [<setting>.<prop>]' for detailed property description.
 
You may edit the following settings: connection, 802-3-ethernet (ethernet), 802-1x, ipv4, ipv6, dcb
nmcli> ?
------------------------------------------------------------------------------
---[ Main menu ]---
goto     [<setting> | <prop>]        :: go to a setting or property
remove   <setting>[.<prop>] | <prop> :: remove setting or reset property value
set      [<setting>.<prop> <value>]  :: set property value
describe [<setting>.<prop>]          :: describe property
print    [all]                       :: print the connection
verify   [all]                       :: verify the connection
save     [persistent|temporary]      :: save the connection
activate [<ifname>] [/<ap>|<nsp>]    :: activate the connection
back                                 :: go one level up (back)
help/?   [<command>]                 :: print this help
nmcli    <conf-option> <value>       :: nmcli configuration
quit                                 :: exit nmcli
------------------------------------------------------------------------------
nmcli>
## 里面可以用？求助来查看操作方法 
 
 

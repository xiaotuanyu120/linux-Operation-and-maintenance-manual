CENTOS: 多网卡+多网关配置
2016年4月16日
16:29
 
CENTOS7下如何实现双网卡+双网关上网
=================================================
## 全局路由文件/etc/sysconfig/network
## 此文件是路由的全局设置
# cat /etc/sysconfig/network
# Created by anaconda
 
## 网卡文件中全部配了GATEWAY，默认情况是无法上网的，此处我们不配置网关
# cat /etc/sysconfig/network-scripts/ifcfg-eno16777736 |grep GATEWAY
# cat /etc/sysconfig/network-scripts/ifcfg-eno33554984 |grep GATEWAY
 
## 我们创建两个route-interface路由文件，把外网的路由文件中设定默认路由（也可以设置在全局配置文件中）
# cat /etc/sysconfig/network-scripts/router-eno16777736
*************************
default via 172.16.2.1 dev eno16777736
172.16.2.0/24 via 172.16.2.1 dev eno16777736
*************************
## 默认网关只可以有一个，写法 default via ip_address dev interface
## 其他路由写法：dest_ip_address/prefix via ip_address dev interface
 
# cat /etc/sysconfig/network-scripts/router-eno33554984
*************************
10.0.0.0/24 via 10.0.0.1 dev eno33554984
*************************
 
 
## PING测试效果
# ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=128 time=71.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=128 time=71.6 ms
^C
--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 71.309/71.465/71.622/0.309 ms
 
## 扩展资料
https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Networking_Guide/sec-Using_the_Command_Line_Interface.html#sec-Static-Routes_and_the_Default_Gateway
 
https://www.centos.org/docs/5/html/5.1/Deployment_Guide/s1-networkscripts-static-routes.html
 

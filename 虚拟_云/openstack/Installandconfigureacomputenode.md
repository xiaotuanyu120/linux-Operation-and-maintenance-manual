Install and configure a compute node
2016年6月25日
22:55
 
Install and configure components
===============================================
## install the packages
# yum install openstack-nova-compute -y
# vim /etc/nova/nova.conf
**********************************************
# cat /etc/nova/nova.conf |grep -Ev "^#|^ ?+$"
[DEFAULT]
rpc_backend = rabbit
auth_strategy = keystone
my_ip = 10.0.0.13
use_neutron = True
firewall_driver = nova.virt.firewall.NoopFirewallDriver
 
[glance]
api_servers = http://controller:9292
 
[keystone_authtoken]
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = nova
password = nova.keystone

[oslo_concurrency]
lock_path = /var/lib/nova/tmp

[oslo_messaging_rabbit]
rabbit_host = controller
rabbit_userid = openstack
rabbit_password = rabbitmq.passwd

[vnc]
enabled = True
vncserver_listen = 0.0.0.0
vncserver_proxyclient_address = $my_ip
novncproxy_base_url = http://controller:6080/vnc_auto.html
********************************************** 
Finalize installation
==================================
## 检查compute node是否支持cpu虚拟化
# egrep -c '(vmx|svm)' /proc/cpuinfo
1
## 如果结果不是1或者比1大的数字，则需要进行如下配置
# vim /etc/nova/nova.conf
*********************************
[libvirt]
...
virt_type = qemu
 
*********************************
 
## 服务自启动
# systemctl enable libvirtd.service openstack-nova-compute.service
# systemctl start libvirtd.service openstack-nova-compute.service
 

install and configure controller node
2016年6月25日
22:25
 
prerequisties
==========================================
## database
# mysql -u root -p
CREATE DATABASE nova_api;
CREATE DATABASE nova;
GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'localhost' IDENTIFIED BY 'nova.passwd';
GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'%' IDENTIFIED BY 'nova.passwd';
GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'%' IDENTIFIED BY 'nova.passwd';
GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'localhost' IDENTIFIED BY 'nova.passwd';
flush privileges;
 
# . /root/admin-openrc
 
## create nova user
# openstack user create --domain default --password-prompt nova
User Password:
Repeat User Password:
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled   | True                             |
| id        | 722418d4fe784df2bfb94b8a13606230 |
| name      | nova                             |
+-----------+----------------------------------+
 
## add the admin role to the nova user
# openstack role add --project service --user nova admin
 
## create the nova service entity
# openstack service create --name nova --description "OpenStack Compute" compute
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Compute                |
| enabled     | True                             |
| id          | 0eab605795a94d3c93a4449a330ea147 |
| name        | nova                             |
| type        | compute                          |
+-------------+----------------------------------+
 
## Create the Compute service API endpoints:
# openstack endpoint create --region RegionOne compute public http://controller:8774/v2.1/%\(tenant_id\)s
+--------------+-------------------------------------------+
| Field        | Value                                     |
+--------------+-------------------------------------------+
| enabled      | True                                      |
| id           | c32c1688b27b4551968f11c7bf3e80d1          |
| interface    | public                                    |
| region       | RegionOne                                 |
| region_id    | RegionOne                                 |
| service_id   | 0eab605795a94d3c93a4449a330ea147          |
| service_name | nova                                      |
| service_type | compute                                   |
| url          | http://controller:8774/v2.1/%(tenant_id)s |
+--------------+-------------------------------------------+
# openstack endpoint create --region RegionOne compute internal http://controller:8774/v2.1/%\(tenant_id\)s
+--------------+-------------------------------------------+
| Field        | Value                                     |
+--------------+-------------------------------------------+
| enabled      | True                                      |
| id           | 6fad9df7e8354156a59fae7ae5173c77          |
| interface    | internal                                  |
| region       | RegionOne                                 |
| region_id    | RegionOne                                 |
| service_id   | 0eab605795a94d3c93a4449a330ea147          |
| service_name | nova                                      |
| service_type | compute                                   |
| url          | http://controller:8774/v2.1/%(tenant_id)s |
+--------------+-------------------------------------------+
# openstack endpoint create --region RegionOne compute admin http://controller:8774/v2.1/%\(tenant_id\)s
+--------------+-------------------------------------------+
| Field        | Value                                     |
+--------------+-------------------------------------------+
| enabled      | True                                      |
| id           | 584b067e11714aa3939d7da38433aac2          |
| interface    | admin                                     |
| region       | RegionOne                                 |
| region_id    | RegionOne                                 |
| service_id   | 0eab605795a94d3c93a4449a330ea147          |
| service_name | nova                                      |
| service_type | compute                                   |
| url          | http://controller:8774/v2.1/%(tenant_id)s |
+--------------+-------------------------------------------+ 
Install and configure components
==========================================
# yum install openstack-nova-api openstack-nova-conductor \
  openstack-nova-console openstack-nova-novncproxy \
  openstack-nova-scheduler
# vim /etc/nova/nova.conf
***********************************
[DEFAULT]
enabled_apis = osapi_compute,metadata
rpc_backend = rabbit
auth_strategy = keystone
my_ip = 10.0.0.12
use_neutron = True
firewall_driver = nova.virt.firewall.NoopFirewallDriver
 
[api_database]
connection = mysql+pymysql://nova:nova.passwd@controller/nova_api
 
[database]
connection = mysql+pymysql://nova:nova.passwd@controller/nova
 
[oslo_messaging_rabbit]
rabbit_host = controller
rabbit_userid = openstack
rabbit_password = rabbitmq.passwd
 
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
 
[vnc]
vncserver_listen = $my_ip
vncserver_proxyclient_address = $my_ip
 
[glance]
api_servers = http://controller:9292
 
[oslo_concurrency]
lock_path = /var/lib/nova/tmp
***********************************
 
## Populate the Compute databases:
# su -s /bin/sh -c "nova-manage api_db sync" nova
# su -s /bin/sh -c "nova-manage db sync" nova
## Ignore any deprecation messages in this output. 
Finalize installation
==========================================
# systemctl enable openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service
# systemctl start openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service

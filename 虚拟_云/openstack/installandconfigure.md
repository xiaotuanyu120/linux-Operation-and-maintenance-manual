install and configure
2016年6月25日
20:49
 
1，## 数据库准备
# mysql -u root -p
CREATE DATABASE glance;
GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' IDENTIFIED BY 'glance.passwd'; 
GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' IDENTIFIED BY 'glance.passwd';
flush privileges;
## 数据库密码是glance.passwd
 
2，## 执行admin环境变量脚本
# . /root/admin-openrc
 
3，## 创建glance用户 注册到service project中
# openstack user create --domain default --password-prompt glance
User Password:
Repeat User Password:
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled   | True                             |
| id        | 4472f92e6ac642599fe4d83259a9beca |
| name      | glance                           |
+-----------+----------------------------------+
## 密码是glance.keystone
 
# openstack role add --project service --user glance admin
 
## 创建glance服务的entity
# openstack service create --name glance   --description "OpenStack Image" image
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Image                  |
| enabled     | True                             |
| id          | e89f26fd510644dfbb3167e032e69d70 |
| name        | glance                           |
| type        | image                            |
+-------------+----------------------------------+
 
4，创建glance服务API的endpoints
# openstack endpoint create --region RegionOne image public http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 82b3859451e44f5c9bd65285b89fa51f |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e89f26fd510644dfbb3167e032e69d70 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
# openstack endpoint create --region RegionOne image internal http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | b69eaf821d294d9a8492876dd7c9f9e1 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e89f26fd510644dfbb3167e032e69d70 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
# openstack endpoint create --region RegionOne image admin http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | d206dab908044b6ab21046fa003d6e6c |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e89f26fd510644dfbb3167e032e69d70 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
 
5，## 安装与配置glance
# yum install openstack-glance -y
# vim /etc/glance/glance-api.conf
****************************************
[database]
connection = mysql+pymysql://glance:glance.passwd@controller/glance
 
[keystone_authtoken]
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = glance
password = glance.keystone
 
[glance_store]
stores = file,http
default_store = file
filesystem_store_datadir = /var/lib/glance/images/
## 这里指定了image的储存路径
****************************************
# vim /etc/glance/glance-registry.conf
****************************************
[database]
connection = mysql+pymysql://glance:glance.passwd@controller/glance
 
[keystone_authtoken]
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = glance
password = glance.keystone
 
[paste_deploy]
flavor = keystone
****************************************
 
6，## 以glance的身份同步其数据库
# su -s /bin/sh -c "glance-manage db_sync" glance
## 报出的一些用法建议warning可以忽略
 
7，## 服务自启动
# systemctl enable openstack-glance-api.service openstack-glance-registry.service
# systemctl start openstack-glance-api.service openstack-glance-registry.service

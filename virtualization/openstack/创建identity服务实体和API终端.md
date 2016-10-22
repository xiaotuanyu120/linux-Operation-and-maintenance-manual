创建identity服务实体和API终端
2016年6月24日
22:47
 
## 配置授权token
# export OS_TOKEN=admin.passwd
## 这里的admin.passwd是/etc/keystone/kestone.conf中配置的密码
 
## 配置终端的url
# export OS_URL=http://controller:35357/v3
 
## 配置API的版本
# export OS_IDENTITY_API_VERSION=3
 
## Create the service entity
# openstack service create --name keystone --description "OpenStack Identity" identity
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Identity               |
| enabled     | True                             |
| id          | e3e2a281c65346e29bf98d119c7f10e5 |
| name        | keystone                         |
| type        | identity                         |
+-------------+----------------------------------+
 
## Create the service  API endpoints
# openstack endpoint create --region RegionOne \
>   identity public http://controller:5000/v3
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | d04d0e5e459146388462536aa87bc9b9 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e3e2a281c65346e29bf98d119c7f10e5 |
| service_name | keystone                         |
| service_type | identity                         |
| url          | http://controller:5000/v3        |
+--------------+----------------------------------+
 
# openstack endpoint create --region RegionOne \
>   identity internal http://controller:5000/v3
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | b1a0957996ad450f92eede513ae9766a |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e3e2a281c65346e29bf98d119c7f10e5 |
| service_name | keystone                         |
| service_type | identity                         |
| url          | http://controller:5000/v3        |
+--------------+----------------------------------+
 
# openstack endpoint create --region RegionOne \
>   identity admin http://controller:35357/v3
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 4db504581f474a0189b8a6468569980b |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | e3e2a281c65346e29bf98d119c7f10e5 |
| service_name | keystone                         |
| service_type | identity                         |
| url          | http://controller:35357/v3       |
+--------------+----------------------------------+
 

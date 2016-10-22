创建domain, projects, users, and roles
2016年6月24日
23:09
 
## identity为其他服务提供认证服务，认证服务是domain, projects, users, and roles的集合
 
## 创建一个默认的domain
# openstack domain create --description "Default Domain" default
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Default Domain                   |
| enabled     | True                             |
| id          | 6c4295d7e7ba49c3b59118a3ced5328a |
| name        | default                          |
+-------------+----------------------------------+
 
## 创建一个admin project，user和role，用来管理
## 创建admin project
# openstack project create --domain default \
>   --description "Admin Project" admin
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Admin Project                    |
| domain_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled     | True                             |
| id          | 3367d352765c45928141b6d783eab584 |
| is_domain   | False                            |
| name        | admin                            |
| parent_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
+-------------+----------------------------------+
 
## 创建admin user
# openstack user create --domain default \
>   --password-prompt admin
User Password:
Repeat User Password:
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled   | True                             |
| id        | 9464c1004449441186caeecd3ed18b4b |
| name      | admin                            |
+-----------+----------------------------------+
## 密码是admin.keystone
 
## 创建admin role
# openstack role create admin
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | None                             |
| id        | 20b4154b8c7a44f78db44813ce82a507 |
| name      | admin                            |
+-----------+----------------------------------+
 
## 给admin project和user 添加 admin role
# openstack role add --project admin --user admin admin
 
## 创建一个service project
This guide uses a service project that contains a unique user for each service that you add to your environment. Create the service project:
# openstack project create --domain default \
>   --description "Service Project" service
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Service Project                  |
| domain_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled     | True                             |
| id          | a2a8d2695456478eb23c40e7bf1b1e86 |
| is_domain   | False                            |
| name        | service                          |
| parent_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
+-------------+----------------------------------+
 
## 创建一个demo project，user and role
Regular (non-admin) tasks should use an unprivileged project and user. As an example, this guide creates the demo project and user.
## 创建demo project
# openstack project create --domain default \
>   --description "Demo Project" demo
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Demo Project                     |
| domain_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled     | True                             |
| id          | 927b06f3dab3401aa0f150cd8d21cb27 |
| is_domain   | False                            |
| name        | demo                             |
| parent_id   | 6c4295d7e7ba49c3b59118a3ced5328a |
+-------------+----------------------------------+
 
## 创建demo user
# openstack user create --domain default \
>   --password-prompt demo
User Password:
Repeat User Password:
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | 6c4295d7e7ba49c3b59118a3ced5328a |
| enabled   | True                             |
| id        | db7217cfa74d431583a2b5d57da0152a |
| name      | demo                             |
+-----------+----------------------------------+
## 密码是demo.keystone
 
## 创建demo role
# openstack role create user
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | None                             |
| id        | 20236f5f74554b19a02d03b9c69fd80c |
| name      | user                             |
+-----------+----------------------------------+
 
## 给demo project和user 添加 demo role
# openstack role add --project demo --user demo user

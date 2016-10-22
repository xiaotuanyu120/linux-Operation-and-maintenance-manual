创建openstack客户端环境脚本
2016年6月25日
20:28
 
0，## 为了更有效率，我们通过一个脚本配置系统变量和命令来通过openstack 客户端操作，openstack支持用OpenRC文件脚本
 
1，## 编辑admin-openrc文件，并增加以下内容
# vim /root/admin-openrc
*****************************
export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=admin
export OS_USERNAME=admin
export OS_PASSWORD=admin.keystone
export OS_AUTH_URL=http://controller:35357/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
*****************************
## admin.keystone是我们添加admin用户时的密码
 
2，## 编辑demo-openrc文件，并增加以下内容
# vim /root/demo-openrc
*****************************
export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=demo
export OS_USERNAME=demo
export OS_PASSWORD=demo.keystone
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
*****************************
## demo.keystone是demo用户的密码
 
3，## 加载admin-openrc文件，来把环境变量转换成admin的环境
# . /root/admin-openrc
 
4，请求一个授权token
# openstack token issue
+------------+-----------------------------------------------------------------+
| Field      | Value                                                           |
+------------+-----------------------------------------------------------------+
| expires    | 2016-06-25T13:39:46.354645Z                                     |
| id         | gAAAAABXbnuTkthPj7fx-                                           |
|            | hqNGICumz8G25xRnDQlDUJc7yy4JUnb0ZFdA7EvPlVZQfxVMXr49lsRM5-p7M-  |
|            | yR2YiiPL-SC33H6AN9m_B9qPn8PpXTLqQOHBOt5zLmOXJTYNrXJ7QWwl2khqnae |
|            | HiwyIH_HZPsQKKGnetlkpL2c-GRhxF3u-WD-Y                           |
| project_id | 3367d352765c45928141b6d783eab584                                |
| user_id    | 9464c1004449441186caeecd3ed18b4b                                |
+------------+-----------------------------------------------------------------+
 

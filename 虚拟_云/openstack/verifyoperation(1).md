verify operation
2016年6月25日
21:20
 
## 用cirros镜像来检查操作
 
1，## 执行admin的环境变量脚本
# . /root/admin-openrc
 
2，## 下载镜像
 # wget http://download.cirros-cloud.net/0.3.4/cirros-0.3.4-x86_64-disk.img
 
3，将镜像上传到image service，磁盘格式是QCOW2，container格式是bare，public它以让其他project可以使用它
# openstack image create "cirros" --file cirros-0.3.4-x86_64-disk.img --disk-format qcow2 --container-format bare --public
403 Forbidden: You are not authorized to complete this action. (HTTP 403)
 
## 按照网上提示，去掉--public就可以创建image
## 所以聚焦到是account的policy上
## 编辑policy的配置文件
# vim /etc/glance/policy.json
*************************************
## 把    "publicize_image":  "role:admin", 修改成下面内容
    "publicize_image": "",
*************************************
# systemctl restart openstack-glance-api.service openstack-glance-registry.service
 
# openstack image create "cirros" --file cirros-0.3.4-x86_64-disk.img --disk-format qcow2 --container-format bare --public
+------------------+------------------------------------------------------+
| Field            | Value                                                |
+------------------+------------------------------------------------------+
| checksum         | ee1eca47dc88f4879d8a229cc70a07c6                     |
| container_format | bare                                                 |
| created_at       | 2016-06-25T14:15:09Z                                 |
| disk_format      | qcow2                                                |
| file             | /v2/images/e36886ad-2f6a-437d-85cd-002c13f31593/file |
| id               | e36886ad-2f6a-437d-85cd-002c13f31593                 |
| min_disk         | 0                                                    |
| min_ram          | 0                                                    |
| name             | cirros                                               |
| owner            | None                                                 |
| protected        | False                                                |
| schema           | /v2/schemas/image                                    |
| size             | 13287936                                             |
| status           | active                                               |
| tags             |                                                      |
| updated_at       | 2016-06-25T14:15:10Z                                 |
| virtual_size     | None                                                 |
| visibility       | public                                               |
+------------------+------------------------------------------------------+
## 参考链接：https://bugzilla.redhat.com/show_bug.cgi?id=1180309
 
## 查看image(因为上传了两次，一次public成功，一次private成功)
# openstack image list
+--------------------------------------+--------+--------+
| ID                                   | Name   | Status |
+--------------------------------------+--------+--------+
| e36886ad-2f6a-437d-85cd-002c13f31593 | cirros | active |
| 4e1aee02-31b4-4fe2-ac9c-840fe39e3aa0 | cirros | active |
+--------------------------------------+--------+--------+
 

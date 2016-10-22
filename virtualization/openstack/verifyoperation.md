verify operation
2016年6月25日
20:14
 
1，## 因为安全原因，禁用临时授权机制
# vim /etc/keystone/keystone-paste.ini
*************************************************
## 在以下三个section中移除"admin_token_auth"
[pipeline:public_api]
# The last item in this pipeline must be public_service or an equivalent
# application. It cannot be a filter.
pipeline = cors sizelimit url_normalize request_id admin_token_auth build_auth_context token_auth json_body ec2_extension public_service
 
[pipeline:admin_api]
# The last item in this pipeline must be admin_service or an equivalent
# application. It cannot be a filter.
pipeline = cors sizelimit url_normalize request_id admin_token_auth build_auth_context token_auth json_body ec2_extension s3_extension admin_service
 
[pipeline:api_v3]
# The last item in this pipeline must be service_v3 or an equivalent
# application. It cannot be a filter.
pipeline = cors sizelimit url_normalize request_id admin_token_auth build_auth_context token_auth json_body ec2_extension_v3 s3_extension service_v3
*************************************************
 
2，## unset 临时的OS_TOKEN和OS_URL环境变量
# unset OS_TOKEN OS_URL
 
3，## 以admin的身份，请求一个授权token
# openstack --os-auth-url http://controller:35357/v3   --os-project-domain-name default --os-user-domain-name default   --os-project-name admin --os-username admin token issue
Password:
## 这里需要我们之前创建的admin user的密码 "admin.keystone"
+------------+-----------------------------------------------------------------+
| Field      | Value                                                           |
+------------+-----------------------------------------------------------------+
| expires    | 2016-06-25T13:25:50.809994Z                                     |
| id         | gAAAAABXbnhQAmcVrCn4MBEr5zuLGAKUYz8o-                           |
|            | j4uuhKHvSWQcfGkVDaUvKZDyRLZReKo10UYzBmcSE41YrwfEEk8dzJjLvQD8fl- |
|            | HlDy6mL8EUf0FE8io_E9EvdCYxVp20LpVvq8sjGbRXlo8W7_ejxwmUIZijSY9JR |
|            | 6m5Fnr-12onbKQb5BNgA                                            |
| project_id | 3367d352765c45928141b6d783eab584                                |
| user_id    | 9464c1004449441186caeecd3ed18b4b                                |
+------------+-----------------------------------------------------------------+
 
4，## 以demo用户的身份，请求一个token
# openstack --os-auth-url http://controller:5000/v3   --os-project-domain-name default --os-user-domain-name default   --os-project-name demo --os-username demo token issue
Password:
+------------+-----------------------------------------------------------------+
| Field      | Value                                                           |
+------------+-----------------------------------------------------------------+
| expires    | 2016-06-25T13:27:53.101459Z                                     |
| id         | gAAAAABXbnjLz48tecIpM6E8z8qhMN_RxG_lb2nWIIU-3-d7GkPvKXds-       |
|            | THmaQ5sQ335DSIZPQVMvBnZO_H_-4QAy-86J7oeBvXVhKbaq_vsCmwdt8-bYv0n |
|            | DSGWuHOTIXQw_EsyeJYhGQ7MFsKDHeYrnrpjnx6fRwB9WdTs4Amk4lYs1cgipTI |
| project_id | 927b06f3dab3401aa0f150cd8d21cb27                                |
| user_id    | db7217cfa74d431583a2b5d57da0152a                                |
+------------+-----------------------------------------------------------------+
 
 

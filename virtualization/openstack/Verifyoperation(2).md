Verify operation
2016年6月26日
12:40
 
## 需要在controller node上执行一下检测
 
1，## 执行环境变量脚本
# . admin-openrc
 
2，## List service components to verify successful launch and registration of each process:
# openstack compute service list
+----+--------------+--------------+----------+---------+-------+--------------+
| Id | Binary       | Host         | Zone     | Status  | State | Updated At   |
+----+--------------+--------------+----------+---------+-------+--------------+
|  1 | nova-        | ctl-node     | internal | enabled | up    | 2016-06-26T0 |
|    | consoleauth  |              |          |         |       | 4:58:15.0000 |
|    |              |              |          |         |       | 00           |
|  2 | nova-        | ctl-node     | internal | enabled | up    | 2016-06-26T0 |
|    | conductor    |              |          |         |       | 4:58:18.0000 |
|    |              |              |          |         |       | 00           |
|  3 | nova-        | ctl-node     | internal | enabled | up    | 2016-06-26T0 |
|    | scheduler    |              |          |         |       | 4:58:21.0000 |
|    |              |              |          |         |       | 00           |
|  6 | nova-compute | compute-node | nova     | enabled | up    | 2016-06-26T0 |
|    |              |              |          |         |       | 4:58:14.0000 |
|    |              |              |          |         |       | 00           |
+----+--------------+--------------+----------+---------+-------+--------------+
 

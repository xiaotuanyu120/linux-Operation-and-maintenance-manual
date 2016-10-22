RabbitMQ
2016年6月24日
21:39
 
## 为什么需要消息队列
openstack需要消息队列来在各服务之间沟通相互的状态，以使它们互相合作
 
## 以下操作需要在controller node上执行
 
## 安装RabbitMQ(最流行的消息队列软件)
# yum install rabbitmq-server
 
## 服务自启动
# systemctl enable rabbitmq-server.service
# systemctl start rabbitmq-server.service
 
## 增加openstack用户：
# rabbitmqctl add_user openstack rabbitmq.passwd
Creating user "openstack" ...
 
## 配置openstac用户的读写权限
# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/" ...

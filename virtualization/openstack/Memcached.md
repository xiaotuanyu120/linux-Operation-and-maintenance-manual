Memcached
2016年6月24日
21:45
 
## 为什么需要Memcached？
identity服务授权机制使用Memcached来缓存tokens
 
## 以下操作在controller node上执行
 
## 安装Memcached
# yum install memcached python-memcached
 
## 服务自启动
# systemctl enable memcached.service
# systemctl start memcached.service
 

nosql数据库
2016年6月24日
21:30
 
## 为何我们需要nosql数据库
telemetry service需要nosql数据库储存信息
 
## 在controller node上执行以下操作
 
## 安装MongoDB
# yum install mongodb-server mongodb
# vim /etc/mongod.conf
*********************************
## 修改绑定ip到controller node
bind_ip = 10.0.0.12
 
## 默认情况下，MongoDB会创建一个1GB大小的journal file在/var/lib/mongodb/journal目录，如果希望减小它，做下面的配置
smallfiles = true
*********************************
 
## 服务自启动
# systemctl enable mongod.service
# systemctl start mongod.service
 

openstack 软件包
2016年6月24日
20:58
 
## 所有节点都需要执行以下所有操作
## centos下安装openstack repository
# yum install centos-release-openstack-mitaka -y
 
## 升级系统的包到最新
# yum upgrade
 
## 安装openstack client
# yum install python-openstackclient -y
 
## 安装openstack-selinux管理包(一般我们关闭selinux)
# yum install openstack-selinux -y

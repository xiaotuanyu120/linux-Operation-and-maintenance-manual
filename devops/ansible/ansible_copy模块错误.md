ansible: copy模块错误
2016年9月23日
17:01
 
错误信息：
Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!" ansible
 
在对方节点上安装libselinux-python
yum install epel-release
yum install libselinux-python

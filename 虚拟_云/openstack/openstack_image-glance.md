openstack: image-glance
2016年6月25日
20:40
 
image服务可以使我们发现，注册和检索虚拟机镜像文件。它提供了一个REST API让我们可以查询虚机镜像文件的metadata和检索真实的镜像。它支持多种形式来储存镜像文件，包括单纯的文件系统，对象存储文件系统等
 
此例中，我们使用简单的文件系统储存，默认情况下在controller的/var/lib/glance/images
 

openstack: identity-keystone
2016年6月24日
21:52
 
identity服务提供了单点的认证管理整体解决方案。
其他服务使用identity服务作为一个通用api
 
identity服务安装在controller node上
 
identity服务包含以下组件
Server
A centralized server provides authentication and authorization services using a RESTful interface.
Drivers
Drivers or a service back end are integrated to the centralized server. They are used for accessing identity information in repositories external to OpenStack, and may already exist in the infrastructure where OpenStack is deployed (for example, SQL databases or LDAP servers).
Modules
Middleware modules run in the address space of the OpenStack component that is using the Identity service. These modules intercept service requests, extract user credentials, and send them to the centralized server for authorization. The integration between the middleware modules and OpenStack components uses the Python Web Server Gateway Interface.
 
当使用identity服务时，必须在安装openstack中为每个服务进行注册，identity会检测到服务的注册和找到它们在网络中的位置

Install and configure
2016年6月28日
16:37
 
Install and configure components
==========================================
# yum install openstack-dashboard -y
 
# vim /etc/openstack-dashboard/local_settings
***************************************
OPENSTACK_HOST = "controller"
ALLOWED_HOSTS = ['*', ]
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
 
CACHES = {
    'default': {
         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
         'LOCATION': 'controller:11211',
    }
}
## 注释掉原来的CACHES
 
OPENSTACK_KEYSTONE_URL = "http://%s:5000/v3" % OPENSTACK_HOST
OPENSTACK_KEYSTONE_MULTIDOMAIN_SUPPORT = True
 
OPENSTACK_API_VERSIONS = {
    "identity": 3,
    "image": 2,
    "volume": 2,
}
OPENSTACK_KEYSTONE_DEFAULT_DOMAIN = "default"
 
OPENSTACK_KEYSTONE_DEFAULT_ROLE = "user"
 
TIME_ZONE = "Asia/Shanghai"
***************************************
  
Finalize installation
========================================
# systemctl restart httpd.service memcached.service 
 
 

nagios: 04-主机和主机组
2016年6月8日
22:24
 
0，创建一个自定义主机与主机组
=============================================
# vi /usr/local/nagios/etc/selfconf/hosts.cfg
************************************************
define host{
        use             generic-host
        host_name       host01
        alias           Some Remote Host
        max_check_attempts 5
        address         10.10.180.17
        hostgroups      allhosts
        }
 
define hostgroup{
        hostgroup_name          allhosts
        alias                   All Servers
        members                 host01
        }
************************************************
 
## use：
指定继承哪一个模版的配置
配置在/usr/local/nagios/etc/objects/templates.cfg中
## host_name：主机名称
## alias：关联在此主机的一个长名称
## address：主机的ip地址
## hostgroups：指定此主机归属的主机组 

SQUID: 安装
2016年3月31日
16:02
 
# yum groupinstall -y base "Development tools"
# wget http://www.squid-cache.org/Versions/v3/3.5/squid-3.5.15-20160330-r14015.tar.gz
# tar zxvf squid-3.5.15-20160330-r14015.tar.gz
# cd squid-3.5.15-20160330-r14015
 
## 仔细看configure完毕之后的输出信息，有error的提前改正，因为每个版本的configure是不同的
# ./configure --prefix=/usr/local/squid --enable-icmp --enable-delay-pools --enable-kill-parent-hack --enable-cache-digests --enable-removal-policies=heap,lru --enable-x-accelerator-vary --enable-follow-x-forwarded-for --with-aufs-threads=320 --with-dl --enable-auth-basic=DB,NCSA --with-large-files
# make
# make install
 
## 每个版本有不同的配置项，很操蛋
# vim etc/squid.conf
****************************************
## 在"acl CONNECT method CONNECT"和"http_access allow localhost manager"之间添加
include "/usr/local/squid/etc/auth.conf"
 
## 在"http_port 3128"之前添加
always_direct allow all
 
## 在配置文件最后添加
forwarded_for off
#隐藏x-forwarded-for头
request_header_access HTTP_VIA deny all
#隐藏HTTP_VIA头
request_header_access VIA deny all
#隐藏VIA头
cache_effective_group daemon
#设置squid执行的用户组，这里使用了系统自带的daemon用户组
cache_effective_user daemon
#设置squid执行的用户，这里使用了系统自带的daemon用户
visible_hostname test
#设置错误页面中出现的服务器名称，可自行更改
cache_dir aufs /usr/local/squid/cache 100 16 256
#设置squid的缓存，可自行调整
cache_store_log none
#关闭store.log
****************************************
## 3.3的几个配置都变化很大，例如header_access变成了request_header_access
 
## 其实这个本应在squid.conf中一起配置，这里给分离出来了
# vim etc/auth.conf
****************************************
# 设置验证相关的配置内容，指定密码文件
auth_param basic program /usr/local/squid/libexec/basic_ncsa_auth /usr/local/squid/etc/passwd
auth_param basic children 10          #设置验证子进程数
auth_param basic credentialsttl 2 hours         #设置验证有效期
auth_param basic casesensitive off         #设置是否区分大小写
 
# 后面这三行分别定义了三个用户组。每个用户组指定了一个用户文件。
acl usergroup1 proxy_auth "/usr/local/squid/etc/ip1user"
acl usergroup2 proxy_auth "/usr/local/squid/etc/ip2user"
acl usergroup3 proxy_auth "/usr/local/squid/etc/ip3user"
 
# 后面三条允许这三个组的用户可以访问网络
http_access allow usergroup1
http_access allow usergroup2
http_access allow usergroup3
 
# 这三条用来分配哪个组的用户走哪个出口ip
tcp_outgoing_address10.100.10.1 usergroup1
tcp_outgoing_address10.100.10.2 usergroup2
tcp_outgoing_address 10.100.10.3 usergroup3
****************************************
 
## 给每个组创建用户，如果空着的话，会有报错，所以最好是都创建用户
# vim /usr/local/squid/etc/ip1user
****************************************
user1
user2
****************************************
 
# vim /usr/local/squid/etc/ip2user
****************************************
user3
user4
****************************************
 
# vim /usr/local/squid/etc/ip3user
****************************************
user5
user6
****************************************
 
 
# htpasswd -cm /usr/local/squid/etc/passwd user1
New password:
Re-type new password:
Adding password for user user1
# htpasswd -m /usr/local/squid/etc/passwd user2
New password:
Re-type new password:
Adding password for user user2
 
 
# mkdir cache
# chown -R daemon:daemon .
# sbin/squid -z
## 初始化的时候会在cache目录下创建目录，我总是卡在0F目录上，Ctrl+c以后启动并没有明显影响
 
## 启动squid
# sbin/squid -N &
[1] 4975
## 如果会出现错误信息，并卡住界面，说明需要去修改相应配置，正常应该是直接回到交互界面
 
# netstat -ln |grep 3128
tcp        0      0 :::3128                     :::*                        LISTEN
 
## 效果未测试
 
## 扩展资料
http://os.51cto.com/art/201104/256479.htm
http://www.cnblogs.com/technic-emotion/articles/3701257.html
 

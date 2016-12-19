PHP: 解决不间断502问题处理
2015年12月8日 星期二
14:37
 
问题描述:
访问网站动态页面的时候不间断出502错误(服务器内部错误)
 
问题检查:
# netstat -c 2 -i
## 看流量正常
# ps -aux |grep php
## 发现结果中大部分php进程是在R状态(running状态),而且一直持续
 
解决方案:
# /usr/local/php/sbin/php-fpm reload
# crontab -e
***********************************
* * * * * /usr/local/php/sbin/php-fpm reload
***********************************
## 相当于每分钟平滑重启一遍php，把处在R状态的php进程，重置为S状态（stop状态，随时待命）
## 另外发现php进程有点多，于是去配置文件中修改最大进程数和最大处理请求数
# vi /usr/local/php/etc/php-fpm.conf
********************************
<value name="max_children">50</value>
<value name="max_requests">500</value>
***********************************

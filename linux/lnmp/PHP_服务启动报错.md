PHP: 服务启动报错
2016年6月4日
9:09
 
错误总结
==============================================
错误1
错误描述：
# service php-fpm start
Starting php-fpm Dec 03 00:39:46.865806 [ALERT] [pool www] pm.min_spare_servers(0) must be a positive value
Dec 03 00:39:46.865842 [ERROR] failed to post process the configuration
 failed
解决办法：
# vim /etc/php/php-fpm.conf
**********************************
## uncomment below
pm.start_servers = 20
pm.min_spare_servers = 5
pm.max_spare_servers = 35
**********************************
 
错误2
错误描述：
## 启动脚本启动的时候提示fail，但是实际php进程已经启动；
解决办法：
分析脚本后发现，是因为php-fpm.conf中没有uncomment pid文件路径
# vim /data/server/php/etc/php-fpm.conf
************************
pid = /data/server/php/var/run/php-fpm.pid
************************
## 修改之后理论上重启php服务就有pid文件了，但是实际上我重启了机器以后才正常生成的pid

nagios: 06-检查nagios配置
2016年6月8日
22:24
 
0，重启服务
=============================================
## 检查配置
# /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
...
Total Errors:   0
 
Things look okay - No serious problems were detected during the pre-flight check
 
## 重启服务
# service nagios restart

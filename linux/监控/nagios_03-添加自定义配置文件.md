nagios: 03-添加自定义配置文件
2016年6月8日
22:24
 
0，准备自定义配置环境
=============================================
## 在主配文件中，配置自定义配置所在目录
# vim /usr/local/nagios/etc/nagios.cfg
*************************************************
cfg_dir=/usr/local/nagios/etc/selfconf
*************************************************
 
## 或者，也可以自定义单独的配置文件名称
cfg_file=/usr/local/nagios/etc/objects/***.cfg
 
## 另外，要确保配置文件的后缀名称是cfg
 
# mkdir /usr/local/nagios/etc/selfconf

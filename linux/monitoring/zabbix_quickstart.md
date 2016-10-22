zabbix:quick start
2015年11月28日 星期六
15:05
 
1、用admin登录web端"http://zabbix-server-ip/zabbix"(zabbix-ser-ip是你服务器ip)
 
2、添加host
## 点击Configuration -> Hosts.
## 点击Create

 
## 最少的最必要填写的几个参数:
 
Host name:
这里我们随便填写"new host"
Groups
点击 " 把右边现存的组移过来，把新建的host加入到该组中。
zabbix对于权限的管理是挂在组上的，所以相当于你加入了组，你就拥有了组所具有的权限
IP address
填写这个host的ip地址，如果你希望在这里填写zabbix server的ip地址，记得去zabbix_agent的配置文件中把Server标识后面指定这个ip地址
## 完成后，点击save 
3、添加item
##  Configuration-> Hosts 找到我们创建的 'New host'，然后点击items链接 
## 点击create item

 
## 最基本的几个参数
Name
item的名称，这里我们填写CPU load
Key
key承担了搜集信息的作用，这里我们填写"system.cpu.load"
Type of information
选择Numeric（float），这指定了搜集数据的格式（我就是因为这个填写错误，导致items一直显示not support状态）
## 查看数据
## 点击monitor -> Latest data，点开other的+
## 需要注意的几点
* 数据会有延迟
* 确保items的那几个基本参数无误
* server上的zabbix-agent和zabbix-server服务开启
* new host的状态必须是Monitored
* item的状态必须是Enabled
 
4、增加新的trigger
## configuration -> hosts，点击trigger链接
## 点击create trigger

 
## 最精华的两个参数
name
这里我们填写"CPU load too high on 'new host' for 3 minutes"
expression
o 这个表达式按照上图所示，可以选择项目，然后自动生成。
o 我们表达式的含义，是用我们做的item去检测cpuload，只要这个值大于2，持续180秒以上，就触发此trigger
o 表达式语法：https://www.zabbix.com/documentation/2.0/manual/config/triggers/expression
## 查看trigger状态
## Monitoring ->Triggers
## 如下图所以，状态是ok即可
 
5、接受邮件通知
 

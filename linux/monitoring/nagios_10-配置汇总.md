nagios: 10-配置汇总
2016年6月8日
15:00
 
1 hosts.cfg 主机配置文件，在这个配置文件里添加主机，格式如下：
define host{
        host_name pangu-server #主机名
        alias pangu-server #主机名别名
        address 10.10.10.11 #主机的IP地址
        check_command check-host-alive #检查的命令，在command.cfg定义的
        max_check_attempts 1 #失败时尝试检测最大次数,值为1时只报警不重新检测
        check_period 24x7    #检查的时间段，24X7是每天都检查
        contact_groups admins-cms #联系人组，报警后发邮件给哪个组，这里是发送给admins-cms，在contactgroups.cfg定义的
        notification_interval 1 #  重发电子邮件通知时间间隔
        notification_period 24x7 # 发送邮件的时间段，24X7是任意时间断都发送邮件报警
        notification_options d,u,r # 发送报警的选项，d表示down,u表示up,r表示restore,表示这3种情况下发送报警
        process_perf_data 1  #其值可以为0或1，其作用为是否启用Nagios的数据输出功能，如果将此项赋值为1，那么Nagios就会将收集的数据写入某个文件中，以备提取
        }
2 hostgroups.cfg 主机组配置文件，可以将主机添加到组里，格式如下：
define hostgroup{
        hostgroup_name pangu #主机组名
        alias pangu #主机组名别名
        members pangu-server #组内成员，也就是在hosts.cfg定义的主机
                }
3 commands.cfg 命令配置文件，定义服务的时候会用到，格式如下：
define command {
        command_name check-host-alive #命令名
        command_line $USER1$/check_ping -H $HOSTADDRESS$ -w 3000.0,80% -c 5000.0,100% -p 5 #具体的命令行
        }
4 services.cfg 服务配置文件，定义主机服务,格式如下：
define service{
        hostgroup_name pangu #主机组名，给哪个组定义服务
        service_description Check /data1 Partition # 定义的服务名，也是Nagios前端显示名称
        check_command nrpe!check_my_disk!10% 8% /data1 #检查服务的命令，在commands.cfg定义
        process_perf_data 1  #其值可以为0或1，其作用为是否启用Nagios的数据输出功能，如果将此项赋值为1，那么Nagios就会将收集的数据写入某个文件中，以备提取
        max_check_attempts 2  #失败时尝试检测最大次数,值为1时只报警不重新检测
        normal_check_interval 15  #正常检查间隔
        retry_check_interval 1 # #重试检查间隔
        check_period 24x7   #检查的时间段，24X7是每天都检查
        notification_interval 15  #重发电子邮件通知时间间隔
        notification_period 24x7   # 发送邮件的时间段，24X7是任意时间断都发送邮件报警
        notification_options w,u,c,r  # 发送报警的选项，w表示warning，d表示down,u表示up,r表示restore,表示这4种情况下发送报警
        contact_groups admins,admins-cms # 联系人组，报警后发邮件和短信给哪个组，这里是发送给admins-cms，在contactgroups.cfg定义的
}
5  escalation.cfg 报警限制配置文件，格式如下，这里主要是避免长时间发短信报警，从第4次短信报警就采用发邮件方式
define serviceescalation{
        host_name pangu-web-102 #主机名也可以是主机组
        service_description Check Phplog Num  #服务名
        first_notification 4   #从第几次短信开始
        last_notification 0   
        notification_interval 10 #重发电子邮件通知时间间隔
        contact_groups admins,webadmin #发送邮件的组
        }

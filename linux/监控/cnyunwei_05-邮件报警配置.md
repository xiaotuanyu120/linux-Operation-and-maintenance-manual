cnyunwei: 05-邮件报警配置
2016年6月10日
16:17
 
1 修改主机名：
将主机名修改为cnyunwei.com，修改/etc/sysconfig/network
2 安装sendmail，关闭postfix
service postfix stop
chkconfig postfix off
yum install sendmail -y
service sendmail start
chkconfig sendmail on
3 cacti 管理界面修改：
在设置-邮件/域名解析选项卡中，如图

备注：
测试邮件：相当于收件人，就是写一个邮件地址，将邮件发送到此邮箱，建议使用163邮箱，其他邮箱可能会被屏蔽掉，
邮件服务 : 需要选smtp，不知道为什么sendmail 会报错，但是我们真正发邮件还是走的sendmail，只不过这里选择smtp
发件人地址：一般就是root@主机名,我们上边设置的主机名是cnyunwei.com，所以这里写root@cnyunwei.com
smtp 服务器主机名：127.0.0.1 端口 25 dns 8.8.8.8 202.106.0.20 
最后发送一封测试邮件，以确保邮件配置正确。
4 报警/阀值的设置,如图所示：

5 设置完毕后只是宕机可以收到短信，但是图形报警还是不可以，需要为图形添加阀值
阀值的话可以通过阀值模板统一部署，也可以自己一条一条定义，这里就不在介绍
注意：监控端口流量图形可以用基线监控，硬盘分区可以用百分比数值来监控
 
来自 <http://note.youdao.com/share/iframe.html> 

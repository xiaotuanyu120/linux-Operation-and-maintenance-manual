NTP
2016年6月24日
20:42
 
## controller node
# yum install chrony -y
# vim /etc/chrony.conf
*********************************
## 更换同步时间server
server 0.asia.pool.ntp.org iburst
server 1.asia.pool.ntp.org iburst
server 2.asia.pool.ntp.org iburst
server 3.asia.pool.ntp.org iburst
 
## 允许其他节点来同步时间
allow 10.0.0.0/24
*********************************
# systemctl enable chronyd.service
# systemctl start chronyd.service
 
## 其他节点
# yum install -y chrony
# vim /etc/chrony.conf
*********************************
## 更换同步时间server为controller
server controller iburst
*********************************
# systemctl enable chronyd.service
# systemctl start chronyd.service
 
## 检测ntp配置效果
## controller node
# chronyc sources
210 Number of sources = 4
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^* 210.23.25.77                  2   6     7     2  -5601us[  -15ms] +/-   73ms
^+ time6.aliyun.com              2   6    17     0  +4156us[+3858us] +/-   57ms
^+ v157-7-235-92.z1d6.static     2   6    17     0  -4525us[-4823us] +/-   64ms
^+ frontier.innolan.net          2   6    17     0  -4739us[-5037us] +/-   86ms
 
## 其他节点
# chronyc sources
210 Number of sources = 1
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^? controller                    0   6     0   10y     +0ns[   +0ns] +/-    0ns
 
 
## 同步时间操作
# chronyc
> waitsync
# timedatectl

IFCONFIG: 多ip脚本
2016年1月15日
9:22
 
## 脚本背景
服务器需要备用多ip，防止ip攻击
 
## 脚本位置
放置在/etc/profile.d/下，开机会自启动
# vim /etc/profile.d/ifconfig-dual-ip.sh
********************************************
ifconfig eth0:0 ip_address01 netmask net_mask up
ifconfig eth0:1 ip_address02 netmask net_mask up
ifconfig eth0:2 ip_address03 netmask net_mask up
ifconfig eth0:3 ip_address04 netmask net_mask up
********************************************

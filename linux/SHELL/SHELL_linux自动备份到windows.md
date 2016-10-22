SHELL: linux自动备份到windows
2016年2月2日
10:54
 
挂载windows共享到linux
=============================
## 安装cifs-utils
# yum install cifs-utils
 
## 挂在cifs格式windows盘
# mount -t cifs -o iocharset=utf8,username="desktop-zack",password="Sudoroot55",uid=0,dir_mode=0777,file_mode=0777,rw //172.16.2.28/dailybak /mnt/remote_bak/
## 参数
-o 指定挂载时跟的参数
iocharset 指定编码格式
username 用户名
password 密码
uid 用什么身份挂载
dir_mode 目录挂载权限
file_mode 文件挂载权限
rw 指定读写模式挂载
## 需要确认的一点是，如果你希望以读写方式挂载，windows共享的目录属性中share和security都必须给与你mount命令中使用的用户读写权限，否则写入的时候会报错权限不足
 
自动备份脚本
===============================
*********************************************
#!/bin/bash
 
umount /mnt/remote_bak
mount -t cifs -o iocharset=utf8,username=desktop-zack,password=Sudoroot88,uid=0,dir_mode=0777,file_mode=0777,rw //172.16.2.28/dailybak /mnt/remote_bak/
 
timestr=`date +%Y_%m_%d`_00\:00\:01.tar.gz
desttimestr=`date +%Y%m%d`.tar.gz
 
mv mc$timestr mc-$desttimestr 2>&1
mv mysql$timestr mysql-$desttimestr 2>&1
 
cp {mc-$desttimestr,mysql-$desttimestr} /mnt/remote_bak
*********************************************
 
报错+解决
===============================
## 问题描述：
挂载时提示
"mount error(12): Cannot allocate memory"
window系统日志显示
"服务器无法通过系统非页面共享区来进行分配，因为服务器已达非页面共享分配的配置极限。"
## 解决方法：
找到注册表下列路径
HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanServer
\Parameters\
创建或者修改DWORD类型的一个注册表"IRPStackSize",值设定为十进制15以上，可以设置成18，然后重启windows系统即可 

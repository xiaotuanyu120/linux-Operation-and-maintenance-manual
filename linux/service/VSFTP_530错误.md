VSFTP: 530错误
2016年2月16日
10:46
 
问题描述：
在centos6上搭建了vsftpd服务，登录时提示"530 login incorrect"
 
分析过程：
首先这是个登录认证错误，而我搭建vsftp的时候使用的是db4-utils+pam认证
1、检查db4-utils生成的db文件中的用户名和密码，无误
2、检查vsftpd.conf中的pam_service_name配置项指定的pam文件名称，根据这个名称找到/etc/pam.d/下的对应文件，发现"auth       sufficient   /lib64/security/pam_userdb.so db=/etc/vsftpd/vsftpd_userlist"路径写错了
 
解决办法：
1、改正上面找到的路径错误
2、重启服务
 
总结重点：
认证过程
1、db4-utils中的"db_load -T -t hash -f 用户名密码文件路径 对应生成的db数据文件路径" 生成用户认证内容
2、"/etc/pam.d/"中的相应文件配置认证方法，指定上面的认证文件
3、"/etc/vsftpd/vsftpd.conf"配置pam_service_name项指定上面的pam文件
 
扩展：以下三项必须一致
db4-utils生成数据文件中的用户名称
vsftpd.conf中配置的user_config_dir目录中的子文件名称
该子文件中配置的local_root的目录名称要一致
 

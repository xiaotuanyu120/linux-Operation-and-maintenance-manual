NGINX: 解决pid文件不存在
2015年12月3日 星期四
12:27
 
问题描述：
## 修改完配置文件，然后平滑重载配置文件时
# /usr/local/nginx/sbin/nginx -s reload
nginx: [error] open() "/usr/local/nginx/nginx.pid" failed (2: No such file or directory)
解决办法：
# ps aux |grep nginx
# kill 10314
# /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
# ls /usr/local/nginx/nginx.pid
/usr/local/nginx/nginx.pid
 
## 其实核心就是杀掉进程，然后用nginx命令的-c参数指定配置文件重启而已

NGINX: 理论1-controlling nginx
2015年12月4日 星期五
9:39
 
1、Master 和 worker 进程
nginx启动的时候，会有一个master进程和多个worker进程；
worker进程的多少是由woker_processes指定的（见配置详解）；
若启用了caching，启动时会多一个cache loader进程和cache manager进程；
 
master进程主要是用来读取和检查配置文件，另外就是来管理worker进程；
worker进程是实际来处理请求的

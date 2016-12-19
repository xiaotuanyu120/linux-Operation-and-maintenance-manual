NGINX: 解决"nginx -t"报错
2015年12月12日 星期六
15:20
 
报错信息：
## 单独nginx主配文件时正常，创建第一个虚拟主机时出问题
# nginx -t
nginx: [emerg] "server" directive is not allowed here in /data/server/nginx/conf/vhost/rewrite.conf:1
nginx: configuration file /data/server/nginx/conf/nginx.conf test failed
 
排错过程：
1、检查虚拟主机配置文件，是否有｛｝不配对情况：正常
2、检查主配文件中include语句语法问题：正常
* 3、检查主配文件中include语句位置：发现放错了位置，错放在了server{}中
 
原理解释：
主配文件中include语句应该在http{}块下，include进来的server{}才正常，如果include语句放在server{}下，相当于把虚拟主机的server{}放在了主配的server{}中，这样肯定会报错。

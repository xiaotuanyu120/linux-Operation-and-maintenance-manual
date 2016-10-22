NGINX: 易错配置重点
2015年12月26日 星期六
17:49
 
0、都是血淋淋的亲身经历,主要是针对"nginx.conf"配置文件
因为下面的两个配置文件，nginx和php-fpm的status状态页无论如何也无法访问
1、"include vhost/*.conf"要写在第一个"server{}"的下面:
在nginx.conf中，在最上面的server{}默认是default_server，因为include相当于把*.conf文件中的配置引入到了nginx.conf中，所以如果"include vhost/*.conf" 写在第一个server{}上时,就相当于替换了server{}在nginx.conf中的地位（默认server）当然，在"listen"中增加default_server指定默认server的除外。
2、"server{}"下有"root"指定时，fast-cgi中这样配置：
"fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;"
就相当于访问"/index.php"时实际访问的是"$document_root/index.php"(其中$document_root就是你root指定的目录)

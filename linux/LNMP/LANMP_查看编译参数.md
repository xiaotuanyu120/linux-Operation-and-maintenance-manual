LANMP: 查看编译参数
2015年12月12日 星期六
9:07
 
1、apache编译参数获取
# cat /path/to/apache/build/config.nice
 
2、nginx编译参数
# /path/to/sbin/nginx -v
 
3、php编译参数
# /path/to/bin/php -i | grep configure
 
4、mysql编译参数
# cat /path/to/mysql/bin/mysqlbug | grep configure

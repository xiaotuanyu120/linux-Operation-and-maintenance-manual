PHP: 编译报错2
2016年6月7日
19:54
 
报错信息：
## php5.3.3安装的时候编译出错
# make
...
/usr/bin/ld: cannot find -lltdl
...
 
解决办法：
# yum install libtool-ltdl-devel

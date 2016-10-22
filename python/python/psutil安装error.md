psutil安装error
2015年7月23日
13:41
 
安装语句：
===========================================
#pip install psutil
...
    error: command 'gcc' failed with exit status 1
...
 
解决办法：
===========================================
#yum install python-devel
#python -m pip install psutil

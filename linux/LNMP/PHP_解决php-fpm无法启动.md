PHP: 解决php-fpm无法启动
2015年12月9日 星期三
10:59
 
问题描述：
# php-fpm start
## 结果显示done，但是实际查看进程没有php进程
排查过程：
# free -m
## 发现还有足够的空余内存
* # df -h
## 发现问题所在，原来是根分区的硬盘分区满了
解决办法：
# mkdir -p /web/usr/local
# cp -rp /usr/local/* /web/usr/local/
# ln -s /web/usr/local local
# php-fpm start
## 然后查看进程，发现成功启动
 
## 其实原理就是,把占用空间最大的目录转移到还有硬盘空间的分区,然后做个软连接指向到转移过去的目录,这样就达到了扩容的目地

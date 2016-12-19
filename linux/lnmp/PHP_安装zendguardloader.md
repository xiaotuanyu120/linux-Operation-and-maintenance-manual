PHP: 安装zend guard loader
2016年1月13日
9:41
 
## zend guard loader 是什么？
Zend Guard 是 Zend 官方出品的一款 PHP 源码加密产品解决方案，能有效地防止程序未经许可的使用和逆向工程。
Zend Guard Loader 则是针对使用 Zend Guard 加密后的 PHP 代码的运行环境。如果环境中没有安装 Zend Guard Loader，则无法运行经 Zend Guard 加密后的 PHP 代码。
 
## 下载链接
http://downloads.zend.com/guard/5.5.0/ZendGuardLoader-php-5.3-linux-glibc23-x86_64.tar.gz
 
## 安装过程
# tar zxvf ZendGuardLoader-php-5.3-linux-glibc23-x86_64.tar.gz 
# mv ZendGuardLoader-php-5.3-linux-glibc23-x86_64 /usr/local/zend
# vim /usr/local/php/etc/php.ini
******************************************
[Zend Optimizer]
zend_extension=/usr/local/zend/php-5.3.x/ZendGuardLoader.so
zend_loader.enable=1
zend_loader.disable_licensing=0
zend_loader.obfuscation_level_support=3
zend_loader.license_path=
******************************************

php:5.2.17+php-fpm
2016年7月21日
10:35
 
wget http://museum.php.net/php5/php-5.2.17.tar.gz
tar zxvf php-5.2.17.tar.gz
wget http://php-fpm.org/downloads/php-5.2.17-fpm-0.5.14.diff.gz
gzip -cd php-5.2.17-fpm-0.5.14.diff.gz |patch  -d php-5.2.17 -p1
 
## error: Cannot find ldap libraries in /usr/lib
yum install openldap openldap-clients openldap-devel openldap-servers
cp -frp /usr/lib64/libldap* /usr/lib/
 
## configure: error: Cannot find MySQL header files under yes.
yum install mysql-devel
 
 
./configure --prefix=/usr/local/php -with-config-file-path=/usr/local/php/etc -with-mysql=/usr/local/mysql -with-mysqli=/usr/local/mysql/bin/mysql_config -with-openssl -enable-fpm -enable-fastcgi -enable-force-cgi-redirect -enable-mbstring -with-freetype-dir -with-jpeg-dir -with-png-dir -with-zlib-dir -with-libxml-dir=/usr -enable-xml -with-mhash -with-mcrypt -enable-pcntl -enable-sockets  -with-bz2 -with-curl -with-curlwrappers -enable-mbregex -with-gd -enable-gd-native-ttf -enable-zip -enable-soap -with-iconv -enable-bcmath -enable-shmop -enable-sysvsem -enable-inline-optimization -with-ldap -with-ldap-sasl -enable-pdo -with-pdo-mysql
 
## iconv错误
make ZEND_EXTRA_LIBS='-liconv'
make install
 
cp sapi/cgi/fpm/init.d/php-fpm.in /etc/init.d/php-fpm
chmod 755 /etc/init.d/php-fpm
 
cp php.ini-recommended /usr/local/php/etc/php.ini
cp sapi/cgi/fpm/conf/php-fpm.conf.in /usr/local/php/etc/php-fpm.conf

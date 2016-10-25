GIT安装
2015年8月7日
11:22
 
# wget https://codeload.github.com/git/git/zip/master  
# unzip master
# cd git-master/
# vi INSTALL                             #查看安装引导
$ make configure ;# as yourself
$ ./configure --prefix=/usr ;# as yourself
$ make all doc ;# as yourself
# make install install-doc install-html;# as root
 
##报错
# make configure
    GEN configure
/bin/sh: autoconf: command not found
# yum install autoconf
 
##安装
# make configure
    GEN configure
# ./configure --prefix=/usr/local/git
 
##报错
# make all doc
......
 #include <zlib.h>
                  ^
compilation terminated.
make: *** [credential-store.o] Error 1
# yum install zlib-devel
##后面又陆续安装
# yum install perl-devel
# yum install asciidoc
# yum install xmlto
 
##
# make install install-doc install-html

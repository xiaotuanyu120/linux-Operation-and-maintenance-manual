error: 服务无法启动报错
2015年10月27日 星期二
17:21
 
mysql服务无法启动报错
==============================
报错信息：
Starting MySQL. ERROR! Manager of pid-file quit without updating file.
分析过程：
系统版本-centos 6.7；
mysqld服务状态是停止；
查看之前的操作修改过datadir的属主和属组为mysql用户，然后重启就报错了；
分析出datadir和basedir位置；
尝试解决办法：
1、在/etc/init.d/mysqld中指定datadir和basedir；报错依旧
2、最后老大解决了，问题是，迁移datadir的时候，把datadir里的一些文件拷贝到一个错误路径去了。 
需要补充的知识点，datadir中会有什么文件，都起什么作用
==============================
datadir中的内容：
# ll .
????? 2260
drwx------ 2 mysql mysql   4096 10?? 27 17:31 mysql
-rw-r----- 1 mysql mysql  18855 10?? 27 17:31 mysql-bin.000001
-rw-r----- 1 mysql mysql 677162 10?? 27 17:31 mysql-bin.000002
-rw-r----- 1 mysql mysql    933 10?? 27 17:31 mysql-bin.000003
-rw-r----- 1 mysql mysql 677162 10?? 27 17:31 mysql-bin.000004
-rw-r----- 1 mysql mysql     76 10?? 27 17:31 mysql-bin.index
-rw-rw---- 1 mysql mysql  10116 10?? 27 17:39 srv9092.ubiquityservers.com.err
-rw-rw---- 1 mysql mysql      6 10?? 27 17:39 srv9092.ubiquityservers.com.pid
drwx------ 2 mysql mysql   4096 10?? 27 17:31 test
drwxrwxrwx 2 mysql mysql  12288 10?? 27 15:59 www_025yuhuashi_com
drwxrwxrwx 2 mysql mysql  12288 10?? 27 15:59 www_61788852_com
。。。。。。
各文件的说明：
# file mysql-bin.000001
mysql-bin.000001: MySQL replication log
## 这些文件都是mysql的操作文件
# file mysql-bin.index
mysql-bin.index: ASCII text
## 顾名思义，应该是mysql-bin文件的索引
 
每一个目录对应一个数据库
# ll www_zhenzhu365_com/
????? 248
-rwxrwxrwx 1 mysql mysql    61 10?? 27 16:01 db.opt
-rwxrwxrwx 1 mysql mysql  8882 10?? 27 16:01 emlog_attachment.frm
-rwxrwxrwx 1 mysql mysql  8722 10?? 27 16:01 emlog_twitter.frm
-rwxrwxrwx 1 mysql mysql     0 10?? 27 16:01 emlog_twitter.MYD
-rwxrwxrwx 1 mysql mysql  1024 10?? 27 16:01 emlog_twitter.MYI
-rwxrwxrwx 1 mysql mysql  8852 10?? 27 16:01 emlog_user.frm
-rwxrwxrwx 1 mysql mysql    60 10?? 27 16:01 emlog_user.MYD
-rwxrwxrwx 1 mysql mysql  3072 10?? 27 16:01 emlog_user.MYI
文件说明：
* db.opt) 此文件记录了该库默认的字符集编码和字符集编码优先级的规则，只会影响到新建的表，如果此文件被删除的话，新建表会依据全局设置进行设置
* *.frm) 与表相关的元数据(meta)信息都存放在".frm"文件,包括表结构的定义信息等,不论是什么存储引擎,每一个表都会有一个以表名命名的".frm"文件,所有的".frm"文件都存放在所属数据库的文件夹下面.
* *.MYD) 是MyISAM存储引擎专用的,存放MyISAM表的数据,每一个MyISAM表都会有一个".MYD"文件与之对应,它同样存放于所属数据库的文件夹下,和".frm"文件在一起.
* *.MYI)是专属于MyISAM存储引擎的,主要存放MyISAM表的索引相关信息,对于MyISAM存储来说,可以被缓坡的内容主要就是来源于"MYI"文件中,每一个MyISA表对应一个"MYI"文件,其存放的位置和".frm"及".MYD"一样.
* *.ibd和*.ibdata) 这两种文件都是存放在InnoDB数据的文件,之所以用两种文件来存放InnoDB的数据,是因为InnoDB的数据存储方式能够通过配置来决定是使用共享表空间存放存储数据,还是用独享表空间存放存储数据.独享表空间存储方式使用".ibd"文件来存放数据,且每个表一个".ibd"文件,文件存放在和MyISAM数据相同的位置,如果选用共享存储表空间来存放数据,则会使用ibdata文件,所有表共同使用一个ibdata文件.
PS：
其中比较特殊的两个数据库是mysql和test，mysql中保存的是mysql软件的一些用户权限和之类的软件相关的设置项。 

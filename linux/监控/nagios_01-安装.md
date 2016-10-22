nagios: 01-安装
2016年6月8日
21:27
 
0，环境准备
==========================
## 环境包安装
# yum install gcc glibc glibc-common gd gd-devel -y
 
## httpd，php安装
# yum install httpd php -y 
1，创建用户
==========================
## 创建nagios用户
# useradd -m nagios
# passwd nagios
 
## 创建nagcmd用户组，并将apache、nagios加入此组
# usermod -a -G nagcmd nagios
# usermod -a -G nagcmd apache
  
2，下载nagios及其插件
==========================
# cd /usr/local/src
# wget http://prdownloads.sourceforge.net/sourceforge/nagios/nagios-4.0.8.tar.gz
# wget http://www.nagios-plugins.org/download/nagios-plugins-2.0.3.tar.gz 
3，编译安装nagios
==========================
## 编译安装nagios
# tar zxvf nagios-4.0.8.tar.gz
# cd nagios-4.0.8
# ./configure --prefix=/usr/local/nagios --with-command-group=nagcmd
# make all
 
## 安装主程序，CGIs和HTML文件
# make install
 
## 安装init脚本(/etc/rc.d/init.d/nagios)
# make install-init
 
## 安装配置文件(${prefix}/etc目录下)
# make install-config
 
## 创建外部命令所在目录及配置其权限(${prefix}/var/rw)
# make install-commandmode
 
 
## 扩展-编译安装选项
If the main program and CGIs compiled without any errors, you
can continue with installing Nagios as follows (type 'make'
without any arguments for a list of all possible options):
 
  make install
     - This installs the main program, CGIs, and HTML files
 
  make install-init
     - This installs the init script in /etc/rc.d/init.d
 
  make install-commandmode
     - This installs and configures permissions on the
       directory for holding the external command file
 
  make install-config
     - This installs *SAMPLE* config files in /usr/local/nagios/etc
       You'll have to modify these sample files before you can
       use Nagios.  Read the HTML documentation for more info
       on doing this.  Pay particular attention to the docs on
       object configuration files, as they determine what/how
       things get monitored!
 
  make install-webconf
     - This installs the Apache config file for the Nagios
       web interface
 
  make install-exfoliation
     - This installs the Exfoliation theme for the Nagios
       web interface
 
  make install-classicui
     - This installs the classic theme for the Nagios
       web interface 
4，修改配置文件，配置报警邮箱
==========================
# vi /usr/local/nagios/etc/objects/contacts.cfg
************************************
define contact{
        contact_name                    nagiosadmin
        use                             generic-contact
        alias                           Nagios Admin
 
        email                           igameyunwei2@gmail.com
        }
************************************ 
5，配置web界面
==========================
## 安装web配置文件
# make install-webconf
 
## 准备nagiosadmin账户，用来访问nagios的web页面
# htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin
 
# service httpd restart 
6，编译安装nagios插件
==========================
# cd /usr/local/src/
# tar zxvf nagios-plugins-2.0.3.tar.gz
# cd nagios-plugins-2.0.3
# ./configure --prefix=/usr/local/nagios --with-nagios-user=nagios --with-nagios-group=nagios
# make
# make install 
7，启动服务
==========================
# chkconfig --add nagios
# chkconfig nagios on
 
## 检查配置
# /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
 
# service nagios start 
8，检查访问
==========================

 
## 如不能访问，确保防火墙放行了80端口，selinux是否关闭
## 访问时需要输入在上面创建的nagiosadmin账户及密码，htpasswd的配置在
# vim /etc/httpd/conf.d/nagios.conf
************************************
<Directory "/usr/local/nagios/sbin">
   ...
   AuthName "Nagios Access"
   AuthType Basic
   AuthUserFile /usr/local/nagios/etc/htpasswd.users
   Require valid-user
   ...
</Directory>
 
...
 
<Directory "/usr/local/nagios/share">
   ...
   AuthName "Nagios Access"
   AuthType Basic
   AuthUserFile /usr/local/nagios/etc/htpasswd.users
   Require valid-user
</Directory>
************************************
  

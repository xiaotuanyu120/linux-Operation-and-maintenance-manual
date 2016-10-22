how to install iredmail with existed mysql database
2015年2月6日
下午 12:16
 
 Installation_Tips  
Advanced Installation Tips for iRedMail
Updated Sep 25, 2009 by michaelb...@gmail.com
How to Use Exist MySQL Server
If you already have MySQL server running in your local net, you can use it to store virtual domains and users.
***********************************************************
****    WARNING: BACKUP ALL DATA BEFORE WE GO FURTHER. ****
***********************************************************
1. Configure iRedMail as above, but when it ask 'Contine? [Y|n]', choose no to continue:
Configuration completed.
 
*************************************************************************
**************************** WARNNING ***********************************
*************************************************************************
*                                                                       *
* Please do remember to *REMOVE* configuration file after installation  *
* completed successfully.                                               *
*                                                                       *
*   * /root/iRedMail-x.y.z/config   # <- config file location
*                                                                       *
*************************************************************************
 
<<< iRedMail >>> Continue? [Y|n]   # <-- Type 'n' or 'N' here to exit installation
<<< iRedMail >>> Canceled, Exit.
2. Edit 'iRedMail-x.y.z/conf/mysql', find these variables:
export MYSQL_FRESH_INSTALLATION='YES'
export MYSQL_SERVER='127.0.0.1'
export MYSQL_PORT='3306'
export MYSQL_SOCKET='/var/lib/mysql/mysql.sock'
export MYSQL_ROOT_USER='root'
export MYSQL_ROOT_PASSWD='passwd'
3. Use your exist MySQL server info here:
export MYSQL_FRESH_INSTALLATION='NO'    # <- Set to 'NO' so that iRedMail won't install mysql-server.
export MYSQL_SERVER='192.168.122.249'   # <- MySQL server address.
export MYSQL_PORT='3306'                # <- MySQL server port.
export MYSQL_SOCKET='/var/lib/mysql/mysql.sock'
export MYSQL_ROOT_USER='root'           # <- MySQL root user, iRedMail will use it to import some databases.
export MYSQL_ROOT_PASSWD='secret'       # <- MySQL root user's password.
4. If your Apache and PHP are not installed in standard directory, you should edit 'conf/httpd' to change them:
#
# HTTPD_SERVERROOT: Apache server root, default is
#   - /var/www (RHEL/CentOS)
#   - /usr/share/apache2 (Debian)
# HTTPD_DOCUMENTROOT: Document root, default is
#   - /var/www/html (RHEL/CentOS)
#   - /var/www/default-site (Debian)
#
export HTTPD_SERVERROOT='/var/www'
export HTTPD_DOCUMENTROOT="${HTTPD_SERVERROOT}/html/"
export HTTPD_CONF="/etc/httpd/conf/httpd.conf"
export HTTPD_CONF_DIR="/etc/httpd/conf.d"
export PHP_MODULES_DIR="${HTTPD_SERVERROOT}/lib/php/modules/"
export HTTPD_SSL_CONF="${HTTPD_CONF_DIR}/ssl.conf"
 
# ---- PHP ----
export PHP_INI='/etc/php.ini'
5. If you already have all Apache+PHP+MySQL related binary packages installed, you must tell iRedMail not to install them in conf/global:
export USE_EXIST_AMP='YES'
6. If you just want iRedMail not to install MySQL related binary packages, you must edit 'functions/packages.sh', remove mysql related packages. Such as php-mysql, mysql-server, mysql, mysql-client, etc.
7. OK, re-execute the main script:
# bash iRedMail.sh
<<< iRedMail >>> Check configuration file: /root/iRedMail-x.y.z/config... Found.
<<< Question >>> Use it for mail server setting? [y|N]y             # <- Type 'y' or 'Y' here
<<< iRedMail >>> Use configuration file: /root/iRedMail-x.y.z/config for mail server setting.
...
How to use mbox format
Although maildir is recommended (more popular, better performance) and default mailbox format, but iRedMail also support mbox format.
Modify 'iRedMail-x.y.z/conf/global', change 'HOME_MAILBOX' to 'mbox' before you start iRedMail installation:
# Maildir format: mbox, Maildir.
HOME_MAILBOX='mbox'
Start iRedMail installation now.
 
From <https://code.google.com/p/iredmail/wiki/Installation_Tips> 
 

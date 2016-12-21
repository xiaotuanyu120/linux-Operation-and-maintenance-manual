---
title: 1.0 silent模式安装oracle 11G R2
date: 2016-12-20 11:53:00
categories: database/oracle
tags: [database,oracle]
---
### 1.0 silent模式安装oracle 11G R2

---

### 0. 环境介绍
- oracle version: oracle 11g R2
- os version: centos 6.8 x64

### 1. 系统配置及准备
#### 1) 切换到root用户
``` bash
su - root
```
#### 2) 增加用户组
``` bash
# --groups for database management
# --groups id are the same as for 12C installations
# --some groups are not required here but can be used
# --later for grid binaries installation
groupadd -g 54321 oinstall
groupadd -g 54322 dba
groupadd -g 54323 oper
groupadd -g 54327 asmdba
groupadd -g 54328 asmoper
groupadd -g 54329 asmadmin
```
#### 3) 增加用户
``` bash
useradd -u 54321 -g oinstall -G dba,oper,asmadmin oracle
passwd oracle
```
#### 4) 内核参数修改
``` bash
# add kernel parameters to /etc/sysctl.conf
vim /etc/sysctl.conf
*****************************
kernel.shmmni = 4096
kernel.shmmax = 4398046511104
kernel.shmall = 1073741824
kernel.sem = 250 32000 100 128

fs.aio-max-nr = 1048576
fs.file-max = 6815744
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048586
*****************************
sysctl -p

# change limits.conf
vim /etc/security/limits.conf
*****************************
oracle   soft   nproc    131072
oracle   hard   nproc    131072
oracle   soft   nofile   131072
oracle   hard   nofile   131072
oracle   soft   core     unlimited
oracle   hard   core     unlimited
oracle   soft   memlock  50000000
oracle   hard   memlock  50000000
*****************************
```
#### 5) 修改hosts文件及hostname
``` bash
# edit /etc/hosts
vi /etc/hosts
*****************************
127.0.0.1   oel6 oel6.dbaora.com localhost localhost.localdomain localhost4 localhost4.localdomain4
*****************************
# edit hostname
vi /etc/sysconfig/network
*****************************
HOSTNAME=oel6.dbaora.com
*****************************
hostname oel6.dbaora.com
```
#### 6) 修改oracle用户的环境变量
``` bash
## EDIT .bash_profile FOR USER oracle
vi /home/oracle/.bash_profile
*****************************
# Oracle Settings
export TMP=/tmp

export ORACLE_HOSTNAME=oel6.dbaora.com
export ORACLE_UNQNAME=ORA11G
export ORACLE_BASE=/ora01/app/oracle
export ORACLE_HOME=$ORACLE_BASE/product/11.2.0/db_1
export ORACLE_SID=ORA11G

PATH=/usr/sbin:$PATH:$ORACLE_HOME/bin
export PATH

export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib;
export CLASSPATH=$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib;

alias cdob='cd $ORACLE_BASE'
alias cdoh='cd $ORACLE_HOME'
alias tns='cd $ORACLE_HOME/network/admin'
alias envo='env | grep ORACLE'

umask 022
*****************************
```
#### 7) 创建oracle相关目录和检查并安装环境包
``` bash
## 创建 ORACLE_HOME 和 ORACLE_BASE
mkdir -p /ora01/app/oracle
mkdir -p /ora01/app/oracle/product/11.2.0/db_1

## 检查环境包
rpm -q --qf '%{NAME}-%{VERSION}-%{RELEASE}(%{ARCH})\n' binutils compat-libstdc++-33 elfutils-libelf elfutils-libelf-devel gcc gcc-c++ glibc glibc-common glibc-devel glibc-headers ksh libaio libaio-devel libgcc libstdc++ libstdc++-devel make sysstat unixODBC unixODBC-devel
# 安装检查结果是未安装的环境包
yum install compat-libstdc++-33 elfutils-libelf-devel gcc gcc-c++ ksh libaio-devel libstdc++-devel unixODBC unixODBC-devel
```
#### 8) oracle程序及oracle环境变量准备
``` bash
# 切换到oracle用户
su - oracle
cd /home/oracle/
# 解压oracle程序
unzip linux.x64_11gR2_database_1of2.zip
unzip linux.x64_11gR2_database_2of2.zip

# 检查 envo 变量
envo
ORACLE_UNQNAME=ORA11G
ORACLE_SID=ORA11G
ORACLE_BASE=/ora01/app/oracle
ORACLE_HOSTNAME=oel6.dbaora.com
ORACLE_HOME=/ora01/app/oracle/product/11.2.0/db_1
# 检查 alias cdob 和 cdoh
cdob
pwd
/ora01/app/oracle

cdoh
pwd
/ora01/app/oracle/product/11.2.0/db_1
```
#### 9) 编辑db_install.rsp并安装oracle程序
``` bash
# database/response中有silent模式安装需要的rsp文件
ls /home/oracle/database/response/
dbca.rsp  db_install.rsp  netca.rsp
# db_install.rsp – used to install oracle binaries, install/upgrade a  database in silent mode
# dbca.rsp – used to install/configure/delete a database in silent mode
# netca.rsp – used to configure simple network for oracle database in silent mode

# 编辑db_install.rsp
cd /home/oracle/database/response/
cp db_install.rsp db_install.rsp.bak
vim db_install.rsp
*****************************
# --force to install only database software
oracle.install.option=INSTALL_DB_SWONLY

# --set your hostname
ORACLE_HOSTNAME=oel6.dbaora.com

# --set unix group for oracle inventory
UNIX_GROUP_NAME=oinstall

# --set directory for oracle inventory
INVENTORY_LOCATION=/ora01/app/oraInventory

# --set oracle home for binaries
ORACLE_HOME=/ora01/app/oracle/product/11.2.0/db_1

# --set oracle home for binaries
ORACLE_BASE=/ora01/app/oracle

# --set version of binaries to install
# -- EE - enterprise edition
oracle.install.db.InstallEdition=EE

# --force to install advanced options
oracle.install.db.isCustomInstall=false

# --specify which advanced option to install
# --  oracle.oraolap:11.2.0.4.0 - Oracle OLAP
# --  oracle.rdbms.dm:11.2.0.4.0 - Oracle Data Mining
# --  oracle.rdbms.dv:11.2.0.4.0 - Oracle Database Vault
# --  oracle.rdbms.lbac:11.2.0.4.0 - Oracle Label Security
# --  oracle.rdbms.partitioning:11.2.0.4.0 - Oracle Partitioning
# --  oracle.rdbms.rat:11.2.0.4.0 - Oracle Real Application Testing
oracle.install.db.customComponents=oracle.server:11.2.0.1.0,oracle.sysman.ccr:10.2.7.0.0,oracle.xdk:11.2.0.1.0,oracle.rdbms.oci:11.2.0.1.0,oracle.network:11.2.0.1.0,oracle.network.listener:11.2.0.1.0,oracle.rdbms:11.2.0.1.0,oracle.options:11.2.0.1.0,oracle.rdbms.partitioning:11.2.0.1.0,oracle.oraolap:11.2.0.1.0,oracle.rdbms.dm:11.2.0.1.0,oracle.rdbms.dv:11.2.0.1.0,orcle.rdbms.lbac:11.2.0.1.0,oracle.rdbms.rat:11.2.0.1.0

# --specify extra groups for database management
oracle.install.db.DBA_GROUP=dba
oracle.install.db.OPER_GROUP=oper

#------------------------------------------------------------------------------
# Specify whether to enable the user to set the password for
# My Oracle Support credentials. The value can be either true or false.
# If left blank it will be assumed to be false.
#
# Example    : SECURITY_UPDATES_VIA_MYORACLESUPPORT=true
#------------------------------------------------------------------------------
SECURITY_UPDATES_VIA_MYORACLESUPPORT=false

#------------------------------------------------------------------------------
# Specify whether user wants to give any proxy details for connection.
# The value can be either true or false. If left blank it will be assumed
# to be false.
#
# Example    : DECLINE_SECURITY_UPDATES=false
#------------------------------------------------------------------------------
DECLINE_SECURITY_UPDATES=true
*****************************

# 使用root身份，修改目录权限
su -
chown -R oracle:oinstall /ora01/

## 切换回oracle，并启动安装程序
su - oracle
./runInstaller -silent -responseFile /home/oracle/database/response/db_install.rsp -ignorePrereq
Starting Oracle Universal Installer...

Checking Temp space: must be greater than 120 MB.   Actual 35584 MB    Passed
Checking swap space: must be greater than 150 MB.   Actual 3132 MB    Passed
Preparing to launch Oracle Universal Installer from /tmp/OraInstall2016-12-20_07-35-46PM. Please wait ...[oracle@oel6 database]$ You can find the log of this install session at:
 /ora01/app/oraInventory/logs/installActions2016-12-20_07-35-46PM.log
The following configuration scripts need to be executed as the "root" user.
 #!/bin/sh
 #Root scripts to run

/ora01/app/oraInventory/orainstRoot.sh
/ora01/app/oracle/product/11.2.0/db_1/root.sh
To execute the configuration scripts:
	 1. Open a terminal window
	 2. Log in as "root"
	 3. Run the scripts
	 4. Return to this window and hit "Enter" key to continue

Successfully Setup Software.

## 以root身份登陆新的ssh会话，然后执行以下命令
sh /ora01/app/oraInventory/orainstRoot.sh
Changing permissions of /ora01/app/oraInventory.
Adding read,write permissions for group.
Removing read,write,execute permissions for world.

Changing groupname of /ora01/app/oraInventory to oinstall.
The execution of the script is complete.

sh /ora01/app/oracle/product/11.2.0/db_1/root.sh
Check /ora01/app/oracle/product/11.2.0/db_1/install/root_oel6.dbaora.com_2016-12-20_19-40-29.log for the output of root script

## 以root身份执行完以上两个脚本后，回到oracle用户的ssh会话，然后按下enter键

## 检测安装成果
sqlplus / as sysdba

SQL*Plus: Release 11.2.0.1.0 Production on Tue Dec 20 19:47:02 2016

Copyright (c) 1982, 2009, Oracle.  All rights reserved.

Connected to an idle instance.

SQL> exit
Disconnected
```
#### 10) 安装net 监听
``` bash
## Configure Oracle Net
cd /home/oracle/database/response/
cp netca.rsp netca.rsp.bck
export DISPLAY=127.0.0.1:1.0
netca -silent -responseFile /home/oracle/database/response/netca.rsp

Parsing command line arguments:
    Parameter "silent" = true
    Parameter "responsefile" = /home/oracle/database/response/netca.rsp
Done parsing command line arguments.
Oracle Net Services Configuration:
Profile configuration complete.
Oracle Net Listener Startup:
    Running Listener Control:
      /ora01/app/oracle/product/11.2.0/db_1/bin/lsnrctl start LISTENER
    Listener Control complete.
    Listener started successfully.
Listener configuration complete.
Oracle Net Services configuration successful. The exit code is 0

## Check LISTENER status
lsnrctl status

LSNRCTL for Linux: Version 11.2.0.1.0 - Production on 20-DEC-2016 21:14:49

Copyright (c) 1991, 2009, Oracle.  All rights reserved.

Connecting to (DESCRIPTION=(ADDRESS=(PROTOCOL=IPC)(KEY=EXTPROC1521)))
STATUS of the LISTENER
------------------------
Alias                     LISTENER
Version                   TNSLSNR for Linux: Version 11.2.0.1.0 - Production
Start Date                20-DEC-2016 21:14:00
Uptime                    0 days 0 hr. 0 min. 54 sec
Trace Level               off
Security                  ON: Local OS Authentication
SNMP                      OFF
Listener Parameter File   /ora01/app/oracle/product/11.2.0/db_1/network/admin/listener.ora
Listener Log File         /ora01/app/oracle/diag/tnslsnr/oel6/listener/alert/log.xml
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(KEY=EXTPROC1521)))
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=oel6)(PORT=1521)))
Services Summary...
Service "ORCL" has 1 instance(s).
  Instance "ORA11G", status BLOCKED, has 1 handler(s) for this service...
The command completed successfully
```
#### 11) 使用dbca初始化数据库
``` bash
## Prepare directories for database datafiles and flash recovery area
mkdir /ora01/app/oracle/oradata
mkdir /ora01/app/oracle/flash_recovery_area

## Configure database
cd /home/oracle/database/response/
cp dbca.rsp dbca.rsp.bak
vi dbca.rsp
*****************************
--global database name
GDBNAME = "ORA11G.dbaora.com"

--instance database name
SID = "ORA11G"

--template name used to create database
TEMPLATENAME = "General_Purpose.dbc"

--password for user sys
SYSPASSWORD = "oracle"

--password for user system
SYSTEMPASSWORD = "oracle"

--creates database console
EMCONFIGURATION = "LOCAL"

--password for sysman user
SYSMANPASSWORD = "oracle"

--password for dbsnmp user
DBSNMPPASSWORD = "oracle"

--default directory for oracle database datafiles
DATAFILEDESTINATION=/ora01/app/oracle/oradata

--default directory for flashback dataa
RECOVERYAREADESTINATION=/ora01/app/oracle/flash_recovery_area

--storage used to create database
--FS - it means OS data files
STORAGETYPE=FS

--database character set
CHARACTERSET = "AL32UTF8"

--national database character set
NATIONALCHARACTERSET= "AL16UTF16"

--listener name to register database to
LISTENERS = "LISTENER"

--force to install sample schemas on the database
SAMPLESCHEMA=TRUE

--specify database type
--has influence on some instance parameters
DATABASETYPE = "OLTP"

--force to use autmatic mamory management
AUTOMATICMEMORYMANAGEMENT = "TRUE"

--defines size of memory used by the database
TOTALMEMORY = "800"
*****************************

## run database installation
dbca -silent -responseFile /home/oracle/database/response/dbca.rsp
Copying database files
1% complete
3% complete
37% complete
Creating and starting Oracle instance
40% complete
45% complete
50% complete
55% complete
56% complete
60% complete
62% complete
Completing Database Creation
66% complete
70% complete
73% complete
85% complete
96% complete
100% complete
Look at the log file "/ora01/app/oracle/cfgtoollogs/dbca/ORA11G/ORA11G.log" for further details.

## 检测效果
sqlplus / as sysdba

SQL*Plus: Release 11.2.0.1.0 Production on Tue Dec 20 14:43:49 2016

Copyright (c) 1982, 2009, Oracle.  All rights reserved.


Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options

SQL> show parameter db_name

NAME				     TYPE	 VALUE
------------------------------------ ----------- ------------------------------
db_name 			     string	 ORA11G
SQL>

## Check status of database console
emctl status dbconsole
Oracle Enterprise Manager 11g Database Control Release 11.2.0.1.0
Copyright (c) 1996, 2009 Oracle Corporation.  All rights reserved.
https://oel6.dbaora.com:1158/em/console/aboutApplication
Oracle Enterprise Manager 11g is running.
------------------------------------------------------------------
Logs are generated in directory /ora01/app/oracle/product/11.2.0/db_1/oel6.dbaora.com_ORA11G/sysman/log
```

---

### 2. 错误
#### 1) email error
安装提示email错误  
**解决办法**
``` bash
# 增加这两个配置
SECURITY_UPDATES_VIA_MYORACLESUPPORT=false
DECLINE_SECURITY_UPDATES=true
```
#### 2) preparation error
```
INS-13013: Target environment do not meet some mandatory requirements.
    Cause: Some of the mandatory prerequisites are not met. See logs for details.
```
**解决办法**
``` bash
# 增加-ignorePrereq
./runInstaller -silent -responseFile /home/oracle/database/response/db_install.rsp -ignorePrereq
```

- [oracle offical docs about "how to install oracle using response files"](http://docs.oracle.com/cd/E11882_01/install.112/e47689/app_nonint.htm#LADBI1342)
- [参考链接1](http://dbaora.com/install-oracle-in-silent-mode-11g-release-2-11-2/)
- [参考链接2](https://www.krenger.ch/blog/11g-silent-installation-error/)
- [参考链接3](https://oracle-base.com/blog/2011/02/13/oracle-11gr2-on-oracle-linux-6/)
- [参考链接4](http://www.apoyl.com/?p=1536)

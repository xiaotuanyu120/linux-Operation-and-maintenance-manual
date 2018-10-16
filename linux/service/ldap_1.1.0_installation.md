---
title: ldap 1.0.0: installation
date: 2018-10-16 10:16:00
categories: linux/service
tags: [ldap]
---
### ldap 1.0.0: installation

---

### 1. ldap安装过程
[参考博客](https://blog.csdn.net/laputa_sky/article/details/80356270)
``` bash
# 安装openldap
yum -y install openldap compat-openldap openldap-clients openldap-servers openldap-servers-sql openldap-devel migrationtools

# 检测版本
slapd -VV
@(#) $OpenLDAP: slapd 2.4.44 (May 16 2018 09:55:53) $
	mockbuild@c1bm.rdu2.centos.org:/builddir/build/BUILD/openldap-2.4.44/openldap-2.4.44/servers/slapd

# 提前准备密码加密字符串
slappasswd -s vbigmaster123456
{SSHA}J2RpecQNk3/kTf2bhTYuqwBQQibjXSot

# 配置openldap
# 2.4.44版本已经弃用了slapd.conf，改为使用slapd.d目录里面的ldif格式的配置文件
vim /etc/openldap/slapd.d/cn\=config/olcDatabase\=\{2\}hdb.ldif
*******************************************************************
# edit
olcSuffix: dc=ilanni,dc=com
olcRootDN: cn=root,dc=ilanni,dc=com

# add
olcRootPW: {SSHA}J2RpecQNk3/kTf2bhTYuqwBQQibjXSot
*******************************************************************

vim /etc/openldap/slapd.d/cn\=config/olcDatabase\=\{1\}monitor.ldif
*******************************************************************
#olcAccess: {0}to * by dn.base="gidNumber=0+uidNumber=0,cn=peercred,cn=extern
# al,cn=auth" read by dn.base="cn=Manager,dc=my-domain,dc=com" read by * none
olcAccess: {0}to * by dn.base="gidNumber=0+uidNumber=0,cn=peercred,cn=extern
 al,cn=auth" read by dn.base="cn=root,dc=ilanni,dc=com" read by * none
*******************************************************************

# 测试配置文件格式
slaptest -F /etc/openldap/slapd.d/

# 启动openldap服务
systemctl enable slapd
systemctl start slapd
systemctl status slapd

netstat -antup | grep 389
tcp        0      0 0.0.0.0:389             0.0.0.0:*               LISTEN      94938/slapd         
tcp6       0      0 :::389                  :::*                    LISTEN      94938/slapd 

# 准备数据库文件
cp /usr/share/openldap-servers/DB_CONFIG.example /var/lib/ldap/DB_CONFIG
chown ldap:ldap -R /var/lib/ldap
chmod 700 -R /var/lib/ldap

# 导入外部配置
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/openldap/schema/cosine.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/openldap/schema/nis.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/openldap/schema/inetorgperson.ldif


vim /usr/share/migrationtools/migrate_common.ph +71
*******************************************************************
$DEFAULT_MAIL_DOMAIN = "ilanni.com";
$DEFAULT_BASE = "dc=ilanni,dc=com";
$EXTENDED_SCHEMA = 1;
*******************************************************************
```
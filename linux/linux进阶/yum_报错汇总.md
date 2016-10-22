yum: 报错汇总
2016年6月17日
9:43
 
错误信息：
# yum install ntp 
rpmdb: PANIC: fatal region error detected; run recovery
error: db3 error(-30974) from dbenv->open: DB_RUNRECOVERY: Fatal error, run database recovery
error: cannot open Packages index using db3 -  (-30974)
error: cannot open Packages database in /var/lib/rpm
CRITICAL:yum.main:
 
Error: rpmdb open failed
 
解决方案：
## 备份rpm数据文件，删除，重建，yum清除缓存
# mkdir /root/backup.rpm.20160617
# cp -avr /var/lib/rpm/ /root/backup.rpm.20160617/
# rm -rf /var/lib/rpm/__db*
# db_verify /var/lib/rpm/Packages 
# rpm --rebuilddb
# yum clean all

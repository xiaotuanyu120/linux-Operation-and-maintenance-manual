SHELL: 定期备份及删除备份文件
2016年1月31日
21:31
 
#!/bin/bash
 
# author: zack
# date:   20160131
# for:    backup /sites
 
# 备份源目录和目标目录
sitesdir="/sites"
backupdir="/home/bakfile"
 
# 备份文件名称
deststr=sites-`date +%Y%m%d`.tar.gz
 
# 备份命令
tar zcf $backupdir/$deststr $sitesdir
 
# 检查以"tar.gz"结尾的文件，超过5个，则删除最旧的一个
filenum=`/bin/ls $backupdir/site*|wc -l`
if [ $filenum > 5 ];
then
    /bin/mkdir /tmp/oldbak 2> /dev/null
    /bin/ls -rt $backupdir/*.tar.gz|head -n `expr $filenum - 5`|xargs -i /bin/mv {} /tmp/oldbak;
fi

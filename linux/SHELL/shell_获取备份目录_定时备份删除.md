---
title:
date: 2016-12-16 13:24:00
categories:
tags:
---
重点在于使用`ls -d`配合通配符`*`来获得目标目录
``` bash
#! /bin/bash
WEB_BASE="/home/weboffice"
CONFDIR="webapps/DFH_Office/WEB-INF/classes"

DATESTR=`date +%Y%m%d-%H%M`
BACKUP_BASE="/home/backup/configuration_backup"
BACKUP_DIR=${BACKUP_BASE}/${DATESTR}

# get list of dirs will been backup
i=0
for dir in `ls -d ${WEB_BASE}/*/${CONFDIR}`
do
  backup_dirs[$i]=$dir;
  i=$[$i+1];
done

# ensure backup dir exist
[ -d $BACKUP_BASE ] || /bin/mkdir -p $BACKUP_BASE >/dev/null 2>&1
[ -d $BACKUP_DIR ] || /bin/mkdir -p $BACKUP_DIR >/dev/null 2>&1

# backup configuration dirs
for classes in ${backup_dirs[@]}
do
  product_str=${classes#${WEB_BASE}/};
  product=${product_str%%/*};
  backup_dir=${BACKUP_DIR}/${product};
  [ -d $backup_dir ] || /bin/mkdir -p $backup_dir >/dev/null 2>&1;
  /bin/cp -r $classes $backup_dir;
done

# keep files only no longer than 7 days
filenum=`/bin/ls -l ${BACKUP_BASE}|grep -v total|wc -l`
[ $filenum -gt 7 ] && {
    ls -rt ${BACKUP_BASE}|head -n `expr $filenum - 7`|xargs -i rm -rf ${BACKUP_BASE}/{};
}
```

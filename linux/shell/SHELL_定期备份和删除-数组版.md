SHELL: 定期备份和删除-数组版
2016年8月12日
13:53
 
---
title: shell：定期备份和删除备份-数组版
date:
---
#!/bin/bash
 
# author: zpw
# date: 2016-08-12
 
bak_path=/headdump
bak_file=(core javacode headdump)
date_str=`date +%Y%m%d-%H%M%S`
rubbish_folder=/tmp/rubbish
 
# go to bak_path folder and backup file
cd $bak_path
for i in ${bak_file[@]};
do
    tar zcf ${i}-${date_str}.tar.gz ${i}
done
 
# keep files only no longer than 7 days
for i in ${bak_file[@]};
do
    filenum=`/bin/ls ${bak_path}/${i}*.tar.gz|wc -l`
    [ $filenum -gt 7 ] && {
        mkdir -p ${rubbish_folder}/${i} 2> /dev/null;
        ls -rt ${i}*.tar.gz|head -n `expr $filenum - 7`|xargs -i mv {} ${rubbish_folder}/${i};
    }
done

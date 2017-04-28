---
title: SHELL: 6.0 定期备份目录
date: 2016-07-26 10:37:00
categories: linux/shell
tags: [shell]
---
### 0. 需求
控制目标目录中以20开头的子目录(目录名称均为日期)不超过10个  
若超过10个，则将最老的子目录移动走

---

### 1. 脚本设计
筛选出20开头的子目录个数  
将目标子目录按照目录名称排序  
备份除了最新的10个目录之外的目录

---

### 2. 脚本内容
``` bash
#!/bin/bash

# author: zpw
# date:   20160726
# for:    mv oldfile

# 备份源目录和目标目录
srcdir=/friend/imgs
destdir=/home/friend/imgs

# 检查以"20"开头的目录，控制此类目录最大数目在$bak_dasy个
bak_days=10
filenum=`/bin/ls -dl $srcdir/20*|grep "^d"|wc -l`
[ ! -d $destdir ] && /bin/mkdir -p $destdir 2> /dev/null
[ $filenum -gt $bak_days ] && {
     /bin/ls -dr $srcdir/20*|tail -n `expr $filenum - $bak_days`|xargs -i /bin/mv {} $destdir
}
```

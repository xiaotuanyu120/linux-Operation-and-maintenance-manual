SHELL: 定期删除多余的目录
2016年7月26日
11:07

---
title: shell脚本：控制特殊名称的目录最大为3个
date: 2016-07-26 10:37:00
categories: shell
tags: shell
---
**需求：**
控制目标目录中以2016开头的子目录不超过3个
若超过3个，则将最老的子目录移动走

**脚本设计：**
通过ls命令和grep组合可以筛选出2016开头的子目录个数
通过ls的按照时间排序功能，可以将目标子目录按照时间排序
可用head来筛选出超出3个的部门，然后用xargs调用mv命令达到目地

<!--more-->


**脚本内容：**
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

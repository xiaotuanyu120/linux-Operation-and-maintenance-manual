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
srcdir=/tmp/test_sh
rubbish_dir=$srcdir/rubbish
 
# 检查以"2016"开头的目录，控制此类目录最大数目在3个
filenum=`/bin/ls -dl $srcdir/2016*|grep "^d"|wc -l`
if [ ! -d $rubbish_dir ]
then
    /bin/mkdir -p $rubbish_dir 2> /dev/null
fi
 
if [ $filenum -gt 3 ]
then
    /bin/ls -ldrt $srcdir/2016*|grep "^d"|head -n `expr $filenum - 3`|awk -F ' ' '{print $9}'|xargs -i /bin/mv {} $rubbish_dir;
fi
```

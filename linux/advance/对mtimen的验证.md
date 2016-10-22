---
title: 对mtime n的验证
date: 2014年12月31日
categories: 23:00
---
 
先提前看一下三个实验文件的日期，及分析它们之间的关系
[root@web01 mtime.d]# ll
total 8
drwxr-xr-x 3 root root 4096 Dec 25 17:44 shell
-rw-r--r-- 1 root root   30 Dec 27 16:46 test.sed
-rw-r--r-- 1 root root    0 Dec 31 22:59 today
<---------------------------------------------------------->
        |         |       |       |       |       |       |
       25     26    27    28    29    30   now              #每个刻度都是当日的23：00
       ⑥      ⑤     ④    ③     ②     ①   now     
由此分析，test.sed是27号16：46，在当天的23：00之前，所以在26-27刻度之间；
而shell是25号17：44，在当天的23：00之前，在25刻度之前。
[root@web01 mtime.d]# find . -maxdepth 1 -mtime 4
./test.sed   
n=4，但显示的结果是4-5之间，
所以说明"n"显示的是第n+1天内修改的文件
[root@web01 mtime.d]# find . -maxdepth 1 -mtime -4
.
./today
[root@web01 mtime.d]# find . -maxdepth 1 -mtime -5
.
./test.sed
./today
-n为-4时，显示的结果中没有了4-5之间的test.sed，但当-n为-5时显示有了test.sed，
所以说明"-n"显示的是n天以内修改的文件，包括第n天
[root@web01 mtime.d]# find . -maxdepth 1 -mtime +4
./shell
[root@web01 mtime.d]# find . -maxdepth 1 -mtime +3
./test.sed
./shell
+n为+3时，显示了shell与test.sed文件，但n为4时只显示了shell文件，
所以说明"+n"显示的是第n+1天之前修改的文件，并不包括第n+1天
 
综上所述：
*    -mtime  n ：n为数字，意为查询第n+1天当天24小时内改动过内容的文件；
*    -mtime +n ：意为查询 n+1天之前（不含n+1天本身）被改动过內容的文件；
*    -mtime -n ：列出在 n 天之內(含 n 天本身)被改动过内容的文件；
*    -newer file ：file 为一个已存文件，列出比 file被改动内容更早之前的文件。

上图摘自鸟哥教程
从上图可以看出，当n=4的时候
-mtime 4 是查询第5天改动过内容的文件；
-mtime +4 是查询5天前改动过内容的文件；
-mtime -4 是查询4天内改动过内容的文件。
 

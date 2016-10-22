杨坤出的sed、grep、find练习题
2014年12月11日
上午 10:15
 
1.搜索/etc/inittab文本，将以数字结尾的行显示出来；
答：
[root@web01 ~]# grep -n '[[:digit:]]$' /etc/inittab
23:#   5 - X11
[root@web01 ~]# grep -n '[0-9]$' /etc/inittab
23:#   5 - X11
 
2.搜索/etc/passwd文本，不区分大小写，将以root开头的行显示出来并显示行号；
答：
[root@web01 ~]# grep -in '^root' /etc/passwd
1:root:x:0:0:root:/root:/bin/bash
 
3.搜索/etc/passwd文本，查找当前系统上名字为bin的用户的帐号的相关信息，只将它的uid显示出来；
答：
[root@web01 ~]# grep  '^bin' /etc/passwd |sed 's/^bin.*x://g;s/...b.*$//g' 
[root@web01 ~]# grep  '^bin' /etc/passwd |cut -d ':' -f 3
 
4.删除/etc/fstab文件中的第一行和第二行；
答：
[root@web01 ~]# sed '1,2 d' /etc/fstab
 
5.删除/etc/fstab文件的第5行到最后一行；
答：
[root@web01 ~]# sed '5,$ d' /etc/fstab
 
6.删除/etc/passwd文件中含root的行；
答：
[root@web01 ~]# sed '/root/ d' /etc/passwd 
 
7.删除/etc/passwd文件中的第三行到第五行；
答：
[root@web01 ~]# sed '3,5 d' /etc/passwd
 
8.将/etc/passwd中所有的oot替换成OOT；
答：
[root@web01 ~]# sed 's/oot/OOT/g' /etc/passwd
 
9.删除/etc/inittab文件中的空白行；
答：
[root@web01 ~]# sed '/^$/ d' /etc/inittab
不过我的inittab里貌似没有空白行
 
10.将/etc/fstab中所有的/替换成#；
答：
[root@web01 ~]# sed 's/\//#/g' /etc/fstab
 
11.将/etc/fstab中除了空白行和以#开头的行以外的其他行显示出来并打印行号；
答：
[root@web01 ~]# grep -nvE '^#|^$' /etc/fstab
 
12.删除/etc/grub.conf文件中行首的空白字符(实际操作的时候可以先备份文件)；
答：
[root@web01 ~]# sed 's/^[[:space:]]\{1,\}//g' /etc/grub.conf
[root@web01 ~]# sed -r 's/^[ \t]+//g' /etc/grub.conf
[root@web01 ~]# sed -r 's/^\s+//g' /etc/grub.conf
 
13.替换/etc/inittab文件中"id:3:initdefault:"一行中的数字为5；
答：
[root@web01 ~]# grep 'id:3:init' /etc/inittab | sed 's/[[:digit:]]/5/g'
id:5:initdefault:
 
 
14.删除/etc/inittab文件中开头的#号；
答：
[root@web01 ~]# sed 's/#//g' /etc/inittab
 
15.承接第9题，将/etc/fstab中所有的/替换成#后，该文本中的#如果后面有空白字符那么就删掉该#号，如果没有则不删；
答：
[root@web01 ~]# sed 's/#\s//g' /etc/inittab
[root@web01 ~]# sed 's/#[[:space:]]//g' /etc/inittab
[root@web01 ~]# sed 's/# //g' /etc/inittab
 
16.使用sed取出文件路径/etc/rc.d的目录名称；
答：
[root@web01 ~]# ll -a /etc/rc.d |sed -n '/^d/'p |awk '{print $9}'
 
17.查找当前系统上没有属主或属组且最近1天内曾被访问过的文件，并将其属主属组均修改为root；
 
18.查找/etc目录下所有用户都没有写权限的文件，显示出其详细信息；
 
19.查找/etc目录下大于1M的文件，并将其文件名写入/tmp/etc.largefiles文件中；
 
20.你从网上下载下来的音频文件的文件名很多都带有空格。但是带有空格的文件名在linux(类Unix)系统里面是很不好的。怎样将所有你下载的mp3文件的文件名中的空格换成_ ；

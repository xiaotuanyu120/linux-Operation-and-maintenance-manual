坤哥awk练习题
2014年12月14日
21:42
 
1.在/etc/fstab文件中，以空格分隔字段，截取第二段的内容；
答：
[root@web01 ~]# awk '{print $2}' /etc/fstab
 
2.在/etc/passwd文件中，以/分隔字段，截取最后一段的内容；
答：
[root@web01 ~]# awk -F/ '{print NF}' /etc/passwd
 
3.在/etc/passwd文件中，以冒号分隔字段，截取其中的第三段，第四段和最后一段内容，其中第三段和第四段中间分隔符变为#；
答：
[root@web01 ~]# awk -F: '{printf("%-d#%-d %-s\n",$3,$4,$7)}' /etc/passwd
 
4.使用awk命令，截取出/etc/passwd文件中，包含root的行；
答：
[root@web01 ~]# awk '/root/' /etc/passwd
 
5.使用awk命令，截取出/etc/passwd文件中，以root开头的行；
答：
[root@web01 ~]# awk '/^root/' /etc/passwd
 
6.在/etc/passwd文件中，以冒号分隔字段，截取第三段包含数字5的行；
答：
[root@web01 ~]# awk -F: '$3~/5/' /etc/passwd
 
7.在/etc/passwd文件中，截取包含root的行，第一个字段为mail的行和第三个字段含4的行，并打印所有截取出来的行的行号；
答：
[root@web01 ~]# grep -n '[[:alnum:]]' /etc/passwd|awk -F: '$0~/root/;$2~/mail/;$4~/4/'
[root@web01 ~]# awk -F: '$0~/root/||$1~/mail/||$3~/4/{print NR,$0}' /etc/passwd 
 
8.在/etc/passwd文件中，以冒号分隔字段，截取最后一段不为/bin/bash的行；
答：
[root@web01 ~]# awk -F: '$7!="\/bin\/bash"' /etc/passwd
 
9.在/etc/passwd文件中，以冒号分隔字段，截取其中第三字段的值大于或者等于5且最后一段为/sbin/shutdown的行并打印行号；
答：
[root@web01 ~]# awk -F: '$3>=5&&$7~/\/sbin\/shutdown/{print NR,$0}' /etc/passwd
 
10.在/etc/passwd文件中，以冒号分隔字段，截取包含root的行或者以mail开头的行或者第三字段包含4的行；
答：
[root@web01 ~]# awk -F: '$0~/root/||$1~/^mail/||$3~/4/' /etc/passwd
 
11.在/etc/passwd文件中，以冒号分隔字段，计算每行有多少字段，并根据行号打印显示字段数，打印格式举例Line:1 7；
答：
[root@web01 ~]# awk -F: '{printf("line:%-2d %-2d\n",NR,NF)}' /etc/passwd
 
12.在/etc/passwd文件中，截取第5行到第10行内容；
答：
[root@web01 ~]# awk -F: 'NR>=5&&NR<=10' /etc/passwd
 
13.在/etc/passwd文件中，以冒号分隔字段，将每一行的第后一个字段赋值为第三个字段和第四个字段的和，并打印出来，要求打印出来的内容仍然以冒号为分隔符；
答：
[root@web01 ~]# awk -F: '{OFS=":";$7=$3+$4;print $0}' /etc/passwd
 
14.在/etc/passwd文件中，以冒号分隔字段，将第4字段求和。
答：
[root@web01 ~]# awk -F: '{sum=sum+$4}END{print sum}' /etc/passwd
 
15.判断/etc/passwd文件，如果登录shell为/sbin/nologin，就输出如：postfix Not Login;   by 王肖强
答：
[root@web01 ~]# awk -F: '{if($7~/\/sbin\/nologin/){print $1,"not login"}else{print $0}}' /etc/passwd
 
16.打印ps aux第五列累加的总和。 by王肖强
答：
[root@web01 ~]# ps aux|awk 'NR>1{sum=sum+$5}END{print sum}'
 
17.统计/etc/passwd文件中各shell出现的次数。 by王肖强
答：
[root@web01 ~]# awk -F: '{for(i=NF;i<NF+1;i++)login[$i]++}END{for(sh in login)printf("%-15s %-d\n",sh,login[sh])}' /etc/passwd
/bin/sync       1
/bin/bash       4
/sbin/nologin   25
/sbin/halt      1
/sbin/shutdown  1
 

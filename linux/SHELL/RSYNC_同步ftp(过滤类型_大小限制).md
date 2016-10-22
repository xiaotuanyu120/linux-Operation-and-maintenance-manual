RSYNC: 同步ftp(过滤类型\大小限制)
2015年11月14日 星期六
15:23
 
脚本需求:
* vsftp一台只可以写入(w),一台只可以读取(r);
* 用rsync把w主机ftp目录同步到r主机的ftp目录;
* 同步的文件最大为1KB;
* 利用ssh隧道传输
软件准备:
yum install -y rsync openssh-clients expect
## expect做交互
## rsync负责传输
## openssh负责通道脚本内容:
#!/usr/bin/expect
# Program
# used for auto sync file
# Author : Zack
# Date : 14/11/2015
 
set user [lindex $argv 0]
set host [lindex $argv 1]
set passwd "yourpasswd"
spawn rsync -av -e ssh --exclude-from="/root/rule.txt" --max-size=1K /home/vsftp/ $user@$host:/home/vsftp/
expect {
"yes/no" {send "yes\r"}
"password:" {send "$passwd\r"}
}
expect eof
## 需要注意的参数
-av 同步拷贝
-e 指定传输shell
--max-size 设定传输数据上限
--exclude-from 指定要忽略的文件列表文件
 
## 特别需要注意的地方：
1、第一次做这个脚本没问题
2、第二次换了个环境，然后发现--exclude-from="/root/rule.txt"报错，需要更换成--exclude-from=/root/rule.txt执行过程:
/usr/bin/expect /root/ftpsync.sh root 192.168.0.208 
补充需求：
因为公司要求这样传递文件的时候要把文件类型过滤一遍，只能传输文本文件。
下面的脚本完全能满足这样的需求：
原理就是，用脚本去筛选文件类型，把文件类型不是ASCII文本格式的文件名称写入
到/root/rule.txt中，然后在使用rsync的时候，用--exclude-from参数指定这个文件，
就达到了筛选文件类型的目地
#!/bin/bash
# zack
# check the file type that transported by ftp
 
export PATH
 
# prepare illegal file list
echo '' > /root/sh/rule.txt;
for i in `ls /home/vsftpd-u/`;
do
    if [ -d $i ];
    then
        cd "/home/vsftpd-u/$i";
        ls |xargs -i file {}|grep -v ASCII|cut -d : -f 1 >> /root/sh/rule.txt;
    fi
done
 
# run expect script to rsync file
/usr/bin/expect /root/ftpsync.sh root 192.168.0.208

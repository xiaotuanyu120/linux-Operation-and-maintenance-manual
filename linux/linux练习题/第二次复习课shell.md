第二次复习课shell
2014年12月19日
20:23
 
#!/bin/bash
for i in `seq 1 10`
do
    n[$i]=$RANDOM
    echo ${n[$i]} >> tmp.txt
done
 
a=`sort -n tmp.txt|head -1`
b=`sort -n tmp.txt|tail -1`
echo $a $b
==========================================================
if grep -q 
直接判断grep的结果，检测到了以后肯定为真
 
#!/bin/bash
for i in {1..5}
do
    if ! grep -q "^user$i:" /etc/passwd
    then
        useradd user"$i"
        echo -e "user$i\nuser$i\n" |passwd user"$i" >/dev/null 2>&1
        echo "add user done"
    else
        echo "The user user$i exist."
        continue
    fi
done 
=========================================================
 
#!/bin/bash
while :
do
    read -p "Please input a number: " n
    if [ "$n" == "end" ]
    then
        exit
    fi
    m=`echo $n|sed 's/[0-9]//g'`
    if [ -n "$m" ]
    then
        echo "It's not number, Please input a number."
    else
        echo $n
    fi
 
done 
=======================================================
 
awk -F [%""]+ 用%和空格同时做分隔符，后面的+代表可以多个空格或多个%
 
 

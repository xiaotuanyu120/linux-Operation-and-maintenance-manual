脚本知识: 给python脚本传参
2015年11月25日 星期三
11:29
 
需要模块：sys
参数个数：len(sys.argv)
脚本名：    sys.argv[0]
参数1：     sys.argv[1]
参数2：     sys.argv[2]
 
# vi test.py
***************************
import sys
 
print "script name: ", sys.argv[0]
for i in range(1, len(sys.argv)):
    print "argument", i, sys.argv[i]
***************************
# python test.py hello world
script name: test.py
argument 1 hello
argument 2 world

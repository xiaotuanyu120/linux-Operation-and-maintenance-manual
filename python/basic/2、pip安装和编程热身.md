2、pip安装和编程热身
2015年7月25日
19:46
 
0、上节课习题
============================================
题目是批量创建目录
我的解答：
************************************************
#!/usr/bin/pythonp
#Filename:exam01.py
'''for auto create folder, and check results.
'''
import os
depts=['SALES','PURCHASE','ADMIN','PRODUCTION','ACCOUNT']
 
for dept in depts:
    delete=os.system('rm -rf /tmp/python/%s'%dept)
    result=os.popen('mkdir /tmp/python/%s'%dept)
    a=print(result) #这里是错误的，因为result是一个文档目录，a为空
    if dept in a:             
        print '%s create success'%dept
    else:
        print '%s create failed'%dept
*************************************************
#上面是不合适的方式，是shell的思维方式
 
老师的解答：
*************************************************
# coding:utf-8
import os
depts=["人事部","销售部","技术部"]
 
for dept in depts:
try:
os.mkdir(dept)
except OSError as e:
print '文件【s%】创建失败，原因【s%】' %(dept,e.strerror)
*************************************************
不同：
1、# coding:utf-8 指定中文编码（第二种方式# encoding:utf-8）
2、直接使用os.mkdir()函数，让函数和系统打交道而不是自己写shell命令
3、try：+ except *** as *** 来截取尝试操作的异常输出
 1、安装部署python服务器
==========================================
安装包：
python主程序：python
python开发工具包：python-devel
包管理工具：pip
增强版shell：ipython
PS：python多版本共存的问题，可使用linux的设置PATH变量来实现
 2、python包管理器
=========================================
(1)pip（推荐）
##安装pip
# wget https://bootstrap.pypa.io/get-pip.py
# python get-pip.py
##超链接https前的backslash是用来转义超链接用的PS:pip如果用get-pip.py的形式装，会根据你的python环境装相应版本，如果需要安装固定版本的pip，最好源码安装。
PS：easy_install也是一个包管理器，不过不如pip
 
(2)wheel后缀.whl比.egg更先进
Wheels are the new standard of python distribution and are intended to replace eggs. 
wheels是一个用来替代eggs的python发行版的新标准。
 
(3)如何进行包隔离--隔离的Python运行环境
yum install python-virtualenv python-virtualenvwrapper
Pip install Virtualenv  virtualenv-wrapper
# yum install python-virtualenv3、增强版shell
=========================================
Bpython
# pip install bpython
 
ipython
# pip install ipython
 4、编程热身
*后期会详细介绍，目前掌握基础更重要扩展1、"import this"命令输出的python之禅
==========================================
>>> import this
The Zen of Python, by Tim Peters
 
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!

错误-IPYTHON: 无法tab补全
2016年1月18日
19:09
 
问题背景
==================================
## 安装完ipython，发现进去以后无法使用tab补全
 
解决办法
===================================
# yum install ncurses-devel patch -y
# pip install readline

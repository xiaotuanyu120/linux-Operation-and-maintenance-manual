---
title: Dlink路由做端口转发
date: 2015年6月18日
categories: 9:37
---
 
目地：将本地端口（软件默认）做成公共端口（非常用端口）转发，保证正常访问的同时，来增强网络安全性
 

 
路由型号：DIR-868L
固件版本：1.03SHC
 
VIRTUAL SERVER 设置
==============================================================================
Name：自定义名称
IP Address：内网中需要访问的机器的IP
Public Port：公网端口（需暴露在公网中的不常用端口）
Private Port：内网端口（软件的默认端口，这里填写的是RDP远程的默认3389端口）
Protocol：Both/TCP/UDP
schedule和inbound filter默认即可
 
TELNET测试
==============================================================================
在cmd中用"telnet 192.168.0.18 3389"来测试

 
结果如果进入telnet界面就是成功了，界面会全黑

 
 CANYOUSEEME测试
=============================================================================
如果机器没有开telnet，可以百度canyouseeme访问www.canyouseeme.org来访问测试公网端口3388

 
 
扩展阅读
===============================================================================
noip，无公网ip的时候可以用noip来模拟一种固定连接的模式。


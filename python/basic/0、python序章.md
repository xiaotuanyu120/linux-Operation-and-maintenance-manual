0、python序章
2015年7月22日
8:13
 
0、python序章（个人归纳）
 
1、讲师经历
=======================================
    公司：外包公司-->初创公司-->搜狐公司
    编程语言：vb、php、java etc.-->python-->python
    变成模式：模仿修改-->从Django切入python-->系统深入学习python
 2、编程项目过程
=======================================
    (1)编程语言并非不变
    (2)架构并非不变
    (3)根据客户的具体业务来决定
 3、学习的几个注意点
=======================================
    个人认为：
        主动的（主动出击）；
        踏实的（从小处一点一滴开始）；
        坚持的（三分钟热度不如不学）；
        重点在于掌握思想（明白编程的思维，即这样做的目地和理由）。
 4、讲师和学员的关系
=======================================
    个人认为：
        主动求学的学生（是学生先要，而非老师先给）；
        善于引导的讲师（学生的要求，讲师根据学生自身情况循循善诱，积极配合） 
扩展知识1、Middleware
=======================================
    Description: It's like a "software glue".
    Usage: Middleware makes it easier for software developers to perform communication and input/output, so they can focus on the specific purpose of their application. Middleware is the software that connects software components or enterprise applications.2、Django
=======================================
    Description: Django is a free and open source web application framework, written in Python, which follows the model-view-controller (MVC) architectural pattern.
    Usage: Django's primary goal is to ease the creation of complex, database-driven websites. 3、Jira
=======================================
    Description: JIRA is a proprietary issue tracking product
    Usage: It provides bug tracking, issue tracking, and project management functions.
 4、Tornado
=======================================
   Description: Tornado is a scalable, non-blocking web server and web application framework written in Python.
    Usage: Tornado is noted for its high performance. It tries to solve the C10k problem affecting other servers.
 
ServerSetupRequests per secondTornadonginx, four frontends8213TornadoOne single-threaded frontend3353DjangoApache/mod_wsgi2223web.pyApache/mod_wsgi2066CherryPyStandalone785Performance on AMD Opteron, 2.4 GHz, four cores[4] 
 
来自 <https://en.wikipedia.org/wiki/Tornado_(web_server)> 
 5、github
=======================================
    Description: GitHub is a web-based Git repository hosting service, which offers all of the distributed revision control and source code management (SCM) functionality of Git as well as adding its own features.
    Usage: GitHub provides a web-based graphical interface and desktop as well as mobile integration. It also provides access control and several collaboration features such as wikis, task management, and bug tracking and feature requests for every project
 6、os.popen
======================================
Open a pipe to or from command. The return value is an open file object connected to the pipe, which can be read or written depending on whether mode is 'r' (default) or 'w'. The bufsize argument has the same meaning as the corresponding argument to the built-in open() function. The exit status of the command (encoded in the format specified for wait()) is available as the return value of the close() method of the file object, except that when the exit status is zero (termination without errors), None is returned.
In [1]: import os
 
In [2]: a=os.popen('mkdir /tmp/test1')
 
In [3]: print a
<open file 'mkdir /tmp/test1', mode 'r' at 0x120c9c0>      <---  #输出
 
[root@localhost ~]# ls -dl /tmp/test1/
drwxr-xr-x. 2 root root 6 Jul 24 11:08 /tmp/test1/         <---  #命令执行成功
  

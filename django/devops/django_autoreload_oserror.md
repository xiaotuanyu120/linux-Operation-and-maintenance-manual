---
title: django中执行os.chdir()引起的"devserver autoreload: OSError: [Errno 2] No such file or directory"
date: 2016-11-03 15:51:00
categories: django/devops
tags: [python,django,chdir,autoreload,manage.py,OSError]
---
### django中执行os.chdir()引起的"devserver autoreload: OSError: [Errno 2] No such file or directory"

### 问题背景
用django写一个命令执行的views，发现写完之后，使用"python manage.py runserver 0.0.0.0:8000"，会不定期的报错，信息如下：
``` python
Traceback (most recent call last):
  File "manage.py", line 10, in <module>
    execute_from_command_line(sys.argv)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/__init__.py", line 338, in execute_from_command_line
    utility.execute()
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/__init__.py", line 330, in execute
    self.fetch_command(subcommand).run_from_argv(self.argv)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/base.py", line 390, in run_from_argv
    self.execute(*args, **cmd_options)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/commands/runserver.py", line 49, in execute
    super(Command, self).execute(*args, **options)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/base.py", line 441, in execute
    output = self.handle(*args, **options)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/commands/runserver.py", line 88, in handle
    self.run(**options)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/core/management/commands/runserver.py", line 97, in run
    autoreload.main(self.inner_run, None, options)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/utils/autoreload.py", line 323, in main
    reloader(wrapped_main_func, args, kwargs)
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/utils/autoreload.py", line 289, in python_reloader
    reloader_thread()
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/utils/autoreload.py", line 265, in reloader_thread
    change = fn()
  File "/vagrant/nnti_classmate/venv27/lib/python2.7/site-packages/django/utils/autoreload.py", line 203, in code_changed
    stat = os.stat(filename)
OSError: [Errno 2] No such file or directory: 'manage.py'
```

查阅了google上的大量资料，都没有发现靠谱的答案，其中发现在django的issue网站，曾经在两年之前有人反应过这个问题，但是没有得到解决，只能草草closed。  
https://code.djangoproject.com/ticket/23691

虽然没有得到确切的解决办法，但是通过这些信息，我大概清楚了问题是什么。django拥有一个autoreload.py文件，这个文件的功能就是在你运行django途中，如果你更改了django项目的代码，它会自动去给你重新加载，此处它报错说找不到manage.py，但是我自己确定这个文件是存在的。  

于是我重新审阅发生这个错误前后自己添加的代码，原来我是执行了一条os.chdir()的命令，相当于环境从当前目录切换到了这条命令执行后的目录，于是豁然开朗，我将django的启动命令写成绝对路径"python /path/to/manage.py runserver 0.0.0.0:8000"，果然问题得到了解决。  

这个问题给我一个很大的启发，有时候啊，歪果仁也不是万能的，迷信google上的答案也是不对的，重要的是找到问题的根源，实事求是的解决问题。  

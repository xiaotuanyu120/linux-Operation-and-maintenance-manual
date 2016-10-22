Django tutorial
2015年10月16日
14:49
 
安装
# pip install Django==1.8.5
Collecting Django==1.8.5
  Downloading Django-1.8.5-py2.py3-none-any.whl (6.2MB)
    100% |████████████████████████████████| 6.2MB 24kB/s
Installing collected packages: Django
Successfully installed Django-1.8.5
 
tutorial链接
https://docs.djangoproject.com/en/1.8/intro/tutorial01/
 
1、查看django版本
# python -c "import django; print(django.get_version())"
1.8.5
2、creating a project
# django-admin startproject tutorial01
# tree tutorial01/
tutorial01/
├── manage.py
└── tutorial01
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
 
1 directory, 5 files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ps：文档详细资料
These files are:
 
    The outer tutorial01/ root directory is just a container for your project. Its name doesn't matter to Django; you can rename it to anything you like.
    manage.py: A command-line utility that lets you interact with this Django project in various ways. You can read all the details about manage.py in django-admin and manage.py.
    The inner tutorial01/ directory is the actual Python package for your project. Its name is the Python package name you'll need to use to import anything inside it (e.g. tutorial01.urls).
    tutorial01/__init__.py: An empty file that tells Python that this directory should be considered a Python package. (Read more about packages in the official Python docs if you're a Python beginner.)
    tutorial01/settings.py: Settings/configuration for this Django project. Django settings will tell you all about how settings work.
    tutorial01/urls.py: The URL declarations for this Django project; a "table of contents" of your Django-powered site. You can read more about URLs in URL dispatcher.
    tutorial01/wsgi.py: An entry-point for WSGI-compatible web servers to serve your project. See How to deploy with WSGI for more details.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
3、DATABASE
# vim tutorial01/settings.py
****************************************
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
## 默认使用的是sqlite3，如果只是试用，这个是最简单的
****************************************
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
其他database的配置
https://docs.djangoproject.com/en/1.8/ref/settings/#std:setting-DATABASES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
4、migration
# python manage.py migrate
Operations to perform:
  Synchronize unmigrated apps: staticfiles, messages
  Apply all migrations: admin, contenttypes, auth, sessions
Synchronizing apps without migrations:
  Creating tables...
    Running deferred SQL...
  Installing custom SQL...
Running migrations:
  Rendering model states... DONE
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying sessions.0001_initial... OK
## 相当于根据配置文件进行初始化
5、测试django project是否可用
# python manage.py runserver 0.0.0.0:8000
Performing system checks...
 
System check identified no issues (0 silenced).
October 17, 2015 - 14:49:42
Django version 1.8.5, using settings 'tutorial01.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
[17/Oct/2015 14:49:51] "GET / HTTP/1.1" 200 1767
[17/Oct/2015 14:49:51] "GET /favicon.ico HTTP/1.1" 404 1944
[17/Oct/2015 14:49:51] "GET /favicon.ico HTTP/1.1" 404 1944
。。。。。。
## 如果runserver后面没有跟内容，那就是默认监听127.0.0.1：8000，这样从其他机器是无法访问的
6、创建一个app
# python manage.py startapp polls
# tree polls/
polls/
├── admin.py
├── __init__.py
├── migrations
│   └── __init__.py
├── models.py
├── tests.py
└── views.py
 
 

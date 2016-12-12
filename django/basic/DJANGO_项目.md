DJANGO:  项目
2016年1月31日
21:42
 
环境检查
## 检查是否安装Django
# python -c "import django; print(django.get_version())"
1.9.1
## 检查python版本
# python -V
Python 2.7.5 
创建Django项目
## 进入到你希望项目目录所在的目录
# cd /root/django/
 
## 项目名称不要和python的内置组件重名，例如django、test等
# django-admin startproject firstsite
 
## 此时你会发现目录下多出来一个名为firstsite的目录
# tree firstsite/
firstsite/
├── firstsite
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py
 
1 directory, 5 files
## 目录功能简介
o 外层的firstsite/ 
* 此目录只是一个项目容器，它的名称并不会影响django，可以随意重命名
o manage.py 
* 是一个命令行工具，和django-admin一样
* 会把项目的包添加到sys.path
* 设置DJANGO_SETTINGS_MODULE环境变量，来让它指向你项目的setting.py
* 使用方法对比
$ django-admin <command> [options]
$ manage.py <command> [options]
$ python -m django <command> [options]
o 里层的firstsite/ 此
* 目录是实际项目的python包，它的名字会在import这个包的时候用到
* 例如import firstsite.urls
o firstsite/__init__.py 
* 用来标识此目录是一个python包
o firstsite/settings.py django项目的配置文件
* 可以这样来指定用哪个配置文件
django-admin runserver --settings=mysite.settings
o firstsite/urls.py 
* 项目的url声明文件，用来匹配url与函数之间的关系
o firstsite/wsgi.py
* wsgi webserver的入口 
运行project
## 启用django自带的轻量级webserver（端口8000，监听所有ip）
# python manage.py runserver 0.0.0.0:8000

## 如果访问不了，请检查selinux和防火墙 

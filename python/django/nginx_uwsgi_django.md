---
title: nginx+uwsgi+django组合
date: 2016-11-04 16:37:00
categories: python/django
tags: [python,django,uwsgi]
---
### nginx+uwsgi+django组合

----

#### 环境介绍
- OS version: Centos6.8 x86_64
- python version: 2.7.10
- pip version: 8.1.2
- virtualenv version: 15.0.3
- nginx version: 1.10.1(yum)

----

#### python及django准备
step 1 >> python虚拟环境搭建
``` python
# virtualenv环境创建
cd /vagrant/nnti_classmate
virtualenv venv27 -p python2.7
source venv27/bin/activate

# 安装django和uwsgi
vi requirement.txt
***********************
Django==1.8
uWSGI==2.0.14
***********************
# requirement.txt中是虚拟环境需要安装的pip包

pip install -r requirement.txt
```

step 2 >> django项目初始化(例子中使用classmate项目，需要换成你自己的)
``` bash
cd /vagrant/nnti_classmate
django-admin startproject classmate
```

step 3 >> django静态文件准备
``` bash
cd /vagrant/nnti_classmate/classmate

vim classmate/settings.py
***************************
# 增加下面内容
STATIC_ROOT = os.path.join(BASE_DIR, "static/")
***************************

# 将项目的静态文件收集到上面定义的/vagrant/nnti_classmate/classmate/static/中
python manage.py collectstatic
```

----

#### nginx安装与配置
step1 >> nginx 安装  
``` bash
yum install nginx
```

step2 >> uwsgi_params文件准备  
``` bash
# 其实nginx yum安装后会自带这个文件
ls /etc/nginx/uwsgi_params
/etc/nginx/uwsgi_params
# 若不存在，需要去下载
# 因为uwsgi_params在nginx配置目录/etc/nginx中，所以下面配置文件中可以直接"include uwsgi_params;"，否则需要指定绝对路径。
```

step3 >> nginx 配置  
``` bash
cd /vagrant/nnti_classmate/classmate

# 创建nginx配置文件
vi ./classmate_nginx.conf
***********************
server {
    listen      80;
    server_name _;
    charset     utf-8;
    access_log /var/log/nginx/nginx.log main;
    error_log /var/log/nginx/error.log error;

    # max upload size
    client_max_body_size 75M;   # adjust to taste

    # Django media
    location /media  {
        alias /vagrant/nnti_classmate/classmate/media;
    }

    location /static {
        alias /vagrant/nnti_classmate/classmate/static;
    }

    location / {
        uwsgi_pass  unix:/tmp/classmate.sock;
        include     uwsgi_params;
    }
}
***********************
# 配置文件中的三个location分别为media、static、/，其中的路径需要按照你实际的来更换

# 因为我们将配置文件放在了classmate项目目录下，而nginx默认的虚拟主机配置目录是/etc/nginx/conf.d，所以需要拷贝过去
cp ./classmate_nginx.conf /etc/nginx/conf.d/

# 因为我们监听的是本机的ip:80，所以要把nginx默认的default.conf给备份起来，否则会冲突
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
```

step 4 >> nginx 重载服务
``` bash
nginx -t
nginx -s reload
```

----

#### uwsgi 配置及启动
step 1 >> uwsgi 配置
``` bash
cd /vagrant/nnti_classmate/classmate

# 创建uwsgi的配置文件
vi uwsgi.ini
***********************
[uwsgi]
chdir=/vagrant/nnti_classmate/classmate
module=classmate.wsgi

master=true
processes = 10
#max-requests=5000
pidfile=/tmp/classmate.pid
daemonize=/var/log/uwsgi/classmate.log

socket = /tmp/classmate.sock
chmod-socket = 666
vacuum=true
***********************
```
> 配置说明
- chdir 指定base目录(既classmate的project根目录)
- module 指定django的wsgi接口文件  
  因为django新版将project根目录下的classmate.wsgi文件替换成了classmate/wsgi.py文件，而module的指定不支持文件名称，所以只能用python的模块调用方式"classmate.wsgi"来指定django的wsgi接口文件
- master true的话，就开启了master 模式，会有一个master process 和多个worker process
- processes 指定worker process的数量
- pidfile 指定pid文件
- daemonize 在app加载后，将uwsgi服务化
- socket 指定socket文件，如果你使用的是socket监听的话
- chmod-socket 指定socket文件的权限，权限不足会无法访问，可在日志中看到错误提示
- vacuum uwsgi结束后，删除socket和所有生成的文件

[uwsgi options documentation](http://uwsgi-docs.readthedocs.io/en/latest/Options.html)

step 2 >> uwsgi 启动
``` bash
uwsgi --ini uwsgi.ini
```

----

#### 走过的坑
1. socket文件权限问题，引起的无法访问
2. uwsgi配置文件中的module不可以用文件指定
3. django必须将static文件collect，而且nginx必须配置static的location才可以正常加载静态文件

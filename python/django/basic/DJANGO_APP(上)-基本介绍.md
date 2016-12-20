DJANGO: APP (上)-基本介绍
2016年2月5日
19:00
 
## 创建项目cms
# django-admin startproject cms
# cd cms/
 
## 创建APP：asset
# python manage.py startapp asset
# tree .
.                              # 根目录是项目容器，无实际意义
├── asset                      # APP目录，和业务直接相关
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations             # 每修改一次model，相应创建一个文件去记录数据库改变
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── cms                        # 项目目录，负责整个项目的设置
│   ├── __init__.py
│   ├── __init__.pyc
│   ├── settings.py
│   ├── settings.pyc
│   ├── urls.py
│   └── wsgi.py
└── manage.py                  # 命令行工具
 
## 把asset加入到项目cms中
## 这样可以让项目来连接此app
# vim cms/settings.py
*************************************
## 把asset加入到INSTALLED_APPS列表中，上面都是默认的django应用
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
 
    'asset',
]
*************************************
 
## 创建第一个views
## views主要处理的是HttpRequest和HttpResponse
# vim asset/views.py
*************************************
# coding:utf-8
from django.http import HttpResponse
 
 
def index(request):
    print request
    return HttpResponse('hello world!')
 
## 函数index会打印出request，然后返回字符串"hello world!"
*************************************
 
## 创建url与vies中函数的映射
## 这样当用户请求的url到来时，就知道用什么函数来处理它
# vim cms/urls.py
*************************************
import asset.views
 
urlpatterns = [
    url(r'^$', asset.views.index), 
    url(r'^admin/', admin.site.urls),
]
 
## 这个asset是因为我们在settings.py中做过设置
## 当用户访问网站根路径的时候，让index函数来处理
## 如果你在asset中也创建了一个urls来处理，可以用url(r'', include(asset.urls))
*************************************
 
## 查看效果
# python manage.py runserver 0.0.0.0:8000

## 当我们访问根路径的时候，返回的就是index函数的字符串
## 另外终端处随着我们的访问会输出
"
<WSGIRequest: GET '/'>
[05/Feb/2016 11:53:01] "GET / HTTP/1.1" 200 12
"
其中第一行就是我们函数中的"print request"

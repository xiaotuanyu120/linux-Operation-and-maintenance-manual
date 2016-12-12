DJANGO: APP(中)-admin-cms
2016年2月5日
20:20
 
APP 之 CMS管理系统（admin）
## 每个app创建之后都会有一个models.py，配置好之后就相当于拥有了一个天然的CMS系统
==========================================================
## 配置models.py
# vim asset/models.py
******************************
# coding:utf-8
 
from django.db import models
 
 
class Host(models.Model):
    STATUS_ITEMS = (
        (1, "空闲"),
        (2, "使用中"),
        (3, "报废"),
    )
    ip = models.GenericIPAddressField(verbose_name="主机IP")
    open_port = models.CharField(max_length=1000, verbose_name="开放端口")
    status = models.IntegerField(choices=STATUS_ITEMS, verbose_name="主机状态")
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
 
    class Meta:
        verbose_name_plural = "主机"
********************************
## 查看修改model后django对应产生的sql语句
# ls asset/migrations/
0001_initial.py  0001_initial.pyc  __init__.py  __init__.pyc
# python manage.py sqlmigrate asset 0001
BEGIN;
--
-- Create model Host
--
CREATE TABLE `asset_host` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `ip` char(39) NOT NULL, `open_port` varchar(1000) NOT NULL, `status` integer NOT NULL, `created_time` datetime(6) NOT NULL, `update_time` datetime(6) NOT NULL);
 
COMMIT;
 
## 配置admin.py
# vim asset/admin.py
********************************
# coding:utf-8
from django.contrib import admin
 
## same with from asset.models import Host
from .models import Host
 
 
class HostAdmin(admin.ModelAdmin):
    list_display = ('ip', 'open_port', 'status', 'update_time', 'created_time')
 
 
admin.site.register(Host, HostAdmin)
## 这一句是把model中的Host和admin中的HostAdmin注册进admin中
********************************
 
## 配置数据库连接
# yum install python-devel -y
# pip install mysql-python
 
# vim cms/settings.py
********************************
DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.sqlite3',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'cms_db',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'sudomysql',
    }
}
********************************
 
# mysql -u root -p
mysql> create database cms_db;
 
# python manage.py makemigrations
Migrations for 'asset':
  0001_initial.py:
    - Create model Host
## 其实是在app下生成了一个文件，这个py文件把你的配置转换成了和数据库对接的文件
# ls -l asset/migrations/0001_initial.py
-rw-r--r--. 1 root root 1326 Feb  9 20:17 asset/migrations/0001_initial.py
 
# python manage.py migrate
Operations to perform:
  Apply all migrations: admin, contenttypes, asset, auth, sessions
Running migrations:
  Rendering model states... DONE
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying asset.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying sessions.0001_initial... OK
 
## 创建超级用户
# python manage.py createsuperuser
 
## 修改显示语言
# vim cms/settings.py
********************************
# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/
 
LANGUAGE_CODE = 'zh-Hans'
TIME_ZONE = 'UTC'
USE_I18N = True
********************************
## i18n国家代码列表
http://www.i18nguy.com/unicode/language-identifiers.html
其中zh-Hans代表简体中文，zh-Hant代表繁体中文 
多class演示(在上面单class基础上)
==========================================
# vim asset/models.py
****************************************************************
# coding:utf-8
 
from django.db import models
 
 
class Host(models.Model):
    STATUS_ITEMS = (
        (1, "空闲"),
        (2, "使用中"),
        (3, "报废"),
    )
    ip = models.GenericIPAddressField(verbose_name="主机IP")
    open_port = models.CharField(max_length=1000, verbose_name="开放端口")
    status = models.IntegerField(choices=STATUS_ITEMS, verbose_name="主机状态")
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
 
    class Meta:
        verbose_name_plural = "主机"
 
class server_room(models.Model):
    STATUS_ITEMS = (
        (1, "空闲"),
        (2, "使用中"),
        (3, "报废"),
    )
    ip = models.GenericIPAddressField(verbose_name="主机IP")
    open_port = models.CharField(max_length=1000, verbose_name="开放端口")
    status = models.IntegerField(choices=STATUS_ITEMS, verbose_name="主机状态")
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
 
    class Meta:
        verbose_name_plural = "机房"
****************************************************************
 
# vim asset/admin.py
****************************************************************
# coding:utf-8
from django.contrib import admin
 
## same with from asset.models import Host
from .models import Host
from .models import server_room
 
class HostAdmin(admin.ModelAdmin):
    list_display = ('ip', 'open_port', 'status', 'update_time', 'created_time')
 
class ServerRoomAdmin(admin.ModelAdmin):
    list_display = ('ip', 'open_port', 'status', 'update_time', 'created_time')
 
admin.site.register(Host, HostAdmin)
admin.site.register(server_room, ServerRoomAdmin)
****************************************************************
 
# python manage.py makemigrations
# python manage.py migrate
 
问题
====================================================
报错1：
# python manage.py makemigrations
......
You are trying to add a non-nullable field 'location' to server_room without a default; we can't do that (the database needs something to populate existing rows).
......
解决方案：
## 修改了字段名称，所以需要给这个字段加上null=True，或者default="**"选项
# vim asset/models.py
****************************************************************
location = models.IntegerField(choices=LOCATION_ITEMS, verbose_name="位置", null=True)
****************************************************************
# python manage.py makemigrations
Migrations for 'asset':
  0003_auto_20160224_0302.py:
    - Remove field status from server_room
    - Add field location to server_room
## 提示把我原来的status段删除，重建了一个location
## 

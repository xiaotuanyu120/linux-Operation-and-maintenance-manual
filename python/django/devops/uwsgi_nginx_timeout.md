---
title: uwsgi: nginx超时设定
date: 2016-11-11 11:16:00
categories: python/django
tags: [python,django,nginx,uwsgi]
---
### nginx中如何设定uwsgi的timeout

----

#### 问题背景
使用nginx做uwsgi的前端web服务器，有时候需要在页面post数据去服务器执行命令，需要时间较长。若该时间超出nginx设定的timeout，nginx就会关闭与uwsgi的连接，然而uwsgi完成命令的执行后，需要将数据发送回给nginx，就会产生错误，信息如下：
```
Fri Nov 11 03:08:46 2016 - SIGPIPE: writing to a closed pipe/socket/fd (probably the client disconnected) on request /dashboard/ (ip 192.168.33.1) !!!
Fri Nov 11 03:08:46 2016 - uwsgi_response_writev_headers_and_body_do(): Broken pipe [core/writer.c line 296] during POST /dashboard/ (192.168.33.1)
IOError: write error
```

----

#### 延长nginx的超时设定
```
location / {
        uwsgi_pass  unix:/tmp/classmate.sock;
        include     uwsgi_params;
        uwsgi_read_timeout 300;
    }
```
> 将nginx配置文件中，增加`uwsgi_read_timeout 300;`，延长超时时间。

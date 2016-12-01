---
title: urllib: 1.0 登陆django的python客户端
date: 2016-12-01 10:30:00
categories: python/django
tags: [python,django,urllib,urllib2]
---
### 1.0 urllib登陆django的python客户端
其实是为了解决使用urllib POST数据到django服务器时，如果通过csrf认证的问题，顺便找到login的解决方案，在此记录一下备用。
``` bash
import urllib
import urllib2
import contextlib


def login(login_url, username, password):
    """
    Login to site
    """
    cookies = urllib2.HTTPCookieProcessor()
    opener = urllib2.build_opener(cookies)
    urllib2.install_opener(opener)

    opener.open(login_url)

    try:
        token = [x.value for x in cookies.cookiejar if x.name == 'csrftoken'][0]
    except IndexError:
        return False, "no csrftoken"

    params = dict(username=username, password=password, \
        this_is_the_login_form=True,
        csrfmiddlewaretoken=token,
         )
    encoded_params = urllib.urlencode(params)

    with contextlib.closing(opener.open(login_url, encoded_params)) as f:
        html = f.read()
    return html

server_ip = "http://192.168.33.10:8000"
login_url = "%s/login/" % server_ip
username = "admin"
password = "admin"

doc = login(login_url, username, password)
```

---
title: error: 1.1.0 KeyError: u'favicon.ico'
date: 2017-06-01 17:38:00
categories: python/flask
tags: [python,flask]
---
### error: 1.1.0 KeyError: u'favicon.ico'

---

### 1. 错误信息
flask里面有这样一个router
``` python
@app.route('/<cat>')
def cat(cat):
    sub_cats = CAT_DICT[cat]
    return render_template("base/categories_base.html",
                           TOPIC_DICT=TOPIC_DICT,
                           cat=cat,
                           sub_cats=sub_cats)
```
于是导致每次访问favicon.ico这个资源的时候会报如下错误，虽然不影响访问，但是看日志的时候总觉得太烦。
``` python
[2017-06-01 09:20:32,340] ERROR in app: Exception on /favicon.ico [GET]
Traceback (most recent call last):
  File "/vagrant/mk2html/venv/lib/python2.7/site-packages/flask/app.py", line 1988, in wsgi_app
    response = self.full_dispatch_request()
  File "/vagrant/mk2html/venv/lib/python2.7/site-packages/flask/app.py", line 1641, in full_dispatch_request
    rv = self.handle_user_exception(e)
  File "/vagrant/mk2html/venv/lib/python2.7/site-packages/flask/app.py", line 1544, in handle_user_exception
    reraise(exc_type, exc_value, tb)
  File "/vagrant/mk2html/venv/lib/python2.7/site-packages/flask/app.py", line 1639, in full_dispatch_request
    rv = self.dispatch_request()
  File "/vagrant/mk2html/venv/lib/python2.7/site-packages/flask/app.py", line 1625, in dispatch_request
    return self.view_functions[rule.endpoint](**req.view_args)
  File "/data/www/linux_manual/blog/__init__.py", line 48, in cat
    sub_cats = CAT_DICT[cat]
KeyError: u'favicon.ico'
```

---

### 2. 解决办法
按照[官方文档](http://flask.pocoo.org/docs/0.12/patterns/favicon/)上的说明，增加如下代码解决
``` python
import os
from flask import send_from_directory


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='images/favicon.ico')
```

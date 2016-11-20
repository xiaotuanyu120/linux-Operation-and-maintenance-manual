### initial flask app

**activate virtual env**
``` bash
source /vagrant/flask_blog/bin/activate
```

**create app directory**
``` bash
cd /vagrant/flask_blog
mkdir MyBlog
```

**create basic directory**
``` bash
cd MyBlog
mkdir ./{static,templates}
```

**create app initial file**
<code>vi __init__.py</code>
``` python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def homepage():
    return "Hi there, how ya doing?"


if __name__ == "__main__":
    app.run()
```
after run <code>vi __init__.py</code>, press <code>i</code> into insert mode.
after finish input, press <code>ESC</code> and input <code>:wq</code> to save and quit

### run test
``` bash
# as we install Flask before, so you can run it directly.
# if you see the output is same with below, it means everything is good.
python __init__.py
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```
although we can run flask like this, but it only listen 127.0.0.1 and can not persistence.
so we need a web server to proxy requests and use uwsgi to process these requests.

### deploy web server and configure uwsgi

**install nginx(web server, you can choose apache also) and uwsgi**
``` bash
yum install nginx -y
pip install uwsgi
```

**configure uwsgi**
<code>vi /vagrant/flask_blog/wsgi.py</code>
``` python
from MyBlog import app

if __name__ == "__main__":
    app.run()
```

**uwsgi test and make configuration file**
``` bash
# use command line to test first
uwsgi --socket 0.0.0.0:8000 --file /vagrant/flask_blog/wsgi.py --callable app --protocol=http

# use configuration file test second
# uwsgi configuration file
vim /vagrant/flask_blog/myblog.ini
************************
[uwsgi]
chdir = /vagrant/flask_blog
module = wsgi:app

master = true
processes = 5
threads = 2
buffer-size = 8192

socket = 127.0.0.1:8001
************************
# chdir is the folder where wsgi.py located in

# module indicate first wsgi-file(wsgi)
# and then application name which assigned in "__init__.py"

# master = True is setting master mode
# processes indicate the number of processes which forked by master process
# buffer-size indicate the request block size
```
然后两种方法都用浏览器测试一下，访问ip:8000端口，查看结果

**configure nginx**
<code>vi /etc/nginx/conf.d/uwsgi.conf</code>
``` bash
server {
        listen 80;
        server_name 192.168.33.10;
        access_log /var/log/nginx/uwsgi_access.log;
        error_log /var/log/nginx/uwsgi_error.log;
        location / {
            include        uwsgi_params;
            uwsgi_pass     127.0.0.1:8001;
            uwsgi_param UWSGI_PYHOME /vagrant/flask_blog;
            uwsgi_param UWSGI_CHDIR /vagrant/flask_blog;
            uwsgi_param UWSGI_SCRIPT myblog:app;
                }
        }
# server_name should be your server's ip or domain name
# uwsgi_pass should be same with configured in myblog.ini
# UWSGI_SCRIPT indicate uwsgi configuration filename(myblog.ini, but no extension)
# and application name(app)
```

**enable and start nginx uwsgi**
``` bash
service nginx start
chkconfig nginx on

# you can write this command into /etc/profile to make it run when OS boot up
uwsgi /vagrant/flask_blog/myblog.ini &
```

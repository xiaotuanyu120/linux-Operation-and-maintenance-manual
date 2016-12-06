---
title: virtualenv: protocol error
date: 2016-12-06 22:17:00
categories: python/advance
tags: [python,virtualenv,vagrant]
---
### virtualenv: protocol error

---

### 1. vagrant环境下使用virtualenv报错
#### 1) 报错信息
``` bash
/usr/local/py27/bin/virtualenv venv -p /usr/local/py27/bin/python2.7
Running virtualenv with interpreter /usr/local/py27/bin/python2.7
New python executable in /vagrant/nodejs/venv/bin/python2.7
Also creating executable in /vagrant/nodejs/venv/bin/python
Traceback (most recent call last):
  File "/usr/local/py27/lib/python2.7/site-packages/virtualenv.py", line 2327, in <module>
    main()
  File "/usr/local/py27/lib/python2.7/site-packages/virtualenv.py", line 711, in main
    symlink=options.symlink)
  File "/usr/local/py27/lib/python2.7/site-packages/virtualenv.py", line 924, in create_environment
    site_packages=site_packages, clear=clear, symlink=symlink))
  File "/usr/local/py27/lib/python2.7/site-packages/virtualenv.py", line 1369, in install_python
    os.symlink(py_executable_base, full_pth)
OSError: [Errno 71] Protocol error
```
#### 2) 解决方法"--always-copy"
``` bash
/usr/local/py27/bin/virtualenv venv -p /usr/local/py27/bin/python2.7 --always-copy
Running virtualenv with interpreter /usr/local/py27/bin/python2.7
New python executable in /vagrant/nodejs/venv/bin/python2.7
Also creating executable in /vagrant/nodejs/venv/bin/python
Installing setuptools, pip, wheel...done.
```
[github issues doc](https://github.com/gratipay/gratipay.com/issues/2327)

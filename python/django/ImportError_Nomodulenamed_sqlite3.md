ImportError: No module named _sqlite3
Saturday, October 17, 2015
2:15 PM
 
执行命令(在django项目目录下)：
# python manage.py migrate
报错：
ImportError: No module named _sqlite3
解决方案：
Install sqlite-devel via 'yum install sqlite-devel'
Recompile Python.

PEP8: flake8
Monday, February 29, 2016
10:13 AM
 
工具简介：
flake8是对下面相关工具的包装
o PyFlakes
o pep8
o Ned Batchelder's McCabe script
 
安装方法：
# pip install flake8
 
使用方法：
# flake8 website_speed_test.py
website_speed_test.py:6:1: F401 'sys' imported but unused
website_speed_test.py:10:1: E302 expected 2 blank lines, found 1
website_speed_test.py:17:1: E302 expected 2 blank lines, found 1

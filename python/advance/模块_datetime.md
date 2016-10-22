模块: datetime
2016年3月21日
16:17
 
## 模块导入
import datetime
 
## 获取当前时间
In [11]: datetime.datetime.now()
Out[11]: datetime.datetime(2016, 3, 21, 4, 21, 45, 248352)
 
## 获取当前日期
In [14]: datetime.date.today()
Out[14]: datetime.date(2016, 3, 21)
 
============================================
 
## 时间转换成字符串
In [16]: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
Out[16]: '2016-03-21 04:26:48'
 
## 转换回来
In [18]: datetime.datetime.strptime("2016-03-21 04:26:48", "%Y-%m-%d %H:%M:%S")
Out[18]: datetime.datetime(2016, 3, 21, 4, 26, 48)

FORMAT: 字符串格式化
2015年7月28日
16:46
 
字符串格式化：
%[转换标志][最小字段宽度][.小数精度位][转换类型]
(1)转换符：
"%"代表格式化开始
(2)转换标志：
- 左对齐
+ 在数字前增加"+""-"号
0 不够的字段宽度用"0"补全
(3)最小字段宽度
指定字段宽度，如果为"*"则从后面的值元组中取值
(4).小数精度位
指定小数的字段精度，如果为"*"则从后面的值元组中取值
(5)转换类型
常用类型：
d digit数字
s string字符串
1、只包含转换符的简单格式化
 
1)数字
>>> print "the number is %d" % 250.25
the number is 250
2)浮点数
>>> print "the number is %f" % 250.25
the number is 250.250000
3)字符串
>>> print "the word is %s" % 'sillyboy'
the word is sillyboy2、转换标志
1)"-"左对齐
>>> print "result is :\n%-d\n%-d\n%-d" %(-1.234, 2.3 ,30)
result is :
-1
2
30
2)"+"在数字前增加"+""-"号
>>> print "result is :\n%+d\n%+d\n%+d" %(-1.234, 2.3 ,30)
result is :
-1
+2
+30
3)"0"在字段宽度不足时用"0"补全
>>> print "result is :\n%0d\n%0d\n%0d" %(-1.234, 2.3 ,30)
result is :
-1
2
30
>>> print "result is :\n%010d\n%010d\n%010d" %(-1.234, 2.3 ,30)
result is :
-000000001
0000000002
0000000030
>>> print "result is :\n%0.10f\n%0.10f\n%0.10f" %(-1.234, 2.3 ,30)
result is :
-1.2340000000
2.3000000000
30.0000000000
#必须要指定后面的字段宽度（无论整形还是浮点型）才会有效果的3、最小字段宽度&小数精度位
##"*"会在后面值元组里取值
>>> print "%-*s%.*f" % (20, 'Apple', 2, 4999.99)
Apple               4999.994、完整版实例演示
*********************************************************************
#!/usr/bin/python
#Filename:format.py
 
item_width = 25
price_width = 10
width = item_width + price_width
 
header_format = '%-*s%*s'
price_format = '%-*s%*.2f'
 
print '='*width
print header_format % (item_width, 'Item', price_width, 'Price')
print '-'*width
print price_format % (item_width, 'Apple', price_width, 0.4)
print price_format % (item_width, 'Orange', price_width, 0.5)
print price_format % (item_width, 'Salt', price_width, 2.4)
print price_format % (item_width, 'Toy', price_width, 38.99)
print '='*width
*********************************************************************
# python format.py
===================================
Item                          Price
-----------------------------------
Apple                          0.40
Orange                         0.50
Salt                           2.40
Toy                           38.99
===================================
  
字符串方法：
find\join\lower\replace\split\strip\translate
1、find
简介：
语法：S.find(sub [,start [,end]]) -> int
作用：Return the lowest index in S where substring sub is found
返回在字符串中查找到的子字符串最左端的索引值
>>> str_find = 'money is good, but money isn\'t most important'
>>> str_find.find('money')
0              <------    #只返回了最左端的索引值'0'
 
 2、join
简介：
 
 
  
3、lower
简介：
 
 
  
4、replace
简介：
 
 
  
5、split
简介：
 
 
  
6、strip
简介：
 
 
  
7、translate
简介：
 
 
  
 
  
 

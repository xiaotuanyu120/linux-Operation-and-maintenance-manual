ENCODE: 字符串和16进制转换
2016年3月1日
17:33
 
In [7]: str = "我--日* "
 
In [8]: print str.encode('hex')
e68891e28094e28094e697a52a20
 
In [9]: print str.encode('hex').decode('hex')
我--日*

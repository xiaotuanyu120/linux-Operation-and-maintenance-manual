5、函数2- open
2015年8月8日
21:38
 
简洁写法
====================================
#用关键字来传递功能开关
>>> def test1(name, button=None):
...     a = a.lower if button else a
...     pass
#这样你就可以用关键字来控制函数内部的流程了 
5.3 函数的补充
====================================
5.3.1 docstring(函数的注释，专业的象征)
>>> def doc_example():
...     '''This is an example for __doc__ show
...     you must put the """ at the end of doc
...     '''
...
>>> doc_example.__doc__
'This is an example for __doc__ show\n    you must put the """ at the end of doc\n    '
>>> help(doc_example)
Help on function doc_example in module __main__:
 
doc_example()
    This is an example for __doc__ show
    you must put the """ at the end of doc
# 只有多行docstring的时候才需要把最后的'''放在单独一行
 
# 扩展方法
>>> doc_example.func_doc
'This is an example for __doc__ show\n    you must put the """ at the end of doc\n    ' 
5.3.2 介绍如何对输入进行验证 assert使用
>>> def int_to_float(num):
...     assert num is int,'the num must is integer'
...     return float(num)
...
>>> int_to_float(10.0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in int_to_float
AssertionError: the num must is integer
# 个人理解：可用户返回一些并不是系统错误的"逻辑错误" 
5.3.3 open的使用
* open(name[, mode[, buffering]])
 
Open a file, returning an object of the file type described in section File Objects. If the file cannot be opened, IOError is raised. When opening a file, it's preferable to use open() instead of invoking the file constructor directly.
 
     MODE:
r (read);w (write);a (append);b (block)
# open()函数打开文件，并返回文件对象
>>> f = open('is_prime_def.py')
>>> f
<open file 'is_prime_def.py', mode 'r' at 0x7f15335c85d0>  #默认模式是read
>>> f.read()
'#!/usr/bin/python\n#Filename:is_prime_def.py\n\'\'\' aim to find all prime from 0 to the number user give. \'\'\'\ndef is_num(x):\n    try:\n
......
print \'==========Done========\'\n'
 
# 读完以后文件seek值到最后，再次读取的时候就读不到东西了
>>> f.readline()
''
# 用obj.seek(0)方法把seek恢复到0位置，也就是文件开头字符位置
>>> f.seek(0)
 
# readline()方法可以单独读行，从seek指针处往后读一整行，若指定size，则读出指定数量字符
>>> f.readline()             
'#!/usr/bin/python\n'
>>> f.readline(5)
"' aim"
 
# readlines()方法，本质就是重复调用readline()，返回一个list
>>> def print_file(f):
...     f.seek(0)
...     for line in f.readlines():
...         print line,              #最后的逗号保证输出时不会多出一个空行
...
>>> print_file(f)
#!/usr/bin/python
#Filename:is_prime_def.py=
。。。。。。
 
# 文件本身就是可以迭代的对象
>>> f = open('is_prime_def.py')
>>> for line in f:
...     print line,
...
#!/usr/bin/python
#Filename:is_prime_def.py
''' aim to find all prime from 0 to the number user give. '''
。。。。。。
 
# .close() 文件关闭方法
>>> f.close()
>>> f
<closed file 'is_prime_def.py', mode 'r' at 0x7f15335c85d0>
 
# 用with自动关闭文件
>>> with open('is_prime_def.py') as f:
...     for line in f:
...         print line,
...
#!/usr/bin/python
#Filename:is_prime_def.py
''' aim to find all prime from 0 to the number user give. '''
。。。。。。
>>> f
<closed file 'is_prime_def.py', mode 'r' at 0x7f4a9dc3c5d0>
# 当with代码块执行完毕以后，文件自动被关闭 
5.3.4 总结一下函数：
* 本质：输入，输出
* 内部逻辑: 要求高内聚
* 本地作用域： 注意可变对象和不可变对象
* 如何使用全局作用域：（不推荐使用global）
* 函数签名： 通过函数名称+参数就能够唯一确认函数，用help(函数)查看
 
5.4 lambda 匿名函数，闭包
=====================================
5.4.1 什么是闭包？
A function defined inside another function is called a nested function. Nested functions can access variables of the enclosing scope. In Python, these non-local variables are read only by default and we must declare them explicitly as non-local (using nonlocal keyword) in order to modify them. Following is an example of a nested function accessing a non-local variable.
 
def print_msg(msg):
    """This is the outer enclosing function"""
 
    def printer():
        """This is the nested function"""
        print(msg)
 
    printer()
 
We execute the function as follows.
 
>>> print_msg("Hello")
Hello
 
We can see that the nested function printer() was able to access the non-local variable msg of the enclosing function. In the example above, what would happen if the last line of the function print_msg() returned the printer() function instead of calling it? This means the function was defined as follows.
 
 
def print_msg(msg):
    """This is the outer enclosing function"""
 
    def printer():
        """This is the nested function"""
        print(msg)
 
    return printer  # this got changed
 
Now let's try calling this function.
 
>>> another = print_msg("Hello")
>>> another()
Hello
 
That's unusual. The print_msg() function was called with the string "Hello" and the returned function was bound to the name another. On calling another(), the message was still remembered although we had already finished executing the print_msg() function. This technique by which some data ("Hello") gets attached to the code is called closure in Python.
 
This value in the enclosing scope is remembered even when the variable goes out of scope or the function itself is removed from the current namespace.
 
>>> del print_msg
>>> another()
Hello
>>> print_msg("Hello")
Traceback (most recent call last):
...
NameError: name 'print_msg' is not defined 
5.4.2 怎么定义闭包？
As seen from the above example, we have a closure in Python when a nested function references a value in its enclosing scope. The criteria that must be met to create closure in Python are summarized in the following points.
 
*     We must have a nested function (function inside a function).
必须是一个函数（封闭函数）内嵌了一个函数（内嵌函数）
*     The nested function must refer to a value defined in the enclosing function.
内嵌函数指向了一个封闭函数空间内的变量
*     The enclosing function must return the nested function.
封闭函数必须返回了内嵌函数
 
               def closure():
                     x = 1                        #1、在封闭环境中的变量
                     def bibao():                 #2、函数中的函数
                           a = x + 1
                           return a
                     return bibao                 #3、上层函数返回下层函数
     
5.4.3 使用闭包的示例
                def counter_closure(start_at = 0):  
                      count = [start_at]
                      def incr():  
                            count[0] += 1  
                            return count
                      return incr
 
5.4.4 When To Use Closures?
 
So what are closures good for? Closures can avoid the use of global values and provides some form of data hiding. It can also provide an object oriented solution to the problem. When there are few methods (one method in most cases) to be implemented in a class, closures can provide an alternate and more elegant solutions. But when the number of attributes and methods get larger, better implement a class.
 
Here is a simple example where a closure might be more preferable than defining a class and making objects. But the preference is all yours.
 
def make_multiplier_of(n):
    def multiplier(x):
        return x * n
    return multiplier
 
Here is how we can use it.
 
 
>>> times3 = make_multiplier_of(3)
>>> times5 = make_multiplier_of(5)
 
>>> times3(9)
27
>>> times5(3)
15
>>> times5(times3(2))
30
 
Decorators in Python make an extensive use of closures as well.
 
On a concluding note, it is good to point out that the values that get enclosed in the closure function can be found out. All function objects have a __closure__ attribute that returns a tuple of cell objects if it is a closure function. Referring to the example above, we know times3 and times5 are closure functions.
 
>>> make_multiplier_of.__closure__
>>> times3.__closure__
(<cell at 0x0000000002D155B8: int object at 0x000000001E39B6E0>,)
 
The cell object has the attribute cell_contents which stores the closed value.
 
>>> times3.__closure__[0].cell_contents
3
>>> times5.__closure__[0].cell_contents
5 
5.4.3 闭包使用的陷阱
     def create_multipliers():
              return [lambda x : i * x for i in range(5)]      
# 推导式生成一个匿名函数列表
         
          for multiplier in create_multipliers():
              print multiplier(2)     
 
# 你猜会输出什么结果？
#  这里牵扯到late binding closure，当i * x 的时候，i的循环已经结束，i=4
 
     参考： http://docs.python-guide.org/en/latest/writing/gotchas/     
课后题
====================================
现有一nginx日志文件nginx.log格式如下:
$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$request_time"ms
 
nginx日志文件
链接: http://pan.baidu.com/s/1o6kTHlK 密码: esmw
 
实例：
127.0.0.1 - - [06/Aug/2015:00:00:09 +0000] "GET /favicon.ico.js HTTP/1.0" 200 88991 "-" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)" "112.26.66.147" "0.688"ms
 
问题1：
求出耗时最久的url，列出top100，并输出各url耗时。比如:
url            time
/favicon.ico   0.688
...            ...
 
问题2：
求出访问量最高的url，列出top50，并给出访问次数。比如:
url              times
/favicon.ico       12
 
问题3：
统计每小时的访问量，按时段分布。比如:
0点:  500
1点:  20
...   ...
 
问题4:
分别统计各url的访问量占比
.js文件
.css文件
.html文件
.png文件
 
精简后代码
#!/usr/bin/python
# coding=utf-8
 
 
'''aim to analysis nginx access log, print the result'''
 
 
def split_to_list(filein,separator=' ',index=0):
    '''split file by separator and collect data which the index directed into a list'''
    list_scan = []
    with open(filein) as f:
        for line in f:
            element = line.split(separator)[index]
            list_scan.append(element)
    return list_scan
 
def count_to_list(count_data,source_data):
    '''count_data is the list used in for loop; source_data is the list where counted from'''
    count_list = []
    for i in count_data:
        count_list.append([i,source_data.count(i)])
    count_list.sort()
    return count_list
 
def print_result(source_list,print_format,print_title,length=None):
    length = len(source_list) if not length else length
    print print_format %print_title
    for j in range(length):
        print format_str %(source_list[j][0],source_list[j][1])
## PATH OF INPUT FILE
path_log = '/root/py/05_2/access.log'
 
## select which question
print '''1: Top 100 of highest request time to url
2: Top 50 of most requested url
3: Count request times each clock
4: Count filetype requested percentage
======================================'''
while True:
    select = (raw_input('which question you want to select? ("1","2","3" or "4":)').strip())
    if select == '1':
        ## QUESTION 1
        ## CONVERT LOG FILE TO LIST
        url = split_to_list(path_log,index=6)
        request_time = split_to_list(path_log,separator='"',index=9)
        url_request_time = []
        for x in range(len(url)):
            url_request_time.append([url[x],request_time[x]])
        url_request_time = sorted(url_request_time,key=lambda x:float(x[1]),reverse=True)
 
        ## PRINT RESULT
        format_str = '%-45s %s'
        title_str = ('URL','REQUEST TIME')
        print_result(url_request_time,format_str,title_str,length=100)
        break
 
    elif select == '2':
        ## QUESTION 2
        ## COUNT URL , RETURN A LIST
        url_split = split_to_list(path_log,index=6)
        url_dereplication = set(url_split)
        url_times = count_to_list(url_dereplication,url_split)
        url_times = sorted(url_times,key=lambda x:float(x[1]),reverse=True)
 
        ## PRINT RESULT
        format_str = '%-60s %s'
        title_str = ('URL','TIMES')
        print_result(url_times,format_str,title_str,length=50)
        break
 
    elif select == '3':
        ## QUESTION 3
        ## COUNT REQUEST EACH CLOCK, RETURN A LIST
        clock_split = split_to_list(path_log,separator=":",index=1)
        clock_dereplication = set(clock_split)
        clock_times = count_to_list(clock_dereplication,clock_split)
 
        ## PRINT RESULT
        format_str = '%-20s %s'
        title_str = ('CLOCK','TIMES')
        print_result(clock_times,format_str,title_str)
        break
 
    elif select == '4':
        ## QUESTION 4
        ## COUNT REQUEST EACH FILETYPE, RETURN A LIST
        filetype_split = split_to_list(path_log,separator='"',index=1)
        filetype = ['.js', '.css', '.html', '.png']
        filetype_count = []
        percent_div = len(filetype_split)
        for i in filetype:
            count_i = 0
            for j in filetype_split:
                if i in j:
                    count_i += 1
            percentage = float(count_i)*100/percent_div
            filetype_count.append([i,percentage])
 
        ## PRINT RESULT
        print '%-20s %s' % ('FILETYPE','PERCENTAGE')
        for i in range(len(filetype_count)):
            print '%-20s %.2f' %(filetype_count[i][0],filetype_count[i][1])
        break
 
    else:
        print "you must select a question in the list before!"

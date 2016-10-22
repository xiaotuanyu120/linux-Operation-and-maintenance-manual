生成器 - 《从零开始学 Python》(第二版) - 极客学院Wiki
Friday, July 1, 2016
8:52 AM
生成器（英文：generator）是一个非常迷人的东西，也常被认为是 Python 的高级编程技能。不过，我依然很乐意在这里跟读者--尽管你可能是一个初学者--探讨这个话题，因为我相信读者看本教程的目的，绝非仅仅将自己限制于初学者水平，一定有一颗不羁的心--要成为 Python 高手。那么，开始了解生成器吧。
还记得上节的"迭代器"吗？生成器和迭代器有着一定的渊源关系。生成器必须是可迭代的，诚然它又不仅仅是迭代器，但除此之外，又没有太多的别的用途，所以，我们可以把它理解为非常方便的自定义迭代器。
最这个关系实在感觉有点糊涂了。稍安勿躁，继续阅读即明了。
简单的生成器
>>> my_generator = (x*x for x in range(4)) 
这是不是跟列表解析很类似呢？仔细观察，它不是列表，如果这样的得到的才是列表：
>>> my_list = [x*x for x in range(4)] 
以上两的区别在于是 [] 还是 ()，虽然是细小的差别，但是结果完全不一样。
>>> dir(my_generator)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', 
'__iter__', 
'__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 
'next', 
'send', 'throw'] 
为了容易观察，我将上述结果进行了重新排版。是不是发现了在迭代器中必有的方法__iter__()和 next()，这说明它是迭代器。如果是迭代器，就可以用 for 循环来依次读出其值。
>>> for i in my_generator:
...     print i
... 
0
1
4
9
>>> for i in my_generator:
...     print i
... 
当第一遍循环的时候，将 my_generator 里面的值依次读出并打印，但是，当再读一次的时候，就发现没有任何结果。这种特性也正是迭代器所具有的。
如果对那个列表，就不一样了：
>>> for i in my_list:
...     print i
... 
0
1
4
9
>>> for i in my_list:
...     print i
... 
0
1
4
9 
难道生成器就是把列表解析中的 [] 换成 () 就行了吗？这仅仅是生成器的一种表现形式和使用方法罢了，仿照列表解析式的命名，可以称之为"生成器解析式"（或者：生成器推导式、生成器表达式）。
生成器解析式是有很多用途的，在不少地方替代列表，是一个不错的选择。特别是针对大量值的时候，如上节所说的，列表占内存较多，迭代器（生成器是迭代器）的优势就在于少占内存，因此无需将生成器（或者说是迭代器）实例化为一个列表，直接对其进行操作，方显示出其迭代的优势。比如：
>>> sum(i*i for i in range(10))
285 
请读者注意观察上面的 sum() 运算，不要以为里面少了一个括号，就是这么写。是不是很迷人？如果列表，你不得不：
>>> sum([i*i for i in range(10)])
285 
通过生成器解析式得到的生成器，掩盖了生成器的一些细节，并且适用领域也有限。下面就要剖析生成器的内部，深入理解这个魔法工具。
定义和执行过程
yield 这个词在汉语中有"生产、出产"之意，在 Python 中，它作为一个关键词（你在变量、函数、类的名称中就不能用这个了），是生成器的标志。
>>> def g():
...     yield 0
...     yield 1
...     yield 2
... 
>>> g
<function g at 0xb71f3b8c> 
建立了一个非常简单的函数，跟以往看到的函数唯一不同的地方是用了三个 yield 语句。然后进行下面的操作：
>>> ge = g()
>>> ge
<generator object g at 0xb7200edc>
>>> type(ge)
<type 'generator'> 
上面建立的函数返回值是一个生成器(generator)类型的对象。
>>> dir(ge)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__iter__', '__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 'next', 'send', 'throw'] 
在这里看到了__iter__() 和 next()，说明它是迭代器。既然如此，当然可以：
>>> ge.next()
0
>>> ge.next()
1
>>> ge.next()
2
>>> ge.next()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration 
从这个简单例子中可以看出，那个含有 yield 关键词的函数返回值是一个生成器类型的对象，这个生成器对象就是迭代器。
我们把含有 yield 语句的函数称作生成器。生成器是一种用普通函数语法定义的迭代器。通过上面的例子可以看出，这个生成器（也是迭代器），在定义过程中并没有像上节迭代器那样写__inter__() 和 next()，而是只要用了 yield 语句，那个普通函数就神奇般地成为了生成器，也就具备了迭代器的功能特性。
yield 语句的作用，就是在调用的时候返回相应的值。详细剖析一下上面的运行过程：
1. ge = g()：除了返回生成器之外，什么也没有操作，任何值也没有被返回。
2. ge.next()：直到这时候，生成器才开始执行，遇到了第一个 yield 语句，将值返回，并暂停执行（有的称之为挂起）。
3. ge.next()：从上次暂停的位置开始，继续向下执行，遇到 yield 语句，将值返回，又暂停。
4. gen.next()：重复上面的操作。
5. gene.next()：从上面的挂起位置开始，但是后面没有可执行的了，于是 next() 发出异常。
从上面的执行过程中，发现 yield 除了作为生成器的标志之外，还有一个功能就是返回值。那么它跟 return 这个返回值有什么区别呢？
yield
为了弄清楚 yield 和 return 的区别，我们写两个没有什么用途的函数：
>>> def r_return(n):
...     print "You taked me."
...     while n > 0:
...         print "before return"
...         return n
...         n -= 1
...         print "after return"
... 
>>> rr = r_return(3)
You taked me.
before return
>>> rr
3 
从函数被调用的过程可以清晰看出，rr = r_return(3)，函数体内的语句就开始执行了，遇到 return，将值返回，然后就结束函数体内的执行。所以 return 后面的语句根本没有执行。这是 return 的特点，关于此特点的详细说明请阅读《函数(2)》中的返回值相关内容。
下面将 return 改为 yield：
>>> def y_yield(n):
...     print "You taked me."
...     while n > 0:
...         print "before yield"
...         yield n
...         n -= 1
...         print "after yield"
... 
>>> yy = y_yield(3)    #没有执行函数体内语句
>>> yy.next()          #开始执行
You taked me.
before yield
3                      #遇到 yield，返回值，并暂停
>>> yy.next()          #从上次暂停位置开始继续执行
after yield
before yield
2                      #又遇到 yield，返回值，并暂停
>>> yy.next()          #重复上述过程
after yield
before yield
1
>>> yy.next()
after yield            #没有满足条件的值，抛出异常
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration 
结合注释和前面对执行过程的分析，读者一定能理解 yield 的特点了，也深知与 return 的区别了。
一般的函数，都是止于 return。作为生成器的函数，由于有了 yield，则会遇到它挂起，如果还有 return，遇到它就直接抛出 SoptIteration 异常而中止迭代。
斐波那契数列已经是老相识了。不论是循环、迭代都用它举例过，现在让我们还用它吧，只不过是要用上 yield：
#!/usr/bin/env Python
# coding=utf-8

def fibs(max):
    """
    斐波那契数列的生成器
    """
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1

if __name__ == "__main__":
    f = fibs(10)
    for i in f:
        print i , 
运行结果如下：
$ python 21501.py
1 1 2 3 5 8 13 21 34 55 
用生成器方式实现的斐波那契数列是不是跟以前的有所不同了呢？读者可以将本教程中已经演示过的斐波那契数列实现方式做一下对比，体会各种方法的差异。
经过上面的各种例子，已经明确，一个函数中，只要包含了 yield 语句，它就是生成器，也是迭代器。这种方式显然比前面写迭代器的类要简便多了。但，并不意味着上节的就被抛弃。是生成器还是迭代器，都是根据具体的使用情景而定。
生成器方法
在 python2.5 以后，生成器有了一个新特征，就是在开始运行后能够为生成器提供新的值。这就好似生成器和"外界"之间进行数据交流。
>>> def repeater(n):
...     while True:
...         n = (yield n)
... 
>>> r = repeater(4)
>>> r.next()
4
>>> r.send("hello")
'hello' 
当执行到 r.next() 的时候，生成器开始执行，在内部遇到了 yield n 挂起。注意在生成器函数中，n = (yield n) 中的 yield n 是一个表达式，并将结果赋值给 n，虽然不严格要求它必须用圆括号包裹，但是一般情况都这么做，请读者也追随这个习惯。
当执行 r.send("hello") 的时候，原来已经被挂起的生成器（函数）又被唤醒，开始执行 n = (yield n)，也就是讲 send() 方法发送的值返回。这就是在运行后能够为生成器提供值的含义。
如果接下来再执行 r.next() 会怎样？
>>> r.next() 
什么也没有，其实就是返回了 None。按照前面的叙述，读者可以看到，这次执行 r.next()，由于没有传入任何值，yield 返回的就只能是 None.
还要注意，send() 方法必须在生成器运行后并挂起才能使用，也就是 yield 至少被执行一次。如果不是这样：
>>> s = repeater(5)
>>> s.send("how")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: can't send non-None value to a just-started generator 
就报错了。但是，可将参数设为 None：
>>> s.send(None)
5 
这是返回的是调用函数的时传入的值。
此外，还有两个方法：close() 和 throw()
* throw(type, value=None, traceback=None):用于在生成器内部（生成器的当前挂起处，或未启动时在定义处）抛出一个异常（在 yield 表达式中）。
* close()：调用时不用参数，用于关闭生成器。
最后一句，你在编程中，不用生成器也可以

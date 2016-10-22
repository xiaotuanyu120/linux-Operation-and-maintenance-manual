模块: timeit
2015年8月29日
15:54
 
module timeit
==========================================================
NAME
    timeit - Tool for measuring execution time of small code snippets.
 
FILE
    /usr/lib64/python2.7/timeit.py
 
DESCRIPTION
    This module avoids a number of common traps for measuring execution
    times.  See also Tim Peters' introduction to the Algorithms chapter in
    the Python Cookbook, published by O'Reilly.
 
    Library usage: see the Timer class.
 
    Command line usage:
        python timeit.py [-n N] [-r N] [-s S] [-t] [-c] [-h] [--] [statement]
 
    Options:
      -n/--number N: how many times to execute 'statement' (default: see below)
      -r/--repeat N: how many times to repeat the timer (default 3)
      -s/--setup S: statement to be executed once initially (default 'pass')
      -t/--time: use time.time() (default on Unix)
      -c/--clock: use time.clock() (default on Windows)
      -v/--verbose: print raw timing results; repeat for more digits precision
      -h/--help: print this usage message and exit
      --: separate options from statement, use when statement starts with -
      statement: statement to be timed (default 'pass')
 
实用工具
=======================================================
Class： Timer
class Timer
 |  Class for timing execution speed of small code snippets.
 |
 |  The constructor takes a statement to be timed, an additional
 |  statement used for setup, and a timer function.  Both statements
 |  default to 'pass'; the timer function is platform-dependent (see
 |  module doc string).
 |
 |  To measure the execution time of the first statement, use the
 |  timeit() method.  The repeat() method is a convenience to call
 |  timeit() multiple times and return a list of results.
 |
 |  The statements may contain newlines, as long as they don't contain
 |  multi-line string literals.
 
>>> Timer_instance = timeit.Timer('print "instance Timer"')
>>> type(Timer_instance)
<type 'instance'>
 
# Timer有两个参数stat = 'pass' setup = 'pass'
stat代表执行语句，setup是给stat的环境语句
比如stat是print 'hello world!'，setup可以是默认的'pass'
但stat是自创的函数func1()时，setup必须是'from __main__ import func1()'
才不会保错，因为Timer的执行环境是和__main__隔离开的，setup要把stat执行的环境准备好。 
func: timeit
timeit(stmt='pass', setup='pass', timer=<built-in function time>, number=1000000)
    Convenience function to create Timer object and call timeit method.
 
>>> Timer_instance.timeit(10)          #参数10是执行次数
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
5.698204040527344e-05 
func: repeat
repeat(stmt='pass', setup='pass', timer=<built-in function time>, repeat=3, number=1000000)
    Convenience function to create Timer object and call repeat method.
 
>>> Timer_instance.repeat(2, 5)  #参数2是执行两次，参数5是每一次的执行次数
instance Timer            #实际就是调用了2次timeit，然后把5传给了timeit
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
instance Timer
[3.814697265625e-05, 2.002716064453125e-05]  # 返回的是一个结果list 
EXAMPLE
=====================================================
#!/usr/bin/python
 
'''Aim to test which statement is faster between re.compile and
match directly'''
 
import timeit
import re
 
 
def re_c_test():
    s = ['good', 'hello', 'hub', 'hock', 'hong']
    t = re.compile('he')
    for i in s:
        t.match(i)
 
 
def re_m_test():
    s = ['good', 'hello', 'hub', 'hock', 'hong']
    for i in s:
        re.match("he", i)
 
 
if __name__ == "__main__":
    n = 1000000
 
    re_c = timeit.Timer("re_c_test()", "from __main__ import re_c_test")
    re_m = timeit.Timer("re_m_test()", "from __main__ import re_m_test")
 
    re_c_time = re_c.repeat(3, n)
    re_m_time = re_m.repeat(3, n)
 
    print 're_m run %d times cost\n\t%r' % (n, re_m_time)
    print 're_c run %d times cost\n\t%r' % (n, re_c_time) 

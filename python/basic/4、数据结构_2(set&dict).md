4、数据结构_2(set&dict)
2015年8月4日
9:00
 
4.6 set集合
======================================
4.6.1 基础操作
====================================
* 去重
#对list去重
>>> l = ['good', 'bad', 'popular', 'good']
>>> set(l)
set(['popular', 'bad', 'good'])
#对string去重
>>> s = 'I am good'
>>> set(s)
set(['a', ' ', 'd', 'g', 'I', 'm', 'o'])
#对tuple去重
>>> t = (1, 2, 1, 3)
>>> set(t)
set([1, 2, 3])
 
* 取交集、并集、差
>>> x = set("China")
>>> y = set("chinese")
>>> x, y
(set(['i', 'h', 'C', 'a', 'n']), set(['c', 'e', 'i', 'h', 'n', 's']))
#交集
>>> x & y
set(['i', 'h', 'n'])
#并集
>>> x | y
set(['a', 'C', 'e', 'i', 'h', 'c', 'n', 's'])
#差
>>> x - y
set(['a', 'C'])
 
4.6.2 set推导式
====================================
>>> {x*2 for x in range(10)}
set([0, 2, 4, 6, 8, 10, 12, 14, 16, 18])
 
>>> {x for x in 'abcdefg' if x not in 'abc'}
set(['e', 'd', 'g', 'f']) 
 
4.7 dict的使用
==============================================
dict特点：
* 字典无序
* key必须是hashable的对象，唯一
4.7.1  基础操作
============================================
##len() 取dict的长度
>>> d = {"liu":102, "zhao":201, "lun":333, "feng":542}
>>> len(d)
4
 
##keys() 取dict的key
>>> d.keys()
['liu', 'zhao', 'feng', 'lun']
##扩展、
想判断某个key是否在dict中，尽量使用'key in dict'，避免使用'key in dict.keys()'
 
##values() 取dict的value值
>>> d.values()
[102, 201, 542, 333]
 
##items() 将dict转换成元组list
>>> d.items()
[('liu', 102), ('zhao', 201), ('feng', 542), ('lun', 333)]
#输出一个list
 
##增加字典项
>>> d['yu'] = 260
>>> d
{'liu': 102, 'zhao': 201, 'yu': 260, 'feng': 542, 'lun': 333}
#因为字典是无序的，所以不会在最后的
 
4.7.2 对字典进行排序
============================================
>>> sorted(d.items(), key=lambda x:x[1])
[('liu', 102), ('zhao', 201), ('yu', 260), ('lun', 333), ('feng', 542)]
#虽然是字典是无序的，但是可以通过转换成list进行排序啊
 
4.7.3 clear方法
============================================
#用于清除dict中所有的项，无返回值，是个原地操作（即不需要把结果赋值给其他变量）
>>> x = {}
>>> y = x
>>> id(x)                    #现在x和y指向的同一个地址
8861504
>>> id(y)
8861504
>>> x['key'] = 'value'
>>> y
{'key': 'value'}
>>> x = {}                   #x赋值换了新的地址
>>> y
{'key': 'value'}
>>> id(x)                    #x换了新的地址
9233920
>>> id(y)
8861504
 
#使用clear（原地操作）
>>> x = {}
>>> y = x
>>> x['key'] = 'value'
>>> y
{'key': 'value'}
>>> x.clear()
>>> y
{}
>>> id(x),id(y)
(9233632, 9233632)           #x和y的地址依然相同
 
4.7.4 copy & deepcopy
============================================
#浅拷贝
>>> t = {"name":['superman', 'batman']}
>>> t1 = t.copy()
>>> t["sex"] = 'male'
>>> t1
{'name': ['superman', 'batman']}         # t中的改变在t1中并未改变
>>> t["name"][0] = 'spiderman'
>>> t1
{'name': ['spiderman', 'batman']}        #value list中的值同步t发生了改变
 
#深拷贝
>>> import copy
>>> d = {"name":['superman', 'batman']}
>>> d1 = copy.deepcopy(d)
>>> d1
{'name': ['superman', 'batman']}
>>> d['sex'] = 'male'
>>> d1
{'name': ['superman', 'batman']}         #同上，d1中未发生改变
>>> d['name'][0] = 'spiderman'
>>> d
{'name': ['spiderman', 'batman'], 'sex': 'male'}
>>> d1
{'name': ['superman', 'batman']}         #value list中的值并未发生改变
4.7.5 get
============================================
#通过get来获取value
>>> d
{'name': ['spiderman', 'batman'], 'sex': 'male'}
>>> d["skill"]              #直接获取不存在的key对应的值会报错
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: 'skill'
>>> d.get("skill",'fly')    #如果key不存在，返回默认值fly                       
'fly'
>>> d
{'name': ['spiderman', 'batman'], 'sex': 'male'}        #dict并未改变
 
4.7.6 setdefault
============================================
#跟get不同，会改变dict的值
>>> d.setdefault("skill",'sly')
'sly'
>>> d
{'skill': 'sly', 'name': ['spiderman', 'batman'], 'sex': 'male'}
 
4.7.7 update
============================================
#用dict 来更新dict
>>> d
{'skill': 'sly', 'name': ['spiderman', 'batman'], 'sex': 'male'}
>>> e = {'power':10000}
>>> d.update(e)
>>> d
{'skill': 'sly', 'name': ['spiderman', 'batman'], 'power': 10000, 'sex': 'male'}
 
4.7.8 dict推导式
=============================================
#将key和value对调
>>> t = {"this is key":"this is value"}
>>> {i:j for j,i in t.items()}
{'this is value': 'this is key'}
 
4.7.9 dict使用实例
=============================================
##用dict做缓存，以上节课判断素数代码为例
##随机输入一个数字判断是否为素数
 
##原代码
**********************************************
while True:
    try:
        input_user = int(raw_input('Input a number : '))
    except ValueError:
        print 'what you input is not a number!'
        continue
 
    is_prime = False
    for i in range(2,input_user//2+1):
        if input_user % i == 0 and input_user != i:
            is_prime = False
            print "%d isn't prime" % input_user
            break
        else:
            print i
            is_prime = True
    if is_prime:
        print "%d is prime" % input_user
**********************************************
##执行过程
# python is_prime.py
Input a number : 11
2
3
4
5
11 is prime
Input a number : 11
2
3
4
5
11 is prime
Input a number :
##从过程可以看出，每次输入11，程序都会遍历计算一遍
 
##带缓存的代码
**********************************************
cache_prime = {}
while True:
    try:
        input_user = int(raw_input('Input a number : '))
    except ValueError:
        print 'what you input is not a number!'
        continue
    if input_user in cache_prime:
        print input_user, cache_prime[input_user]
        continue
 
    is_prime = False
    for i in range(2,input_user//2+1):
        if input_user % i == 0 and input_user != i:
            is_prime = False
            print "%d isn't prime" % input_user
            cache_prime[input_user] = "isn't prime"
            break
        else:
            print i
            is_prime = True
    if is_prime:
        print "%d is prime" % input_user
        cache_prime[input_user] = "is prime"
**********************************************
##执行过程
# python is_prime.py
Input a number : 11
2
3
4
5
11 is prime
Input a number : 11
11 is prime              #直接输出了结果，并未计算，因为有缓存啊
Input a number :
 
4.7.10 课后习题
===============================================
2. 给你一首优美的英文诗选段
s = """
Have you thought about what you want people to say about you after you're gone? Can you hear the voice saying, "He was a great man." Or "She really will be missed." What else do they say?
One of the strangest phenomena of life is to engage in a work that will last long after death. Isn't that a lot like investing all your money so that future generations can bare interest on it? Perhaps, yet if you look deep in your own heart, you'll find something drives you to make this kind of contribution---something drives every human being to find a purpose that lives on after death.
"""
统计出其中共用到多少个字母，每个字母在字符串中出现的次数是多少，然后按照出现的频率进行排序输出。
1.        区分大小写
2.        不区分大小写
 
#我的解答：
***************************************************************
# coding=utf-8
#!/usr/bin/pythonp
# Filename:test_05.py
s = '''
Have you thought about what you want people to say about you after you're gone? Can you hear the voice saying, "He was a great man." Or "She really will be missed." What else do they say?
One of the strangest phenomena of life is to engage in a work that will last long after death. Isn't that a lot like investing all your money so that future generations can bare interest on it? Perhaps, yet if you look deep in your own heart, you'll find something drives you to make this kind of contribution---something drives every human being to find a purpose that lives on after death.
'''
# count how many letters in string s
letter_count = 0
for i in range(len(s)):
    if s[i].isalpha():
        letter_count += 1
print 'Total letter : %s' %letter_count
 
# dereplication string s
s=s.lower()
letter_unique = list(set(s))
letter_alpha = ['null']
k = 0
for j in range(len(letter_unique)):
    if letter_unique[j].isalpha():
        letter_alpha[k] = letter_unique[j]
        k += 1
        letter_alpha += ['null']
letter_alpha.remove('null')
 
# make a dict to store the result of count
alpha_count = {}
list_s = list(s)
for l in letter_alpha:
    alpha_count[l] = list_s.count(l)
 
# print result
alpha_print = [(x,y) for y,x in alpha_count.items()]
alpha_print.sort(reverse=True)
for n in range(len(alpha_count)):
    print '%-s: %s' %(alpha_print[n][1],alpha_print[n][0])
***************************************************************
* 简化后代码：
***************************************************************
# coding=utf-8
#!/usr/bin/pythonp
# Filename:test_05.py
s = '''
Have you thought about what you want people to say about you after you're gone? Can you hear the voice saying, "He was a great man." Or "She really will be missed." What else do they say?
One of the strangest phenomena of life is to engage in a work that will last long after death. Isn't that a lot like investing all your money so that future generations can bare interest on it? Perhaps, yet if you look deep in your own heart, you'll find something drives you to make this kind of contribution---something drives every human being to find a purpose that lives on after death.
'''
# count how many letters in string s
#s=s.lower()
letter_keep = [i for i in range(len(s)) if s[i].isalpha()]
print 'Total letter : %s' % len(letter_keep)
 
# dereplication string s
letter_unique = [j for j in list(set(s)) if j.isalpha()]
 
# make a dict by zip() to store the result of count
alpha_print = sorted(zip([list(s).count(l) for l in letter_unique],letter_unique))
 
# print result
for n in range(len(letter_unique)-1, -1, -1):
    print '%-s: %s' %(alpha_print[n][1],alpha_print[n][0])
***************************************************************
  

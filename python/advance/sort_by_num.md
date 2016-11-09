---
title: 当list的string中包含数字的时候，用数字来给list排序
date: 2016-11-09 12:57:00
categories: python/advance
tags: [python,list,sort]
---
### 当list的string中包含数字的时候，用数字来给list排序

----

#### sort()和sorted()的区别
- sort() Docstring:  
L.sort(cmp=None, key=None, reverse=False) -- stable sort *IN PLACE*;

- sorted() Docstring:   
sorted(iterable, cmp=None, key=None, reverse=False) --> new sorted list

通过它们的docstring知道，list.sort()的in place，是将原list本身进行排序，而sorted()的new sorted list，是在原list外生成一个新的排过序的list

----

#### 普通list的字符串排序
``` python
# 字符串组成的list，按照字符串排序
>>> a = ['1a', '3c', '2b', 'others']
>>> print sorted(a)
['1a', '2b', '3c', 'others']
```

----

#### 复杂list的字符串排序
``` python
# list组成的list，按照字符串排序(默认是用子list来排序)
>>> b = [['1a', 'one'], ['3c', 'three'], ['2b', 'two'], ['others', 'more']]
>>> print sorted(b)
[['1a', 'one'], ['2b', 'two'], ['3c', 'three'], ['others', 'more']]
# 指定使用子list[1]来排序
>>> print sorted(b, key=lambda x:x[1])
[['others', 'more'], ['1a', 'one'], ['3c', 'three'], ['2b', 'two']]
```


----

#### 普通list的数字排序
``` python
# 当数字是int格式时
>>> c = [1, 3, 2, 'other']
>>> print sorted(c)
[1, 2, 3, 'other']

# 当数字是字符串格式时
# 默认的排序会出问题
>>> d = ['1', '3', '2', '23']
>>> print sorted(d)
['1', '2', '23', '3']
# 23应该在3后面，但是却排在了3的前面

# 通过key=int来解决
>>> print sorted(d, key=int)
['1', '2', '3', '23']
```
> "key=int"的函数，代表了要将每一个key带入到int函数中，处理后再排序

----

#### 复杂list的数字排序
``` python
>>> e = [['1', 'one'], ['2', 'two'], ['4', 'four'], ['23', 'twenty three']]
# 若直接使用key=int函数会报错
>>> print sorted(e, key=int)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: int() argument must be a string or a number, not 'list'
# 因为现在默认的key是子list，而不是子list中的list[0]，所以int函数报错。

# 这样的话，我们需要去改写一个新的int函数
>>> def new_int(input):
...     return int(input[0])
...
>>> print sorted(e, key=new_int)
[['1', 'one'], ['2', 'two'], ['4', 'four'], ['23', 'twenty three']]
```

----

#### 当数字和字符串混合在一起时，如何进行数字排序
若数字字符串不为"1"这种格式，而是"1c"这种混合格式，我们就无法通过直接int来对key进行操作了，但按照我们上面的思路，需要进一步修改new_int函数
``` python
# 我们来个更复杂的，直接加入一个完全不包含数字的
>>> f = [['1a', 'one'], ['2b', 'two'], ['4d', 'four'], ['23y', 'twenty three'], ['others', 'more']]

# 导入re模块，用其来分割数字和字符串
>>> import re
# try_int是用来应对没有数字的情况
>>> def try_int(input):
...     try:
...         return int(input)
...     except:
...         return input
...
>>> def sort_key(in_list):
...     return [try_int(x) for x in re.split('([0-9]+)', in_list[0])]
...
>>> print sorted(f, key=sort_key)
[['1a', 'one'], ['2b', 'two'], ['4d', 'four'], ['23y', 'twenty three'], ['others', 'more']]
```
这样我们就达到了数字排序的目地

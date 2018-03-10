---
title: CLASS: new style class vs old style class (inspect)
date: 2018-03-03 16:04:00
categories: python/advance
tags: [python,class,inspect]
---
### CLASS: new style class vs old style class (inspect)

---

### 1. 新式类和旧式类
python2里面有新式类和旧式类之分，python3里面只有新式类，所以以下提到新式类和旧式类的区别，都是在python2的环境下讨论。
``` python
# 旧式类
class OldStyleClass:
    pass

print type(OldStyleClass)
# 输出
<type 'classobj'>


# 新式类
class NewStyleClass(object):
    pass

print type(NewStyleClass)
# 输出
<type 'type'>
```

---

### 2. 新旧类的类继承中的顺序区别
测试用的python文件`mro_test.py`
``` python
from inspect import getmro


class Base():
    def say(self):
        print("Base class")


class A(Base):
    pass


class B(Base):
    def say(self):
        print("B class")


class C(A, B):
    pass


if __name__ == "__main__":
    c = C()
    c.say()
    print(getmro(C))
```
旧式类按照深度优先继承类，所以寻找`say`函数时，先找到`Base`类的`say`函数。
``` bash
python2 mro_test.py
Base class
(<class __main__.C at 0x7fdf2fa0b050>, <class __main__.A at 0x7fdf31557ef0>, <class __main__.Base at 0x7fdf31557e88>, <class __main__.B at 0x7fdf31557f58>)
```
新式类为广度优先（提前给Base类继承object），所以寻找`say`函数时，先找到`B`类的`say`函数。
``` bash
python2 mro_test.py
B class
(<class '__main__.C'>, <class '__main__.A'>, <class '__main__.B'>, <class '__main__.Base'>, <type 'object'>)
```

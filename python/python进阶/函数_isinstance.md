函数: isinstance
2016年6月8日
9:28
 
In [22]: isinstance?
Docstring:
isinstance(object, class-or-type-or-tuple) -> bool
 
Return whether an object is an instance of a class or of a subclass thereof.
With a type as second argument, return whether that is the object's type.
The form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for
isinstance(x, A) or isinstance(x, B) or ... (etc.).
Type:      builtin_function_or_method
 
In [23]: isinstance(a, dict)
Out[23]: True
 
In [24]: isinstance(a, str)
Out[24]: False

---
title: codecs解决open()向文件写入Unicode时出现的Error
date: 2016-11-01 10:41:00
categories: python/advanced
tags: [python, unicode, open, codecs]
---
## 使用codecs解决open()向文件写入unicode时出现的Error
### 错误信息
``` python
>>> f = open('/tmp/test', 'w')
>>> f.write(u'\u201c')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'ascii' codec can't encode character u'\u201c' in position 0: ordinal not in range(128)
```

### 解决办法
``` python
>>> f = codecs.open('/tmp/test', 'w', encoding='utf8')
>>> f.write(u'\u201c')
```

### 原因解释
因为原生的open()并不支持写入unicode字符，只有使用codecs这个模块中的open()来代替解决
[官方对codecs的详细解释](https://docs.python.org/2/library/codecs.html)

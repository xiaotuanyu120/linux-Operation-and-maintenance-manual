---
title: how to change encode with iconv
date: 2016-10-22 23:01:00
categories: linux/advance
---
### when we need change encode
sometimes, we need put text files from windows to linux, and in most cases, for chinese,
you will find a lot of chinese confusion code inside. So how do we fix it?

### fix confusion code by using iconv
**what is iconv**
iconv - convert text from one character encoding to another
[for details](https://linux.die.net/man/1/iconv)

**example**
``` bash
# for example, we need fix chinese confusion code problem
iconv -f gb18030 -t utf8 test.txt -o test2.txt
```

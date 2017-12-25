---
title: SHELL: 1.0 变量的简单处理(${})
date: 2016-04-05 00:07:00
categories: linux/shell
tags: [shell,variable]
---
### SHELL: 1.0 变量的简单处理(${})

---

### 0. 声明file变量
``` bash
file=http://www.python.org/test.php?pip.tar.gz
```

---

### 1. 匹配截取
``` bash
# 去除第一个"//"及其左边的内容
echo ${file#*//}
www.python.org/test.php?pip.tar.gz

# 去除最后一个"/"及其左边的内容
echo ${file##*/}
test.php?pip.tar.gz

# 去除最后一个"/"及其右边的内容
echo ${file%/*}
http://www.python.org

# 去除第一个"//"及其右边的内容
echo ${file%%//*}
http:
```

---

### 2. 位置截取
``` bash
# 截取最开始7个字符
echo ${file:0:7}
http://

# 截取第7个字符后面连续14个字符
echo ${file:7:14}
www.python.org

# 截取第一个字符
echo ${file::1}
h

# 截取最后一个字符
echo ${file: -1}
z

# 去除最后一个字符
echo ${file%?}
http://www.python.org/test.php?pip.tar.g

# 去除第一个字符
echo ${file#?}
ttp://www.python.org/test.php?pip.tar.gz
```

---

### 3. 替换
``` bash
# 替换第一个'p'为'P'
echo ${file/p/P}
httP://www.python.org/test.php?pip.tar.gz

# 替换所有的'p'为'P'
echo ${file//p/P}
httP://www.Python.org/test.PhP?PiP.tar.gz
```

---

### 4. 根据变量是否定义或是否为空，加以判断，并处理返回值
#### 1) "-"，未定义时返回预设值
`${var-string} 仅改变回传值`
``` bash
# 变量未定义，返回预设值
unset file
echo ${file-newfile}
newfile
```
#### 2) ":-"，未定义及为空时返回预设值
`${var:-string} 仅改变回传值`
``` bash
# 变量未定义及变量为空，皆返回预设值
unset file
echo ${file:-newfile}
newfile

file=''
echo ${file:-newfile}
newfile
```
#### 3) "+"，除了未定义时，其他皆返回预设值
`${var+string} 仅改变回传值`
``` bash
# 不论变量是否为空，皆返回预设值
file=''
echo ${file+newfile}
newfile
file='oldfile'
echo ${file+newfile}
newfile

# 变量未定义时，不改变输出
unset file
echo ${file+newfile}
```
#### 4) ":+"，除了未定义或为空时，其他皆返回预设值
`${var:+string} 仅改变回传值`
``` bash
# 变量非空时返回预设值
file='oldfile'
echo ${file:+newfile}
newfile
```

PS:扩展
${file=my.file.txt} ：若 $file 沒設定，則使用 my.file.txt 作傳回值，同時將 $file 賦值為 my.file.txt 。 (空值及非空值時不作處理)  
${file:=my.file.txt} ：若 $file 沒設定或為空值，則使用 my.file.txt 作傳回值，同時將 $file 賦值為 my.file.txt 。 (非空值時不作處理)  
${file?my.file.txt} ：若 $file 沒設定，則將 my.file.txt 輸出至 STDERR。 (空值及非空值時不作處理)  
${file:?my.file.txt} ：若 $file 沒設定或為空值，則將 my.file.txt 輸出至 STDERR。 (非空值時不作處理)  

---

### 5. 获取变量字符串长度
``` bash
file='oldfile'
echo ${\#file}
7
```
> "\\"只是为了jinja语法的转义

---

### 6. 通过变量匹配
``` bash
a="http://www.baidu.com/tengxun"
b=".com"

echo ${a##*${b}}
/tengxun
echo ${a%%${b}*}
http://www.baidu
echo ${a/${b}/.COM}
http://www.baidu.COM/tengxun
```

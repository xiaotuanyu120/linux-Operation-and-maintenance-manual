SHELL: ${}简单用法
2016年4月5日
0:07
 
## 声明file变量
# file=http://www.python.org/test.php?pip.tar.gz
 
匹配截取
=============================================
## 去除第一个"//"及其左边的内容
# echo ${file#*//}
www.python.org/test.php?pip.tar.gz
 
## 去除最后一个"/"及其左边的内容
# echo ${file##*/}
test.php?pip.tar.gz
 
## 去除最后一个"/"及其右边的内容
# echo ${file%/*}
http://www.python.org
 
## 去除第一个"//"及其右边的内容
# echo ${file%%//*}
http:
 
位置截取
=============================================
## 截取最开始7个字符
# echo ${file:0:7}
http://
 
## 截取第7个字符后面连续14个字符
# echo ${file:7:14}
www.python.org
 
替换
==============================================
## 替换第一个'p'为'P'
# echo ${file/p/P}
httP://www.python.org/test.php?pip.tar.gz
 
## 替换所有的'p'为'P'
# echo ${file//p/P}
httP://www.Python.org/test.PhP?PiP.tar.gz
 
${var-string} & ${var:-string} 仅改变回传值
(## 可用来判断变量是否定义或是否为空值)
=============================================
## 变量未定义，返回预设值；变量为空，返回空值
# unset file
# echo ${file-newfile}
newfile
# file=''
# echo ${file-newfile}
## 变量不为空时，返回原值
# file='oldfile'
# echo ${file-newfile}
oldfile
 
 
## 变量未定义及变量为空，皆返回预设值
# unset file
# echo ${file:-newfile}
newfile
# file=''
# echo ${file:-newfile}
newfile
## 变量不为空时，返回原值
# file='oldfile'
# echo ${file:-newfile}
oldfile
 
${var+string} & ${var:+string} 仅改变回传值
(可用来判断变量是否为空)
=============================================
## 不论变量是否为空，皆返回预设值
# file=''
# echo ${file+newfile}
newfile
# file='oldfile'
# echo ${file+newfile}
newfile
## 变量未定义时，不改变输出
# unset file
# echo ${file+newfile}
 
 
## 变量非空时返回预设值；变量为空，返回原值
# file=''
# echo ${file:+newfile}
 
# file='oldfile'
# echo ${file:+newfile}
newfile
## 变量未定义时，不改变输出
# unset file
# echo ${file+newfile}
 
PS:扩展
${file=my.file.txt} ：若 $file 沒設定，則使用 my.file.txt 作傳回值，同時將 $file 賦值為 my.file.txt 。 (空值及非空值時不作處理)
${file:=my.file.txt} ：若 $file 沒設定或為空值，則使用 my.file.txt 作傳回值，同時將 $file 賦值為 my.file.txt 。 (非空值時不作處理)
${file?my.file.txt} ：若 $file 沒設定，則將 my.file.txt 輸出至 STDERR。 (空值及非空值時不作處理)
${file:?my.file.txt} ：若 $file 沒設定或為空值，則將 my.file.txt 輸出至 STDERR。 (非空值時不作處理)
 
## 获取变量字符串长度
# file='oldfile'
# echo ${#file}
7

GIT error: 添加链接文件报错
2016年10月6日
9:37
 
### 错误信息
当去添加某些文件时报以下错误
``` git
error: readlink("bin/python"): Function not implemented
error: unable to index file bin/python
fatal: updating files failed
 
# 发现原来出错的文件都是软连接
$ ls -l bin/python
lrwxrwxrwx 1 zackzhao 1049089 9 十月  5 17:48 bin/python -> python2.7
```
 
### 解决办法
``` git
git config core.symlinks true
```

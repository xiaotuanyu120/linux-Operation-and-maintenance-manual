---
title: jdk: 2.1.0 命令行编译java项目
date: 2017-08-25 10:34:00
categories: java/jvm
tags: [jdk,javac]
---
### jdk: 2.1.0 命令行编译java项目

---

### 0. 命令行编译java项目之前
javac命令是jdk中提供的一个工具，用于编译`.java`源文件为`.class`文件。我们主要使用这个命令及其参数来编译java项目。
> 参考以下文档
> - [英文精品文档，介绍了详细的原理](http://www.sergiy.ca/how-to-compile-and-launch-java-code-from-command-line/)
> - [前一篇的中文翻译，增加了多文件编译的提示](http://www.wangmingkuo.com/java/linux%E4%B8%8B%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%BC%96%E8%AF%91%E8%BF%90%E8%A1%8Cjava%E7%A8%8B%E5%BA%8F%EF%BC%88%E5%A4%9A%E4%B8%AA%E6%96%87%E4%BB%B6%E6%88%96%E8%80%85/)
> - [关于编译文件顺序问题的解决](http://benweizhu.github.io/blog/2014/04/07/write-java-code-without-ide/)

---

### 1. 命令行编译java项目
网上了解一下javac的用法，就可以学会如何编译一个单独的java文件。但是若要编译一个java项目，需要注意以下几点
- 使用`-classpath`或`-cp`指定所有的依赖的jar包路径，linux使用`:`而windows使用`;`来间隔，例如"lib/somejar.jar:/usr/local/tomcat/lib/somejar2.jar"，不然会有很多import找不到包的错误
- 要指定源文件根目录，使用`-sourcepath`
- 需要编译工程所有的java源文件，可用for循环java源文件，也可用`@文件`，文件中储存所有java文件的方式

``` bash
# 进入工程根目录，子目录是src源文件目录和lib-jar包目录

# 准备源文件路径文件
echo > javafile.txt
find src/ -name *.java >> javafile.txt

# 拼接一下jar包的路径
jarfiles=()
for jar in $(find lib -name *.jar);do jarfiles=("${jarfiles[@]}" $jar);done
classfile=""
for cf in ${jarfiles[@]};do classfile="${classfile}:${cf}";done

# src是源目录
# $classfile是jar文件路径
# class是编译后的class文件目录
# @javafile.txt是读取javafile.txt文件中列出的java源文件，来逐个编译，也可以直接写单个文件路径
javac -d class -sourcepath src -cp $classfile @javafile.txt
```

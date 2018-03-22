---
title: svn: 1.4.0 svn tags vs git tags
date: 2018-03-22 14:58:00
categories: linux/service
tags: [svn,git,tag]
---
### svn: 1.4.0 svn tags vs git tags

---

### 1. svn tags
[svn tags 官方文档](https://tortoisesvn.net/docs/release/TortoiseSVN_en/tsvn-dug-branchtag.html)  
结论： **实际上svn不存在branch和tags，一切都只是目录而已。**  
为了测试，我自己搭建了一个svn环境，创建了一个repo，里面只增加了一个文件
``` bash
1.txt
```
当我按照官方的操作创建了一个tags（url指定tags/v0.0.1），然后我在update一下我的库，我发现work dir里面出现了以下文件
``` bash
1.txt
tags\v0.0.1\1.txt
```
> 相当于给我拷贝了一份代码到指定的tags目录中。

---

### 2. 谈谈git tags
有一句名言，这里引用一下 “Git isn’t better than Subversion, it’s just different”.
#### git里面的tags是怎样的呢？
在讨论git中的tags之前，我们先来看看git是如何对待文件的。 在这里引用一下pro-git里面的一段话  
```
直接记录快照，而非差异比较

Git 和其它版本控制系统（包括 Subversion 和近似工具）的主要差别在于 Git 对待数据的方法。 概念上来区分，其它大部分系统以文件变更列表的方式存储信息。 这类系统（CVS、Subversion、Perforce、Bazaar 等等）将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异。

Git 不按照以上方式对待或保存数据。 反之，Git 更像是把数据看作是对小型文件系统的一组快照。 每次你提交更新，或在 Git 中保存项目状态时，它主要对当时的全部文件制作一个快照并保存这个快照的索引。 为了高效，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。 Git 对待数据更像是一个 快照流。
```
现在让我们一起来看一下tags，同样我们引用pro-git中的内容
```
Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。

一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。

然而，附注标签是存储在 Git 数据库中的一个完整对象。
```
也就是说，git中有两种tags，一种是轻量级的，仅仅是一个commit的引用，这种会很小。  
另外一种附注标签是git数据库中的一个完整对象。  


通常情况下，git的tags比较好用一些。
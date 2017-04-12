---
title: git: 1.3.0 忽略文件-“.gitignore”
date: 2016-03-24 15:54:00
categories: devops/git
tags: [git,ignore]
---
### git: 1.3.0 忽略文件-“.gitignore”

---

### 1. 如何配置".gitignore"
有时候一个目录内，我们可能不想让git追踪某些文件，比如临时文件或者本地测试文件
``` bash
# 在git项目根目录创建文件
vim ./.gitignore
*********************************
*.pyc
.*
*********************************
```
> 此例中忽略了所有的pyc后缀文件和隐藏文件

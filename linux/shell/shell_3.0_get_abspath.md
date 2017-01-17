---
title: SHELL: 3.0 如何获取脚本绝对路径
date: 2016-07-28 10:59:00
categories: linux/shell
tags: [shell,linux]
---
### SHELL: 3.0 如何获取脚本绝对路径

---

### 1. 使用readlink
``` bash
mypath=`readlink -f $(dirname $0)`
echo $mypath
```

---

### 2. 使用pwd
``` bash
basedir=$(cd "$(dirname "$0")"; pwd)
```

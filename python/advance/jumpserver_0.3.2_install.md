---
title: jumpserver 0.3.2 install
date: 2018-01-09 16:28:00
categories: python/advance
tags: [python,jumpserver]
---
### jumpserver 0.3.2 install

---

### 安装jumpserver v0.3.2
``` bash
wget https://github.com/jumpserver/jumpserver/archive/0.3.2-rc2.tar.gz
tar zxvf 0.3.2-rc2.tar.gz
cd jumpserver-0.3.2-rc2/install
python install.py
# 如果有现成的mysql，需要提前创建jumpserver数据库，并创建用户授权访问该库
```

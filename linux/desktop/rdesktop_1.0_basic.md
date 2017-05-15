---
title: rdesktop: 1.0 基础用法
date: 2017-05-10 11:35:00
categories: linux/desktop
tags: [linux,fedora,rdesktop]
---
### rdesktop: 1.0 基础用法

---

### 1. fedora 25 上远程windows10的基本用例
``` bash
rdesktop -r sound:local 172.16.33.222 -d nnti -u zackzhao -p password -a 16 -g 1600x900
```

参数解释
- -r sound:[local|off|remote], 使用local可以把远程声音展示到本地
- -d domain, 指定需要登录的域
- -u user, 指定用户名称
- -p password, 指定用户密码
- -a bpp, 指定色彩位数(8, 15, 16, 24 or 32)
- -g geometry, 指定分辨率，宽x高

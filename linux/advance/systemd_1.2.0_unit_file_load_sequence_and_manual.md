---
title: systemd 1.2.0 unit file load sequence and manual
date: 2018-10-17 09:31:00
categories: linux/advance
tags: [systemd,manual]
---
### systemd 1.2.0 unit file load sequence and manual

---

### 1. manual for systemd unit files
``` bash
man systemd.unit
```

### 2. systemd unit file load sequence
下面的内容来自于systemd.unit的manual
```
UNIT LOAD PATH
       Unit files are loaded from a set of paths determined during compilation, described in the two tables below. Unit files found in directories listed earlier
       override files with the same name in directories lower in the list.

       Table 1.  Load path when running in system mode (--system).
       ┌────────────────────────┬─────────────────────────────┐
       │Path                    │ Description                 │
       ├────────────────────────┼─────────────────────────────┤
       │/etc/systemd/system     │ Local configuration         │
       ├────────────────────────┼─────────────────────────────┤
       │/run/systemd/system     │ Runtime units               │
       ├────────────────────────┼─────────────────────────────┤
       │/usr/lib/systemd/system │ Units of installed packages │
       └────────────────────────┴─────────────────────────────┘

       Additional units might be loaded into systemd ("linked") from directories not on the unit load path. See the link command for systemctl(1). Also, some units
       are dynamically created via a systemd.generator(7).
```
> 重点需要注意：
1. unit files配置在三个目录中
2. unit files和iptables的规则差不多，是从（表中）上到下，遇到的第一个unit file生效。
3. unit files可以是一个其他非表中目录的文件的链接（链接文件必须在表中的目录中）
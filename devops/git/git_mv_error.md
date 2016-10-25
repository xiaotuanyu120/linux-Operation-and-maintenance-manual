---
title: git mv error caused by case sensitive of linux
date: 2016-10-25 19:49:00
categories: devops/git
tags: [devops,git,error]
---
### error info
its occured when i want to rename a folder by using git
``` bash
[root@localhost linux-Operation-and-maintenance-manual]# git mv DevOps devops
fatal: renaming 'DevOps' failed: Text file busy
```

### reason
this is because git think DevOps is like devops, almost same.
but, if you do it as below, it worked.
``` bash
[root@localhost linux-Operation-and-maintenance-manual]# git mv DevOps devopss
[root@localhost linux-Operation-and-maintenance-manual]# git mv devopss devops
```
so, we know that we need rename it with thinking about the case sensitive problem next time.

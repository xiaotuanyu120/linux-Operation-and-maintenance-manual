---
title: jenkins: 2.2.0 配置JENKINS_HOME
date: 2017-06-14 14:02:00
categories: devops/jenkins
tags: [jenkins,java,linux]
---
### jenkins: 2.2.0 配置JENKINS_HOME

---

### 1. 什么是JENKINS_HOME?
JENKINS_HOME代表的是jenkins的程序目录，它会储存所有的jenkins数据在里面，也就是说如果你希望去备份jenkins，只需要去备份这个目录就可以了。恢复数据也很简单，就是用备份数据覆盖这个目录的数据重启就可以了。

---

### 2. 修改JENKINS_HOME?
默认情况下JENKINS_HOME是指的`~/.jenkins`，如果希望改变，只需要改变当前的JENKINS_HOME变量即可
``` bash
export JENKINS_HOME=/data/jenkins
```
> 也可以将这个语句写进/etc/profile中，当修改完JENKINS_HOME后，重启jenkins即可

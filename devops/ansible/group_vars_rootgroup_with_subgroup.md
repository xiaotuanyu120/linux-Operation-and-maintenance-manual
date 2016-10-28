---
title: 组变量之父组和子组的变量是否可储存在同一个目录中
date: 2016-10-25 22:08:00
categories: devops/ansible
tags: [ansible,vars,group_vars]
---

### 为什么有这个发问？
在ansible的使用过程中我们会遇到这样的情况
```
[productA:children]
hk-server
sh-server
bj-server

[hk-server]
...

[sh-server]
...

[bj-server]
...

[productB:children]
...

[productC:children]
...
```
于是我们的group_vars目录中就会有下列情景
``` bash
[root@node01 ansible-tomcat]# ls group_vars/
productA  hk-server  sh-server  bj-server
productB ...
```
面对这么多的文件，有时候需要按照产品寻找真的很成问题，所以，才有了上面的发问，
下面我们来实验以下是否可以将父组和子组的变量放在一起

### 实验过程
#### 实验1
首先，我们需要去测试，当我们将组变量以目录下几个子文件的方式存储时，如果有冲突变量，那么生效规则的问题
我们会为WEB组准备两个变量文件，将他们存储在group_vars/WEB/中，并观察冲突变量的生效规则
**hosts文件内容**
```
[WEB:children]
web1

[web1]
192.168.33.102
```

**group_vars/WEB/下的组变量文件内容**
``` bash
# group_vars/WEB/var1
*********************
---
webvar: var-father01
*********************

# group_vars/WEB/var2
*********************
---
webvar: var-father02
*********************
```

**main.yml文件内容**
```
---
- hosts: WEB
  remote_user: root

  tasks:
    - debug: msg="{{ webvar }}"
```

**执行结果**
``` bash
[root@node01 test]# ansible-playbook -i hosts main.yml

PLAY [WEB] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.33.102]

TASK [debug] *******************************************************************
ok: [192.168.33.102] => {
    "msg": "var-father02"
}

PLAY RECAP *********************************************************************
192.168.33.102             : ok=2    changed=0    unreachable=0    failed=0
```
执行结果显示，var2文件中的变量内容生效

**将var1更改为var3，再次测试**
这样是为了测试，文件顺序对变量生效的影响
``` bash
[root@node01 test]# mv group_vars/WEB/var1 group_vars/WEB/var3
[root@node01 test]# ansible-playbook -i hosts main.yml

PLAY [WEB] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.33.102]

TASK [debug] *******************************************************************
ok: [192.168.33.102] => {
    "msg": "var-father01"
}

PLAY RECAP *********************************************************************
192.168.33.102             : ok=2    changed=0    unreachable=0    failed=0
```
执行结果显示，此时var3文件中的变量内容生效，也就是说，文件的顺序越靠后，越晚被加载，优先级越高

**测试子组变量是否可放在父组中**
将var3改为web，将var2改为web2，将子组变量文件创建为web1(因为ansible中变量文件需要与组名相同)
这样文件顺序就为web web1 web2，若最终结果是web1中的变量内容，说明子组变量按照规则覆盖了父组变量
若变量不是web1中的变量内容，说明web1只是WEB组中的一个普通变量储存文件，也就是说子组变量文件并不能放在父组中
``` bash
[root@node01 test]# mv group_vars/WEB/var3 group_vars/WEB/web
[root@node01 test]# mv group_vars/WEB/var2 group_vars/WEB/web2
[root@node01 test]# vim group_vars/WEB/web1
*************************
---
webvar: var-subgroup-web1
*************************

# 执行结果
[root@node01 test]# ansible-playbook -i hosts main.yml

PLAY [WEB] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.33.102]

TASK [debug] *******************************************************************
ok: [192.168.33.102] => {
    "msg": "var-father02"
}

PLAY RECAP *********************************************************************
192.168.33.102             : ok=2    changed=0    unreachable=0    failed=0
```
结果说明，很遗憾，我们无法将父组和子组中的变量放在同一个目录中

但是，从本质上讲，父组和子组变量之间，包括子组与子组之间，无非就是冲突时的变量处理问题
我们可以将不冲突的变量全部写入到父组中
然后，
- 父组与子组冲突时，利用变量文件排序，后者覆盖前者的特性，将子组命名为父组变量文件之后即可如web01、web02
- 子组之间冲突时，我们可以在父组中创建一个变量list，然后子组中分别使用不冲突变量名称，将所有的子组变量赋值给父组变量中的变量list，然后进一步处理
**子组冲突的例子**
```
# 父组中创建变量list
---
  test:
    - '{{ test_01 | d({}) }}'
    - '{{ test_02 | d({}) }}'


# 子组中分别为test_01和test_02
```

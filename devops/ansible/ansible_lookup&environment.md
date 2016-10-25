ansible: lookup & environment
2016年10月17日
15:47
 
---
title: 使用ansible获取主机的JAVA_HOME
date: 2016-10-17 15:02:00
categories: devops
tags: [devops,ansible]
---
### 问题背景
最近公司要做运维自动化(工具使用ansible)，但因为前期未统一环境，导致线上机器JAVA_HOME并不统一
于是有了一个需求，如何使用ansible去获取JAVA_HOME？
 
<!--more-->
 
### 解决思路过程
**思路1、使用command模块执行which java获取**
``` bash
# inventory内容
*********************************
[test]
47.90.80.156
*********************************
 
# 测试yaml文件内容
*********************************
---
- hosts: all
  remote_user: root
 
  tasks:
   - command: which java
     register: get_java
 
   - debug: var=get_java
*********************************
 
# 执行报错
ansible-playbook -i hosts main.yml
 
PLAY [all] *********************************************************************
 
TASK [setup] *******************************************************************
ok: [47.90.80.156]
 
TASK [command] *****************************************************************
fatal: [47.90.80.156]: FAILED! => {"changed": true, "cmd": ["which", "java"], "delta": "0:00:00.006982", "end": "2016-10-17 15:17:52.931760", "failed": true, "rc": 1, "start": "2016-10-17 15:17:52.924778", "stderr": "which: no java in (/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin)", "stdout": "", "stdout_lines": [], "warnings": []}
 
NO MORE HOSTS LEFT *************************************************************
 [WARNING]: Could not create retry file 'main.retry'.         [Errno 2] No such file or directory:
''
 
 
PLAY RECAP *********************************************************************
47.90.80.156               : ok=1    changed=0    unreachable=0    failed=1   
```
 
以上报错，是因为ansible执行task时，host的PATH变量和实际登录host时的PATH不一致造成的
``` bash
ansible -i hosts test -m setup |grep PATH
            "PATH": "/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin",
```
 
**思路2、使用lookup获取PATH变量，然后在去执行which java**
``` bash
# inventory内容
*********************************
[test]
47.90.80.156
*********************************
 
# 测试yaml文件内容
*********************************
---
- hosts: all
  remote_user: root
 
  tasks:
   - command: which java
     register: get_java
     environment:
       PATH: "{{ lookup('env', 'PATH') }}"
 
   - debug: var=get_java.stdout
*********************************
# environment参数可以改变ansible执行task时的环境变量
# register可以把task的执行结果获取到，此处get_java是一个dict，我们只需要stdout即可
 
# 执行结果
ansible-playbook -i hosts main.yml
 
PLAY [all] *********************************************************************
 
TASK [setup] *******************************************************************
ok: [47.90.80.156]
 
TASK [command] *****************************************************************
changed: [47.90.80.156]
 
TASK [debug] *******************************************************************
ok: [47.90.80.156] => {
    "get_java.stdout": "/usr/java/bin/java"
}
 
PLAY RECAP *********************************************************************
47.90.80.156               : ok=3    changed=1    unreachable=0    failed=0   
```
 
**思路3、如何将结果传递到template中**
我们之所以要获取JAVA_HOME，为的是需要将此变量写入到每个tomcat的启动脚本中，所以上面获取的结果还需要写入到template中才圆满
``` bash
# inventory
*********************************
[test]
47.90.80.156
*********************************
 
# 测试yaml文件内容
*********************************
---
- hosts: all
  remote_user: root
 
  tasks:
   - command: which java
     register: get_java
     environment:
       PATH: "{{ lookup('env', 'PATH') }}"
 
   - name: copy init script to host
     template: src='/root/test.sh' dest='/root/tomcat.sh'
*********************************
 
# 模版文件内容/root/test.sh
*********************************
JAVA_HOME=$(dirname $(dirname {{ get_java.stdout }}))
echo $JAVA_HOME
*********************************
# dirname命令可以获取文件的路径，详情可man dirname查看
 
# 执行结果
ansible-playbook -i hosts main.yml
 
PLAY [all] *********************************************************************
 
TASK [setup] *******************************************************************
ok: [47.90.80.156]
 
TASK [command] *****************************************************************
changed: [47.90.80.156]
 
TASK [copy init script to host] ************************************************
changed: [47.90.80.156]
 
PLAY RECAP *********************************************************************
47.90.80.156               : ok=3    changed=2    unreachable=0    failed=0   
```
 
**到目标机器上去看一下tomcat.sh文件**
``` bash
sh /root/tomcat.sh
/usr/java
 
cat /root/tomcat.sh
JAVA_HOME=$(dirname $(dirname /usr/java/bin/java))
echo $JAVA_HOME
```
至此，我们已经完成了整个使用ansible自动获取host的JAVA_HOME变量的过程

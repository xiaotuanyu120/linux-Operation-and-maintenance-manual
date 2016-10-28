---
title: ansible: register & when
date: 2016-10-18 10:22:00
categories: devops/ansible
tags:
---

---
title: ansible状态语句when的使用
date: 2016-10-18 10:29:00
categories: devops
tags: [ansible,devops]
---
### 问题背景
使用ansible过程中task之间不可能完全独立，ansible提供了很多方法来帮助我们实现task之间的逻辑
例如：
- 配置文件更新之后可以使用notify，执行相应handler重启服务
- 使用ignore_errors来跳过不能100%执行成功的task
- 循环语句和条件语句

此处需要研究的就是when条件语句，执行目标是确定host的java环境是否存在，以决定是否安装

<!--more-->

### 解决过程
**使用register获取执行结果**
``` bash
# roles的变量文件内容:roles/install_java/vars/main.yml
*******************************
---
JAVA_HOME: /usr/local/jdk
*******************************

# install_java的tasks文件内容
*******************************
---
- command: "{{ JAVA_HOME }}/bin/java -version"
  register: java_result
  ignore_errors: True

- debug: var=java_result
*******************************
# ignore_errors配置，可以在command执行失败的时候跳过错误，继续执行tasks

# 执行结果
ansible-playbook -i hosts main.yml -e '{"host":"long8_web01","role":"install_java"}'

PLAY [long8_web01] *************************************************************

TASK [setup] *******************************************************************
ok: [103.236.220.177]

TASK [install_java : command] **************************************************
changed: [103.236.220.177]

TASK [install_java : debug] ****************************************************
ok: [103.236.220.177] => {
    "java_result": {
        "changed": true,
        "cmd": [
            "/usr/local/jdk/bin/java",
            "-version"
        ],
        "delta": "0:00:00.050991",
        "end": "2016-10-18 11:09:53.606986",
        "rc": 0,
        "start": "2016-10-18 11:09:53.555995",
        "stderr": "java version \"1.6.0_45\"\nJava(TM) SE Runtime Environment (build 1.6.0_45-b06)\nJava HotSpot(TM) 64-Bit Server VM (build 20.45-b01, mixed mode)",
        "stdout": "",
        "stdout_lines": [],
        "warnings": []
    }
}

PLAY RECAP *********************************************************************
103.236.220.177            : ok=3    changed=1    unreachable=0    failed=0
# 成功收集了信息
```

**使用when语句来处理得到的信息**
``` bash
# install_java的tasks文件内容
*******************************
---
- command: "{{ JAVA_HOME }}/bin/java -version"
  register: java_result
  ignore_errors: True

- debug: msg="success!"
  when: java_result|succeeded
*******************************

# 执行结果
ansible-playbook -i hosts main.yml -e '{"host":"long8_web01","role":"install_java"}'

PLAY [long8_web01] *************************************************************

TASK [setup] *******************************************************************
ok: [103.236.220.177]

TASK [install_java : command] **************************************************
changed: [103.236.220.177]

TASK [install_java : debug] ****************************************************
ok: [103.236.220.177] => {
    "msg": "success!"
}

PLAY RECAP *********************************************************************
103.236.220.177            : ok=3    changed=1    unreachable=0    failed=0   
# 成功根据java_result成功状态时输出了success

# 修改JAVA_HOME，故意使其失败，查看执行结果
# 修改变量
*******************************
---
JAVA_HOME: /usr/local/jdk/aaa
*******************************
# 再次执行
ansible-playbook -i hosts main.yml -e '{"host":"long8_web01","role":"install_java"}'

PLAY [long8_web01] *************************************************************

TASK [setup] *******************************************************************
ok: [103.236.220.177]

TASK [install_java : command] **************************************************
fatal: [103.236.220.177]: FAILED! => {"changed": false, "cmd": "/usr/local/jdk/aaa/bin/java -version", "failed": true, "msg": "[Errno 2] No such file or directory", "rc": 2}
...ignoring

TASK [install_java : debug] ****************************************************
skipping: [103.236.220.177]

PLAY RECAP *********************************************************************
103.236.220.177            : ok=2    changed=0    unreachable=0    failed=0   
# debug在检测到结果是失败的时候，跳过了success消息的输出
```

### 总结
我们可以使用register来获得检查信息，使用when判断failed或者success，然后进一步执行task
来达到我们控制task逻辑的目地

**线上使用例子**
``` bash
# role/install_java/tasks/main.yml文件内容
---
- command: "{{ JAVA_HOME }}/bin/java -version"
  register: java_result
  ignore_errors: True

- name: yum install essential packages, if not, copy module will not work
  yum: name={{ item }} state=absent
  with_items:
    - epel-release
    - libselinux-python
  when: java_result|failed

- name: copy jre
  copy: src=jre-6u45-linux-x64.bin dest=/usr/local/src mode=0544
  when: java_result|failed

- name: install jre
  shell: sh ./jre-6u45-linux-x64.bin
  args:
    chdir: /usr/local/src
  when: java_result|failed
```

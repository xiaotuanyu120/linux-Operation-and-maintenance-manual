PLAYBOOK: 基础
2016年4月15日
9:15
 
PLAYBOOK简单语法
## 包含多个plays，组成一个list
*****************************************
---
## 第一个play，是list中的第一段，指定了hosts、user和tasks
- hosts: webservers
  remote_user: root
 
  tasks:
  - name: ensure apache is at the latest version
    yum: name=httpd state=latest
  - name: write the apache config file
    template: src=/srv/httpd.j2 dest=/etc/httpd.conf
 
- hosts: databases
  remote_user: root
 
  tasks:
  - name: ensure postgresql is at the latest version
    yum: name=postgresql state=latest
  - name: ensure that postgresql is started
    service: name=postgresql state=running
 
## 开头固定格式"---"
## 有两个play，分别是list中的一二段，每段指定了hosts、user和tasks
## list格式："-"后面必须跟一个空格
## 一个play相当于list第一段，内容是一个dict，dict中还包含tasks对应的list
*****************************************
 
扩展知识
http://docs.ansible.com/ansible/playbooks_intro.html
 
例子：CONNECTION验证
# cat ping.yaml
********************************
---
- hosts: webserver
  remote_user: root
  tasks:
    - name: test connection
      ping:
********************************
 
## 执行结果
# ansible-playbook -i hosts ping.yaml
 
PLAY [webserver] ***************************************************************
 
TASK [setup] *******************************************************************
ok: [172.16.2.166]
 
TASK [test connection] *********************************************************
ok: [172.16.2.166]
 
PLAY RECAP *********************************************************************
172.16.2.166               : ok=2    changed=0    unreachable=0    failed=0

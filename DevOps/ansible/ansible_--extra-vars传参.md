ansible: --extra-vars传参
2016年9月30日
12:51
 
## ansible-playbook可以通过"--extra-vars/-e"传参
 
### 普通变量传递
**main.yml文件定义变量**
```
- hosts: "{{ host }}"
```
 
**命令行传参**
``` bash
ansible-playbook ... -e "hosts=web"
```
"- name"不可传参数，实测无效
 
### 使用with_items传递list变量，实现循环list内容
可以使用json数据传输
**main.yml文件定义变量**
```
- hosts: "{{ host }}"
 
tasks:
  - name: yum install
    yum: name={{ item }} state=latest
    with_items: "{{ yumpack }}"
```
module外的变量都需要双引号
 
**命令行传参**
``` bash
ansible-playbook ... --extra-vars '{"host":"all","yumpack":["vim","wget"]}'
```
 
### roles如何循环？
就像google讨论组上讲的，目前roles无法通过with_items的方式进行循环，但我们可以把循环传入到roles内部进行循环
[Google discuss](https://groups.google.com/forum/#!msg/ansible-project/B5547FiIhYA/-iJ7Zl7E5ccJ)
**yaml文件内容**
``` 
# main.yml文件内容
---
- hosts: "{{ host }}"
  remote_user: root
 
  roles:
    - {role: "tomcat", yumpack: "{{ yumpack }}"}
 
# role/tomcat/tasks/main.yml内容
---
 - name: yum test
   yum: name={{ item }} state=latest
   with_items: "{{ yumpack }}"
```
module中的变量不用加双引号，但是其他地方需要双引号，否则会报错
 
 
**命令行传参**
```
ansible-playbook ... main.yml -e "{'host':'all','yumpack':['vim','wget','nginx']}" -C
```

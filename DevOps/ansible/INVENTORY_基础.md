INVENTORY: 基础
2016年3月25日
15:57
 
INVENTORY
## ansible默认我们使用sshkey连接，所以要提前做好key
=============================================================================
默认INVENTORY文件
## 直接执行命令失败，是因为ansible去默认的hosts文件中无法找到node信息
# ansible all -m ping
 [WARNING]: Host file not found: /etc/ansible/hosts
 
 [WARNING]: provided hosts list is empty, only localhost is available
 
最基本的INVENTORY文件
## 自定义自己的host文件，后期可以用-i参数指定此文件
# vim hosts
*********************
[webserver]
172.16.2.166
*********************
## 执行效果
# ansible -i hosts webserver -m ping
172.16.2.166 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
 
指定SSH端口号的INVENTORY文件
##若node的ssh默认port不是22，假设是5536端口，可以使用下面格式
# vim hosts
*********************
[webserver]
172.16.2.166:5536
*********************
 
指定别名的INVENTORY文件
## 有时候我们需要方便的调用别名来指定IP主机
# vim hosts
*********************
[webserver]
test ansible_port=5536 ansible_host=172.16.2.166
*********************
## 执行效果
# ansible -i hosts test -a "/bin/echo hello"
test | SUCCESS | rc=0 >>
hello
 
批量添加host到INVENTORY文件
## host太多，批量添加
# vim hosts
*********************
[webserver]
172.16.2.16[5:6]
*********************
# ansible -i hosts all -a "/bin/echo hello"
172.16.2.165 | UNREACHABLE! => {
    "changed": false,
    "msg": "Failed to connect to the host via ssh.",
    "unreachable": true
}
172.16.2.166 | SUCCESS | rc=0 >>
hello
 
PS:还可以用字母区间
[webservers]
www[01:50].example.com
[databases]
db-[a:f].example.com
 
分组套分组的INVENTORY文件
## 大分组还需要继续分成小分组的情况，这样处理
*****************************
[web_group]
www01.example.com
www02.example.com
 
[db_group]
db01.example.com
db02.example.com
 
[asia:children]
web_group
db_group
*****************************
 
变量
## 变量是用在之后的playbooks中
## 可以设定主机变量、分组变量
*****************************
## 主机变量
[web_group]
www01.example.com http_port=80 maxRequestsPerChild=808
www02.example.com http_port=303 maxRequestsPerChild=909
 
## 分组变量
[db_group]
db01.example.com
db02.example.com
 
[db:vars]
ntp_server=ntp.example.com
proxy=proxy.example.com
 
## 另外形式的分组变量
[asia:children]
web_group
db_group
 
[asia:vars]
some_server=foo..example.com
halon_system_timeout=30
self_destruct_countdown=60
escape_pods=2
*****************************

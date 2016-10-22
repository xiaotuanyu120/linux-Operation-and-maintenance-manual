sudoer configure to support become function in ansible
2016年10月21日
21:39
 
---
title: sudoer configure to support become function in ansible
date: 2016-10-21 21:00:00
categories: devops
tags: [devops, ansible]
---
### why should use become
We don't use root directly in ansible in most cases. Instead, we prefer a common
user to execute some tasks in sudo mode. By doing so, we can keep the security.
 
### how we use become
Let's make an example, we try to manage tomcat init script by using ansible become
 
<!--more-->
 
**first create a common user and switch to it**
``` bash
# on ansible control node
[root@ansible-control ~]
useradd classmate
su - classmate
# on controled node
[root@test-host ~]
useradd classmate
```
 
**yaml file content**
``` bash
***************************
---
- hosts: test-host
  remote_user: classmate
  become: true
  become_user: root
  become_method: sudo
 
  tasks:
   - name: start tomcat1
     service: name=tomcat1 state=started
***************************
```
 
**ERROR**
but we met an error when run it directly(run below command by classmate user)
``` bash
ansible-playbook -i hosts main.yml
 
PLAY [long8_web] ***************************************************************
 
TASK [setup] *******************************************************************
fatal: [192.168.100.22]: FAILED! => {"changed": false, "failed": true, "module_stderr": "", "module_stdout": "sudo: a password is required\r\n", "msg": "MODULE FAILURE"}
 
NO MORE HOSTS LEFT *************************************************************
to retry, use: --limit @/home/classmate/ansible-test/main.retry
 
PLAY RECAP *********************************************************************
192.168.100.22            : ok=0    changed=0    unreachable=0    failed=1   
```
 
**DEBUG**
we try it one more time in debug mode to check detail
``` bash
ansible-playbook -i hosts main.yml -vvvv
No config file found; using defaults
Loaded callback default of type stdout, v2.0
 
PLAYBOOK: main.yml *************************************************************
1 plays in main.yml
 
PLAY [long8_web] ***************************************************************
 
TASK [setup] *******************************************************************
<192.168.100.22> ESTABLISH SSH CONNECTION FOR USER: classmate
<192.168.100.22> SSH: EXEC ssh -C -vvv -o ControlMaster=auto -o ControlPersist=60s -o KbdInteractiveAuthentication=no -o PreferredAuthentications=gssapi-with-mic,gssapi-keyex,hostbased,publickey -o PasswordAuthentication=no -o User=classmate -o ConnectTimeout=10 -o ControlPath=/home/classmate/.ansible/cp/ansible-ssh-%h-%p-%r 192.168.100.22 '/bin/sh -c '"'"'( umask 77 && mkdir -p "` echo $HOME/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511 `" && echo ansible-tmp-1477056354.81-98638790861511="` echo $HOME/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511 `" ) && sleep 0'"'"''
<192.168.100.22> PUT /tmp/tmpeK7ikg TO /home/classmate/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511/setup
<192.168.100.22> SSH: EXEC sftp -b - -C -vvv -o ControlMaster=auto -o ControlPersist=60s -o KbdInteractiveAuthentication=no -o PreferredAuthentications=gssapi-with-mic,gssapi-keyex,hostbased,publickey -o PasswordAuthentication=no -o User=classmate -o ConnectTimeout=10 -o ControlPath=/home/classmate/.ansible/cp/ansible-ssh-%h-%p-%r '[103.236.220.177]'
<192.168.100.22> ESTABLISH SSH CONNECTION FOR USER: classmate
<192.168.100.22> SSH: EXEC ssh -C -vvv -o ControlMaster=auto -o ControlPersist=60s -o KbdInteractiveAuthentication=no -o PreferredAuthentications=gssapi-with-mic,gssapi-keyex,hostbased,publickey -o PasswordAuthentication=no -o User=classmate -o ConnectTimeout=10 -o ControlPath=/home/classmate/.ansible/cp/ansible-ssh-%h-%p-%r 103.236.220.177 '/bin/sh -c '"'"'chmod u+x /home/classmate/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511/ /home/classmate/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511/setup && sleep 0'"'"''
<192.168.100.22> ESTABLISH SSH CONNECTION FOR USER: classmate
<192.168.100.22> SSH: EXEC ssh -C -vvv -o ControlMaster=auto -o ControlPersist=60s -o KbdInteractiveAuthentication=no -o PreferredAuthentications=gssapi-with-mic,gssapi-keyex,hostbased,publickey -o PasswordAuthentication=no -o User=classmate -o ConnectTimeout=10 -o ControlPath=/home/classmate/.ansible/cp/ansible-ssh-%h-%p-%r -tt 192.168.100.22 '/bin/sh -c '"'"'sudo -H -S -n -u root /bin/sh -c '"'"'"'"'"'"'"'"'echo BECOME-SUCCESS-kzyiyadwuhlluevxdczpkcspfgwzyuhz; LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 LC_MESSAGES=en_US.UTF-8 /usr/bin/python /home/classmate/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511/setup; rm -rf "/home/classmate/.ansible/tmp/ansible-tmp-1477056354.81-98638790861511/" > /dev/null 2>&1'"'"'"'"'"'"'"'"' && sleep 0'"'"''
fatal: [192.168.100.22]: FAILED! => {"changed": false, "failed": true, "invocation": {"module_name": "setup"}, "module_stderr": "OpenSSH_5.3p1, OpenSSL 1.0.1e-fips 11 Feb 2013\ndebug1: Reading configuration data /etc/ssh/ssh_config\r\ndebug1: Applying options for *\r\ndebug1: auto-mux: Trying existing master\r\ndebug2: fd 3 setting O_NONBLOCK\r\ndebug2: mux_client_hello_exchange: master version 4\r\ndebug3: mux_client_request_forwards: requesting forwardings: 0 local, 0 remote\r\ndebug3: mux_client_request_session: entering\r\ndebug3: mux_client_request_alive: entering\r\ndebug3: mux_client_request_alive: done pid = 16619\r\ndebug3: mux_client_request_session: session request sent\r\ndebug1: mux_client_request_session: master session id: 2\r\ndebug1: mux_client_request_session: master session id: 2\r\ndebug3: mux_client_read_packet: read header failed: Broken pipe\r\ndebug2: Received exit status from master 1\r\nShared connection to 192.168.100.22 closed.\r\n", "module_stdout": "sudo: a password is required\r\n", "msg": "MODULE FAILURE"}
 
NO MORE HOSTS LEFT *************************************************************
to retry, use: --limit @/home/classmate/ansible-test/main.retry
 
PLAY RECAP *********************************************************************
192.168.100.22            : ok=0    changed=0    unreachable=0    failed=1   
# we can see it that ansible have tried to run "service, sh, python" command
# so we can fix it by grant permission of these command to classmate
```
 
**SOLVE METHOD**
configure sudoer on test-host to solve it
``` bash
# on test-host node
[root@test-host ~]
visudo
***************************
# add the content below to grant service command permission to classmate
# and we don't want to input password when running ansible tasks, so we set "NOPASSWD"
classmate ALL=(root) NOPASSWD: /sbin/service,/bin/sh,/usr/bin/python
***************************
 
# try run ansible again
ansible-playbook -i hosts main.yml
 
PLAY [long8_web] ***************************************************************
 
TASK [setup] *******************************************************************
ok: [192.168.100.22]
 
TASK [restart tomcat] **********************************************************
changed: [192.168.100.22]
 
PLAY RECAP *********************************************************************
192.168.100.22            : ok=2    changed=1    unreachable=0    failed=0
 
# check tomcat status on test-host
[root@test-host ~]
ps aux |grep java |grep tomcat1
root      9650  0.2  0.6 6386456 102912 ?      Sl   20:59   0:04 /usr/local/jdk/bin/java -Djava.util.logging.config.file=/home/tomcat1/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -XX:PermSize=128m -XX:MaxPermSize=512m -Djava.endorsed.dirs=/home/tomcat1/endorsed -classpath /home/tomcat1/bin/bootstrap.jar -Dcatalina.base=/home/tomcat1 -Dcatalina.home=/home/tomcat1 -Djava.io.tmpdir=/home/tomcat1/temp org.apache.catalina.startup.Bootstrap start
```
 
[become detail link](http://docs.ansible.com/ansible/become.html)
[sudoer configure detail link](https://wiki.archlinux.org/index.php/sudo)

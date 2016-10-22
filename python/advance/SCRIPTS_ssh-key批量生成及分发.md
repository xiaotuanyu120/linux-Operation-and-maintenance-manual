SCRIPTS: ssh-key批量生成及分发
2016年3月24日
16:30
 
## 脚本结构
keygen_ssh.py : pexpect(用来生成key和分发key)
main.py: fabric(主程序，维护host列表、提供对外程序接口及调用keygen_ssh.py)
 ## keygen_ssh.py
**************************************************************
import pexpect
import sys
import os
import datetime
 
def key_gen(host):
    key_file = '/root/.ssh/'+''.join(str(host).strip())
    if os.path.isfile(key_file):
        os.system("mv %s %s.old" % (key_file, key_file))
        os.system("mv %s.pub %s.pub.old" % (key_file, key_file))
    child = pexpect.spawn('ssh-keygen -b 1024 -t rsa')
    fout = file('key_gen.log', 'w')
    child.logfile = fout
 
    child.expect('save the key')
    child.sendline(key_file)
 
    child.expect('passphrase')
    child.sendline('')
    child.expect('passphrase')
    child.sendline('')
 
    child.expect(pexpect.EOF)
 
def key_copy(host, password):
    child = pexpect.spawn('ssh-copy-id -i /root/.ssh/%s.pub root@%s' % (host,
    host))
 
    index = child.expect(['yes/no', 'password'])
    if index == 0:
        child.sendline('yes')
    elif index == 1:
        child.sendline(password)
    child.expect(pexpect.EOF)
**************************************************************
 ## main.py
**************************************************************
from fabric.api import local
from fabric.api import env
from fabric.api import runs_once
 
from keygen_ssh import key_gen as _key_gen
from keygen_ssh import key_copy as _key_copy
 
hosts = {
        '172.16.2.3': 'Sudoroot88',
}
 
env.hosts = [x for x in hosts]
 
env.passwords = {'root@'+x+':22': hosts[x] for x in hosts}
 
@runs_once
def ssh_key_gen():
    for host in hosts:
        _key_gen(host)
 
@runs_once
def ssh_key_copy():
    for host in hosts:
        _key_copy(host, hosts[host])
**************************************************************
 
yum install gcc libffi-devel python-devel openssl-devel
pip install cryptography
pip install fabric
pip install pexpect

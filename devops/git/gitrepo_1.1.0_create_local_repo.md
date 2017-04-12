---
title: git仓库: 1.1.0 centos6搭建git本地服务器
date: 2016-08-25 09:25:00
categories: devops/git
tags: [devops,git]
---
### git仓库: 1.1.0 centos6搭建git本地服务器

---

### 0. 创建本地git服务器之前
- 远程仓库通常只是一个裸仓库（bare repository)  
即一个没有当前工作目录的仓库。因为该仓库只是一个合作媒介，所以不需要从硬盘上取出最新版本的快照；  
仓库里存放的仅仅是 Git 的数据。简单地说，裸仓库就是你工作目录中 .git 子目录内的内容。
- git客户端与服务器之间的互通可以通过4种协议：  
本地、http、ssh和git，最常使用且最易管理的协议以及默认的协议就是ssh

### 1. 准备git服务器
假设我们搭建的是centos 6.5服务器
``` bash
# 安装git
yum install git

# 增加git用户
useradd git
passwd git

# 目录初始化
mkdir -p /data/git/test.git
cd /data/git/test.git
git --bare init
# --bare参数会将原本初始化在".git"目录下的文件初始化在当前目录下，形成裸仓库，这样的目的是禁止用户在此目录下进行git常规操作，以确保此目录只是作为git服务端仓库使用。
chown -R git:git /data/git

# 安全配置
# 将git用户的shell更改为git-shell，这样用户就只可以通过ssh来进行git操作，而不能进行其他操作了
vi /etc/passwd
*************************
git:x:501:503::/home/git:/usr/bin/git-shell
*************************
# 配置之后，其他客户端尝试ssh时会有以下提示
ssh git@192.168.1.105
Last login: Sat Jun  4 09:06:15 2016 from 192.168.1.249
fatal: What do you think I am? A shell?
Connection to 192.168.1.105 closed.
```

---

### 2. 项目主管角色(mac)
我们假设项目主管使用的是mac客户端
```
# 若ssh密钥不存在时，创建密钥
ssh-keygen

# 拷贝公钥信息到git服务器上去
cat .ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQDDCtzFiZ3rhRFZLwl0z3Cy1GOWzuxkzJ5aKQFmkIVZ/HA+RC+tfgfFItOAmQDtJrBc8TXN************XGto+XxMGWdqnibcO9/7a7uhy4kh3bFyDFSwS228OlcxIuul1zNvBFPnOQqI7Mh0nZBdA2cYENOalPOw== zack@Zack-MBP.local
# 公钥信息为一行，可将此信息拷贝到git服务器"/home/git/.ssh/authorized_keys"中，每个用户的公钥占用一行
scp .ssh/id_rsa.pub root@192.168.1.105:/tmp/id_rsa.supervisor.pub

# git服务器上的操作
=====================================================
cd /home/git
mkdir .ssh
touch .ssh/authorized_keys
chown -R git:git .ssh
chmod 700 .ssh
chmod 600 .ssh/authorized_keys
cat /tmp/id_rsa.supervisor.pub >> .ssh/authorized_keys
=====================================================

# 初始化git项目
mkdir myproject
cd myproject
git init
touch README.md
echo "test project" >> README.md
git add README.md
git commit -m 'initial commit'
git remote add origin git@192.168.1.105:/data/git/test.git
git push origin master
```

---

### 3. 普通开发人员角色(win)
普通开发人员在等待主管将项目初始化之后，就可以clone项目并编辑自己的分支了，假设其用的是windows系统
1. 下载git for windows客户端
2. 打开git bash客户端
3. 执行下面命令
``` bash
ssh-keygen.exe
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/zack.IG/.ssh/id_rsa):
Created directory '/c/Users/zack.IG/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /c/Users/zack.IG/.ssh/id_rsa.
Your public key has been saved in /c/Users/zack.IG/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:JN/yNAhk4307bT/SH8HfnnlLcTjUjdmxODH3ts7NqN0 zack@zack
The key\'s randomart image is:
+---[RSA 2048]----+
|      +      o o |
|     + o      ===|
|      + o .  o+.*|
|       = + o .oo.|
|        S * o o=.|
|         + + oo+B|
|          . . ===|
|             +.==|
|            . .+E|
+----[SHA256]-----+
```
4. 将id_rsa.pub的内容也拷贝到git服务器的authorized_keys文件中（另起一行）
5. 打开git bash客户端
``` bash
git clone git@192.168.1.105：/data/git/test.git
Cloning into 'test'...
The authenticity of host '192.168.1.105 (192.168.1.105)' can't be established.
RSA key fingerprint is SHA256:ISP93qigltNRT1V8ntMTEf9AVWz0lzX6KxjZJd7SAUY.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.1.105' (RSA) to the list of known hosts.
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (3/3), done.
Checking connectivity... done.
```

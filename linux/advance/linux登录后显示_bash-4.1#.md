---
title: linux登录后显示_bash-4.1#
date: 2014年12月5日
categories: 下午 5:25
---
 
出现这种现象的原因是root目录下 .bash_profile   .bashrc
 
两个环境文件丢失。
 
解决方法：
 
重新建立这两个文件
 
 
 # vi /root .bash_profile
 
*** /root: directory ***
 
::::::::::::::
.bash_profile
::::::::::::::
# .bash_profile
 
# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi
 
# User specific environment and startup programs
 
PATH=$PATH:$HOME/bin
 
export PATH
unset USERNAME
 
 
 
 # vi /root .bashrc
 
*** /root: directory ***
 
::::::::::::::
.bashrc
::::::::::::::
# .bashrc
 
# User specific aliases and functions
 
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
 
# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi

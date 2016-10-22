PLAYBOOK: yum模块
2016年4月13日
19:46
 
YUM常用参数
## 包名称
name：
package_name
package_name-1.0
*
 
## 期望的状态
state：
# 安装
present
installed    # 同present
latest
# 卸载
absent
removed    # 同absent
 
## 指定从哪个repo安装，多个repo用","隔开
enablerepo：
repo1,repo2
 
## 是否进行gpg检查
disable_gpg_check：
yes
no
 
PLAYBOOK YUM MODULE EXAMPLE
## YUM安装最新的apache
********************************
- name: install the latest version of Apache
  yum: name=httpd state=latest
********************************
 
## YUM指定repo安装apache
********************************
- name: install the latest version of Apache from the testing repo
  yum: name=httpd enablerepo=testing state=present
********************************
 
## YUM安装指定版本的apache
********************************
- name: install one specific version of Apache
  yum: name=httpd-2.2.29-1.4.amzn1 state=present
********************************
 
## YUM更新所有包到最新
********************************
- name: upgrade all packages
  yum: name=* state=latest
********************************
 
## YUM从远程和本地rpm安装nginx
********************************
- name: install the nginx rpm from a remote repo
  yum: name=http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm state=present
 
- name: install nginx rpm from a local file
  yum: name=/usr/local/src/nginx-release-centos-6-0.el6.ngx.noarch.rpm state=present
********************************
 
## YUM安装base&"Development tools"等package group
********************************
---
- hosts: webserver
  remote_user: root
  tasks:
    - name: install the 'Development tools' package group
      yum: name="@Development tools" state=present
 
    - name: install the base package group
      yum: name="@base" state=present
********************************

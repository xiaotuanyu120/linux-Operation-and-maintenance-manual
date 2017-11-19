---
title: 1.1.1 二进制文件安装(Centos7)
date: 2017-07-28 16:45:00
categories: virtualization/docker
tags: [docker]
---
### 1.1.1 二进制文件安装(Centos7)

---

### 0. 准备
[docker官方二进制文件安装文档](https://docs.docker.com/engine/installation/linux/docker-ce/binaries/)
#### 1) 使用二进制文件安装docker之前，确认满足以下系统环境
- 系统是64位（这里使用的是centos7）, `uname -i`
- Linux kernel版本是 3.10 或更高, `uname -r`
- iptables版本是 1.4 或更高, `iptables --version`
- git版本是 1.7 或更高, `git --version`
- 可执行的ps命令, `rpm -qa |grep procps; which ps`
- XZ Utils版本是 4.9 或更高, `xz --version`
- 挂载合适的cgroupfs 分层, `yum install -y libcgroup libcgroup-tools;systemctl enable cgconfig;systemctl start cgconfig`

#### 2) 增强安全
为了增强安全性，系统需要开启selinux，开启selinux后，docker会自动在创建容器时配置selinux的context，也就是说，我们只要开启selinux就好，其他的docker来做了。  
> [redhat 关于这docker和selinux的详细解释](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux_atomic_host/7/html/overview_of_containers_in_red_hat_systems/introduction_to_linux_containers#secure_containers_with_selinux)

> 关于安全计算模式（seccomp）,参见[docker关于seccomp的详细介绍](https://docs.docker.com/engine/security/seccomp/)，通过seccomp可以禁用某些系统调用，来增强docker的安全性。

---

### 1. 安装docker静态二进制文件
``` bash
# step 1 下载docker二进制文件
wget https://download.docker.com/linux/static/stable/x86_64/docker-17.06.0-ce.tgz

# step 2 解压
tar zxvf docker-17.06.0-ce.tgz

# step 3 拷贝二进制文件到PATH变量的路径中
cp docker/* /usr/bin/
```

---

### 2. 启动dockerd（systemd）
``` bash
cat > /usr/lib/systemd/system/docker.service << EOF
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target docker.socket firewalld.service
Wants=network-online.target
Requires=docker.socket

[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
ExecStart=/usr/bin/dockerd -H fd://
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=1048576
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNPROC=infinity
LimitCORE=infinity
# Uncomment TasksMax if your systemd version supports it.
# Only systemd 226 and above support this version.
#TasksMax=infinity
TimeoutStartSec=0
# set delegate yes so that systemd does not reset the cgroups of docker containers
Delegate=yes
# kill only the docker process, not all processes in the cgroup
KillMode=process
# restart the docker process if it exits prematurely
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s

[Install]
WantedBy=multi-user.target
EOF

cat > /usr/lib/systemd/system/docker.socket << EOF
[Unit]
Description=Docker Socket for the API
PartOf=docker.service

[Socket]
ListenStream=/var/run/docker.sock
SocketMode=0660
SocketUser=root
SocketGroup=docker

[Install]
WantedBy=sockets.target
EOF

# 按照docker.socket中指定的增加docker组
groupadd docker

# 增加root用户对新建文件的selinux权限
chcon -u system_u /usr/lib/systemd/system/docker.servcie
restorecon -vF /usr/lib/systemd/system/docker.servcie
ll /usr/lib/systemd/system/docker.servcie -Z
-rw-r--r--. root root system_u:object_r:systemd_unit_file_t:s0 /usr/lib/systemd/system/docker.servcie

# 启动docker
systemctl daemon-reload
systemctl enable docker
systemctl start docker
```
> docker的systemd unit文件参照[docker项目源码中的systemd文件示例](https://github.com/moby/moby/tree/master/contrib/init/systemd)

> docker unit文件中"dockerd -H fd://"的"fd://"是linux中的文件描述符的缩写，-H是指定一种socket类型，可使用unix，tcp和fd，详细可参阅[docker文档中对于socket选项这部分的说明](https://docs.docker.com/engine/reference/commandline/dockerd//#daemon-socket-option)

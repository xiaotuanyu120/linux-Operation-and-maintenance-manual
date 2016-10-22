DOCKER:安装
2015年12月12日 星期六
16:06
 
YUM安装
## 系统版本
# uname -r
3.10.0-229.el7.x86_64
# cat /etc/centos-release
CentOS Linux release 7.1.1503 (Core)
## Docker requires a 64-bit installation regardless of your CentOS version. Also, your kernel must be 3.10 at minimum, which CentOS 7 runs.
## 官方要求内核最低3.1，系统要求64位
 
## 创建docker的yum源
# vim docker.repo
********************************
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
********************************
 
## 安装docker
# yum install docker-engine -y
 
## 启动docker服务
# systemctl enable docker
# systemctl start docker
 
## 查看docker版本
# docker version
Client:
 Version:      1.9.1
 API version:  1.21
 Go version:   go1.4.2
 Git commit:   a34a1d5
 Built:        Fri Nov 20 13:25:01 UTC 2015
 OS/Arch:      linux/amd64
 
Server:
 Version:      1.9.1
 API version:  1.21
 Go version:   go1.4.2
 Git commit:   a34a1d5
 Built:        Fri Nov 20 13:25:01 UTC 2015
 OS/Arch:      linux/amd64

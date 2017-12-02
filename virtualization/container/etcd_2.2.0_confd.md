---
title: etcd 2.2.0 搭配confd做配置管理
date: 2017-03-29 14:00:00
categories: virtualization/container
tags: [container,coreos,etcd,confd]
---
### etcd 2.2.0 搭配confd做配置管理

---

### 0. 环境
[confd安装官方文档](https://github.com/kelseyhightower/confd/blob/master/docs/installation.md)  
[confd quick-start-guide](https://github.com/kelseyhightower/confd/blob/master/docs/quick-start-guide.md)  

---

### 1. 安装etcd
etcd的安装参照[centos6安装etcd集群](http://linux.xiao5tech.com/virtualization/container)

此处我们使用centos+etcd来提供etcd配置中心服务，然后使用centos+confd来作为客户端，另外etcd上采取ssl认证

---

### 2. 安装confd
#### 1) 安装confd
``` bash
wget https://github.com/kelseyhightower/confd/releases/download/v0.12.0/confd-0.12.0-linux-amd64
mv confd-0.12.0-linux-amd64 /usr/local/bin/confd
export PATH=$PATH:/usr/local/bin
```

#### 3) 创建confd配置模板
``` bash
mkdir -p /etc/confd/{conf.d,templates}

vim /etc/confd/conf.d/myapp-nginx.toml
*************************************
[template]
prefix = "/myapp"
src = "nginx.conf.tmpl"
dest = "/tmp/myapp.conf"
owner = "nginx"
mode = "0644"
keys = [
  "/subdomain",
  "/upstream",
]
check_cmd = "/usr/sbin/nginx -t -c \{\{.src}}"
reload_cmd = "/usr/sbin/service nginx reload"
*************************************

vim /etc/confd/templates/nginx.conf.tmpl
*************************************
upstream \{\{getv "/subdomain"}} {
\{\{range getvs "/upstream/*"}}
    server \{\{.}};
\{\{end}}
}

server {
    server_name  \{\{getv "/subdomain"}}.example.com;
    location / {
        proxy_pass        http://\{\{getv "/subdomain"}};
        proxy_redirect    off;
        proxy_set_header  Host             $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
   }
}
*************************************
```
> 转义符是因为flask使用的jinja模板问题，必须要转义，实际不需要转义符，实际环境中记得一定要去掉两个转义符

#### 4) etcd上设置key
``` bash
./etcdctl --ca-file ./ca.pem --cert-file ./client.pem --key-file ./client-key.pem --endpoint https://69.172.86.20:2379 set /myapp/subdomain myapp
./etcdctl --ca-file ./ca.pem --cert-file ./client.pem --key-file ./client-key.pem --endpoint https://69.172.86.20:2379 set /myapp/upstream/app1 192.168.0.1:80
./etcdctl --ca-file ./ca.pem --cert-file ./client.pem --key-file ./client-key.pem --endpoint https://69.172.86.20:2379 set /myapp/upstream/app2 192.168.0.2:80
```
> 这里特别需要注意的是，目前官方分支的confd不支持etcd api v3，所以我们需要使用v2的api来储存值，否则confd目前(<=0.12.0)是无法使用的。

> 如果不采用认证的话，不需要指定各种认证文件

#### 5) 手动执行confd生成配置文件
confd有两种生成配置文件的方式，一种是使用daemon，一种是手动一次性获取，这里为了演示我们使用手动一次性获取方式
``` bash
confd -onetime -backend etcd -client-ca-keys ./ca.pem -client-cert ./client.pem -client-key ./client-key.pem -node https://69.172.86.20:2379
cat /tmp/myapp.conf
upstream myapp {

    server 192.168.0.1:80;

    server 192.168.0.2:80;

}

server {
    server_name  myapp.example.com;
    location / {
        proxy_pass        http://myapp;
        proxy_redirect    off;
        proxy_set_header  Host             $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
   }
}

```
> 如果etcd没配置认证的话，可以去掉所有认证文件选项，另外-backend默认是etcd，也可以省略。

> 想要持续后台运行，可执行 `confd -interval 10` 取代`confd -onetime`

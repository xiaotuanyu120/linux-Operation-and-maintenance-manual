---
title: keepalive 1.1.0 nginx高可用
date: 2017-03-02 15:55:00
categories: linux/service
tags: [linux,keepalived,nginx]
---
### keepalive 1.1.0 nginx高可用

---

### 0. 环境
- OS: centos6.7
- keepalived: 1.3.4
- nginx: 1.10.2

主机|角色|ip
---|---|---
nignx01|master|192.168.33.81
nginx02|slave|192.168.33.82
|vip|192.168.33.80

[keepalived中文文档](http://www.keepalived.org/pdf/sery-lvs-cluster.pdf)  
[keepalived中文博客](http://seanlook.com/2015/05/18/nginx-keepalived-ha/)  
[keepalivedHOWTO,关于authentication](http://www.keepalived.org/LVS-NAT-Keepalived-HOWTO.html)  
[使用单播还是组播](http://www.rendoumi.com/keepalivedde-dan-bo-unicastyu-duo-bo-multicast/)  

---

### 1. keepalived安装
``` bash
yum install -y openssl-devel
yum install -y keepalived
```

---

### 2. 配置keepalived
`vim /etc/keepalived/keepalived.conf`
```
global_defs {
    lvs_id web_router
}

vrrp_script chk_nginx_service {
    script   "/etc/keepalived/nginx-ha-check"
    interval 3
    weight   -5
    fall     2
    rise     1
}

vrrp_instance VI_1 {
    state MASTER
    interface         eth0
    priority          101
    virtual_router_id 51
    advert_int        1
    unicast_src_ip    192.168.33.81

    unicast_peer {
        192.168.33.82
    }

    authentication {
        auth_type PASS
        auth_pass 1111
    }

    virtual_ipaddress {
        192.168.33.80
    }

    track_script {
        chk_nginx_service
    }
}
```
> 配置简介:
- global_defs, 全局配置，可配置邮件通知和lvs_id
  - lvs_id, lvs负载均衡标识id，在一个网络内，应该是唯一的。
- vrrp_script，可有多个脚本块配置
  - script, 检测脚本，也可以是一条命令
  - interval, 检测时间间隔
  - weight, weight大于0时，若脚本返回结果为0，则增加priority；weight小于0时，若脚本返回结果非0，则减小priority。priority的范围为1-255
  - fall 2, 连续失败2次才算失败
  - rise 1, 成功一次就算成功
- vrrp_instance, 创建vrrp实例
  - state, 指定初始状态，主还是从，角色转换根据priority来定
  - interface, 网卡
  - priority, 优先级，用来确定角色
  - virtual_router_id, 相同的VRID为一个组，它将决定多播的MAC地址
  - advert_int, 检查间隔，默认为1秒。这就是VRRP的定时器，MASTER每隔这样一个时间间隔，就会发送一个advertisement报文以通知组内其他路由器自己工作正常
  - unicast_src_ip, 单播源ip
  - unicast_peer, 单播对端ip，可配置多个
  - authentication, 安全认证
    - auth_type PASS, 使用密码方式认证
    - auth_pass, 指定密码
  - virtual_ipaddress, 指定vip
  - track_script, 指定检查脚本，可配置多个

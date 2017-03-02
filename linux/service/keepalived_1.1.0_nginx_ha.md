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
nginx02|backup|192.168.33.82
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
MASTER上配置
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

BACKUP上配置
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
    state BACKUP
    interface         eth0
    priority          100
    virtual_router_id 51
    advert_int        1
    unicast_src_ip    192.168.33.82

    unicast_peer {
        192.168.33.81
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

---

### 3. 准备nginx check脚本
``` bash
vim /etc/keepalived/nginx-ha-check
****************************************************
#!/bin/bash
counter=$(ps -C nginx --no-heading|wc -l)
if [ "${counter}" = "0" ]; then
    /usr/local/nginx/sbin/nginx
    sleep 2
    counter=$(ps -C nginx --no-heading|wc -l)
    if [ "${counter}" = "0" ]; then
        /etc/init.d/keepalived stop
    fi
fi
****************************************************

chmod 755 /etc/keepalived/nginx-ha-check
```

---

### 4. 检查网卡状态
``` bash
# 1. 在master上查看网卡信息
ip a show dev eth1
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 08:00:27:cc:25:79 brd ff:ff:ff:ff:ff:ff
    inet 192.168.33.31/24 brd 192.168.33.255 scope global eth1
    inet 192.168.33.30/32 scope global eth1
    inet6 fe80::a00:27ff:fecc:2579/64 scope link
       valid_lft forever preferred_lft forever

# 2. 手动停止nginx
service nginxd stop

# 3. 查看日志，看到backup上自动提升角色为master
# master上
Mar  2 14:18:31 node1 Keepalived[5977]: Stopping Keepalived v1.2.13 (03/19,2015)
Mar  2 14:18:31 node1 Keepalived_vrrp[5980]: VRRP_Instance(VI_1) sending 0 priority
Mar  2 14:18:31 node1 Keepalived_vrrp[5980]: VRRP_Instance(VI_1) removing protocol VIPs.
Mar  2 14:18:31 node1 Keepalived_healthcheckers[5979]: Netlink reflector reports IP 192.168.33.30 removed
# backup上
Mar  2 14:18:32 node2 Keepalived_vrrp[5979]: VRRP_Instance(VI_1) Transition to MASTER STATE
Mar  2 14:18:33 node2 Keepalived_vrrp[5979]: VRRP_Instance(VI_1) Entering MASTER STATE
Mar  2 14:18:33 node2 Keepalived_vrrp[5979]: VRRP_Instance(VI_1) setting protocol VIPs.
Mar  2 14:18:33 node2 Keepalived_vrrp[5979]: VRRP_Instance(VI_1) Sending gratuitous ARPs on eth1 for 192.168.33.30
Mar  2 14:18:33 node2 Keepalived_healthcheckers[5978]: Netlink reflector reports IP 192.168.33.30 added
# 需要重新开启master节点时，需要先保证nginx服务启动，然后再启动keepalived服务
```

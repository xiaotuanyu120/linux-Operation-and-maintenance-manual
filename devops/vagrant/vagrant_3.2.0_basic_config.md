---
title: vagrant: 3.2.0 基本配置
date: 2016-09-30 15:40:00
categories: devops/vagrant
tags: [devops,vagrant]
---
### vagrant: 3.2.0 基本配置

---

### 1. 基本配置

#### 1) hostname配置
``` ruby
config.vm.hostname = "hostname"
```

#### 2) 网络配置
``` ruby
config.vm.network "private_network", ip: "11.11.11.11"
config.vm.network "public_network", ip: "192.168.0.11"

# 不需要自动配置
config.vm.network "private_network", ip: "11.11.11.11", auto_config: false

# 自动配置宿主机的dns到虚拟机的配置
config.vm.provider :virtualbox do |vb|
  vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
end
```

#### 3) 内存、CPU、视频显示配置
``` ruby
config.vm.provider "virtualbox" do |vb|
  # Display the VirtualBox GUI when booting the machine
  vb.gui = true

  vb.memory = 2048
  vb.cpus = 2
end
```
> 此配置在多主机配置中，可以作为主机配置的子配置项
``` ruby
config.vm.define "clouderaN2" do |clouderaN2|
  clouderaN2.vm.hostname = "cloudera-n2"
  clouderaN2.vm.network "private_network", ip: "192.168.33.62"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end
end
```

#### 4) 同步目录
``` ruby
# 默认把host机器的Vagrantfile所在目录和虚机的/vagrant自动同步
config.vm.synced_folder "d:/local/dir", "/vm/dir/"
```

---
title: vagrant: 3.3.0 在一个目录中创建多主机
date: 2016-10-25 19:38:00
categories: devops/vagrant
tags: [vagrant]
---
### vagrant: 3.3.0 在一个目录中创建多主机

---

### 1. Why we need multiple VMs?
The problem of IT in today that we have to faced is more and more access pressure,
for solving this, cluster is the best way. So that's why we need multiple vms,
as metioned above, sometimes we need a web cluster to test.

---

### 2. How to get multiple vms in vagrant?
**configure like this in Vagrantfile**
``` ruby
Vagrant.configure("2") do |config|
  config.vm.box = "d:\IMAGE-ISO\mycentos6.8.box"
  config.vm.define "node01" do |node01|
    node01.vm.hostname = "node01"
    node01.vm.network "private_network", ip: "192.168.33.101"
  end

  config.vm.define "node02" do |node02|
    node02.vm.hostname = "node02"
    node02.vm.network "private_network", ip: "192.168.33.102"
  end
end
```

---

### 3. How to manage multiple vms?
``` bash
# get all vms up
vagrant up

# only get one vm up
vagrant up hostname

# how to ssh vms
vagrant ssh hostname
```

---

### 4. 如何给多虚拟机中的某一个特定指定内存cpu等硬件信息
``` ruby
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "centos/7"

  config.vm.define "node02" do |node02|
    node02.vm.hostname = "node02"
  	node02.vm.network "private_network", ip: "192.168.33.62"
  end

  config.vm.define "node03" do |node03|
    node03.vm.hostname = "node03"
  	node03.vm.network "private_network", ip: "192.168.33.63"
	  config.vm.provider "virtualbox" do |vb|
  		# Display the VirtualBox GUI when booting the machine
  		# vb.gui = true

  		# Customize the amount of memory on the VM:
  		vb.memory = "2048"
	  end
  end

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true

    # Customize the amount of memory on the VM:
    vb.memory = "1024"
  end
end
```
> 可以直接在vm里面增加子级配置

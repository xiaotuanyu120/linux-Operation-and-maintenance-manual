---
title: how to create multiple VMs in vagrant
date: 2016-10-25 19:38:00
categories: devops/vagrant
---
## Why we need multiple VMs?
The problem of IT in today that we have to faced is more and more access pressure,
for solving this, cluster is the best way. So that's why we need multiple vms,
as metioned above, sometimes we need a web cluster to test.

### How to get multiple vms in vagrant?
**configure like this in Vagrantfile**
```
Vagrant.configure("2") do |config|
  config.vm.box = "d:\IMAGE-ISO\mycentos6.8.box"
  config.vm.define "node01" do |node01|
    node01.vm.hostname = "node01"
	node01.vm.network "private_network", ip: "192.168.33.101"
  end

  config.vm.define "node02" do |node02|
    node02.vm.hostname = "node02"
	node01.vm.network "private_network", ip: "192.168.33.102"
  end
end
```

### How to manage multiple vms?
``` bash
# get all vms up
vagrant up

# only get one vm up
vagrant up hostname

# how to ssh vms
vagrant ssh hostname
```

KVM: 脚本复制VM+启动错误
2016年4月5日
14:54
 
VM复制-原理
=====================================================
1、拷贝img和xml文件
# cp /etc/libvirt/qemu/controller.xml /etc/libvirt/qemu/compute-node01.xml
# cp /data/kvm/images/controller.img /data/kvm/images/compute-node01.img
 
2、编辑xml文件
# vim compute-node01.xml
**************************************************************************
## 修改名称
<name>compute-node01</name>
 
## 修改UUID
  <uuid>3a356102-a046-4cdc-adf2-86a738abf75b</uuid>
 
## 修改img路径
<source file='/data/kvm/images/compute-node01.img'/>
 
## 修改外网网卡mac
<mac address='fa:95:89:fd:ce:a9'/>
 
## 修改内网网卡mac
<mac address='52:54:3e:65:38:8a'/>
 
## 修改vnc端口
<graphics type='vnc' port='5997' autoport='no' listen='0.0.0.0'>
*************************************************************************
 
3、定义并启动虚机
# virsh define compute-node01.xml
# virsh start compute-node01
 
VM复制-脚本
=================================================
## 基础语句（基于自己设计的模板，见后面）
## VM NAME修改语句
# NAME=controller01
# sed -i "s#%NAME%#$NAME#g" controller01.xml
 
## UUID修改语句
# UUID=`uuidgen`
# sed -i "s#%UUID%#$UUID#g" controller01.xml
 
## 修改img文件语句
# IMAGE_PATH=/data/kvm/images/controller01.img  
# sed -i "s#%IMAGE_PATH%#$IMAGE_PATH#g" controller01.xml
 
## 生成mac地址
# MAC=fa:95:$(dd if=/dev/urandom count=1 2>/dev/null |md5sum|sed 's/^\(..\)\(..\)\(..\)\(..\).*$/\1:\2:\3:\4/')
# MAC2=52:54:$(dd if=/dev/urandom count=1 2>/dev/null |md5sum|sed 's/^\(..\)\(..\)\(..\)\(..\).*$/\1:\2:\3:\4/')
# sed -i "s#%MAC%#$MAC#g" controller01.xml
# sed -i "s#%MAC2%#$MAC2#g" controller01.xml
## 内部局域网的MAC地址多以52:54开头
## 外部网络桥接的MAC地址多以fa:95开头
 
## 修改vnc端口
# VNC_PORT=5998
# sed -i "s#%VNC_PORT%#$VNC_PORT#g" controller01.xml
 
VM复制-脚本
=======================================================
1、脚本所在路径包含磁盘镜像centos6-template.img
2、脚本所在路径包含配置模版template.xml
*****************************************************
#!/bin/bash
 
IMAGE_BASE_PATH=/data/kvm/images
 
VMNAME=$1
VNC_PORT=$2
 
 
UUID=`uuidgen`
IMAGE_PATH=${IMAGE_BASE_PATH}/${VMNAME}.img
MAC=fa:95:$(dd if=/dev/urandom count=1 2>/dev/null |md5sum|sed 's/^\(..\)\(..\)\(..\)\(..\).*$/\1:\2:\3:\4/')
MAC2=52:54:$(dd if=/dev/urandom count=1 2>/dev/null |md5sum|sed 's/^\(..\)\(..\)\(..\)\(..\).*$/\1:\2:\3:\4/')
 
cp -f ./template.xml ${VMNAME}.xml
cp -f ./centos6-template.img ${IMAGE_PATH}
 
sed -i "s#%NAME%#$VMNAME#g" ${VMNAME}.xml
sed -i "s#%UUID%#$UUID#g" ${VMNAME}.xml
sed -i "s#%IMAGE_PATH%#$IMAGE_PATH#g" ${VMNAME}.xml
sed -i "s#%MAC%#$MAC#g" ${VMNAME}.xml
sed -i "s#%MAC2%#$MAC2#g" ${VMNAME}.xml
sed -i "s#%VNC_PORT%#$VNC_PORT#g" ${VMNAME}.xml
 
virsh define ${VMNAME}.xml
virsh start $VMNAME
 
VM复制-模版文件
======================================================
template.xml
- vnc接口
- br0和br1双网卡
- selinux关闭
*************************************************************************
<domain type='kvm' id='41'>
  <name>%NAME%</name>
  <uuid>%UUID%</uuid>
  <memory unit='KiB'>2097152</memory>
  <currentMemory unit='KiB'>2097152</currentMemory>
  <vcpu placement='static'>1</vcpu>
  <resource>
    <partition>/machine</partition>
  </resource>
  <os>
    <type arch='x86_64' machine='pc-i440fx-rhel7.0.0'>hvm</type>
    <boot dev='hd'/>
  </os>
  <features>
    <acpi/>
    <apic/>
  </features>
  <cpu mode='custom' match='exact'>
    <model fallback='allow'>Nehalem</model>
  </cpu>
  <clock offset='utc'>
    <timer name='rtc' tickpolicy='catchup'/>
    <timer name='pit' tickpolicy='delay'/>
    <timer name='hpet' present='no'/>
  </clock>
  <on_poweroff>destroy</on_poweroff>
  <on_reboot>restart</on_reboot>
  <on_crash>restart</on_crash>
  <pm>
    <suspend-to-mem enabled='no'/>
    <suspend-to-disk enabled='no'/>
  </pm>
  <devices>
    <emulator>/usr/libexec/qemu-kvm</emulator>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='%IMAGE_PATH%'/>
      <backingStore/>
      <target dev='vda' bus='virtio'/>
      <alias name='virtio-disk0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x07' function='0x0'/>
    </disk>
    <disk type='block' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <backingStore/>
      <target dev='hda' bus='ide'/>
      <readonly/>
      <alias name='ide0-0-0'/>
      <address type='drive' controller='0' bus='0' target='0' unit='0'/>
    </disk>
    <controller type='usb' index='0' model='ich9-ehci1'>
      <alias name='usb'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x7'/>
    </controller>
    <controller type='usb' index='0' model='ich9-uhci1'>
      <alias name='usb'/>
      <master startport='0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x0' multifunction='on'/>
    </controller>
    <controller type='usb' index='0' model='ich9-uhci2'>
      <alias name='usb'/>
      <master startport='2'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x1'/>
    </controller>
    <controller type='usb' index='0' model='ich9-uhci3'>
      <alias name='usb'/>
      <master startport='4'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x2'/>
    </controller>
    <controller type='pci' index='0' model='pci-root'>
      <alias name='pci.0'/>
    </controller>
    <controller type='ide' index='0'>
      <alias name='ide'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x1'/>
    </controller>
    <controller type='virtio-serial' index='0'>
      <alias name='virtio-serial0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x05' function='0x0'/>
    </controller>
    <interface type='bridge'>
      <mac address='%MAC%'/>
      <source bridge='br0'/>
      <target dev='vnet0'/>
      <model type='virtio'/>
      <alias name='net0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x03' function='0x0'/>
    </interface>
    <interface type='bridge'>
      <mac address='%MAC2%'/>
      <source bridge='br1'/>
      <target dev='vnet1'/>
      <model type='virtio'/>
      <alias name='net1'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x04' function='0x0'/>
    </interface>
    <serial type='pty'>
      <source path='/dev/pts/1'/>
      <target port='0'/>
      <alias name='serial0'/>
    </serial>
    <console type='pty' tty='/dev/pts/1'>
      <source path='/dev/pts/1'/>
      <target type='serial' port='0'/>
      <alias name='serial0'/>
    </console>
    <input type='tablet' bus='usb'>
      <alias name='input0'/>
    </input>
    <input type='mouse' bus='ps2'/>
    <input type='keyboard' bus='ps2'/>
    <graphics type='vnc' port='%VNC_PORT%' autoport='no' listen='0.0.0.0'>
      <listen type='address' address='0.0.0.0'/>
    </graphics>
    <video>
      <model type='cirrus' vram='16384' heads='1'/>
      <alias name='video0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x0'/>
    </video>
    <memballoon model='virtio'>
      <alias name='balloon0'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x08' function='0x0'/>
    </memballoon>
  </devices>
  <seclabel type='dynamic' model='selinux' relabel='yes'>
    <label>system_u:system_r:svirt_t:s0:c421,c1001</label>
    <imagelabel>system_u:object_r:svirt_image_t:s0:c421,c1001</imagelabel>
  </seclabel>
</domain>
*************************************************************************
 
VM复制-问题
====================================================================
错误：
error: unsupported configuration: Unable to find security driver for model selinux
解决办法：
virsh edit domain
**************************
删掉seclable那一块的selinux设定
**************************
 
问题描述：
# virsh start compute-node01
error: Failed to start domain compute-node01
error: internal error: process exited while connecting to monitor: 2016-04-07T09:06:59.054829Z qemu-kvm: -chardev socket,id=charchannel0,path=/var/lib/libvirt/qemu/channel/target/domain-controller/org.qemu.guest_agent.0,server,nowait: Failed to bind socket: Permission denied
2016-04-07T09:06:59.054904Z qemu-kvm: -chardev socket,id=charchannel0,path=/var/lib/libvirt/qemu/channel/target/domain-controller/org.qemu.guest_agent.0,server,nowait: chardev: opening backend "socket" failed
 
问题分析：
看报错信息，知道是权限错误，具体的权限是/var/lib/libvirt/qemu下的权限不对
网上查到信息，/etc/libvirt/qemu.conf中默认是qemu用户的权限，我的这个新虚机是拷贝原有的虚机而来，现在两台都无法启动
把配置文件中的用户修改成root，依然无法启动
 
问题解决：
## 后来发现原来虚机也有seclable配置，会使用selinux来防护权限
## 关闭selinux，保证qemu.conf中配置的用户和/var/lib/libvirt/qemu目录权限一致即可启动虚机

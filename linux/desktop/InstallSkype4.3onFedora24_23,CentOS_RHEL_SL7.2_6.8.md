Install Skype 4.3 on Fedora 24/23, CentOS/RHEL/SL 7.2/6.8
2016年8月17日
9:12
 
---
title: Install Skype 4.3 on Fedora 24/23, CentOS/RHEL/SL 7.2/6.8
date: 2016-08-17 11:23:00
categories: linux
tags: [linux,skype,fedora]
---
LINK: [原文章](https://www.if-not-true-then-false.com/2012/install-skype-on-fedora-centos-red-hat-rhel-scientific-linux-sl/)
 
This is guide, howto **install Skype 4.3 on Fedora 24/23/22/21/20/19/18/17/16 on CentOS/Red Hat (RHEL)/Scientific Linux (SL) 7.2/6.8**. This is actually easy process, but I won't use Skype own RPM package, which works only with Fedora 16+. Skype package also doesn't care about any needed dependencies on 64-bit (x86_64) systems nor 32-bit (i686) systems. This guide uses Skype dynamic package and all dependencies are installed manually. 
 
### 1. Install Skype 4.3 on Fedora 24/23/22/21/20 and CentOS/Red Hat (RHEL) 7.2/6.8
 
#### 1.1 Change root user
```  bash
su -
## OR ##
sudo -i
 ```
 
#### 1.2 Install needed repositories
Needed only on CentOS/RHEL/SL
```  bash
## CentOS 7, Red Hat (RHEL) 7 and Scientific Linux 7 ##
yum localinstall http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-7.noarch.rpm
yum localinstall http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm
 
 
## CentOS 6, Red Hat (RHEL) 6 and Scientific Linux 6 ##
yum localinstall http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
```
 
#### 1.3 Install Needed Dependencies
```  bash
## Fedora 24/23/22 ##
dnf install alsa-lib.i686 fontconfig.i686 freetype.i686 glib2.i686 libSM.i686 libXScrnSaver.i686 libXi.i686 libXrandr.i686 libXrender.i686 libXv.i686 libstdc++.i686 pulseaudio-libs.i686 qt.i686 qt-x11.i686 zlib.i686 qtwebkit.i686
 
## Fedora 21/20/19/18/17/16 and CentOS/RHEL 7.2/6.8 ##
yum install alsa-lib.i686 fontconfig.i686 freetype.i686 glib2.i686 libSM.i686 libXScrnSaver.i686 libXi.i686 libXrandr.i686 libXrender.i686 libXv.i686 libstdc++.i686 pulseaudio-libs.i686 qt.i686 qt-x11.i686 zlib.i686 qtwebkit.i686
```
 
Same commands on multiple lines:
```  bash
## Fedora 24/23/22 ##
dnf install alsa-lib.i686 fontconfig.i686 freetype.i686 \
glib2.i686 libSM.i686 libXScrnSaver.i686 libXi.i686 \
libXrandr.i686 libXrender.i686 libXv.i686 libstdc++.i686 \
pulseaudio-libs.i686 qt.i686 qt-x11.i686 zlib.i686 qtwebkit.i686
 
## Fedora 21/20/19/18/17/16 and CentOS/RHEL 7.2/6.8 ##
yum install alsa-lib.i686 fontconfig.i686 freetype.i686 \
glib2.i686 libSM.i686 libXScrnSaver.i686 libXi.i686 \
libXrandr.i686 libXrender.i686 libXv.i686 libstdc++.i686 \
pulseaudio-libs.i686 qt.i686 qt-x11.i686 zlib.i686 qtwebkit.i686
```
 
Additional dependencies for CentOS 6 / Red Hat (RHEL) 6 / Scientific Linux (SL) 6
```  bash
yum install libcanberra-gtk2.i686 gtk2-engines.i686 PackageKit-gtk-module.i686
```
#### 1.4 Download Skype 4.3 Dynamic
```  bash
cd /tmp
 
## Skype 4.3 Dynamic for Fedora/CentOS/RHEL/SL ##
wget --trust-server-names http://www.skype.com/go/getskype-linux-dynamic
 
```
 
#### 1.5 Extract Skype
```  bash
mkdir /opt/skype
 
## Extract Skype 4.3 ##
tar xvf skype-4.3* -C /opt/skype --strip-components=1
```
   
#### 1.6 Create Launcher
```  bash
## Link skype.desktop ##
ln -s /opt/skype/skype.desktop /usr/share/applications/skype.desktop
 
## Link icons (copy and paste all rows at once) ##
## Thank you Andrej Podzimek for this code and idea ##
for icon in /opt/skype/icons/*; do
ressuffix="${icon##*_}"
res="${ressuffix%%.*}"
ln -s "$icon" /usr/share/icons/hicolor/"$res"/apps/skype.png
done
 
## Update gtk icon cache (needed at least Gnome/GTK envorinments) ##
gtk-update-icon-cache /usr/share/icons/hicolor
 
## Create empty /usr/bin/skype file and set permissions ##
touch /usr/bin/skype
chmod 755 /usr/bin/skype
```
 
Open /usr/bin/skype with text editor and add following content:
Fedora 24/23/22/21/20 / CentOS 7 / Red Hat (RHEL) 7 / Scientific Linux (SL) 7
```  bash
#!/bin/sh
export SKYPE_HOME="/opt/skype"
$SKYPE_HOME/skype --resources=$SKYPE_HOME $*
```
 
CentOS 6 / Red Hat (RHEL) 6 / Scientific Linux (SL) 6
```  bash
#!/bin/sh
export SKYPE_HOME="/opt/skype"
export GTK2_RC_FILES="/etc/gtk-2.0/gtkrc"
 
$SKYPE_HOME/skype --resources=$SKYPE_HOME $*
```
 
If you you have problems to use command line editors, like vi/vim, nano, emacs, pico, joe, etc. then copy and paste following lines (exactly) to terminal to create /usr/bin/skype file.
Fedora 24/23/22/21/20 / CentOS 7 / Red Hat (RHEL) 7 / Scientific Linux (SL) 7
```  bash
cat << EOF > /usr/bin/skype 
#!/bin/sh 
export SKYPE_HOME="/opt/skype" 
\$SKYPE_HOME/skype --resources=\$SKYPE_HOME \$*
EOF 
```
 
CentOS 6 / Red Hat (RHEL) 6 / Scientific Linux (SL) 6
```  bash
cat << EOF > /usr/bin/skype
#!/bin/sh
export SKYPE_HOME="/opt/skype"
export GTK2_RC_FILES="/etc/gtk-2.0/gtkrc"
 
\$SKYPE_HOME/skype --resources=\$SKYPE_HOME \$*
EOF
```

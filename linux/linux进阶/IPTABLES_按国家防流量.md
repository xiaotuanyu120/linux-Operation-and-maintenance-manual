IPTABLES: 按国家防流量
2016年1月22日
11:19
 
问题背景：
====================================================
网站针对某个国家或地区开放，希望禁掉其它国家的访问
 
使用工具
====================================================
1、使用服务自带的限制，例如nginx和svn等，但有限制
2、使用iptables，全局限制，简单方便
## 基于上面两条，优选iptables全局控制
 
iptables模块介绍
=====================================================
* 普通修改iptables模块是需要重新编译内核的，但是如果使用xtables-addons（iptables扩展），则不需要重新编译。
* xtables-addons中的xt_getip模块基于iptables的GeoIP过滤机制，可根据来源/目的地国家，过滤/NAT或管理数据包。
 
部署过程
=====================================================
## xtables-addons安装
## 依赖包安装
# yum install epel-release
# yum install gcc-c++ make automake kernel-devel-`uname -r` wget unzip iptables-devel perl-Text-CSV_XS
## kernel-devel-`uname -r`需要换成实际环境中的相应版本
 
## 编译安装xtables-addons
## centos6安装最新的2.1版本有问题，换成1.47.1
# wget http://jaist.dl.sourceforge.net/project/xtables-addons/Xtables-addons/xtables-addons-1.47.1.tar.xz
# tar Jxf xtables-addons-1.47.1.tar.xz
# cd xtables-addons-1.47.1
# ./configure
# make
# make install
 
## 为Xtables-addons安装GeoIP数据库
# cd geoip/
# ./xt_geoip_dl
--2016-01-31 15:42:36--  http://geolite.maxmind.com/download/geoip/database/GeoIPv6.csv.gz
。。。省略。。。
FINISHED --2016-01-31 15:43:34--
Downloaded: 2 files, 2.7M in 57s (48.5 KB/s)
Archive:  GeoIPCountryCSV.zip
  inflating: GeoIPCountryWhois.csv
# ./xt_geoip_build GeoIPCountryWhois.csv
# mkdir -p /usr/share/xt_geoip
# cp -r {BE,LE} /usr/share/xt_geoip/
 
规则制定
==================================================
iptables -m geoip --src-cc country[,country...] --dst-cc country[,country...]
 
## 例如，阻止也门(YE)和赞比亚(ZM)的入站流量
# iptables -I INPUT -m geoip --src-cc YE,ZM -j DROP
## 例如，阻止发往中国(CN)的出站流量
# iptables -A OUTPUT -m geoip --dst-cc CN -j DROP
 
## "!"的用法
## 例如，阻止所有非美国的入站流量
# iptables -I INPUT -m geoip ! --src-cc US -j DROP
 
PS:国家代码参考ISO3166标准
 
 
 
问题+解决方案
=======================================================
问题1：编译报错
# make
make  all-recursive
make[1]: Entering directory `/usr/local/src/xtables-addons-1.47.1'
Making all in extensions
make[2]: Entering directory `/usr/local/src/xtables-addons-1.47.1/extensions'
Xtables-addons 1.47.1 - Linux 2.6.32-431.el6.x86_64
if [ -n "/lib/modules/2.6.32-431.el6.x86_64/build" ]; then make -C /lib/modules/2.6.32-431.el6.x86_64/build M=/usr/local/src/xtables-addons-1.47.1/extensions modules; fi;
make[3]: Entering directory `/usr/src/kernels/2.6.32-431.el6.x86_64'
  CC [M]  /usr/local/src/xtables-addons-1.47.1/extensions/compat_xtables.o
/usr/local/src/xtables-addons-1.47.1/extensions/compat_xtables.c: In function 'xtnu_ipv6_find_hdr':
/usr/local/src/xtables-addons-1.47.1/extensions/compat_xtables.c:633: error: too few arguments to function 'ipv6_find_hdr'
make[4]: *** [/usr/local/src/xtables-addons-1.47.1/extensions/compat_xtables.o] Error 1
make[3]: *** [_module_/usr/local/src/xtables-addons-1.47.1/extensions] Error 2
make[3]: Leaving directory `/usr/src/kernels/2.6.32-431.el6.x86_64'
make[2]: *** [modules] Error 2
make[2]: Leaving directory `/usr/local/src/xtables-addons-1.47.1/extensions'
make[1]: *** [all-recursive] Error 1
make[1]: Leaving directory `/usr/local/src/xtables-addons-1.47.1'
make: *** [all] Error 2
 
解决办法：
## 尝试-1（本环境无效）
# vi /usr/src/kernels/2.6.32-431.el6.x86_64/include/linux/autoconf.h
*******************************************
## 注释下面这一行，网查很多这个解决方案，但是依旧没有解决
/*#define CONFIG_IP6_NF_TARGET_REJECT_MODULE 1*/
*******************************************
 
## 尝试-2（有效解决）
# vim extensions/compat_xtables.c
************************************************
## 把报错的ipv6的代码段注释掉，很傻逼，但是最起码可以编译了
/*int xtnu_ipv6_find_hdr(const struct sk_buff *skb, unsigned int *offset,
    int target, unsigned short *fragoff, int *fragflg)
{
        return ipv6_find_hdr(skb, offset, target, fragoff);
}
EXPORT_SYMBOL_GPL(xtnu_ipv6_find_hdr);*/
## 最开头和最结尾的"/*    */"是注释符
************************************************ 

---
title: 三十一讲DNS服务
date: 2015年2月2日	 20:14:00
---
 
dig -t NS .
 
参考连接：
链接1：https://blog.dnsimple.com/2014/01/why-alias-record/
链接2：https://support.dnsimple.com/articles/differences-between-a-cname-alias-url/
 
A记录 - 把域名map到ip地址
CNAME - 
把域名map到X域名上，访问时返回X域名，然后继续解析X域名
但是，当你对此域名做cname后，不可以对此域名继续做其他任何形式的解析
https://tools.ietf.org/html/rfc1912#section-2.4
alias - 把域名map到X域名上，跟cname不同的是，它可以与其他针对于此域名的记录共存
url - 把域名301重定向到目标域名上
 
 
 

---
title: nginx: 7.2.0 if语句、参数变量、geoip
date: 2018-07-26 17:16:00
categories: linux/lnmp
tags: [nginx,geo]
---
### nginx: 7.2.0 if语句、参数变量、geoip

---

### 0. 前言
geo是一个ip库，nginx可以用来过滤ip, 默认情况下，nginx就编译上了geo库，除非编译时手动增加`--without-http_geo_moudle`。

---

### 1. geo过滤ip
#### 1) 希望达到的效果
访问`www.abc.com？testip=1.2.3.4`，根据testip参数，来使用geo匹配ip白名单，如果不在白名单内，返回403。

#### 2) 示例
```
http {
    ...

    geo $arg_testip $geo {
        default 0;
        1.2.3.4 1;
        192.168.0.0/24 1;
        include vhost/geoip_cn;
    }

    ...

    server {
        ...

        location / {

            ......


            if ($geo = 0) {
                return 403;
            }

            ......

        }
    }
}
```
> 若使用`geo $geo {}`，默认使用的是`$remote_addr`, [详细文档](http://nginx.org/en/docs/http/ngx_http_geo_module.html)。 当然我们可以手动传入替换的变量，例如此处我们使用的是`$arg_testip`，也就是`testip`参数。

> `default 0`的含义是，如果在此列表中没有匹配的ip或者ip段，则默认给`geo`变量赋值为`0`。


geoip_cn文件内容示例
```
103.101.60.0/22 1;
103.101.120.0/21 1;
103.101.144.0/21 1;
103.101.153.0/24 1;
103.101.180.0/22 1;
103.101.184.0/22 1;
103.102.76.0/22 1;
103.102.80.0/22 1;
103.102.168.0/21 1;
103.102.180.0/22 1;
```
> 查询地区网址段的网址:
- https://www.ip2location.com/blockvisitorsbycountry.aspx
- https://www.countryipblocks.net/country_selection.php
- http://www.ipdeny.com/ipblocks/

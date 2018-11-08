---
title: nginx: 7.1.0 if语句、参数变量、自定义header变量
date: 2018-07-26 09:15:00
categories: service/nginx
tags: [nginx]
---
### nginx: 7.1.0 if语句、参数变量、自定义header变量

---

### 0. 前言
nginx的逻辑判断需要注意以下几点：
- if语句不可以嵌套
- if不可以多condition（不可以使用&&和||）

> 参考文档：[nginx_if语句官方文档](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#if)

---

### 1. if语句及相关变量示例
#### 1) 希望达到的效果
1. 直接访问域名`www.abc.com`，返回官网
2. 访问`www.abc.com？testip=1.2.3.4`，并且传入http header：`Authorization=authstring`，若`testip`及`Authorization`两个判断都okay，返回官网
3. 否则，其他所有情况返回403

#### 2) 示例
1. 变量说明：
  - [$request_uri](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_uri), 完整的访问域名`www.abc.com?testip=1.2.3.4`
  - [$arg_name](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_arg_)，可以匹配传入参数的名字，例如`$arg_testip`匹配的就是`testip`这个参数
2. 逻辑说明：
  - 因为if不能嵌套，只能通过额外引入一个`$tag`变量来协助判断
  - 自定义header的识别需要注意以下两点：
    - `underscores_in_headers on;`
    - 自定义header变量的格式`$http_<customized-header-name>`(配置里面都要小写，传入的时候可以大写)

```
server {
	...

    underscores_in_headers on;

    location / {

        ......

        set $tag 1;

        if ($request_uri !~* (.*)testip(.*)) {
            set $tag 0;
        }

        if ($arg_testip !~* (1.2.3.4|2.3.4.5|3.4.5.6)) {
            set $tag "${tag}1";
        }

        if ($http_authorization != authstring) {
            set $tag "${tag}1";
        }

        if ($tag = 11) {
            return 403;
        }

        if ($tag = 111) {
            return 403;
        }

        ......

    }
}
```

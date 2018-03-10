---
title: error 1.0.0 nginx vue webpack fresh 404
date: 2018-03-10 10:51:00
categories: javascript/basic
tags: [nginx, vue, webpack]
---
### error 1.0.0 nginx vue webpack fresh 404

---

### 1. 错误信息
当部署使用webpack打包过的vue工程，然后用nginx去做web服务器时，通过首页点击是没有问题的，例如www.abc.com/mobile是一个vue工程，通过鼠标点击访问www.abc.com/mobile/news是没问题的，但是当我们刷新之后，会返回404.
网上搜索之后，找到了原因，nginx解析www.abc.com/mobile/news时，会去mobile/news目录下面找文件，但是实际上我们通过webpack打包的vue项目只是有一个index.html和static目录，vue是通过index.html引入的js文件来提供资源的路由的。所以，nginx刷新那个url的时候默认去找了mobile/news目录，发现目录不存在，肯定是报404错误。然而当我们在首页通过访问index.html去点击进入子级目录时，是通过vue的router来访问的，当然就没问题了。

### 2. 解决办法
[segmentfault answer](https://segmentfault.com/a/1190000013056296)  
重点是
1. config/index.js中配置build部分的assetsPublicPath
2. build/webpack.prod.conf.js中配置output部分的publicPath
3. router/index.js中配置Router部分的base
4. nginx部分配置

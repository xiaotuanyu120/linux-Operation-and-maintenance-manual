博客: hexo的next主题加友链
Thursday, 25 August 2016
5:34 PM
 
---
title: hexo博客友情链接配置
date: 2016-08-25 17:35:00
categories: hexo
tags: [hexo,blog]
---
**配置说明：**[next友情链接说明文档](https://github.com/iissnan/hexo-theme-next/wiki/友情链接设置)
 
``` bash
# 进入hexo的程序目录
vim themes/next/_config.yml
*********************
links_title: Friend Links
links:
  yuhui: http://ipchy.net
*********************
 
# 重新生成静态页面
hexo g
# 生成之前，先打开程序根目录下的_config.yml，不用更改内容，就是保存一遍，否则会报错
```

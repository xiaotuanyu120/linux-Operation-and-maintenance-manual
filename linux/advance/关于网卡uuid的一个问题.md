---
title: 关于网卡uuid的一个问题
date: 2016年6月24日
categories: 20:06
---
 
当你看到你的网卡配置文件中有UUID时，你需要知道
uuid只是NetworkManager识别的东西，而并不被network服务识别
所以，当你并不使用NetworkManager管理network时，尽管可以删除此字段

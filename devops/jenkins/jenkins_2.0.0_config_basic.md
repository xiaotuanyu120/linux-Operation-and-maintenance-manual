---
title: jenkins: 2.0.0 基本配置
date: 2016-08-12 15:42:00
categories: devops/jenkins
tags: [jenkins,java,linux]
---
### jenkins: 2.0.0 基本配置

---

### 1. 安全性配置
点击侧边栏 -> manage jenkins -> Configure Global Security

确保以下选项被勾选
- enable security 启用安全模块
- Jenkins' own user database  使用jenkins自有的用户信息database(禁止注册user)
- Logged-in users can do anything  登录者有全部权限

---

### 2. 插件升级及安装
点击侧边栏 -> manage jenkins -> Manage Plugins

此处可执行多种插件操作
- 升级查询及升级
- 卸载
- 搜索插件及安装

---

### 3. 系统全局配置
点击侧边栏 -> manage jenkins -> Configure System

- 禁用发送给jenkins数据
- email配置

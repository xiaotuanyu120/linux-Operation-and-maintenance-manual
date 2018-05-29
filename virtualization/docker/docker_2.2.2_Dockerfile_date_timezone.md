---
title: 1.2.2 docker容器时间不准解决方案
date: 2018-05-29 13:29:00
categories: virtualization/docker
tags: [docker]
---
### 1.2.2 docker容器时间不准解决方案

---

### 0. 问题背景
创建了很多docker镜像，但是起来的容器里面时间有问题

---

### 1. 解决办法
在Dockerfile中增加以下内容
```
ENV TZ=America/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
```
> [stackoverflow 解决办法](https://serverfault.com/questions/683605/docker-container-time-timezone-will-not-reflect-changes)

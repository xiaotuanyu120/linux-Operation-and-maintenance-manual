---
title: 2.1.4 镜像-镜像的导入和导出
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 2.1.4 镜像-镜像的导入和导出

---

### 1. 镜像导出和导入
#### 1) 导出镜像文件
``` bash
docker save -o centos7-x64.tar centos:7-x64
```

#### 2) 导入镜像文件
``` bash
docker load < centos7-x64.tar
# 这样就方便在不同机器之间转移docker镜像文件了```
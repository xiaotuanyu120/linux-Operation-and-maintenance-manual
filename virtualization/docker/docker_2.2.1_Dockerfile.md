---
title: 1.2.1 Dockerfile
date: 2017-09-13 14:33:00
categories: virtualization/docker
tags: [docker]
---
### 1.2.1 Dockerfile

---

### 0. Dockerfile前言
docker镜像自定义的核心文件就是Dockerfile，通过其来进行一系列操作来构建适合使用的镜像。
> 主要参考官方 [Dockerfile documents](https://docs.docker.com/engine/reference/builder/)和[Dockerfile 最佳实践](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)

---

### 1. Dockerfile使用方法
在Dockerfile所在的目录中执行以下命令即可。当没有指定Dockerfile时，docker默认寻找当前目录下的Dockerfile文件。
``` bash
docker build .

# 需要手动指定Dockerfile可使用-f
docker build -f /path/to/a/Dockerfile .

# 可使用-t指定仓库路径和tag
docker build -t shykes/myapp .
# 也可以同时指定多个
docker build -t shykes/myapp:1.0.2 -t shykes/myapp:latest .
```
> 推荐编译docker镜像时，创建一个空目录，然后将Dockerfile放进该目录。目录中仅需要放置其他一些构建镜像必备的文件即可。

> 需要注意的是，Dockerfile中的每一条指令都是顺序执行且独立的，这意味着`RUN cd /tmp`不会对接下来的指令有任何影响

---

### 2. Dockerfile格式
```
# Comment
INSTRUCTION arguments
```
注释使用`#`；

构造命令不区分大小写，但是一般都大写和后面的参数加以区分；

Dockerfile必须以`FROM`开头，从基本镜像开始向下顺序执行构造命令；

---

### 3. 构造命令
#### 1) FROM
```
FROM <image> [AS <name>]
FROM <image>[:<tag>] [AS <name>]
FROM <image>[@<digest>] [AS <name>]
```
<image>可以是公共仓库镜像或者私有仓库镜像，只要是有效的即可；
#### 2) RUN
```
# shell模式
RUN <command>

# exec模式
RUN ["executable", "param1", "param2"]
```
exec模式是解析成json数组，所以必须要用双引号
#### 3) EXPOSE
```
EXPOSE <port> [<port>...]
```
指定容器运行时的监听端口，例如apache web服务器容器需要监听80
#### 4) ENV
```
ENV <key> <value>
ENV <key>=<value> ...
```
第一种方式，`ENV <key> <value>`在第一个空格之后全部都是value，包括空格和引号；

第二种方式，`ENV <key>=<value> ...`可以用于给多个变量赋值，使用脱意符号来输入空格。

以下两种方式是相同的
```
# first form
ENV myName John Doe
ENV myDog Rex The Dog
ENV myCat fluffy

# second form
ENV myName="John Doe" myDog=Rex\ The\ Dog \
    myCat=fluffy
```
#### 5) ADD & COPY
```
ADD <src>... <dest>
COPY <src>... <dest>
```
如果src是个目录，会拷贝这个目录下面的所有内容到dest中
#### 6) CMD
```
# exec form, this is the preferred form
CMD ["executable","param1","param2"]

# as default parameters to ENTRYPOINT
CMD ["param1","param2"]

# shell form
CMD command param1 param2
```
CMD这个命令的初衷是作为ENTRYPOINT的默认参数，如果用作此用，需要CMD和ENTRYPOINT都使用json数组的方式
#### 7) ENTRYPOINT
```
# exec form, preferred
ENTRYPOINT ["executable", "param1", "param2"]

# shell form
ENTRYPOINT command param1 param2
```
当容器启动的时候执行的命令，比如说`ENTRYPOINT top -b`
#### 8) VOLUME
```
VOLUME ["/data"]
```
相当于把本机的或者其他容器的磁盘挂载到当前容器中，上面的例子就是把宿主机的/data挂载到了容器的/data上。可以在容器运行时使用`-v`来达到同样的效果，而且`-v`更方便的是可以手动更改挂载目录的路径，例如`-v /home/data:/data`这样就把本机的/home/data挂载到了容器的/data上面。
#### 9) USER
```
USER <user>[:<group>] or
USER <UID>[:<GID>]
```
指定一个非root用户，用于执行RUN,CMD,ENTRYPOINT等命令，也用于容器的运行。
#### 10) WORKDIR
```
WORKDIR /path/to/workdir
```
用于指定RUN, CMD, ENTRYPOINT, COPY 和 ADD这些命令的执行目录，当然，如果你指定的是绝对路径的话不受此影响。

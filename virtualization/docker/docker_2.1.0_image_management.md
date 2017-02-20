---
title: DOCKER 2.1.0 镜像-管理
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 1.2.0 镜像-管理

---

### 1. 搜索镜像
``` bash
docker search tomcat
NAME                           DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
tomcat                         Apache Tomcat is an open source implementa...   1193      [OK]
dordoka/tomcat                 Ubuntu 14.04, Oracle JDK 8 and Tomcat 8 ba...   31                   [OK]
davidcaste/alpine-tomcat       Apache Tomcat 7/8 using Oracle Java 7/8 wi...   15                   [OK]
cloudesire/tomcat              Tomcat server, 6/7/8                            12                   [OK]
andreptb/tomcat                Debian Jessie based image with Apache Tomc...   6                    [OK]
openweb/oracle-tomcat          A fork off of Official tomcat image with O...   5                    [OK]
fbrx/tomcat                    Minimal Tomcat image based on Alpine Linux      4                    [OK]
...
```
> 字段介绍：
- NAME             名称
- DESCRIPTION      描述
- STARS            星星（好评度）
- OFFICIAL         是否官方版本
- AUTOMATED        是否自动创建
>我们可以看到最高好评度的就是官方创建的official版本
---

### 2. 获取镜像
``` bash
# 获取默认镜像
docker pull tomcat
Using default tag: latest
latest: Pulling from library/tomcat
5040bd298390: Pull complete
fce5728aad85: Pull complete
c42794440453: Pull complete
9789263043d1: Pull complete
6c6ea13aad15: Pull complete
55336e5423a8: Pull complete
b278bc2055e9: Pull complete
53161d17f4ce: Pull complete
f0f5041f1011: Pull complete
25928c7caaa1: Pull complete
cfed2024bbdf: Pull complete
Digest: sha256:0fb173e213111be292962336777a134d43f59c1b8cc2da3cbaaf6308ee7a490a
Status: Downloaded newer image for tomcat:latest

# 指定tag获取镜像
docker pull tomcat:7.0.75-jre7-alpine
7.0.75-jre7-alpine: Pulling from library/tomcat
b7f33cc0b48e: Pull complete
43a564ae36a3: Pull complete
93e4c3809f11: Pull complete
f994fbfa33b2: Pull complete
8bc378fa6428: Pull complete
569f0d7875b5: Pull complete
1c8ddc5ce010: Pull complete
7709f7014e0d: Pull complete
Digest: sha256:ff39d0b3dd5f445cf3fbb600740d09ae2fe86b1fbd6c3a6285de2c8702e4db13
Status: Downloaded newer image for tomcat:7.0.75-jre7-alpine
```
> docker的image是分layer的，我们可以看到下载的时候，是分layer下载的，layer是由AUFS文件系统支撑的  
TAG可以指定版本  
docker pull 语法：
- `docker pull [参数] [仓库地址[:端口]/]名称[:TAG]`  
- `docker pull 名称`
---

### 3. 管理镜像信息
#### 1) 查看镜像信息
``` bash
docker images
REPOSITORY          TAG                  IMAGE ID            CREATED             SIZE
tomcat              latest               0335e4e8579b        4 days ago          355 MB
tomcat              7.0.75-jre7-alpine   dc29b990e815        3 weeks ago         146 MB
hello-world         latest               48b5124b2768        5 weeks ago         1.84 kB
```
> 字段详解：  
- REPOSITORY    仓库地址
- TAG           标签
- IMAGE ID      镜像ID
- CREATED       创建时间
- VIRTUAL SIZE  镜像大小

#### 2) 增加新TAG
``` bash
docker tag tomcat:latest tomcat:la
# docker tag 语法：
# docker tag [-f|--force[=false]] [--help] IMAGE[:TAG] [REGISTRY_HOST/][USERNAME/]NAME[:TAG]

docker images
REPOSITORY          TAG                  IMAGE ID            CREATED             SIZE
tomcat              la                   0335e4e8579b        4 days ago          355 MB
tomcat              latest               0335e4e8579b        4 days ago          355 MB
tomcat              7.0.75-jre7-alpine   dc29b990e815        3 weeks ago         146 MB
hello-world         latest               48b5124b2768        5 weeks ago         1.84 kB
# IMAGE ID相同，代表其实两个镜像是指向一个，只是相当于不通的快捷方式
```

#### 3) 查看镜像详细信息
``` bash
docker inspect dc29b990e815
[
    {
        "Id": "sha256:dc29b990e8157560bab88705c6d9fee446b24346d190cbf437bb221e8a356834",
        "RepoTags": [
            "tomcat:7.0.75-jre7-alpine"
        ],
        "RepoDigests": [
            "tomcat@sha256:ff39d0b3dd5f445cf3fbb600740d09ae2fe86b1fbd6c3a6285de2c8702e4db13"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2017-01-25T18:43:44.623719475Z",
        "Container": "5383f8dc4eb1217b142703075b613e0ac723552a785f9e0d3a597327f22e9425",
        "ContainerConfig": {
            "Hostname": "26ba10d264c2",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "8080/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/tomcat/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/jvm/java-1.7-openjdk/jre/bin:/usr/lib/jvm/java-1.7-openjdk/bin",
                "LANG=C.UTF-8",
                "JAVA_HOME=/usr/lib/jvm/java-1.7-openjdk/jre",
                "JAVA_VERSION=7u121",
                "JAVA_ALPINE_VERSION=7.121.2.6.8-r0",
                "CATALINA_HOME=/usr/local/tomcat",
                "TOMCAT_NATIVE_LIBDIR=/usr/local/tomcat/native-jni-lib",
                "LD_LIBRARY_PATH=/usr/local/tomcat/native-jni-lib",
                "GPG_KEYS=05AB33110949707C93A279E3D3EFE6B686867BA6 07E48665A34DCAFAE522E5E6266191C37C037D42 47309207D818FFD8DCD3F83F1931D684307A10A5 541FBE7D8F78B25E055DDEE13C370389288584E7 61B832AC2F1C5A90F0F9B00A1C506407564C17A3 713DA88BE50911535FE716F5208B0AB1D63011C7 79F7026C690BAA50B92CD8B66A3AD3F4F22C4FED 9BA44C2621385CB966EBA586F72C284D731FABEE A27677289986DB50844682F8ACB77FC2E86E29AC A9C5DF4D22E99998D9875A5110C01C5A2F6059E7 DCFD35E0BF8CA7344752DE8B6FB21E8933C60243 F3A04C595DB5B6A5F1ECA43E3B7BBB100D811BBE F7DA48BB64BCB84ECBA7EE6935CD23C10D498E23",
                "TOMCAT_MAJOR=7",
                "TOMCAT_VERSION=7.0.75",
                "TOMCAT_TGZ_URL=https://www.apache.org/dyn/closer.cgi?action=download&filename=tomcat/tomcat-7/v7.0.75/bin/apache-tomcat-7.0.75.tar.gz",
                "TOMCAT_ASC_URL=https://www.apache.org/dist/tomcat/tomcat-7/v7.0.75/bin/apache-tomcat-7.0.75.tar.gz.asc"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "#(nop) ",
                "CMD [\"catalina.sh\" \"run\"]"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:321e079d13079a1e507039ce1eccead924924dfa33d5106226cebc4abb7146ca",
            "Volumes": null,
            "WorkingDir": "/usr/local/tomcat",
            "Entrypoint": null,
            "OnBuild": [],
            "Labels": {}
        },
        "DockerVersion": "1.12.6",
        "Author": "",
        "Config": {
            "Hostname": "26ba10d264c2",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "8080/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/tomcat/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/jvm/java-1.7-openjdk/jre/bin:/usr/lib/jvm/java-1.7-openjdk/bin",
                "LANG=C.UTF-8",
                "JAVA_HOME=/usr/lib/jvm/java-1.7-openjdk/jre",
                "JAVA_VERSION=7u121",
                "JAVA_ALPINE_VERSION=7.121.2.6.8-r0",
                "CATALINA_HOME=/usr/local/tomcat",
                "TOMCAT_NATIVE_LIBDIR=/usr/local/tomcat/native-jni-lib",
                "LD_LIBRARY_PATH=/usr/local/tomcat/native-jni-lib",
                "GPG_KEYS=05AB33110949707C93A279E3D3EFE6B686867BA6 07E48665A34DCAFAE522E5E6266191C37C037D42 47309207D818FFD8DCD3F83F1931D684307A10A5 541FBE7D8F78B25E055DDEE13C370389288584E7 61B832AC2F1C5A90F0F9B00A1C506407564C17A3 713DA88BE50911535FE716F5208B0AB1D63011C7 79F7026C690BAA50B92CD8B66A3AD3F4F22C4FED 9BA44C2621385CB966EBA586F72C284D731FABEE A27677289986DB50844682F8ACB77FC2E86E29AC A9C5DF4D22E99998D9875A5110C01C5A2F6059E7 DCFD35E0BF8CA7344752DE8B6FB21E8933C60243 F3A04C595DB5B6A5F1ECA43E3B7BBB100D811BBE F7DA48BB64BCB84ECBA7EE6935CD23C10D498E23",
                "TOMCAT_MAJOR=7",
                "TOMCAT_VERSION=7.0.75",
                "TOMCAT_TGZ_URL=https://www.apache.org/dyn/closer.cgi?action=download&filename=tomcat/tomcat-7/v7.0.75/bin/apache-tomcat-7.0.75.tar.gz",
                "TOMCAT_ASC_URL=https://www.apache.org/dist/tomcat/tomcat-7/v7.0.75/bin/apache-tomcat-7.0.75.tar.gz.asc"
            ],
            "Cmd": [
                "catalina.sh",
                "run"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:321e079d13079a1e507039ce1eccead924924dfa33d5106226cebc4abb7146ca",
            "Volumes": null,
            "WorkingDir": "/usr/local/tomcat",
            "Entrypoint": null,
            "OnBuild": [],
            "Labels": {}
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 145568814,
        "VirtualSize": 145568814,
        "GraphDriver": {
            "Name": "overlay",
            "Data": {
                "RootDir": "/var/lib/docker/overlay/230f8385f4d17dc44ff7228946491192ccef810661d78400e15f3058ad7f4bd3/root"
            }
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:7cbcbac42c44c6c38559e5df3a494f44987333c8023a40fec48df2fce1fc146b",
                "sha256:da07d9b32b0090fa42690c204d7b49925b5e65ea770893d02c01ab00d61ff920",
                "sha256:d7f6d7c1230bdabfc039b0ee7eb1308e836be0eac05fce9829e8f47d74dce6e6",
                "sha256:9d55db8cf2e6bf928b404dd353665544b8a38caf444ace4f631288051f06fa14",
                "sha256:6e959be46cf0bd37a54cfe9faa78aa6a1b41da0bf2e68ef77c30c614e14b6037",
                "sha256:f327f2bfb2043e5ab0f471c9c4b73b840c6197a348691ef56e82c2dc11c88f46",
                "sha256:58c1d1c66edfd579fb9d12b951933df2a8034e1989b106fe4b9e25f24e310f5d",
                "sha256:dcbeb9645db70fd730ea5f8732804fa112822b060113f725f682176287ef4fb6"
            ]
        }
    }
]
```
---

### 4. 删除镜像
#### 1) 使用tag删除镜像
``` bash
docker rmi tomcat:la
Untagged: tomcat:la

docker images
REPOSITORY          TAG                  IMAGE ID            CREATED             SIZE
tomcat              latest               0335e4e8579b        4 days ago          355 MB
tomcat              7.0.75-jre7-alpine   dc29b990e815        3 weeks ago         146 MB
hello-world         latest               48b5124b2768        5 weeks ago         1.84 kB
# docker在删除多tag镜像时，其实删除的只是一个镜像tag而已
# 但在镜像只有一个tag时，删除的可就是镜像本身了
# 删除镜像本身时，和下载镜像一样，也是分layer删除的
```

#### 2) 删除正在运行的镜像
``` bash
# 运行一个容器
docker run centos echo 'hello! my first docker!'
hello! my first docker!

# 查看运行的容器列表
docker ps -a
CONTAINER ID IMAGE  COMMAND                CREATED        STATUS                    PORTS   NAMES
6d48ad2e17cf centos "echo 'hello! my firs" 21 seconds ago Exited (0) 20 seconds ago         goofy_bell

# 尝试删除镜像（会报错）
docker rmi hello-world:latest
Error response from daemon: conflict: unable to remove repository reference "hello-world:latest" (must force) - container 7fe36705b599 is using its referenced image 48b5124b2768

# 此时我们可以用"docker rmi -f hello-world"来强制删除，但强烈不推荐
# 推荐先删除依赖该镜像的容器，然后再删除镜像
# 首先删除container id：7fe36705b599（id可以缩写，只要保证唯一即可）
docker rm 7fe3
7fe3

# 此时已经没有容器在运行
docker ps -a
CONTAINER ID  IMAGE   COMMAND                  CREATED        STATUS                    PORTS   NAMES

# 使用镜像ID删除镜像
docker rmi hello-world:latest
Untagged: hello-world:latest
Untagged: hello-world@sha256:c5515758d4c5e1e838e9cd307f6c6a0d620b5e07e6f927b07d05f6d12a1ac8d7
Deleted: sha256:48b5124b2768d2b917edcb640435044a97967015485e812545546cbed5cf0233
Deleted: sha256:98c944e98de8d35097100ff70a31083ec57704be0991a92c51700465e4544d08
```

---

### 5. 创建镜像
#### 1) 基于本地模版导入
``` bash
# 在openvz下载镜像模版（https://download.openvz.org/template/precreated/）
wget https://download.openvz.org/template/precreated/centos-7-x86_64-minimal.tar.gz

# 基于下载的模版创建镜像
cat centos-7-x86_64-minimal.tar.gz | docker import - centos:7-x64
8f93c5d4058b3343e745650d1eda471c18d83c3d2b9fd832b08376bd94a37d22

docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              7-x64               8f93c5d4058b        49 seconds ago      418.9 MB
# 镜像的大小貌似增加了不少，模版文件133M，制作的镜像已经是418.9M了
ll -h centos-7-x86_64-minimal.tar.gz
-rw-r--r--. 1 root root 133M Nov  9 04:28 centos-7-x86_64-minimal.tar.gz
```

#### 2) 基于已有的镜像的容器创建
``` bash
# 运行一个容器，做出改变，然后退出
docker run -ti centos:7-x64 /bin/bash
[root@8dd4c7e651b0 /]# touch test
[root@8dd4c7e651b0 /]# exit
# 主机名就是该container的id
docker ps -a | cut -d ' ' -f 1
CONTAINER
8dd4c7e651b0

## 基于容器id创建新的镜像
docker commit -m 'add test file' -a 'zack' 8dd4c7e651b0 centos:test
061ebf4e339cbf0708d812a87ecc04e094c9aebd7bb4892414ac64971a34ac05
## docker commit 语法
# docker  commit [option] CONTAINER [REPOSITORY[:TAG]]
# [-a|--author[=AUTHOR]] 作者信息
# [-m|--message[=MESSAGE]]  提交时附加信息
# [-p|--pause[=true]]  是否在提交时暂停容器运行

# 可以看出新的image id和原来的不同
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
centos              test                061ebf4e339c        About a minute ago   418.9 MB
centos              7-x64               8f93c5d4058b        15 minutes ago       418.9 MB```

---

### 6. 镜像导出和导入
#### 1) 导出镜像文件
``` bash
# docker save -o centos7-x64.tar centos:7-x64
# ll -h centos7-x64.tar
-rw-r--r--. 1 root root 411M Dec 13 00:30 centos7-x64.tar
```

#### 2) 导入镜像文件
``` bash
docker load < centos7-x64.tar
# 这样就方便在不同机器之间转移docker镜像文件了```

---

### 7. 镜像上传
``` bash
# 创建个新tag（格式必须是你的username/anything）
docker tag centos:test user/test:first-image       # 这是错误的开端，格式不对
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              test                061ebf4e339c        20 minutes ago      418.9 MB
user/test           first-image         061ebf4e339c        20 minutes ago      418.9 MB
centos              7-x64               8f93c5d4058b        34 minutes ago      418.9 MB
# 起初创建的user/test,上传一直出错，然后尝试了换成我的docker hub的用户名，成功了，所以说，上传到docker hub
# 的镜像tag必须有一定格式，如下
docker push centos:test
You cannot push a "root" repository. Please rename your repository to <user>/<repo> (ex: xiaotuanyu/centos)

# 上传到docker hub（需要提前去注册帐号https://hub.docker.com/）
# 登录docker hub
docker login
Username: xiaotuanyu
Password:
Email: zhaopeiwu@outlook.com
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
# 其实直接docker push image会自动提示登录，但是我这边docker push的时候一直报错连接问题，所以提前尝试先登录

# 正确修改格式后上传镜像（网络不好需要尝试多次）
docker push xiaotuanyu/safari:centos7-x64
The push refers to a repository [docker.io/xiaotuanyu/safari] (len: 1)
8f93c5d4058b: Pushed
centos7-x64: digest: sha256:2ab250cab0d96f7d1563e5e73c47cf16b43d8b0bac65564e1c369884414e9208 size: 1206
```

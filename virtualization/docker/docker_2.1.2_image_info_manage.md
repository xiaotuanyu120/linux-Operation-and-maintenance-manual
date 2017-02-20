---
title: 2.1.2 镜像-镜像信息的查看与管理
date: 2015-12-12 16:30:00
categories: virtualization/docker
tags: [docker,image]
---
### DOCKER 2.1.2 镜像-镜像信息的查看与管理

---

### 1. 管理镜像信息
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

IMAGE:管理镜像
2015年12月12日 星期六
16:30
 
## 搜索镜像
# docker search centos
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
centos                            The official build of CentOS.                   1738      [OK]
jdeathe/centos-ssh                CentOS-6 6.7 x86_64 / EPEL/IUS Repos / Ope...   14                   [OK]
million12/centos-supervisor       Base CentOS-7 with supervisord launcher, h...   9                    [OK]
blalor/centos                     Bare-bones base CentOS 6.5 image                8                    [OK]
torusware/speedus-centos          Always updated official CentOS docker imag...   7                    [OK]
nimmis/java-centos                This is docker images of CentOS 7 with dif...   7                    [OK]
consol/centos-xfce-vnc            Centos container with "headless" VNC sessi...   3                    [OK]
nathonfowlie/centos-jre           Latest CentOS image with the JRE pre-insta...   3                    [OK]
jdeathe/centos-ssh-mysql          CentOS-6 6.7 x86_64 / MySQL.                    3                    [OK]
tcnksm/centos-node                Dockerfile for CentOS packaging node            2                    [OK]
consol/sakuli-centos-xfce         Sakuli end-2-end testing and monitoring co...   2                    [OK]
centos/mariadb55-centos7                                                          2                    [OK]
nickistre/centos-lamp             LAMP on centos setup                            2                    [OK]
layerworx/centos                  CentOS container with etcd, etcdctl, confd...   1                    [OK]
nathonfowlie/centos-jira          JIRA running on the latest version of CentOS    1                    [OK]
lighthopper/orientdb-centos       A Dockerfile for creating an OrientDB imag...   1                    [OK]
yajo/centos-epel                  CentOS with EPEL and fully updated              1                    [OK]
nickistre/centos-lamp-wordpress   LAMP on CentOS setups with wp-cli installed     1                    [OK]
lighthopper/openjdk-centos        A Dockerfile for creating an OpenJDK image...   0                    [OK]
jasonish/centos-suricata          Suricata base image based on CentOS 7.          0                    [OK]
dmglab/centos                     CentOS with superpowers!                        0                    [OK]
timhughes/centos                  Centos with systemd installed and running       0                    [OK]
jsmigel/centos-epel               Docker base image of CentOS w/ EPEL installed   0                    [OK]
pdericson/centos                  Docker image for CentOS                         0                    [OK]
blacklabelops/centos              Blacklabelops Centos 7.1.503 base image wi...   0                    [OK]
## 字段介绍：
NAME             名称
DESCRIPTION      描述
STARS            星星（好评度）
OFFICIAL         是否官方版本
AUTOMATED        是否自动创建
## 我们可以看到最高好评度的就是官方创建的official版本 
## 从仓库获取镜像
# docker pull registry.hub.docker.com/centos:latest
Pulling repository registry.hub.docker.com/centos
ce20c473cd8a: Download complete
47d44cb6f252: Download complete
168a69b62202: Download complete
812e9d9d677f: Download complete
4234bfdd88f8: Download complete
Status: Downloaded newer image for registry.hub.docker.com/centos:latest
registry.hub.docker.com/centos: this image was pulled from a legacy registry.  Important: This registry version will not be supported in future versions of docker.
## docker的image是分layer的，我们可以看到下载的时候，是分layer下载的，layer是由AUFS文件系统支撑的
## TAG可以指定centos版本
## docker pull 语法：
docker pull [参数] [仓库地址[:端口]/]名称[:TAG]
docker pull 名称 
## 查看及管理镜像信息
1、查看镜像信息
# docker images
REPOSITORY                       TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
registry.hub.docker.com/centos   latest              ce20c473cd8a        8 weeks ago         172.3 MB
## 字段详解：
REPOSITORY    仓库地址
TAG           标签
IMAGE ID      镜像ID
CREATED       创建时间
VIRTUAL SIZE  镜像大小
 
2、增加新TAG
# docker tag registry.hub.docker.com/centos:latest centos:latest
## docker tag 语法：
docker tag [-f|--force[=false]] [--help] IMAGE[:TAG] [REGISTRY_HOST/][USERNAME/]NAME[:TAG]
 
# docker images
REPOSITORY                       TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
registry.hub.docker.com/centos   latest              ce20c473cd8a        8 weeks ago         172.3 MB
centos                           latest              ce20c473cd8a        8 weeks ago         172.3 MB
## IMAGE ID相同，代表其实两个镜像是指向一个，只是相当于不通的快捷方式
 
3、查看镜像详细信息
# docker inspect ce20c473cd8a
[
{
    "Id": "ce20c473cd8ac1fab6601529ce6a075743f2cf7a8f4cfed2216f8cfcb53bfc4e",
    "RepoTags": [
        "registry.hub.docker.com/centos:latest",
        "centos:latest"
    ],
    "RepoDigests": [],
    "Parent": "4234bfdd88f8ed2bc4607bd2ebba2d41d61e2693ad0d184e7b05e1b57f8b8b33",
    "Comment": "",
    "Created": "2015-10-13T23:29:04.138328589Z",
    "Container": "eaa200e2e187340f0707085b9b4eab5658b13fd190af68c71a60f6283578172f",
    "ContainerConfig": {
        "Hostname": "7aa5783a47d5",
        "Domainname": "",
        "User": "",
        "AttachStdin": false,
        "AttachStdout": false,
        "AttachStderr": false,
        "Tty": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Env": null,
        "Cmd": [
            "/bin/sh",
            "-c",
            "#(nop) CMD [\"/bin/bash\"]"
        ],
        "Image": "4234bfdd88f8ed2bc4607bd2ebba2d41d61e2693ad0d184e7b05e1b57f8b8b33",
        "Volumes": null,
        "WorkingDir": "",
        "Entrypoint": null,
        "OnBuild": null,
        "Labels": {
            "License": "GPLv2",
            "Vendor": "CentOS"
        }
    },
    "DockerVersion": "1.8.2",
    "Author": "The CentOS Project \u003ccloud-ops@centos.org\u003e",
    "Config": {
        "Hostname": "7aa5783a47d5",
        "Domainname": "",
        "User": "",
        "AttachStdin": false,
        "AttachStdout": false,
        "AttachStderr": false,
        "Tty": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Env": null,
        "Cmd": [
            "/bin/bash"
        ],
        "Image": "4234bfdd88f8ed2bc4607bd2ebba2d41d61e2693ad0d184e7b05e1b57f8b8b33",
        "Volumes": null,
        "WorkingDir": "",
        "Entrypoint": null,
        "OnBuild": null,
        "Labels": {
            "License": "GPLv2",
            "Vendor": "CentOS"
        }
    },
    "Architecture": "amd64",
    "Os": "linux",
    "Size": 0,
    "VirtualSize": 172284372,
    "GraphDriver": {
        "Name": "devicemapper",
        "Data": {
            "DeviceId": "6",
            "DeviceName": "docker-253:0-35450395-ce20c473cd8ac1fab6601529ce6a075743f2cf7a8f4cfed2216f8cfcb53bfc4e",
            "DeviceSize": "107374182400"
        }
    }
}
] 
## 删除镜像
1、使用tag删除镜像
# docker rmi registry.hub.docker.com/centos:latest
Untagged: registry.hub.docker.com/centos:latest
# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              latest              ce20c473cd8a        8 weeks ago         172.3 MB
## docker在删除多tag镜像时，其实删除的只是一个镜像tag而已
## 但在镜像只有一个tag时，删除的可就是镜像本身了
## 删除镜像本身时，和下载镜像一样，也是分layer删除的
 
2、删除正在运行的镜像
## 运行一个容器
# docker run centos echo 'hello! my first docker!'
hello! my first docker!
## 查看运行的容器列表
# docker ps -a
CONTAINER ID IMAGE  COMMAND                CREATED        STATUS                    PORTS   NAMES
6d48ad2e17cf centos "echo 'hello! my firs" 21 seconds ago Exited (0) 20 seconds ago         goofy_bell
## 尝试删除镜像（会报错）
# docker rmi centos
Error response from daemon: conflict: unable to remove repository reference "centos" (must force) - container 6d48ad2e17cf is using its referenced image ce20c473cd8a
Error: failed to remove images: [centos]
 
## 此时我们可以用"docker rmi -f centos"来强制删除，但强烈不推荐
## 推荐先删除依赖该镜像的容器，然后再删除镜像
## 首先删除container id：6d48ad2e17cf（id可以缩写，只要保证唯一即可）
# docker rm 6d48
6d48
## 此时已经没有容器在运行
# docker ps -a
CONTAINER ID  IMAGE   COMMAND                  CREATED        STATUS                    PORTS   NAMES
## 使用镜像ID删除镜像
# docker rmi -f ce20c473cd8a
Untagged: centos:latest
Deleted: ce20c473cd8ac1fab6601529ce6a075743f2cf7a8f4cfed2216f8cfcb53bfc4e
Deleted: 4234bfdd88f8ed2bc4607bd2ebba2d41d61e2693ad0d184e7b05e1b57f8b8b33
Deleted: 812e9d9d677f15c39277b2edc8f9bc07354c899483409bb07d1c13c2b9c33ec8
Deleted: 168a69b6220279e6d5bd8dafd2edf71434a08e32b60a7060f7a705f64857169d
Deleted: 47d44cb6f252ea4f6aecf8a447972de5d9f9f2e2bec549a2f1d8f92557f4d05a 
## 创建镜像
1、基于本地模版导入
## 在openvz下载镜像模版（https://download.openvz.org/template/precreated/）
# wget https://download.openvz.org/template/precreated/centos-7-x86_64-minimal.tar.gz
 
## 基于下载的模版创建镜像
# cat centos-7-x86_64-minimal.tar.gz | docker import - centos:7-x64
8f93c5d4058b3343e745650d1eda471c18d83c3d2b9fd832b08376bd94a37d22
# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              7-x64               8f93c5d4058b        49 seconds ago      418.9 MB
## 镜像的大小貌似增加了不少，模版文件133M，制作的镜像已经是418.9M了
# ll -h centos-7-x86_64-minimal.tar.gz
-rw-r--r--. 1 root root 133M Nov  9 04:28 centos-7-x86_64-minimal.tar.gz
 
2、基于已有的镜像的容器创建
## 运行一个容器，做出改变，然后退出
# docker run -ti centos:7-x64 /bin/bash
[root@8dd4c7e651b0 /]# touch test
[root@8dd4c7e651b0 /]# exit
## 主机名就是该container的id
# docker ps -a | cut -d ' ' -f 1
CONTAINER
8dd4c7e651b0
 
## 基于容器id创建新的镜像
# docker commit -m 'add test file' -a 'zack' 8dd4c7e651b0 centos:test
061ebf4e339cbf0708d812a87ecc04e094c9aebd7bb4892414ac64971a34ac05
## docker commit 语法
docker  commit [option] CONTAINER [REPOSITORY[:TAG]]
[-a|--author[=AUTHOR]] 作者信息
[-m|--message[=MESSAGE]]  提交时附加信息
[-p|--pause[=true]]  是否在提交时暂停容器运行
 
## 可以看出新的image id和原来的不同
# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
centos              test                061ebf4e339c        About a minute ago   418.9 MB
centos              7-x64               8f93c5d4058b        15 minutes ago       418.9 MB 
## 镜像导出和导入
## 导出镜像文件
# docker save -o centos7-x64.tar centos:7-x64
# ll -h centos7-x64.tar
-rw-r--r--. 1 root root 411M Dec 13 00:30 centos7-x64.tar
 
## 导入镜像文件
# docker load < centos7-x64.tar
 
## 这样就方便在不同机器之间转移docker镜像文件了 
## 镜像上传
## 创建个新tag（格式必须是你的username/anything）
# docker tag centos:test user/test:first-image       # 这是错误的开端，格式不对
# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
centos              test                061ebf4e339c        20 minutes ago      418.9 MB
user/test           first-image         061ebf4e339c        20 minutes ago      418.9 MB
centos              7-x64               8f93c5d4058b        34 minutes ago      418.9 MB
## 起初创建的user/test,上传一直出错，然后尝试了换成我的docker hub的用户名，成功了，所以说，上传到docker hub
## 的镜像tag必须有一定格式，如下
# docker push centos:test
You cannot push a "root" repository. Please rename your repository to <user>/<repo> (ex: xiaotuanyu/centos)
 
## 上传到docker hub（需要提前去注册帐号https://hub.docker.com/）
## 登录docker hub
# docker login
Username: xiaotuanyu
Password:
Email: zhaopeiwu@outlook.com
WARNING: login credentials saved in /root/.docker/config.json
Login Succeeded
## 其实直接docker push image会自动提示登录，但是我这边docker push的时候一直报错连接问题，所以提前尝试先登录
 
## 正确修改格式后上传镜像（网络不好需要尝试多次）
# docker push xiaotuanyu/safari:centos7-x64
The push refers to a repository [docker.io/xiaotuanyu/safari] (len: 1)
8f93c5d4058b: Pushed
centos7-x64: digest: sha256:2ab250cab0d96f7d1563e5e73c47cf16b43d8b0bac65564e1c369884414e9208 size: 1206
  

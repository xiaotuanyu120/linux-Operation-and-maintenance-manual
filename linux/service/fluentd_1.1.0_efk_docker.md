---
title: fluentd 1.1.0 efk(elasticsearch+kibana) + docker
date: 2017-08-08 09:19:00
categories: linux/service
tags: [ffmpeg]
---
### fluentd 1.1.0 efk(elasticsearch+kibana) + docker

---

### 0. 安装docker
安装可参照[docker yum安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.0_installation_centos7.html)和[docker 二进制安装](http://linux.xiao5tech.com/virtualization/docker/docker_1.1.1_installation_binary.html)，也可以使用发行版自己安装的docker版本(只要不是太旧)。
> 二进制安装方法里面开启了selinux，这里需要关闭

---

### 1. 启动 fluentd + elasticsearch + kibana 容器
``` bash
# 创建fluentd编译目录及配置目录
mkdir -p fluentd/conf

# 创建fluentd Dockerfile
cat > fluentd/Dockerfile << EOF
FROM fluent/fluentd:v0.12-debian
RUN ["gem", "install", "fluent-plugin-elasticsearch", "--no-rdoc", "--no-ri", "--version", "1.9.2"]
EOF

# 创建fluentd配置文件
cat > fluentd/conf/fluent.conf << EOF
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>
<match *.**>
  @type copy
  <store>
    @type elasticsearch
    host elasticsearch
    port 9200
    logstash_format true
    logstash_prefix fluentd
    logstash_dateformat %Y%m%d
    include_tag_key true
    type_name access_log
    tag_key @log_name
    flush_interval 1s
  </store>
  <store>
    @type stdout
  </store>
</match>
EOF
# 当使用out_copy时，可指定多个输出源
# logstash_format为true时，意味着kibana可以搜索使用es中的数据

# 创建docker-compose.yml文件，编译新的fluentd镜像，其他两个使用官方镜像
cat > docker-compose.yml << EOF
version: '2'
services:
  fluentd:
    build: ./fluentd
    volumes:
      - ./fluentd/conf:/fluentd/etc
    links:
      - "elasticsearch"
    ports:
      - "24224:24224"
      - "24224:24224/udp"

  elasticsearch:
    image: elasticsearch
    expose:
      - 9200
    ports:
      - "9200:9200"

  kibana:
    image: kibana
    links:
      - "elasticsearch"
    ports:
      - "5601:5601"
EOF

docker-compose up -d
```
> 此处不过多介绍elasticsearch和kibana，感兴趣的参照以下文档
- [elasticsearch 6.0 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html)
- [kibana 6.0 官方文档](https://www.elastic.co/guide/en/kibana/6.0/setup.html)

---

### 2. 启动fluentd采集tomcat日志
``` bash
mkdir -p fluentd/conf
cat > fluentd/Dockerfile << EOF
FROM fluent/fluentd:v0.12-debian
RUN ["gem", "install", "fluent-plugin-elasticsearch", "--no-rdoc", "--no-ri", "--version", "1.9.2"]
EOF

cat > fluentd/conf/fluent.conf << EOF
<source>
  @type tail
  path /usr/local/tomcat/logs/catalina.out
  pos_file /usr/local/tomcat/logs/catalina.out.pos
  tag tomcat.*
  format none
</source>
<match tomcat.**>
  @type forward
  <server>
    host 113.10.193.68
    port 24224
  </server>
</match>
EOF

# 创建docker-compose.yml文件，启动fluentd客户端
cat > docker-compose.yml << EOF
version: '2'
services:
  fluentd:
    image: fluent/fluentd
    volumes:
      - ./fluentd/conf:/fluentd/etc
      - /usr/local/tomcat:/usr/local/tomcat
    ports:
      - "24224:24224"
      - "24224:24224/udp"
EOF

docker-compose up -d
```
> 当使用tail时，tag配置成tomcat.\*，其中\*会自动将path变量的内容扩展到tag中，并且使用“.”代替“/”，此处实际tag为tomcat.usr.local.tomcat.logs.catalina.out

> 官方文档
- [type tail文档](https://docs.fluentd.org/v0.12/articles/in_tail)
- [format multiline文档](https://docs.fluentd.org/v0.12/articles/parser_multiline)

精品文章：
- [Tomcat容器日志收集方案fluentd+elasticsearch+kilbana](http://270142877.blog.51cto.com/12869137/1951159)

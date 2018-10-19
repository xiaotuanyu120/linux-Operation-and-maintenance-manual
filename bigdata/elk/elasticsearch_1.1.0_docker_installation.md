---
title: elasticsearch 1.1.0: docker installation
date: 2018-07-14 11:39:00
categories: bigdata/elk
tags: [elk, elasticsearch]
---
### elasticsearch 1.1.0: docker installation

---

### 1. elasticsearch docker-compose安装
docker-compose.yml
``` yaml
version: '2.2'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.3.1
    container_name: elasticsearch
    environment:
      - cluster.name=docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata1:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - esnet
  elasticsearch2:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.3.1
    container_name: elasticsearch2
    environment:
      - cluster.name=docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "discovery.zen.ping.unicast.hosts=elasticsearch"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata2:/usr/share/elasticsearch/data
    networks:
      - esnet

volumes:
  esdata1:
    driver: local
  esdata2:
    driver: local

networks:
  esnet:
```
启动elasticsearch
``` bash
docker-compose up -d
```
> [elastic官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/6.3/docker.html)

### 2. 检查elastic集群状态
``` bash
curl http://127.0.0.1:9200/_cat/health
1531540102 03:48:22 docker-cluster green 2 2 0 0 0 0 0 0 - 100.0%
```

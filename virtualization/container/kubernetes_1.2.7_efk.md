---
title: kubernetes 1.2.7 EFK
date: 2018-01-30 14:51:00
categories: virtualization/container
tags: [container,kubernetes,filebeat]
---
###  kubernetes 1.2.7 EFK

---

### 0. 环境
1. kubernetes 集群
2. kubectl 客户端

elasticsearch部署分为了三个角色：
- master节点，仅用于集群管理
- client节点，用于客户端使用，提供api
- data节点，用于储存和检索数据

[elasticsearch + k8s](https://github.com/kubernetes/examples/tree/master/staging/elasticsearch/production_cluster)  
[elasticsearch doc for filebeat](https://www.elastic.co/guide/en/beats/filebeat/master/running-on-kubernetes.html)

### 1. 安装elasticsearch
``` bash
echo 'apiVersion: v1
kind: ServiceAccount
metadata:
  name: elasticsearch' > service-account.yaml

echo 'apiVersion: v1
kind: Service
metadata:
  name: elasticsearch-discovery
  labels:
    component: elasticsearch
    role: master
spec:
  selector:
    component: elasticsearch
    role: master
  ports:
  - name: transport
    port: 9300
    protocol: TCP' > es-discovery-svc.yaml

echo 'apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  labels:
    component: elasticsearch
    role: client
spec:
  #type: LoadBalancer
  selector:
    component: elasticsearch
    role: client
  ports:
  - name: http
    port: 9200
    protocol: TCP' > es-svc.yaml

echo 'apiVersion: v1
kind: ReplicationController
metadata:
  name: es-master
  labels:
    component: elasticsearch
    role: master
spec:
  replicas: 1
  template:
    metadata:
      labels:
        component: elasticsearch
        role: master
    spec:
      serviceAccount: elasticsearch
      containers:
      - name: es-master
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        image: quay.io/pires/docker-elasticsearch-kubernetes:1.7.1-4
        env:
        - name: KUBERNETES_CA_CERTIFICATE_FILE
          value: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: "CLUSTER_NAME"
          value: "myesdb"
        - name: NODE_MASTER
          value: "true"
        - name: NODE_DATA
          value: "false"
        - name: HTTP_ENABLE
          value: "false"
        ports:
        - containerPort: 9300
          name: transport
          protocol: TCP
        volumeMounts:
        - mountPath: /data
          name: storage
      volumes:
      - name: storage
        emptyDir: {}' > es-master-rc.yaml

kubectl apply -f service-account.yaml
kubectl apply -f es-discovery-svc.yaml
kubectl apply -f es-svc.yaml
kubectl apply -f es-master-rc.yaml

# 等待es-master正常运行后执行
echo 'apiVersion: v1
kind: ReplicationController
metadata:
  name: es-client
  labels:
    component: elasticsearch
    role: client
spec:
  replicas: 1
  template:
    metadata:
      labels:
        component: elasticsearch
        role: client
    spec:
      serviceAccount: elasticsearch
      containers:
      - name: es-client
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        image: quay.io/pires/docker-elasticsearch-kubernetes:1.7.1-4
        env:
        - name: KUBERNETES_CA_CERTIFICATE_FILE
          value: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: "CLUSTER_NAME"
          value: "myesdb"
        - name: NODE_MASTER
          value: "false"
        - name: NODE_DATA
          value: "false"
        - name: HTTP_ENABLE
          value: "true"
        ports:
        - containerPort: 9200
          name: http
          protocol: TCP
        - containerPort: 9300
          name: transport
          protocol: TCP
        volumeMounts:
        - mountPath: /data
          name: storage
      volumes:
      - name: storage
        emptyDir: {}' > es-client-rc.yaml

kubectl apply -f es-client-rc.yaml

# 等待es-client正常运行后执行
echo 'apiVersion: v1
kind: ReplicationController
metadata:
  name: es-data
  labels:
    component: elasticsearch
    role: data
spec:
  replicas: 1
  template:
    metadata:
      labels:
        component: elasticsearch
        role: data
    spec:
      serviceAccount: elasticsearch
      containers:
      - name: es-data
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        image: quay.io/pires/docker-elasticsearch-kubernetes:1.7.1-4
        env:
        - name: KUBERNETES_CA_CERTIFICATE_FILE
          value: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: "CLUSTER_NAME"
          value: "myesdb"
        - name: NODE_MASTER
          value: "false"
        - name: HTTP_ENABLE
          value: "false"
        ports:
        - containerPort: 9300
          name: transport
          protocol: TCP
        volumeMounts:
        - mountPath: /data
          name: storage
      volumes:
      - name: storage
        emptyDir: {}' > es-data-rc.yaml

kubectl apply -f es-data-rc.yaml
```

### 2. 验证集群状态
``` bash

```

---
title: kubernetes 1.3.0 run-stateless-application-deployment
date: 2018-01-15 13:07:00
categories: virtualization/container
tags: [container,kubernetes]
---
### kubernetes 1.3.0 run-stateless-application-deployment

---

### 0. Objectives
- deployment(nginx) 创建；
- deployment信息查看(kubectl)；
- deployment 更新。

> 参考链接：[kubenetes 官方文档](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/)

> 执行以下操作之前，可以参照文档先创建一个kubenetes cluster

### 1. Creating and exploring an nginx deployment
`deployment.yaml`
``` yaml
apiVersion: apps/v1beta2 # for versions before 1.8.0 use apps/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # tells deployment to run 2 pods matching the template
  template: # create pods using pod definition in this template
    metadata:
      # unlike pod-nginx.yaml, the name is not included in the meta data as a unique name is
      # generated from the deployment name
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

#### 1) 创建deploment
``` bash
kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment.yaml
```

#### 2) 查看deploment
``` bash
kubectl describe deployment nginx-deployment
```
输出结果
```
Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Mon, 15 Jan 2018 06:19:34 +0000
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=1
                        kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"apps/v1beta2","kind":"Deployment","metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},"spec":{"replicas":2,"se...
Selector:               app=nginx
Replicas:               2 desired | 2 updated | 2 total | 0 available | 2 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.7.9
    Port:         80/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      False   MinimumReplicasUnavailable
  Progressing    True    ReplicaSetUpdated
OldReplicaSets:  <none>
NewReplicaSet:   nginx-deployment-6c54bd5869 (2/2 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  15m   deployment-controller  Scaled up replica set nginx-deployment-6c54bd5869 to 2
```

#### 3) 查看pods
``` bash
kubectl get pods -l app=nginx
```
输出结果
```
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-6c54bd5869-f56kg   1/1       Running   0          16m
nginx-deployment-6c54bd5869-p79hd   1/1       Running   0          16m
```

#### 4) 查看pod详细信息
``` bash
kubectl describe pod nginx-deployment-6c54bd5869-f56kg
```
输出结果
```
Name:           nginx-deployment-6c54bd5869-f56kg
Namespace:      default
Node:           node01/10.0.2.15
Start Time:     Mon, 15 Jan 2018 07:00:55 +0000
Labels:         app=nginx
                pod-template-hash=2710681425
Annotations:    <none>
Status:         Running
IP:             10.5.52.3
Controlled By:  ReplicaSet/nginx-deployment-6c54bd5869
Containers:
  nginx:
    Container ID:   docker://cf62a29a203a6870fa8a8fc0610835cb16e53bd31a30d2c75a734b59ced355b5
    Image:          nginx:1.7.9
    Image ID:       docker-pullable://nginx@sha256:e3456c851a152494c3e4ff5fcc26f240206abac0c9d794affb40e0714846c451
    Port:           80/TCP
    State:          Running
      Started:      Mon, 15 Jan 2018 07:02:32 +0000
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
Conditions:
  Type           Status
  Initialized    True
  Ready          True
  PodScheduled   True
Volumes:         <none>
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     <none>
Events:
  Type     Reason             Age                 From               Message
  ----     ------             ----                ----               -------
  Warning  FailedScheduling   26m (x26 over 33m)  default-scheduler  0/3 nodes are available: 3 NodeNotReady.
  Normal   Scheduled          22m                 default-scheduler  Successfully assigned nginx-deployment-6c54bd5869-f56kg to node01
  Normal   Pulling            22m                 kubelet, node01    pulling image "nginx:1.7.9"
  Normal   Pulled             21m                 kubelet, node01    Successfully pulled image "nginx:1.7.9"
  Normal   Created            21m                 kubelet, node01    Created container
  Normal   Started            21m                 kubelet, node01    Started container
  Warning  MissingClusterDNS  1m (x20 over 22m)   kubelet, node01    pod: "nginx-deployment-6c54bd5869-f56kg_default(65c64d74-f9c0-11e7-a243-525400cae48b)". kubelet does not have ClusterDNS IP configured and cannot create Pod using "ClusterFirst" policy. Falling back to "Default" policy.
```

### 2. Updating the deployment
升级nginx到1.8,`deployment-update.yaml`
``` yaml
apiVersion: apps/v1beta2 # for versions before 1.8.0 use apps/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.8 # Update the version of nginx from 1.7.9 to 1.8
        ports:
        - containerPort: 80
```

#### 1) apply新的deploment
``` bash
kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment-update.yaml
```

#### 2) 查看pod更新过程
``` bash
kubectl get pods -l app=nginx
```
输出结果
```
NAME                                READY     STATUS              RESTARTS   AGE
nginx-deployment-6c54bd5869-f56kg   1/1       Running             0          37m
nginx-deployment-6c54bd5869-p79hd   1/1       Running             0          37m
nginx-deployment-7694d679d9-z5fdf   0/1       ContainerCreating   0          40s
```
查看正在创建的pod的状态
``` bash
kubectl describe pod nginx-deployment-7694d679d9-z5fdf
```
输出结果
```
Name:           nginx-deployment-7694d679d9-z5fdf
Namespace:      default
Node:           node03/10.0.2.15
Start Time:     Mon, 15 Jan 2018 07:27:08 +0000
Labels:         app=nginx
                pod-template-hash=3250823585
Annotations:    <none>
Status:         Pending
IP:             
Controlled By:  ReplicaSet/nginx-deployment-7694d679d9
Containers:
  nginx:
    Container ID:   
    Image:          nginx:1.8
    Image ID:       
    Port:           80/TCP
    State:          Waiting
      Reason:       ContainerCreating
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
Conditions:
  Type           Status
  Initialized    True
  Ready          False
  PodScheduled   True
Volumes:         <none>
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     <none>
Events:
  Type     Reason             Age                From               Message
  ----     ------             ----               ----               -------
  Normal   Scheduled          53s                default-scheduler  Successfully assigned nginx-deployment-7694d679d9-z5fdf to node03
  Warning  MissingClusterDNS  51s (x2 over 53s)  kubelet, node03    pod: "nginx-deployment-7694d679d9-z5fdf_default(7e34acdf-f9c5-11e7-a243-525400cae48b)". kubelet does not have ClusterDNS IP configured and cannot create Pod using "ClusterFirst" policy. Falling back to "Default" policy.
  Normal   Pulling            51s                kubelet, node03    pulling image "nginx:1.8"
```
> 正在pull nginx1.8的镜像

k8s已经创建了新的pod，杀死了一个pod
``` bash
kubectl get pods -l app=nginx
```
输出结果
```
NAME                                READY     STATUS              RESTARTS   AGE
nginx-deployment-6c54bd5869-f56kg   1/1       Running             0          40m
nginx-deployment-7694d679d9-4465x   0/1       ContainerCreating   0          1m
nginx-deployment-7694d679d9-z5fdf   1/1       Running             0          3m
```
最终会创建两个新的pod，所有旧的pod被杀死
``` bash
kubectl get pods -l app=nginx
```
```
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-7694d679d9-4465x   1/1       Running   0          2m
nginx-deployment-7694d679d9-z5fdf   1/1       Running   0          5m
```

查看新的deployment
```
kubectl describe deployment nginx-deployment
```
输出结果中能很清晰的看到更新过程
```
Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Mon, 15 Jan 2018 06:50:37 +0000
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=2
                        kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"apps/v1beta2","kind":"Deployment","metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},"spec":{"replicas":2,"se...
Selector:               app=nginx
Replicas:               2 desired | 2 updated | 2 total | 2 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.8
    Port:         80/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-deployment-7694d679d9 (2/2 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  42m   deployment-controller  Scaled up replica set nginx-deployment-6c54bd5869 to 2
  Normal  ScalingReplicaSet  6m    deployment-controller  Scaled up replica set nginx-deployment-7694d679d9 to 1
  Normal  ScalingReplicaSet  3m    deployment-controller  Scaled down replica set nginx-deployment-6c54bd5869 to 1
  Normal  ScalingReplicaSet  3m    deployment-controller  Scaled up replica set nginx-deployment-7694d679d9 to 2
  Normal  ScalingReplicaSet  55s   deployment-controller  Scaled down replica set nginx-deployment-6c54bd5869 to 0
```

### 3. Scaling the application by increasing the replica count
修改replicas为4
``` yaml
apiVersion: apps/v1beta2 # for versions before 1.8.0 use apps/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 4 # Update the replicas from 2 to 4
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.8
        ports:
        - containerPort: 80
```
#### 1) apply新的deploment
``` bash
kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment-scale.yaml
```
#### 2) 查看更新结果
``` bash
kubectl get pods -l app=nginx
```
输出结果
```
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-7694d679d9-4465x   1/1       Running   0          10m
nginx-deployment-7694d679d9-ncg7f   1/1       Running   0          2m
nginx-deployment-7694d679d9-skxr9   1/1       Running   0          2m
nginx-deployment-7694d679d9-z5fdf   1/1       Running   0          13m
```

### 4. Deleting a deployment
``` bash
kubectl delete deployment nginx-deployment
```

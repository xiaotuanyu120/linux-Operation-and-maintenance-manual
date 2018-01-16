---
title: kubernetes 1.3.1 guestbook(php frontend with redis cluster)
date: 2018-01-16 16:34:00
categories: virtualization/container
tags: [container,kubernetes]
---
### kubernetes 1.3.1 guestbook(php frontend with redis cluster)

---

### 0. Objectives
- 启动redis master
- 启动redis slave
- 启动guestbook前端
- 公开并查看前端service
- 清除工作

> 参考链接：[kubenetes 官方文档](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)

> 执行以下操作之前，可以参照文档先创建一个kubenetes cluster

### 1. Start up the Redis Master
#### 1) Creating the Redis Master Deployment
`redis-master-deployment.yaml`
``` yaml
apiVersion: apps/v1beta2 # for versions before 1.8.0 use apps/v1beta1
kind: Deployment
metadata:
  name: redis-master
spec:
  selector:
    matchLabels:
      app: redis
      role: master
      tier: backend
  replicas: 1
  template:
    metadata:
      labels:
        app: redis
        role: master
        tier: backend
    spec:
      containers:
      - name: master
        image: k8s.gcr.io/redis:e2e  # or just image: redis
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 6379
```
> 通过selector中的mathLabels和pod的labels匹配联系在一起

``` bash
kubectl apply -f redis-master-deployment.yaml

kubectl get pods
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-585798d8ff-lqw5t   1/1       Running   0          19m

kubectl logs -f redis-master-585798d8ff-lqw5t
```
#### 2) Creating the Redis Master Service
`redis-master-service.yaml`
``` yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-master
  labels:
    app: redis
    role: master
    tier: backend
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
    role: master
    tier: backend
```
> 通过selector和pod的labels匹配联系在一起

``` bash
kubectl apply -f redis-master-service.yaml

kubectl get service
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes     ClusterIP   10.254.0.1       <none>        443/TCP    1d
redis-master   ClusterIP   10.254.184.211   <none>        6379/TCP   6s
```

### 2. Start up the Redis Slaves
创建Redis slave来组成redis集群  
#### 1) Creating the Redis Slave Deployment
`redis-slave-deployment.yaml`
``` yaml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: redis-slave
spec:
  selector:
    matchLabels:
      app: redis
      role: slave
      tier: backend
  replicas: 2
  template:
    metadata:
      labels:
        app: redis
        role: slave
        tier: backend
    spec:
      containers:
      - name: slave
        image: gcr.io/google_samples/gb-redisslave:v1
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
        - name: GET_HOSTS_FROM
          value: env
        ports:
        - containerPort: 6379
```
> Using `GET_HOSTS_FROM=dns` requires your cluster to  
provide a dns service. As of Kubernetes 1.3, DNS is a built-in  
service launched automatically. However, if the cluster you are using  
does not have a built-in DNS service, you can instead  
instead access an environment variable to find the master  
service's host. To do so, comment out the 'value: dns' line above, and  
uncomment the line below:  
`value: env`

> redis slave 是通过下面的命令来和redis-master这个service建立的连接
``` bash
if [[ ${GET_HOSTS_FROM:-dns} == "env" ]]; then
  redis-server --slaveof ${REDIS_MASTER_SERVICE_HOST} 6379
else
  redis-server --slaveof redis-master 6379
fi
```

``` bash
kubectl apply -f redis-slave-deployment.yaml

kubectl get pods
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-585798d8ff-lqw5t   1/1       Running   0          35m
redis-slave-865486c9df-254jt    1/1       Running   0          6m
redis-slave-865486c9df-qczr9    1/1       Running   0          6m
```

#### 2) Creating the Redis Slave Service
`redis-slave-service.yaml`
``` yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-slave
  labels:
    app: redis
    role: slave
    tier: backend
spec:
  ports:
  - port: 6379
  selector:
    app: redis
    role: slave
    tier: backend
```

``` bash
kubectl apply -f redis-slave-service.yaml

kubectl get services
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes     ClusterIP   10.254.0.1       <none>        443/TCP    1d
redis-master   ClusterIP   10.254.184.211   <none>        6379/TCP   18m
redis-slave    ClusterIP   10.254.251.186   <none>        6379/TCP   5s
```

### 3. Set up and Expose the Guestbook Frontend
guestbook应用是用php编写的一个处理http请求的web前端程序，调用redis-master（写）和redis-slave（读）。
#### 1) Creating the Guestbook Frontend Deployment
`frontend-deployment.yaml`
``` yaml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: frontend
spec:
  selector:
    matchLabels:
      app: guestbook
      tier: frontend
  replicas: 3
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google-samples/gb-frontend:v4
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
        - name: GET_HOSTS_FROM
          value: env
        ports:
        - containerPort: 80
```
> Using `GET_HOSTS_FROM=dns` requires your cluster to  
provide a dns service. As of Kubernetes 1.3, DNS is a built-in  
service launched automatically. However, if the cluster you are using  
does not have a built-in DNS service, you can instead  
instead access an environment variable to find the master  
service's host. To do so, comment out the 'value: dns' line above, and  
uncomment the line below:  
`value: env`

``` bash
kubectl apply -f frontend-deployment.yaml

kubectl get pods -l app=guestbook -l tier=frontend
NAME                        READY     STATUS    RESTARTS   AGE
frontend-656ff8f48f-4zt9q   1/1       Running   0          18m
frontend-656ff8f48f-gfz5w   1/1       Running   0          18m
frontend-656ff8f48f-qvhwk   1/1       Running   0          18m
```

#### 2) Creating the Frontend Service
`frontend-service.yaml`
``` yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  type: NodePort
  ports:
  - port: 80
  selector:
    app: guestbook
    tier: frontend
```
> comment or delete `type: NodePort` if you want to use a LoadBalancer  
if your cluster supports it, uncomment the following to automatically create  
an external load-balanced IP for the frontend service.  
`type: LoadBalancer`

> frontend是通过`guestbook.php`中的`$host = 'redis-slave'`和`$host = 'redis-master'`来和redis建立的联系

``` bash
kubectl apply -f frontend-service.yaml

kubectl get services
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
frontend       NodePort    10.254.217.166   <none>        80:40751/TCP   5s
kubernetes     ClusterIP   10.254.0.1       <none>        443/TCP        1d
redis-master   ClusterIP   10.254.184.211   <none>        6379/TCP       46m
redis-slave    ClusterIP   10.254.251.186   <none>        6379/TCP       28m
```

#### 3) Viewing the Frontend Service via NodePort
``` bash
kubectl get services frontend
NAME       TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
frontend   NodePort   10.254.217.166   <none>        80:40751/TCP   4m
```
> 因为我们是使用的NodePort方式转发的service，所以我们只需要在浏览器中访问cluster中的任意一个node ip:40751就可以了

### 4. Cleaning up
``` bash
kubectl delete deployment -l app=redis
kubectl delete service -l app=redis
kubectl delete deployment -l app=guestbook
kubectl delete service -l app=guestbook
```

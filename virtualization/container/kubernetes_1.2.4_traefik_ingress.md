---
title: kubernetes 1.2.4 traefik ingress
date: 2018-01-29 16:55:00
categories: virtualization/container
tags: [container,kubernetes,traefik,ingress]
---
### kubernetes 1.2.4 traefik ingress

---

### 0. 环境
1. kubernetes 集群
2. kubectl 客户端
[traefik 官方文档](http://docs.traefik.io/user-guide/kubernetes/)

使用ClusterRoleBinding来限制traefik权限
``` bash
echo '---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: traefik-ingress-controller
rules:
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
    resources:
      - ingresses
    verbs:
      - get
      - list
      - watch
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: traefik-ingress-controller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: traefik-ingress-controller
subjects:
- kind: ServiceAccount
  name: traefik-ingress-controller
  namespace: kube-system' > traefik-rbac.yaml

kubectl apply -f traefik-rbac.yaml
```

### 1. 使用DaemonSet部署traefik
``` bash
echo '---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
---
kind: DaemonSet
apiVersion: extensions/v1beta1
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
  labels:
    k8s-app: traefik-ingress-lb
spec:
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-lb
        name: traefik-ingress-lb
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      hostNetwork: true
      containers:
      - image: traefik
        name: traefik-ingress-lb
        ports:
        - name: http
          containerPort: 80
          hostPort: 80
        - name: admin
          containerPort: 8080
        securityContext:
          privileged: true
        args:
        - -d
        - --api
        - --kubernetes
---
kind: Service
apiVersion: v1
metadata:
  name: traefik-ingress-service
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
    - protocol: TCP
      port: 80
      name: web
    - protocol: TCP
      port: 8080
      name: admin
  type: NodePort' > traefik-ds.yaml

kubectl apply -f traefik-ds.yaml
```

### 2. 查看traefik pods
``` bash
kubectl --namespace=kube-system get pods
```

### 3. 创建ingress
#### 1) ingress ui
``` bash
echo 'apiVersion: v1
kind: Service
metadata:
  name: traefik-web-ui
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: traefik-web-ui
  namespace: kube-system
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: ui.example.com
    http:
      paths:
      - backend:
            serviceName: traefik-web-ui
            servicePort: 80' > traefik-ui.yaml

kubectl apply -f traefik-ui.yaml
```
> 然后我们浏览器ui.example.com测试(不是真实域名的话，需要本地host解析到任意node节点的ip上)

#### 2) 测试ingress反向代理服务
假设我们已经启动了另外一个service，我们需要负载均衡流量到该service上
``` bash
echo 'apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: cheese
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  rules:
  - host: traefik-test.com
    http:
      paths:
      - path: /
        backend:
          serviceName: test-service
          servicePort: 8080' > traefik-ingress.yaml

kubectl apply -f traefik-ingress.yaml
```

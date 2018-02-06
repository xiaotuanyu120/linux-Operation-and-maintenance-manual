---
title: kubernetes 1.2.5 ingress ssl
date: 2018-01-30 15:22:00
categories: virtualization/container
tags: [container,kubernetes,ingress,ssl]
---
### kubernetes 1.2.5 ingress ssl

---

### 0. 环境
1. kubernetes 集群
2. kubectl 客户端

增加ssl的重点在于
- 自定义config文件中定义证书文件
- mount证书和配置文件到pod中
- ingress规则那边增加secret证书到tls
[traefik 官方文档](https://kubernetes.io/docs/concepts/services-networking/ingress/)

### 1. 准备secret
``` bash
# 将tls.crt 和 tls.key 上传到服务器上
ls cert/tls.*
cert/tls.crt  cert/tls.key

# 创建secret
kubectl create secret --namespace=kube-system tls dc-chain-secret --key ./cert/tls.key --cert ./cert/tls.crt
```
> 注意命名空间要设定为kube-system，不然traefik在kube-system命名空间那边找不到secret

### 2. 准备rbac
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

### 3. 准备 configmap
``` bash
echo 'apiVersion: v1
kind: ConfigMap
metadata:
  name: dc-chain-traefik-conf
  namespace: kube-system
data:
  traefik.toml: |
    # traefik config
    logLevel = "INFO"
    defaultEntryPoints = ["http", "https"]

    [entryPoints]
      [entryPoints.http]
      address = ":80"
        [entryPoints.http.redirect]
          entryPoint = "https"
      [entryPoints.https]
      address = ":443"
        [entryPoints.https.tls]
          [[entryPoints.https.tls.certificates]]
          CertFile = "/ssl/example.com/tls.crt"
          KeyFile = "/ssl/example.com/tls.key"

    [web]
    address = ":8080"

    [kubernetes]
    namespaces = [ "default", "kube-system" ]' > traefik-configmap.yaml

kubectl apply -f traefik-configmap.yaml
```

### 3. 准备 deployment 和 service
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
      volumes:
        - name: dc-chain-secret
          secret:
            secretName: dc-chain-secret
        - name: dc-chain-traefik-conf
          configMap:
            name: dc-chain-traefik-conf
      containers:
      - image: traefik
        name: traefik-ingress-lb
        volumeMounts:
          - mountPath: /config
            name: dc-chain-traefik-conf
          - mountPath: /ssl/example.com
            name: dc-chain-secret
        ports:
        - name: http
          containerPort: 80
          hostPort: 80
        - name: admin
          containerPort: 8080
        - name: https
          containerPort: 443
          hostPort: 443
        securityContext:
          privileged: true
        args:
        - --configfile=/config/traefik.toml
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
      name: http
    - protocol: TCP
      port: 443
      name: https
    - protocol: TCP
      port: 8080
      name: admin
  type: NodePort' > traefik-ds.yaml

kubectl apply -f traefik-ds.yaml
```

### 4. 准备 ingress
``` bash
echo 'apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: dc-chain-service
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  tls:
    - secretName: dc-chain-secret
      hosts:
        - example.com
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: dc-chain-service
          servicePort: 8080' > traefik-ingress.yaml

kubectl apply -f traefik-ingress.yaml
```

---
title: node.js: 4.0 npm install error
date: 2017-12-29 11:16:00
categories: javascript/node.js
tags: [node.js]
---
### node.js: 4.0 npm install error

---

### 1. npm install Error
``` bash
npm install
...
gyp WARN EACCES attempting to reinstall using temporary dev dir "/root/fabric-samples/fabcar/node_modules/pkcs11js/.node-gyp"
gyp WARN EACCES user "root" does not have permission to access the dev dir "/root/fabric-samples/fabcar/node_modules/pkcs11js/.node-gyp/6.12.2"
...
```

解决方法：
``` bash
npm install --unsafe-perm --verbose
```
> [github issue 链接](https://github.com/nodejs/node-gyp/issues/454)

---
title: log: 2.0 server
date: 2016-12-07 00:05:00
categories: web/node.js
tags: [node.js,socket.io,express,jquery,redis]
---
### log 2.0 server

---

### 1. 服务端需要完成的功能
- 使用express和http模块，启动http服务器
- 使用socket.io模块，绑定websocket实例到http服务器
- 使用redis模块，链接redis客户端到redis服务器
 - redis订阅'log'频道，其实此处应该传递参数'c'，为了测试方便，暂时放下
 - redis使用socket.emit方法广播接收到的message

---

### 2. 服务端文件内容
`index.js`
``` javascript
// initial express and create an instance named "app"
var express = require('express')
var app = express();

// initial a http server with "app"
var http = require('http').Server(app);

// initial socket.io and bind socket.io to http server
var io = require('socket.io')(http);

// initial redis and connect to redis server
var redis = require('redis');
var redisclient = redis.createClient("redis://127.0.0.1:6379");

// set website static dir
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// redis subscribe
var sub = function(c) {
  var c = c || 'logchannel';
  redisclient.subscribe(c, function(e) {
    console.log('subscribe channel : ' + c);
  });
}
sub();

io.on('connection', function(socket){
  redisclient.on('message', function(error, msg) {
    socket.emit('log', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
```

---
title: log: 3.0 client
date: 2016-12-07 00:19:00
categories: web/node.js
tags: [node.js,socket.io,express,jquery,redis]
---
### log 3.0 client

---

### 1. 客户端需要完成的功能
- 提供html内容
- socket.io来建立socket通道，接受服务端发来的数据
- jquery
 - 分析url，拿到query string，用来订阅指定的host频道
 - 将socket拿到的数据，添加到web页面中
 - 实现div中的scroll自动滑动到底部功能

---

### 2. 客户端文件内容
`index.html`
#### 1) html部分
``` html
<!doctype html>
<html>
  <head>
    <title>Socket.IO log</title>
    <style>
      #main,#log_messages {
        border: 1px solid #ccc;
        max-width: 1000px;
        height: 750px;
        padding: 10px;
        MARGIN-RIGHT: auto;
        MARGIN-LEFT: auto;
      }
      #log_messages {
        height: 700px;
        overflow-y: auto;
        background-color: black;
        color: white;
      }
      #stopButton {
        margin-top: 8px;
      }
    </style>
  </head>

  <body>
    <div id="main">
      <div id="log_messages">
        <ul id="log"></ul>
      </div>
      <button type="button" id="stopButton">STOP</button>
    </div>
  </body>
</html>
```

#### 2) jquery和socket.io部分
填写到body前面
``` javascript
<script src="/js/socket.io.js"></script>
<script src="/js/jquery.min.js"></script>
<script>
  $(function(){

    var socket = io();

    // parse url query strings
    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // get query string
    var host = getParameterByName('host');

    socket.on(host, function(msg) {
      $("#log").append($('<li>').text(msg));
      // scroll div to bottom
      $('#log_messages').animate({
         scrollTop: $('#log_messages')[0].scrollHeight}, 100);
    });

    // stop socket
    $("#stopButton").on("click", function() {
      socket.disconnect();
    });
  });
</script>
```

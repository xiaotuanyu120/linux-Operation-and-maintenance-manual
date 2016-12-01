//请求自带模块，并将其赋值给变量//
var http = require("http");
var url = require("url");

/////////////////
//服务端基本原理//
////////////////
/*
//使用http模块的createServer函数的listen方法，启动一个http服务器
createServer的参数是一个函数，当接收到请求时，通过回调这个函数来返回请求
http.createServer(function(request, response) {
//当收到请求时，使用	response.writeHead()函数发送一个HTTP状态200和HTTP头的内容类型 （content-type）
 response.writeHead(200, {"Content-Type": "text/plain"});
//使用	response.write()	函数在HTTP相应主体中发送文本“Hello	World"。
 response.write("Hello world!");
//最后，我们调用	response.end()	完成响应
 response.end();
}).listen(8888);
*/

//创建个函数，来启动服务端
function start(route) {
  function onRequest(request, response) {
    pathname = url.parse(request.url).pathname;
    console.log("pathname is " + pathname);

    //start传递route函数进来，使其来route pathname参数
    //详细route函数内容，见router.js
    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello world!");
    response.end();
  }
  http.createServer(onRequest).listen(8888);
}

exports.start = start

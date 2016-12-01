//导入我们自建的模块，并将其赋值给变量
var	server = require("./server");
var router = require("./router");

//调用自建模块的方法
server.start(router.route);

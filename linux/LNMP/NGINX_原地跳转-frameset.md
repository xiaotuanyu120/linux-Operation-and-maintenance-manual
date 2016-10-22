NGINX: 原地跳转-frameset
2016年6月16日
8:30
 
0，需求与实际效果
=========================================
需求：
nginx做web服务器，将请求均指向到指定的html文件
frameset来指定一个frame直接跳转到目标网址
 
效果：
访问url完全不会随着你访问资源的变化而变化，只是作为一个frame访问 
1，html&nginx配置文件内容
=========================================
html文件内容
<html>
<head>
<meta http-equiv=Content-Type content="text/html;charset=GB2312" />
<title>hupai66.com</title>
</head>
 
<script LANGUAGE="JavaScript"> 
window.status='';
</script>
 
<frameset rows="0,*" framespacing="0" border="0" frameborder="0">
    <frame name="header" scrolling="no" noresize target="main" src="">
    <frame name="main" src="http://www.hupai.info/?intr=20689" scrolling="auto">
    <noframes>
    <body>
        <p></p>
    </body>
    </noframes>
</frameset>
</html> 
nginx虚机配置文件
server {
        listen 80;
        server_name www.hupai66.com hupai66.com;
        index indexhupai66.html;
location / {
            root /data/index;
        }
access_log  /data/web/logs/hp_web_8081.log access;
}

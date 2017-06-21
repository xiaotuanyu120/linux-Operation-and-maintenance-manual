14、xml&html
2015年9月18日
9:12
 
14.1 xml介绍
含义：XML stands for EXtensible Markup Language.
存储和传输：XML was designed to store and transport data.
人机皆友好：XML was designed to be both human- and machine-readable.
<?xml version="1.0" encoding="UTF-8"?>
<note>
 <to>Tove</to>
 <from>Jani</from>
 <heading>Reminder</heading>
 <body>Don't forget me this weekend!</body>
</note>
特点：
结构化、自描述、可扩展和浏览器自适应
 
From <http://www.cidu.net/jc/homepage/zhanwang/xml/xml2.htm> 
 
14.2 html
     14.2.1 介绍
HTML is a markup language for describing web documents (web pages).
HTML stands for Hyper Text Markup Language
 
     14.2.2 发展：
http://zhidao.baidu.com/link?url=Vi_Rmj4-aX3L8eenZtZHzrZU4YdC02Ha9H-Xs_p7cbUbncCXIIt8AsT1I4qtYbsCrRRV6A7y1u_l4ZmtpiG3oK
 
14.3 怎么使用：
simple example
<html>
<body>
 
<h1>My First Heading</h1>
 
<p>My first paragraph.</p>
 
</body>
</html>
 
14.4. HTML标签列表
http://www.w3school.com.cn/tags/index.asp
 
14.4.1 标签属性
<a href="http://m.sohu.com">链接</a>
 
14.5  h标签
<h1></h1>
..
..
<h6></h6>
 
14.6 段落标签
<p>这是一个段落</p>
 
14.7 格式化标签
<b>加粗</b>
<big>加大</big>
<i>斜体</i>
<strong>着重</strong>
<del>删除</del>
 
参考：http://www.w3school.com.cn/html/html_formatting.asp
 
14.8 样式css
两种方式：
     1. 外联样式
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
     2. 内嵌
<head>
 
<style type="text/css">
body {background-color: red}
p {margin-left: 20px}
</style>
</head>
 
14.9 表格和列表
表格：
<table border="1">
<tr>
<td>row 1, cell 1</td>
<td>row 1, cell 2</td>
</tr>
<tr>
<td>row 2, cell 1</td>
<td>row 2, cell 2</td>
</tr>
</table>
 
无序列表：
<ul>
<li>Coffee</li>
<li>Milk</li>
</ul>
 
有序列表
<ol>
<li>Coffee</li>
<li>Milk</li>
</ol>
 
14.10 块元素和内联元素
 
块元素
<div></div>
 
内联元素
<span></span>
<b></b>
 
14.11 表单Form
 
普通表单
<form>
First name:
<input type="text" name="firstname" />
<br />
Last name:
<input type="text" name="lastname" />
</form>
 
单选表单
<form>
<input type="radio" name="sex" value="male" /> Male
<br />
<input type="radio" name="sex" value="female" /> Female
</form>
 
提交表单
<form name="input" action="html_form_action.asp" method="get">
Username:
<input type="text" name="user" />
Password：
<input type="password" name="password">
<input type="submit" value="Submit" />
</form>
 
参考：http://www.w3school.com.cn/html/html_forms.asp
 
14.12 框架frameset
<frameset cols="25%,75%">
   <frame src="frame_a.htm">
   <frame src="frame_b.htm">
</frameset>
 
14.13 内联框架iframe
 
<iframe src="http://m.sohu.com" width="360" height="800"></iframe>
 
14.14 头部定义：
 
<!DOCTYPE HTML>
<html>
<!--head-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
<meta name="MobileOptimized" content="320"/>
<meta name="description" content="手机搜狐网，懂手机，更懂你！手机搜狐是国内最大的移动门户之一，利用搜狐门户矩阵资源，内容覆盖新闻、财经、体育、娱乐、女人、图库、视频等资讯，为7亿手机用户打造随时随地的掌上资讯生活。手机搜狐网，手机搜狐触版- m.sohu.com" />
<meta name="keywords" content="手机搜狐,手机搜狐网,搜狐手机版,搜狐新闻,搜狐,搜狐网,资讯,娱乐,女人,神吐槽,热辣评,狐揭秘" />
<title>手机搜狐网</title>

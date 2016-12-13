Tomcat前端配置一个HTTP服务器应该是大部分应用的标配了，基本思路就是所有动态请求都反向代理给后端的Tomcat，HTTP服务器来处理静态请求，包括图片、js、css、html以及xml等。这样可以让你的应用的负载能力提高很多，前端这个HTTP服务器主流用的最多的当属Apache HTTP Server和nginx。今天这篇文章主要讲解的是这种组合的方式的前提下，后端的Tomcat中的app在301跳转的时候遇到的一个问题。

问题

先把问题说清楚，前端nginx占用81端口，因为80干了别的，暂时懒得停80的应用，暂时修改为81端口而已。然后Tomcat占用8080端口，具体配置如下（只是截取了server中的一段）：
location /app1/ {
    index index.jsp index.html index.html index.shtml;
    proxy_pass http://localhost:8080/app1/;

    proxy_set_header   Host             $host;
     proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
}

location ~* ^.+\.(png|jpg|jpeg|gif|ico|css|js|xml)$ {
    root /home/gap/app/apache-tomcat-5.5.14/webapps;
}
上面的代码只是简单举例，其中处理静态内容的部分也可以用目录alias或者root的方式去处理，效果应该一样的，但是具体区别我也没深入了解，不过这不是今天的重点。在这个配置下出现的问题就是当访问http://host:81/app1/Login.do的时候，登录成功需要301跳转到用户中心页面，然后跳转的地址本应该是http://host:81/app1/userindex.do，但是结果不太尽如人意，浏览器实际出现的地址http://host/app1/userindex.do。这里面的问题就是81端口没了，跑80端口去了，自然就404了。扯了一大段，这就是今天想说的问题。

问题出现了,自然得分析原因，由于我们这个项目中需要支持ssl，使用了Struts1.2的Framework，于是采用了SecurePlugIn（想了解的可以参照SSLExt Command 2.3节）的插件来处理。那么我首先怀疑是不是这个东西在作怪，看了下配置文件这个插件的enable都直接为false。看来不是这个插件作怪了，那么在不是应用本身逻辑在作怪的话那么可能是服务器配置有问题了，这个时候就应该直接从http请求开始分析了。

首先我打开chrome，然后来分析这次request发生了什么（打开开发者工具中的Network面板），能发现的基本就是请求Login.do是没问题的，但是Login.do之后发生的301重定向是错误的，一个重要的线索就是Login.do的请求中response中的Location的值是http://host/usercenter.do，这里丢掉了端口号。这个地方的具体原因后边会提到，先说下解决思路。

解决思路可以有两个，第一个就是nginx是可以利用proxy_redirect来修改response的Location和Refresh的值，Location自然可以被重新修改为81端口的地址，第二个就是找到是谁把Location搞错了，修改这个地方别搞错Location就行了。

解决思路1:利用nginx的proxy_redirect

这个思路其实有点偏重解决问题型，就是我看到这里错了，原因不纠结，我让你好使就可以了。可能好多人都是这个思路，毕竟解决问题是首要目的。

很多人在配置nginx的时候，习惯参考官方wiki的Full Example (taken from Nginx site)，来做一些配置，参考这个肯定比参考baidu搜索出来的文档要靠谱很多，建议不了解每个属性的可以来参照下这个官方示例。这个配置里面proxy_redirect的属性为off，很多人应该没有问过为什么就直接根据人家来做了，之所以这样下结论是因为我看到太多国内人的集成例子中都是这样设置的了。我这里也是这样设置的，以前也倒是没想起来问下为啥，的确不太符合我的风格。反正服务器是这样配置的，现在是出来问题了，我们先来看下这个属性能做什么。

首先看官方文档Reference:proxy_redirect的说明：


Sets a text that should be changed in the header fields “Location” and “Refresh” of a response from the proxied server. Suppose a proxied server returned the header field “Location: http://localhost:8000/two/some/uri/”.

基本意思就是修改代理服务器(也就是此时的nginx)的response的头信息里面的Location和Refresh的值，按照这个解释的话我们的问题肯定就迎刃而解了，因为现在遇到的问题就是这个能够修改的两个中的一个Location出了问题，那么下面的代码就可以解决问题
proxy_redirect     http://host http://host:81;
这样重启sudo nginx -s reload然后再访问应该就ok了。其实你google搜索nginx proxy_redirect 重定向有好多这样的例子和这个解决方式是一样的，就不细说了，如果有人想了解的可以自己参照nginx官方文档和结合例子来操作下试试就可以理解了。

解决思路2:找到问题原因，修改出错的地方解决

根据上个思路解决了问题以后，一点都没如释重负的感觉，反而各个地方都觉得很空的感觉，因为有好几个疑问没解决，其中包括为啥是80而不是81或者8080没道理？这个Location是不是应该nginx来重写，修改掉那个跳转错的地方是不是比这个思路会更好？

那就先来分析下问题的原因：既然response的Locaiton不对，那么首先想到的就是这个Location是谁构造出来的，了解HTTP协议的人应该都知道，request中的header都是client（浏览器等）构造好发送给服务器的，服务器收到请求以后构造response信息返回给client。那么这样Location这个值肯定就是nginx或者Tomcat给搞出的问题了，这个地方nginx只是一个proxy server，那么response肯定是Tomcat发给nginx的，也就是说我们应该从Tomcat下手来分析这个问题。

首先我就看了下Tomcat的官方文档 Proxy Support，这里面对这个介绍如下：


The proxyName and proxyPort attributes can be used when Tomcat is run behind a proxy server. These attributes modify the values returned to web applications that call the request.getServerName() and request.getServerPort() methods, which are often used to construct absolute URLs for redirects. Without configuring these attributes, the values returned would reflect the server name and port on which the connection from the proxy server was received, rather than the server name and port to whom the client directed the original request.

意思就是proxyPort的属性就是用来我这种nginx做前端代理服务器Tomcat在后端处理动态请求的情况的。修改属性的值可以作用于应用的两个方法，主要用于绝对路径和重定向之用。如果不配置的话，可能会不对头。那么既然是这里不对头，我就先把server.xml中我这个http的connector的配置加入了proxyPort="81",重启Tomcat，然后把nginx上步骤的修改注释掉，重启测试。结果基本如所料，完全正常跳转了。

事情到了这个时候，其实问题基本明了了，不过我还是对这个Tomcat为啥默认解析了80端口很是疑惑。我下载了Tomcat的source来看下问题究竟，看了以后用通俗的语言来表述的话就是这样：如果默认不配置proxyPort默认为0，然后在构造response的时候判断如果proxyPort为0那么就不添加端口，不添加端口当然就默认走了80端口，源代码如下：
// FIXME: the code below doesnt belongs to here,
// this is only have sense
// in Http11, not in ajp13..
// At this point the Host header has been processed.
// Override if the proxyPort/proxyHost are set
String proxyName = connector.getProxyName();
int proxyPort = connector.getProxyPort();
if (proxyPort != 0) {
    req.setServerPort(proxyPort);
}
if (proxyName != null) {
    req.serverName().setString(proxyName);
}
到了这里就真相大白了，心里也没结了，一块石头终于落地了。

总结

也就是说Tomcat在设计的时候是对这种代理服务器和Tomcat集成的情况做了考虑，80端口之所以没问题是因为port为空，浏览器会默认走80端口，如果nginx这代理服务器不是80这个端口应该需要配置proxyPort的属性的，这样就不会遇到这个问题。

那么基于这个来总结的话，两种解决方式都可以，不过修改Tomcat配置文件的方式是我最推荐的，因为这个思路看起来是又合理、又易于理解。我的感觉就是谁的事情谁来解决比较好，nginx作为proxy server 你就只需要做你的静态文件的解析，和把动态请求方向代理的服务器就可以了，既然Tomcat把这个信息构造错了，人家也有提供了解决方案，就根据你的情况合理配置就可以了。

一直以来自己是个特别较真的人，各种事情都是，希望每个人在解决问题的时候不要仅限于解决了问题就ok吧，更多的去了解问题的真相才会进步更快，例如这个问题其实有一个必要前提是需要了解一些HTTP的协议的基础知识，如果不了解的话可能你不会很快判断出Location出了问题，你可能也不会很快知道response是谁构造错的。建议大家都读下《HTTP权威指南》，每个做web开发的工程师都应该拥有这本书，可以大概先看一遍了解，后续需要就拿出来作为工具书查阅资料。如果作为工具书的话，那就强烈推荐大家购买图灵推出的《HTTP权威指南》电子版，我都把我的纸质书卖了换了电子版了，买了都说好啊。不过顺带说句图灵购买也需要输入个兑换码才能送银子，这体验不好，因为总是忘记，着急买书的都会忘记，建议改进下啊。



[转载地址](http://www.ituring.com.cn/article/48042)

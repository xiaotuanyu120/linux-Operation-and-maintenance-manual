---
title: tomcat 1.3.2 优化-如何承载上万并发
date: 2017-02-15 14:38:00
categories: linux/java_env
tags: [linux,java_env,tomcat]
---
### tomcat 1.3.2 优化-如何承载上万并发

---

### 0. 前言
最近在研究如何搭建一套高并发的java web架构，关于这方面的优化和配置牵扯到系统、代理、tcp、tomcat一系列的优化，很是复杂，在研究tomcat的优化过oigvs，搜索到了这一篇[tomcat并发13000](https://blog.krecan.net/2010/05/02/cool-tomcat-is-able-to-handle-more-than-13000-concurrent-connections/comment-page-1/#comment-9636)的文章，感觉可以拿出来分享一下，原文是英文，有兴趣的可以去参考并自己实践。

---

### 1. 环境
OS: Centos6.7 无内核优化
tomcat: version 7.0.75 原生无任何配置修改
jdk: 1.7.0_79

---

### 2. 准备测试代码
``` java
public class ThreadsServlet extends HttpServlet {  
    private static final long serialVersionUID = 7770323867448369047L;  

    @Override  
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {  
        int number = Integer.valueOf(req.getParameter("number"));  
        try {  
            System.out.println("Servlet no. "+number+" called.");  
            URL url = new URL(req.getScheme()+"://"+req.getServerName()+":"+req.getServerPort()+req.getRequestURI()+"?number="+(number+1));  
            Object content = url.getContent();  
            resp.setContentType("plain/text");  
            resp.getWriter().write("OK: "+content);  
        } catch (Throwable e) {  
            String message = "Reached "+number+" of connections";  
            System.out.println(message);  
            System.out.println(e);  
            resp.getWriter().write(message);  
        }  
    }  
}
```
代码的处理是找的公司的同事帮忙封装成war包的，访问url为"http://localhost:8080/threads/something?number=1"

---

### 3. 默认配置测试结果
``` bash
Servlet no. 193 called.
Servlet no. 194 called.
Servlet no. 195 called.
Servlet no. 196 called.
Servlet no. 197 called.
Servlet no. 198 called.
Servlet no. 199 called.
Servlet no. 200 called.
```

---

### 4. 修改Connector配置
打开`$CATALINA_BASE/conf/server.xml`
``` xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           maxThreads="32000"
           redirectPort="8443" />
```

测试结果
```
Servlet no. 1135 called.
Servlet no. 1136 called.
Servlet no. 1137 called.
Servlet no. 1138 called.
Servlet no. 1139 called.
Servlet no. 1140 called.
Exception in thread "http-apr-8080-exec-1141" java.lang.OutOfMemoryError: Java heap space
        at org.apache.coyote.http11.InternalAprInputBuffer.<init>(InternalAprInputBuffer.java:59)
        at org.apache.coyote.http11.Http11AprProcessor.<init>(Http11AprProcessor.java:67)
        at org.apache.coyote.http11.Http11AprProtocol$Http11ConnectionHandler.createProcessor(Http11AprProtocol.java:301)
        at org.apache.coyote.http11.Http11AprProtocol$Http11ConnectionHandler.createProcessor(Http11AprProtocol.java:208)
        at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:603)
        at org.apache.tomcat.util.net.AprEndpoint$SocketWithOptionsProcessor.run(AprEndpoint.java:2473)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:745)
```

---

### 5. 增大heap space
编辑`$CATALINA_BASE/bin/catalina.sh`
``` bash
JAVA_OPTS="-Xmx2G"
```

测试结果
```
Servlet no. 2013 called.
Servlet no. 2014 called.
Servlet no. 2015 called.
Servlet no. 2016 called.
Servlet no. 2017 called.
Servlet no. 2018 called.
Servlet no. 2019 called.
Reached 2019 of connections
java.net.SocketException: Too many open files
Feb 15, 2017 8:12:14 AM org.apache.tomcat.util.net.AprEndpoint$Acceptor run
SEVERE: Socket accept failed
org.apache.tomcat.jni.Error: 24: Too many open files
        at org.apache.tomcat.jni.Socket.accept(Native Method)
        at org.apache.tomcat.util.net.AprEndpoint$Acceptor.run(AprEndpoint.java:1086)
        at java.lang.Thread.run(Thread.java:745)
```

---

### 6. 查看并增加文件打开数
``` bash
# 修改系统文件数上限
vim /etc/sysctl.conf
********************************
fs.file-max = 65535
********************************
sysctl -p

# 修改用户文件数上限
vim /etc/security/limits.conf
*********************************
root soft nofile 65535
root hard nofile 65535
*********************************
# logout 重新login
```

测试结果
```
Servlet no. 8181 called.
Servlet no. 8182 called.
Servlet no. 8183 called.
Servlet no. 8184 called.
Servlet no. 8185 called.
Servlet no. 8186 called.
Servlet no. 8187 called.
Servlet no. 8188 called.
Servlet no. 8189 called.
Servlet no. 8190 called.
Servlet no. 8191 called.
Servlet no. 8192 called.
```
卡住在这里，查看了下内存，并尝试增大了堆内存，但是依然没有改善

---

### 7. 缩小socket的buffersize，来节省内存
打开`$CATALINA_BASE/conf/server.xml`
``` xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           maxThreads="32000"
           socket.appReadBufSize="1024"
           socket.appWriteBufSize="1024"
           bufferSize="1024"
           redirectPort="8443" />
```
默认值是8192，为了提高并发，可以降低此值，或者增大堆内存

测试结果
```
Servlet no. 8177 called.
Servlet no. 8178 called.
Servlet no. 8179 called.
Servlet no. 8180 called.
Servlet no. 8181 called.
Servlet no. 8182 called.
Servlet no. 8183 called.
Servlet no. 8184 called.
Servlet no. 8185 called.
Servlet no. 8186 called.
Servlet no. 8187 called.
Servlet no. 8188 called.
Servlet no. 8189 called.
Servlet no. 8190 called.
Servlet no. 8191 called.
Servlet no. 8192 called.
```
并没有得到更大的提升。

---

### 8. 总结
提升tomcat7的并发性能，可以通过增加堆内存和提升线程数的方法，另外系统方面需要增加文件打开数。但是这仅仅是在tomcat应用的角度来看。  
其实tomcat也是一个web服务器，web服务器的提升核心是代码，其次才是http/tcp的优化，系统的优化，和servlet的优化。  
而且，正确的架构也能提升web架构的并发性，追求单台tomcat的性能极致只是为了技术研究，我们完全可以使用nginx+tomcat集群的方式，在并发和扩展性上得到兼顾。

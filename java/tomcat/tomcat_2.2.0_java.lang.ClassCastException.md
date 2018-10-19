---
title: tomcat 2.2.0 问题-java.lang.ClassCastException
date: 2017-04-18 10:35:00
categories: java/tomcat
tags: [tomcat7,java,classloader,java.lang.ClassCastException]
---
### tomcat 2.2.0 问题-java.lang.ClassCastException

---

### 0. 问题背景
开发更新了新的代码，线上tomcat7发生了runtime error，错误信息如下：
``` java
java.lang.ClassCastException: com.nnti.pay.controller.vo.PayWayVo cannot be cast to com.nnti.pay.model.vo.MerchantPay
        at com.nnti.pay.controller.PayController.pay_way(PayController.java:77)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:606)
        at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:220)
        at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:134)
        at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:116)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:827)
        at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:738)
        at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:85)
        at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)
        at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:897)
        at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:970)
        at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:861)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:624)
        at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:846)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:731)
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
        at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
        at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:197)
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
        at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
        at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:218)
        at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:110)
        at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:506)
        at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:169)
        at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:103)
        at org.apache.catalina.valves.AccessLogValve.invoke(AccessLogValve.java:962)
        at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:116)
        at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:452)
        at org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1087)
        at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:637)
        at org.apache.tomcat.util.net.JIoEndpoint$SocketProcessor.run(JIoEndpoint.java:316)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(Thread.java:745)
```
参考链接：  
http://stackoverflow.com/questions/15400445/spring-mvc-java-lang-classcastexception  
https://www.mulesoft.com/tcat/tomcat-classpath  
http://kyfxbl.iteye.com/blog/1707237  
https://tomcat.apache.org/tomcat-7.0-doc/class-loader-howto.html  

---

1. 有可能和代码有关，网上搜查结论https://www.ibm.com/developerworks/community/blogs/738b7897-cd38-4f24-9f05-48dd69116837/entry/classcastexception_reason_and_resolution2?lang=en
2. tomcat加载类的时候，同一个类被不同的classloader加载，表象问题是WEB_INFO/lib中包含tomcat原生的jar包引起的问题，突破方向是classloader

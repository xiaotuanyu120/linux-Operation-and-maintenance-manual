---
title: error 1.1.0 EPR ... Operation not found ... WSA Action =
date: 2018-08-01 11:07:00
categories: java/product_issues
tags: [linux,java]
---
### error 1.1.0 EPR ... Operation not found ... WSA Action =

---

### 0. 问题描述
开发使用axis2，然后更新了一个方法，但是线上一直有报错。开发目测是找不到这个方法，于是有了下面这个排错过程。
- Axis2： Apache Axis2是一个Web服务的核心支援引擎。AXIS2对旧有的AXIS重新设计及重写，并提供两种语言Java及C的开发版本
- wsdl： WSDL（Web服务描述语言，Web Services Description Language）是为描述Web服务发布的XML格式。

### 1. 排查过程
分析错误信息
```
2018-07-31 17:28:17,469 ERROR [org.apache.axis2.engine.AxisEngine] - The endpoint reference (EPR) for the Operation not found is http://***:***/services/Axis2WebService and the WSA Action = . If this EPR was previously reachable, please contact the server administrator.
org.apache.axis2.AxisFault: The endpoint reference (EPR) for the Operation not found is http://***:***/services/Axis2WebService and the WSA Action = . If this EPR was previously reachable, please contact the server administrator.
  at org.apache.axis2.engine.DispatchPhase.checkPostConditions(DispatchPhase.java:102)
  at org.apache.axis2.engine.Phase.invoke(Phase.java:329)
  at org.apache.axis2.engine.AxisEngine.invoke(AxisEngine.java:262)
  at org.apache.axis2.engine.AxisEngine.receive(AxisEngine.java:168)
  at org.apache.axis2.transport.http.HTTPTransportUtils.processHTTPPostRequest(HTTPTransportUtils.java:172)
  at org.apache.axis2.transport.http.AxisServlet.doPost(AxisServlet.java:146)
  at javax.servlet.http.HttpServlet.service(HttpServlet.java:650)
  at javax.servlet.http.HttpServlet.service(HttpServlet.java:731)
  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
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
  at org.apache.tomcat.util.net.AprEndpoint$SocketWithOptionsProcessor.run(AprEndpoint.java:2473)
  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
  at java.lang.Thread.run(Thread.java:745)
```
里面关键信息是`The endpoint reference (EPR) for the Operation not found is http://***:***/services/Axis2WebService and the WSA Action = `，里面重点提示了找不到operation。

网上找到这个报错的官方说明
```
If Axis2 engine cannot find a service and an operation for a message, it immediately fails, sending a fault to the sender. If service not found - "Service Not found EPR is " If service found but not an operation- "Operation Not found EPR is and WSA Action = "
```
确定了是因为这个operation不存在，网上查了下，发现给wsdl增加operation，需要增加operation到wsdl的xml文件中，于是网查如何能找到这个xml文件

网上查了下如何查看wsdl的xml文件，发现可以使用在url后面增加`?wsdl`来查看xml文件，例如(http://***:***/services/Axis2WebService?wsdl)，然后下载这个文件给开发看，发现确实没有开发说的方法。而且开发说这个xml文件不是手动配置，而是根据代码动态生成的。


### 2. 解决办法
然后问题基本上可以确定是这个方法没有更新上去，然后确认了一遍更新流程，做了以下操作：
- 定位到类文件，删除它
- 删除work缓存目录中的文件
- 让开发重新更新这个类文件
- 重启java服务
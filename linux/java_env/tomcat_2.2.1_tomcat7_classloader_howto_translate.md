---
title: tomcat 2.2.1 tomcat7类加载器HOWTO-中文翻译
date: 2017-04-19 14:05:00
categories: linux/java_env
tags: [tomcat7,java,classloader,java.lang.ClassCastException]
---
### tomcat 2.2.1 tomcat7类加载器HOWTO-中文翻译

---

### 0. 原文地址
[apache tomcat7 class-loader-howto](https://tomcat.apache.org/tomcat-7.0-doc/class-loader-howto.html)

---

### 1. 翻译内容
#### 1) 概述
和许多服务器应用一样，tomcat安装了各种类加载器(也就是实现java.lang.ClassLoader的类)，以允许容器的不同部分以及容器上运行的Web应用程序访问不同的可用类和资源的存储库。该机制用于提供Servlet规范2.4版中定义的功能，特别是9.4和9.6节。  

在java环境中，类加载器是以亲子树的形式排列。一般情况下，当一个类加载器被要求加载一个特定的类或资源时，它首先把请求发送给它的父类加载器，只有当父类加载器无法找到该资源时，它才在自己的类库中查询。  

不过值得注意的是，Web应用程序类加载器采用的模型与此稍有不同，在接下来的内容中会提到，但是主要原则是相同的。  

当tomcat启动时，它会创建一个类加载器集合，以如下的父加载器在子加载器之上的亲子关系组织：
```
      Bootstrap
          |
       System
          |
       Common
       /     \
  Webapp1   Webapp2 ...
```
这些类加载器的特征，包括它们可见的类和资源的来源，将会在以下部分中详细讨论。

#### 2) 类加载器定义
如上面架构图所示，Tomcat在初始化时创建以下类加载器：
- **Bootstrap** -- 这个类加载器包含java虚拟机提供的基本运行时类，外加系统扩展目录($JAVA_HOME/jre/lib/ext)中jar包中的所有类。注意：一些JVM可能会将其实现为多个类加载器，或者它根本不可见（作为类加载器）。

- **System** -- 这个类加载器通常是根据CLASSPATH环境变量的内容来初始化类的。所有这些类对于Tomcat内部类和Web应用程序都是可见的。但是，标准的Tomcat启动脚本($CATALINA_HOME/bin/catalina.sh或％CATALINA_HOME％\bin\catalina.bat)完全忽略CLASSPATH环境变量本身的内容，而是从以下存储库构建System类加载器:
  - `$CATALINA_HOME/bin/bootstrap.jar` -- 包含用于初始化tomcat服务器的main()方法和它依赖的类加载器实现类

  - `$CATALINA_BASE/bin/tomcat-juli.jar` or `$CATALINA_HOME/bin/tomcat-juli.jar` -- 日志实现类。它们包含java.util.logging API的增强类Tomcat JULI，以及由Tomcat内部使用的Apache Commons Logging库的软件包重命名副本，查看[日志文档](https://tomcat.apache.org/tomcat-7.0-doc/logging.html)获取更多详情。  
  在*$CATALINA_BASE/bin*中的tomcat-juli.jar优先级要高于在*$CATALINA_HOME/bin*中的。它在某些日志记录配置中很有用。

  - `$CATALINA_HOME/bin/commons-daemon.jar` -- Apache Commons Daemon项目中的类。这个JAR文件不存在于由`catalina.bat|.sh`脚本构建的CLASSPATH中，而是从bootstrap.jar的清单文件引用。

- **Common** -- 这个类加载器包含对Tomcat内部类和所有Web应用程序可见的其他类。  
通常，应用程序类不能放在这里。此类加载器搜索的位置由`$CATALINA_BASE/conf/catalina.properties`中的`common.loader`属性定义。默认的设置将按照列出的顺序搜索以下位置：
  - `$CATALINA_BASE/lib`中的解包的类和资源
  - `$CATALINA_BASE/lib`中的jar文件
  - `$CATALINA_HOME/lib`中的解包的类和资源
  - `$CATALINA_HOME/lib`中的jar文件  

  默认情况下，它包含以下内容
  - annotations-api.jar — JavaEE annotations classes.
  - catalina.jar — Implementation of the Catalina servlet container portion of Tomcat.
  - catalina-ant.jar — Tomcat Catalina Ant tasks.
  - catalina-ha.jar — High availability package.
  - catalina-tribes.jar — Group communication package.
  - ecj-*.jar — Eclipse JDT Java compiler.
  - el-api.jar — EL 2.2 API.
  - jasper.jar — Tomcat Jasper JSP Compiler and Runtime.
  - jasper-el.jar — Tomcat Jasper EL implementation.
  - jsp-api.jar — JSP 2.2 API.
  - servlet-api.jar — Servlet 3.0 API.
  - tomcat-api.jar — Several interfaces defined by Tomcat.
  - tomcat-coyote.jar — Tomcat connectors and utility classes.
  - tomcat-dbcp.jar — Database connection pool implementation based on package-renamed copy of Apache Commons Pool and Apache Commons DBCP.
  - tomcat-i18n-**.jar — Optional JARs containing resource bundles for other languages. As default bundles are also included in each individual JAR, they can be safely removed if no internationalization of messages is needed.
  - tomcat-jdbc.jar — An alternative database connection pool implementation, known as Tomcat JDBC pool. See documentation for more details.
  - tomcat-util.jar — Common classes used by various components of Apache Tomcat.
  - tomcat7-websocket.jar — WebSocket 1.1 implementation
  - websocket-api.jar — WebSocket 1.1 API

- **WebappX** -- 为在单个Tomcat实例中部署的每个Web应用程序创建了一个类加载器。所有Web应用程序的/WEB-INF/classes目录中的解包的类和资源，以及Web应用程序/WEB-INF/lib目录下的JAR文件中的类和资源都对该Web应用程序可见，但对其他的web应用程序不可见。

前面提到过，web应用程序类加载器和默认的java委托模式(根据Servlet规范2.4版第9.7.2节Web应用程序类加载器中的建议)不同，当处理从Web应用程序的WebappX类加载器加载类的请求时，此类加载器将首先查找本身存储库，而不是委派给父类先去查找。不过也有例外，作为JRE基类一部分的类不能被覆盖。对于某些类（例如J2SE 1.4+中的XML解析器组件），可以使用J2SE 1.4认可的功能。最后，包含Servlet API类的任何JAR文件都将被类加载器显式忽略 -- 不要在您的Web应用程序中包含这样的JAR。Tomcat中的所有其他类加载器遵循通常的委托模式。

因此，从Web应用程序的角度来看，类或资源加载将按以下顺序查找以下存储库：
 - JVM中的Bootstrap类
 - web应用程序/WEB-INFO/classes中的类
 - web应用程序/WEB-INFO/lib中的类
 - System类加载器类
 - Common类加载器类

如果Web应用程序类加载器配置为<Loader delegate =“true”/>，则该顺序变为：
- JVM中的Bootstrap类
- System类加载器类
- Common类加载器类
- web应用程序/WEB-INFO/classes中的类
- web应用程序/WEB-INFO/lib中的类

#### 3) XML解析器和Java
从Java 1.4开始，JAXP API和XML解析器的一个副本被打包在JRE中。这对希望使用自己的XML解析器的应用程序有影响。  

在旧版本的Tomcat中，您可以简单地替换Tomcat libraries目录中的XML解析器来更改所有Web应用程序使用的解析器。然而，当您运行Java的现代版本时，这种技术将无效，因为通常的类加载器委派过程将始终选择JDK内的实现。

Java支持称为“支持标准覆盖机制”的机制，以允许替换在JCP之外创建的API（例如来自W3C的DOM和SAX）。它也可以用于更新XML解析器实现。有关详细信息，请参阅：http://docs.oracle.com/javase/1.5.0/docs/guide/standards/index.html

Tomcat通过在启动容器的命令行中包含系统属性设置`-Djava.endorsed.dirs=$JAVA_ENDORSED_DIRS`来使用此机制。此选项的默认值为`$CATALINA_HOME/endorsed`。默认情况下不创建该目录。

#### 4) 在安全管理器下运行
在安全管理器下运行允许加载类的位置也将取决于策略文件的内容。有关更多信息，请参阅安全管理器[HOW-TO](https://tomcat.apache.org/tomcat-7.0-doc/security-manager-howto.html)。

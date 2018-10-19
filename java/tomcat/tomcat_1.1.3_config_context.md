---
title: tomcat 1.1.3 配置-context
date: 2018-08-12 12:27:00
categories: java/tomcat
tags: [tomcat,linux]
---
### tomcat 1.1.3 配置-context

---

### 0. 背景
线上的工程，一直在server.xml里面配置context来指定工程目录，不是特别清楚里面配置的含义，结果就系统性的查询了一下，结果真就发现，直接在server.xml里面配置context是不推荐的(`<Context path="" docBase="/root/webfile/web" debug=“0” reloadable="false"/>`)，当然，也不是不可以这样，详细请查看后面说明。  
- 主要参考了[tomcat 7.0.90的context说明文档](https://tomcat.apache.org/tomcat-7.0-doc/config/context.html)

### 1. context配置说明
context元素表示在特定虚拟主机中运行的Web应用程序。每个Web应用程序都基于Web应用程序归档（WAR）文件或包含相应解压缩内容的相应目录。web应用程序通过http请求的URI与context path变量的最长匹配来处理http请求。当context被匹配中后，它会通过`WEB-INF/web.xml`中配置的servlet来处理http请求。  
context元素可以配置多个，每个context的名称必须是唯一的。context path不需要唯一，见[多版本并行部署](https://tomcat.apache.org/tomcat-7.0-doc/config/context.html#Parallel_deployment)。每个虚拟主机中至少要配置一个context path为空的context，这个context作为默认的web应用程序，会处理所有匹配不到其他context的http请求。

#### 名称
当虚拟主机执行autoDeploy或deployOnStartup操作时，Web应用程序的context name和context path是从定义Web应用程序的文件的名称派生的。因此，context path可能未在应用程序中嵌入的`META-INF/context.xml`中定义，并且context name，context path，context version和base filename（名称减去任何.war或.xml扩展名）之间存在密切关系。  
如果没有version指定的话，context name和context path是一致的。如果context path是空（默认context），则context name是ROOT，否则，base filename就是context path去掉开头的`/`然后替换其他的`/`为`#`。  
如果指定了version，context path不变，context name和base filename会在结尾增加`##version`

Context Path|Context Version|Context Name|Base File Name|Example File Names (.xml, .war & directory)
---|---|---|---|---
/foo|None|/foo|foo|foo.xml, foo.war, foo
/foo/bar|None|/foo/bar|foo#bar|foo#bar.xml, foo#bar.war, foo#bar
Empty String|None|Empty String|ROOT|ROOT.xml, ROOT.war, ROOT
/foo|42|/foo##42|foo##42|foo##42.xml, foo##42.war, foo##42
/foo/bar|42|/foo/bar##42|foo#bar##42|foo#bar##42.xml, foo#bar##42.war, foo#bar##42
Empty String|42|##42|ROOT##42|ROOT##42.xml, ROOT##42.war, ROOT##42

> version是一个字符串，没有version指定的时候是空字符串，tomcat根据字符串排序来判定不同的version的先后顺序，"001"比"002"早，空字符串比"11"早。

虽然有上面的规则将context path和base filename关联在了一起，但是，我们还是有办法让base filename不再根据context path派生。  
下面说明两种方法：
- disable `autoDeploy`和`deployOnStartup`，然后将所有context在server.xml中配置。
- 将war包或者工程目录放在appBase定义的目录之外，然后配置一个context.xml，在里面定义docBase

#### 定义context
不建议将context元素直接配置在server.xml文件中。这是因为它使得修改Context配置后，在不重新启动Tomcat的情况下无法重新加载主conf/server.xml文件。  
可以按照如下方式定义context：
- 在web应用程序`META-INF/context.xml`中配置。可选，若host配置了copyXML（此属性仅在deployXML为true时生效），则会拷贝此context文件到$CATALINA_BASE/conf/[enginename]/[hostname]/中，并重命名为应用程序的base filename加上.xml后缀。
- 在$CATALINA_BASE/conf/[enginename]/[hostname]/目录中，根据base filename派生出context path和version。这个文件也会取代`META-INF/context.xml`的优先权。
- 在server.xml的HOST元素中配置context

默认的context配置会多个web应用程序应用。web应用程序单独配置的context会覆盖任意的默认配置的context。
- $CATALINA_BASE/conf/context.xml中，context配置会被所有的web应用程序加载
- $CATALINA_BASE/conf/[enginename]/[hostname]/context.xml.default中，会被指定的hostname的host中的所有web应用程序加载

#### 属性
有很多context种的具体属性，可参照[tomcat 7.0.90 context文档 - atrributes](https://tomcat.apache.org/tomcat-7.0-doc/config/context.html#Attributes)

> 其他更多详细信息，可以查看[tomcat 7.0.90 官方context文档](https://tomcat.apache.org/tomcat-7.0-doc/config/context.html)

### 2. context 配置实践
#### 理论上推荐实践
目的：
- webapps下面的默认程序不自动启动
- 不在server.xml中配置context，实现独立文件配置context

server.xml
``` xml
      <Host name="localhost"  appBase=""
            unpackWARs="true" autoDeploy="false">
```
> 1. 修改appBase的值为空，或者其他目录。目的是避免加载tomcat默认的应用程序。
2. 修改autoDeploy为false，避免热加载

Catalina/localhost/ROOT.xml
``` xml
<Context path="" docBase="/root/webfile/web" debug="0" reloadable="false"/>
```
> 1. path为空，代表是默认的context。
> 2. docBase指向需要的工程路径。
> 3. debug为0，按需开启
> 4. reloadable默认即为false，代表修改工程目录中文件时，不去自动重载context，仅在重启tomcat时生效。有需要的话，可以配置为true

#### 管理方便的实践
当然，还有另外一种官方不推荐，但是相当简便的方法，就是直接在server.xml中配置context
- host中将autoDeploy、deployOnStartup、deployXML配置为false
- context中path为空，docBase设置为真正的war包或者目录路径
> 代价仅仅为不可以热更新而已，对某些不在乎服务重启导致的中断的项目可以这样配置，便于管理

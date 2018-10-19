---
title: elk 3.1.0 logstash plugin grok
date: 2018-08-24 21:33:00
categories: bigdata/elk
tags: [elk, logstash, grok]
---
### elk 3.1.0 logstash plugin grok

---

### 1. 为啥需要grok？
logstash作为elk组件中的数据收集和处理中间件，主要分三块逻辑，input filter output。其中filter部分可以忽略，但是如果需要对数据进行详细的统计的话，filter就特别重要了。其中filter有许多组件，比较重要的就有这个grok，之所以它比较重要，是因为它可以帮助我们用正则匹配的方式来将日志里面的字段细分。后期方便统计和整理。

### 2. 认识和使用grok
#### 什么是grok？
grok可以帮助我们将无结构散乱的日志整理成为可查询的结构性的数据。我们需要使用pattern来逐条匹配，将他们结构化，logstash已经提供了默认的120多条pattern来供我们使用，详细的可以参照[这个文档](https://github.com/logstash-plugins/logstash-patterns-core/tree/master/patterns)。当然，我们也可以按照语法写自定义的pattern。  

#### grok 语法
`%{SYNTAX:SEMANTIC}`，换成更好理解的描述就是`%{pattern_name:result_name}`，举两个实际的例子：`%{NUMBER:duration}`, `%{IP:client}`。 详细解释来说，就是我们需要提前定义一个pattern，其名称为`NUMBER`，然后用NUMBER代表的pattern去匹配日志，匹配到的字段的key就是duration。  
> 默认情况SEMANTIC全部保存为字符串，如果希望改变格式，可以显式指定`%{NUMBER:num:int}`，目前只支持两种string之外的格式`int`和`float`。

例子：
有一个这样的日志
```
55.3.244.1 GET /index.html 15824 0.043
```
匹配pattern
```
filter {
  grok {
    match => { "message" => "%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}" }
  }
}
```
匹配结果
```
client: 55.3.244.1
method: GET
request: /index.html
bytes: 15824
duration: 0.043 
```

#### 正则部分
grok是基于正则的，所以，它支持自己编写正则规则，使用的正则库是[Oniguruma](https://github.com/kkos/oniguruma/blob/master/doc/RE)

#### 自定义pattern
grok虽然提供了很多pattern，但是有时候我们有自定义的需求，就需要自己创建pattern了。创建自己的pattern很简单，就是把自定义的pattern文件以任意名称放在自定义的pattern目录中，然后使用grok的`pattern_dir`参数指定就好了，`pattern_dir`是一个数组，可以指定多个pattern目录，例如`patterns_dir => ["/opt/logstash/patterns", "/opt/logstash/extra_patterns"]`。

例子：  
创建pattern目录
``` bash
# logstash的目录 => /usr/local/logstash
mkdir /usr/local/logstash/patterns
# 目录不强制在logstash程序目录下，只不过为了方便管理，推荐放在一起
```
创建pattern规则文件
``` bash
# 文件名称随意，自己方便管理就好
# 格式： "pattern_name regrex_rules"
echo 'NUMBER \d+' > /usr/local/logstash/math
```
使用我们自定义的pattern NUMBER
``` bash
filter {
  grok {
    patterns_dir => ["./patterns"]
    match => { "message" => "%{NUMBER:amount}" }
  }
}
```
> 如果是在logstash程序根目录下，可以像上面这样用相对路径指定。如果是在其他位置，推荐还是用绝对路径。


#### 嵌套pattern
pattern除了使用正则来表示之外，还可以用pattern来拼接成新的pattern，例如默认pattern库中的时间的例子
```
# Years?
YEAR (?>\d\d){1,2}
HOUR (?:2[0123]|[01]?[0-9])
MINUTE (?:[0-5][0-9])
# '60' is a leap second in most time standards and thus is valid.
SECOND (?:(?:[0-5][0-9]|60)(?:[:.,][0-9]+)?)
TIME (?!<[0-9])%{HOUR}:%{MINUTE}(?::%{SECOND})(?![0-9])
# datestamp is YYYY/MM/DD-HH:MM:SS.UUUU (or something like it)
DATE_US %{MONTHNUM}[/-]%{MONTHDAY}[/-]%{YEAR}
DATE_EU %{MONTHDAY}[./-]%{MONTHNUM}[./-]%{YEAR}
ISO8601_TIMEZONE (?:Z|[+-]%{HOUR}(?::?%{MINUTE}))
ISO8601_SECOND (?:%{SECOND}|60)
TIMESTAMP_ISO8601 %{YEAR}-%{MONTHNUM}-%{MONTHDAY}[T ]%{HOUR}:?%{MINUTE}(?::?%{SECOND})?%{ISO8601_TIMEZONE}?
DATE %{DATE_US}|%{DATE_EU}
DATESTAMP %{DATE}[- ]%{TIME}
TZ (?:[PMCE][SD]T|UTC)
DATESTAMP_RFC822 %{DAY} %{MONTH} %{MONTHDAY} %{YEAR} %{TIME} %{TZ}
DATESTAMP_OTHER %{DAY} %{MONTH} %{MONTHDAY} %{TIME} %{TZ} %{YEAR}
```
> 官方使用简单的年月日时间等pattern组合成了不同的复杂的日期格式的pattern  
> 在pattern组合嵌套的时候，也可以掺杂着写正则规则或字符串，例如` %{YEAR}-%{MONTHNUM}-%{MONTHDAY}`

#### grok使用经验
- 尽量给pattern分级别，例如简单的底层的pattern使用正则表示，这种属于底层pattern，上层表示业务逻辑的pattern是另外一个层级。这样嵌套起来逻辑非常清晰
- logstash的日志里面并没有特别好的提供了grok的debug功能，kibana有提供debug的界面，但是我装的这个没有，难道是因为没有装x-pack的原因？不过也有一个[grok debugger的在线服务](https://grokdebug.herokuapp.com)。在这个debugger里面可以方便的提供日志示例，然后编写grok规则，实时查看匹配的效果。同时除了logstash提供的官方pattern之外，还可以增加自定义的pattern，非常方便使用。


### 3. 示例
#### tomcat日志
```
2018-08-28 16:57:09,698 INFO [com.gsmc.png.action.AGDataFeedAction] - getPlayerBetsByDate timeStart:2018-08-28 16:45:52 timeEnd:2018-08-28 16:57:09 loginname:ei_yby666
```
grok pattern
```
# regex basic
JAVALOGMESSAGE (?:.*)

# combined basic
TOMCAT_DATESTAMP 20%{YEAR}-%{MONTHNUM}-%{MONTHDAY} %{HOUR}:?%{MINUTE}(?::?%{SECOND})

# real world logic
AGRECORDTOMCATLOG %{TOMCAT_DATESTAMP:timestamp} %{LOGLEVEL:level} \[%{JAVACLASS:class}\] - %{JAVALOGMESSAGE:logmessage}
```

#### nginx日志
```
171.210.67.86 - - [28/Aug/2018:16:58:43 +0800] "GET /images/qtgames/EVP-thelegendofshaolin.png HTTP/1.1" 200 17762 "https://qy333.vip/mobile/app/gameLobby.jsp" "Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-G9550 Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/7.0 Chrome/59.0.3071.125 Mobile Safari/537.36" "171.210.67.86" 127.0.0.1:16221 0.001 0.001
```
grok pattern
```
NGINXWEB %{IPORHOST:clientip} - - \[%{HTTPDATE:timestamp}\] "(?:%{WORD:verb} %{NOTSPACE:request}(?: HTTP/%{NUMBER:httpversion})?|%{DATA:rawrequest})" %{NUMBER:status} (?:%{NUMBER:body_bytes_sent}|-) (?:"(?:%{URI:http_referer}|-)"|%{QS:http_referer}) %{QS:http_user_agent} %{QS:http_x_forwarded_for} %{URIHOST:upstream_addr} %{NUMBER:upstream_response_time} %{NUMBER:request_time}
```
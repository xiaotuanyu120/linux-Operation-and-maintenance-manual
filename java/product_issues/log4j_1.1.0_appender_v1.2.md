---
title: log4j 1.1.0 log4j.properties appender配置说明
date: 2018-05-18 11:57:00
categories: java/product_issues
tags: [java,log4j.properties]
---
### log4j 1.1.0 log4j.properties appender配置说明

---

### 0. 参考文档
[log4j 1.2 文档](http://logging.apache.org/log4j/1.2/manual.html)

---

### 1. `log4j.properties`示例文档
``` bash
# log4j.rootLogger 或者 log4j.rootCategory = [日志级别],AppenderName1,AppenderName2
# 日志级别：
#     TRACE, DEBUG, INFO, WARN, ERROR and FATAL
# 日志级别顺序：
#     DEBUG < INFO < WARN < ERROR < FATAL
log4j.rootLogger=debug, stdout, R

# log4j.appender.stdout 代表的是stdout这个appender名称
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout

# Pattern to output the caller's file name and line number.
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] (%F:%L) - %m%n

log4j.appender.R=org.apache.log4j.RollingFileAppender
log4j.appender.R.File=example.log

log4j.appender.R.MaxFileSize=100KB
# Keep one backup file
log4j.appender.R.MaxBackupIndex=1

log4j.appender.R.layout=org.apache.log4j.PatternLayout
log4j.appender.R.layout.ConversionPattern=%p %t %c - %m%n
```
> 重点： `log4j.rootLogger 或者 log4j.rootCategory = [日志级别],AppenderName1,AppenderName2`，使用AppenderName之前，必须在这边配置的AppenderName。
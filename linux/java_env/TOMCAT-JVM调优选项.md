TOMCAT-JVM调优选项
2016年8月8日
10:26
 
## 编辑bin目录下的catalina.sh，可配置jvm参数
vim /usr/local/tomcat/bin/catalina.sh
默认有两个参数可以配置，
#   CATALINA_OPTS   (Optional) Java runtime options used when the "start",
#                   "run" or "debug" command is executed.
#                   Include here and not in JAVA_OPTS all options, that should
#                   only be used by Tomcat itself, not by the stop process,
#                   the version command etc.
#                   Examples are heap size, GC logging, JMX ports etc.
 
#   JAVA_OPTS       (Optional) Java runtime options used when any command
#                   is executed.
#                   Include here and not in CATALINA_OPTS all options, that
#                   should be used by Tomcat and also by the stop process,
#                   the version command etc.
#                   Most options should go into CATALINA_OPTS.
 
按照上面两个参数的介绍，我们对heap的参数放在CATALINA_OPTS中
 
 

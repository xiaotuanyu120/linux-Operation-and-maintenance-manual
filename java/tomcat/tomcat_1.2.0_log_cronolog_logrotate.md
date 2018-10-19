---
title: tomcat 1.2.0 日志-cronolog日志切割
date: 2016-10-20 21:44:00
categories: java/tomcat
tags: [linux,tomcat,log]
---
### tomcat 1.2.0 日志-cronolog日志切割

---

### 1. install cronolog
[fedoraproject's download link, cronolog1.6.2](http://pkgs.fedoraproject.org/repo/pkgs/cronolog/cronolog-1.6.2.tar.gz/a44564fd5a5b061a5691b9a837d04979/cronolog-1.6.2.tar.gz)
``` bash
tar zxf cronolog-1.6.2.tar.gz
cd cronolog-1.6.2
./configure
make && make install
```

---

### 2. configure tomcat
<code>bin/catalina.sh</code>内容
``` bash
# 1, add ".%Y-%m-%d"
if [ -z "$CATALINA_OUT" ] ; then
  CATALINA_OUT="$CATALINA_BASE"/logs/catalina.%Y-%m-%d.out
fi

# 2, comment "touch "$CATALINA_OUT"(located about 370 lines)
#touch "$CATALINA_OUT"

#3, change log redirection
if [ "$1" = "-security" ] ; then
  if [ $have_tty -eq 1 ]; then
    echo "Using Security Manager"
  fi  
  shift
  "$_RUNJAVA" "$LOGGING_CONFIG" $LOGGING_MANAGER $JAVA_OPTS $CATALINA_OPTS \
    -Djava.endorsed.dirs="$JAVA_ENDORSED_DIRS" -classpath "$CLASSPATH" \
    -Djava.security.manager \
    -Djava.security.policy=="$CATALINA_BASE"/conf/catalina.policy \
    -Dcatalina.base="$CATALINA_BASE" \
    -Dcatalina.home="$CATALINA_HOME" \
    -Djava.io.tmpdir="$CATALINA_TMPDIR" \
#    org.apache.catalina.startup.Bootstrap "$@" start \
#    >> "$CATALINA_OUT" 2>&1 &
    org.apache.catalina.startup.Bootstrap "$@" start 2>&1\
    |/usr/local/sbin/cronolog "$CATALINA_OUT" &

else
  "$_RUNJAVA" "$LOGGING_CONFIG" $LOGGING_MANAGER $JAVA_OPTS $CATALINA_OPTS \
    -Djava.endorsed.dirs="$JAVA_ENDORSED_DIRS" -classpath "$CLASSPATH" \
    -Dcatalina.base="$CATALINA_BASE" \
    -Dcatalina.home="$CATALINA_HOME" \
    -Djava.io.tmpdir="$CATALINA_TMPDIR" \
#    org.apache.catalina.startup.Bootstrap "$@" start \
#    >> "$CATALINA_OUT" 2>&1 &
    org.apache.catalina.startup.Bootstrap "$@" start 2>&1\
    |/usr/local/sbin/cronolog "$CATALINA_OUT" &
fi
```

---

### 3. restart tomcat
``` bash
bin/catalina.sh stop
bin/catalina.sh start
# if can't stop it, go straight to kill it
```

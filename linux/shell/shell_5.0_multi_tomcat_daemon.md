---
title: SHELL: 5.0 多个tomcat管理脚本
date: 2017-01-20 17:06:00
categories: linux/shell
tags: [shell]
---

``` bash
#!/bin/bash
#chkconfig: 35 80 90

export JAVA_HOME=/usr/java/jdk1.6.0_45

function get_pid() {
    pid=`ps aux |grep java|grep ${shop_base}/$1|awk '{print $2}'`
}

function start() {
    get_pid $1
    [ -n "$pid" ] && echo "$1 already running, pid is $pid" || {
        ${shop_base}/$1/bin/catalina.sh start 1>>$run_log 2>&1
        RETVAL_tmp=$?
        get_pid $1
        [ -n "$pid" ] && echo "start $1 OK, pid is $pid"|| {
            RETVAL_tmp=1
            echo "start $1 failed!! for more information check $run_log"
        }
    }
}

function stop() {
    get_pid $1
    [ -z "$pid" ] && echo "$1 already stopped!" || {
        kill -9 $pid
        RETVAL_tmp=$?
        get_pid $1
        [ -n "pid" ] && echo "$1 stopped"
    }
}

function run() {
    RETVAL_tmp=0
    for shop in ${shopTomcat[@]}
    do
        $1 $shop
	RETVAL=$[$RETVAL+$RETVAL_tmp]
    done
}

run_log=/tmp/payshop.log
echo > $run_log
shop_base=/home/webserver
shopTomcat=(bstdshop
            bxlyshop
            cxlmyshop
            cxsshop
            cyhlwshop
            dftxxshop
            dtsshop
            e68shop
            fcksshop
            fcydshop
            fdlshop
            fgyshop
            htwzshop
            hxmyshop
            jtdxxshop
            jtytshop
            jwsmshop
            kmfsshop
            kpwdshop
            ktsshop
            kxyxshop
            kzsmshop
            ljxshop
            lxqwlshop
            nkwshop
            pmsdshop
            qhdsshop
            qswmshop
            qxfwshop
            qyqfshop
            stczshop
            sxmjcshop
            tlfzshop
            twhshop
            tylshop
            watshop
            wbthshop
            wdfsshop
            xdkjshop
            xdyshop
            xhcshop
            xyhmyshop
            ycmshop
            ylxxshop
            zrhyshop)



case "$1" in
   start)
        run_method=start
        run $run_method
        ;;
   stop)
        run_method=stop
        run $run_method
        ;;
   restart)
        run_method=stop
        run $run_method
	run_method=start
        run $run_method
        ;;
   *)
        echo $"Usage: $0 {start|stop|restart}"
        RETVAL=1
esac
exit $RETVAL
```

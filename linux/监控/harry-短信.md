harry-短信
2016年6月8日
15:00
 
公司之前一直使用的飞信的免费接口来发送Nagios短信报警，但由于1.23飞信内部系统升级，导致发信不能发送，飞信机器人也公布近期不会去破解，so,免费的飞信时代被终结。公司正好有自己的短信接口平台，接下来带大家一起配置nagios调用第三方短信接口。 
1：首先我们要写一个调用短信接口的脚本，网上的脚本大都是python写的，我这个是shell写的，比较好理解。
vi /root/duanxin.sh
# 脚本的日志文件 
LOGFILE="/data1/sms_log/sms_send_.log"  #定义发送短信的日志信息 文件
:>>"$LOGFILE" 
exec 1>>"$LOGFILE" 
exec 2>&1 
 
Uid="test"    #接口的用户名，这个使用接口时对方会提供，我这里的test是随意写的
Key="123456"  #密码与用户名对应，也是接口方提供
 
MOBILE_NUMBER=$1 # 接受短信的手机号码  
QIANMING="%e3%80%90%e9%a9%ac%e5%8f%af%e6%b3%a2%e7%bd%97%e7%bd%91%e3%80%91" #这里重点说一下，签名有的接口需要，有的不需要，因为我们公司的接口需要，所以需要添加上，我这里的签名内容是经过编码的，不加编码会导致发送失败，具体工作中需不需要编码还得看接口哪边有没有要求。
XXD="/usr/bin/xxd" 
CURL="/usr/bin/curl" 
TIMEOUT=5 
MESSAGE_ENCODE=$(echo $(/usr/local/bin/php -r "echo urlencode(\"$2\");"; ) )  #这里的$2是nagios发送短信的第二个变量
URL="http://192.168.100.100:8888/services/msgsend.asmx/SendMsg?userCode=${$Uid}&userPass=${Key}&DesNo=${MOBILE_NUMBER}&Msg=${MESSAGE_ENCODE}${QIANMING}&Channel=0"
#我这里的URL是胡乱写的，我不可能暴漏自己公司的接口哈，但是格式大体是这样的，到时候接口方会提供URL的格式的
# Send it 
set -x 
${CURL} -s --connect-timeout ${TIMEOUT} "${URL}"
2 ：测试脚本
bash /root/duanxin.sh "手机号" "内容"
如果脚本报错，可以根据报错信息检查脚本，如果脚本没有问题，但是短信发不出去，可以看看sms_send_log里面的报错信息
3：nagios 调用脚本，不要忘记脚本要给执行权限，一般脚本放在root目录下，nagios在调用脚本时是不能访问root目录的，所以你还要看你/root目录的权限
define command {
       command_name host-notify-by-sms
       command_line /root/duanxin.sh $CONTACTPAGER$ "$HOSTNAME$ $HOSTSTATE$ $SHORTDATETIME$"
       }
define command {
       command_name service-notify-by-sms
       command_line /root/duanxin.sh $CONTACTPAGER$ "$SERVICESTATE$ $SERVICEOUTPUT$ $HOSTALIAS$/$SERVICEDESC$ $SHORTDATETIME$"
       }
4：看到这里大家可能对上面脚本的$1和 $2概念比较模糊，其实刚开始我也迷糊，nagios怎么知道我要发送的号码呢，后来研究发现，$CONTACTPAGER$这个
变量就是nagios内部联系人的变量，也就是他会调用我们在contacts.cfg里面定义的手机号，而我们脚本里面定义的$1就对应$CONTACTPAGER$，$2就对应
"$HOSTNAME$ $HOSTSTATE$ $SHORTDATETIME$"

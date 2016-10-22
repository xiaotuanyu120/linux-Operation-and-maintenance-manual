---
title: SAMBA: 配置参数详解 
date: 2015年7月17日
categories: 17:25
---
 
samba配置参数详解  
samba大约超过200个配置参数.
[global]
    netbios name = HARDY     #设置服务器的netbios名字
    server string = my server #对samba服务器的描述
    workgroup = DEBIAN_FANS  #samba服务器属于哪个工作组名或域名
    encrypt passwords = yes  #密码需要加密
    message command = /bin/sh -c 'xedit %s ; rm %s' &  #当winpopup向网络用户发消息时，此参数可用来接收消息，可惜没有发送。
    security = user          #用于登陆域，或用户验证登陆
    wins support = yes       #设置本地为wins服务器，当WINS SERVER没有启动,SAMBA利用广播来进行名字解析，而WINS SERVER是通过udp协议来进行包的传送和不同网络中的路由．因此在不同的网络中进行NETbios解析，要打开wins server.
    samba 利用"remote browse sync" 来和远程的local master browser进行信息的同步 
    name resolve order = wins lmhosts hosts bcast # 解析netbios的顺序 (lmhosts-lan manager file)(hosts-unix的/etc/hosts,dns,nis)(wins)(bcast,广播)  
  ; wins server = 192.168.0.22 # 指定wins服务器的网络地址
  ; wins proxy =  yes          # 如果指定的wins服务器在不同的网断，就需要打开
  ; dns proxy = yes           # 当wins服务器在wins中找不到名字的话，就会查找dns.很有用哦
  ; admin users = hardy     #samba的管理用户，默认是root.
    add user script = /usr/sbin/useradd -d /dev/null -g 100 -s /bin/false  %u #代替手工的添加计算机账号(看pdc配置文件),我没有试成功。
    prefered master = yes    # 强制使samba成为local master
    local master = yes       # 使nmbd试着在子网中成为master browse(储存子网中所有的netbios name 所对应ip的列表)
    domain master = yes      # 使nmbd成为广域网的netbios name 所对应ip的列表，任务是同步所有子网中local master的列表。因此使各终端
                          得到整个域的浏览列表，如果设置了domain logons = yes 那么domain master默认是yes
    os level = 33            #操作系统级别，winNT4.0服务器-33  如果数值高于33，samba就成为local master browers不管网络中是否存在winNT4.0
                                            winNT3.51服务器-32
                                            winNT4.0客户机-17
                                            winNT3.51客户机-16
                                            win98 - 2
                                            win95 - 1
                                            win3.1- 1  
    time server  = yes # nmbd将会告知windows的客户端自己是作为smb的时间服务器，可以用net time /yes /set 来同步时间
    domain logons = yes      #设置samba为win98/95所登陆的域服务器。 
    printer admin = hardy
    username map = /etc/samba/smbusers #用户别名文件。
    logon path =       # 看[profiles]的说明
    logon drive = Z:        # 把用户的home目录映射成z:盘，只适用于NT,但我用XP也可以
    logon home =   #指定客户端登陆的home目录的位置，当然[homes]目录需要定义哦，为了同时支持9x和nt登陆.该项要设置成为, 并且指定logon path =   
    socket options = TCP_NODELAY SO_RCVBUF=8192 SO_SNDBUF=8192 #据说可以提高samba性能
    password server =       # 其他的NT 服务器，或samba服务器但security=server或domain 的ntbios 名字
    hosts allow = 192.168.0. #指定那些主机可以访问
    hosta deny =  192.168.8. #指定那些主机不可以访问
    interfaces = 192.168.0.100/255.255.255.0     #设置samba将对哪些网络接口进行服务。
    bind interface only = yes                    # 如果设置成是，samba只对这几个网络接口服务
    socket address = 192.168.0.10                #强制samba只在该端口监听
    netbios aliases = yao xiao ping              # 设置3个samba虚拟服务器
    include = /etc/samba/smb.conf.another        #包括另外的samba配置文件
    show add printer wizard= yes   # 当用户添加打印机时,显示安装向导. 
    printcap name = /etc/printcap
    load printers = yes
    log file = /var/log/samba/%m.log             #日志文件
    max log size = 0                             #日志文件的大小
    log level = 0                                # 日志级别 0 表示没有，3 一般比较合理
    syslog = 2                                   # syslog的日志级(0,err)(1,warning)(2,notice)(3,ifno)(4或以上，debug)
    syslog only = yes                            #只使用系统日志，关闭samba日志
    smb passwd file = /etc/samba/smbpasswd
    unix password sync = yes                     #当用户改变samba加密的密码时,SAMBA会试着更新UNIX用户密码
    passwd program = /usr/bin/passwd %u          #这个就指定更改密码的命令
    passwd chat = *New*password* %n\n *Retype*new*password* %n\n *passwd:*all*authentication*tokens*updated*successfully*  #更改密码时的对话
    password level = ＂数字＂　在win9x下密码最多出现大写字母的个数,因为９Ｘ是使用平文传送密码的。
    null password = yes      # 是否允许空密码
    pam password change = no  #为samba打开pam改变密码控制机制的支持，
    obey pam restrictions = no #当encrypt passwords = yes 时，samba 会忽略pam的验证，因为pam不支持(挑战/回答)验证机制，他只用来做平文密码的验证。
    nt acl support = yes # 允许NT用户修改unix文件的属性
    announce as = NT         #告诉客户端，samba是以winNT的身份来运行的 
    announce version = 4.0   #告诉客户端，samba是以4.0版本来运行的
    remote announce = 192.168.33.33/DEBIAN_FANS #子网和工作组，允许SAMBA和子网同步浏览(local master) 
    browse list = yes        #samba将在服务器上生成浏览列表
    remote browse sync = 192.168.222.22 # samba 将会同步在其他子网(local master)的列表，但子网的(LOCAL MASTER)必须是SAMBA服务器
    unix realname #在客户端是否采用unix全文件名
    nis homedir = yes # SAMBA 采用NIS的/etc/nsswitch.conf 文件，而不用/etc/passwd,来找用户的home目录
    logon script = %U.bat  #指定客户端登陆文件名
[netlogon]
    path = /home/samba/netlogon  # 该目录中存放用户登陆脚本(logon script = %U.bat)
    writable = no
    guest ok = yes
    share modes = no        # 打开dos的锁全文件的方式，在比较繁忙的服务器上关闭它，会提高性能。
    ;write list = hardy,root  # 指定哪些用户可以在该只读共享文件上有写的权限
[profiles]            # 设置每个登陆用户的环境，包括桌面的属性，开始菜单上应用程序，以及其他项目。它是储存在服务器的。
    path = /home/samba
    writable = yes    #允许些操作
    browsable = yes   #允许该目录被显示在系统资源中
    create mask = 0600
    directory mask = 0700
[printers]
    path = /var/spool/samba
    guest ok = yes
    browseable = yes
    printable = yes
    read only = yes
[cdrom]
    path = /mnt/cdrom
    read only = yes
    gue  st ok = yes
    locking = no      #由于是只读文件
    public = yes 
    preexec = /bin/mount /dev/cdrom   #在链接共享文件之前，要执行的命令
    postexec = /bin/umount /dev/cdrom  #在断开共享文件之前，要执行的命令  但我不知道什么时候才算断开。
[homes]
   comment = Home
   magic script = hardy.sh  #当用户打开该共享文件hardy.sh将被执行，结果将被重定向到客户端
   magic output = /var/log/magicoutput #指定结果输出到该文件
   volume = user-at-home  # dos的盘符卷标
   read list = badguy    # 限制这些用户在可写文件上的些操作权限
   valid users = %S      # 可登陆用户
   invalid users = root   #不可登陆用户
   max connections = 0    # 最大连接数
   read only = no
   writable = yes
   create mode = 0777
   directory mode = 0775
   browseable = no
[public]
   path = /var/ftp
   dont descend = etc bin lib # 指定这些在/var/ftp目录下的目录是不可访问的。
   follow symlinks = yes      # 指定是否允许文件的链接
   wide links = yes           # 指定是否可以链接到/var/ftp以外的文件或目录
   hide dot files = yes           # 是否隐藏点文件
   hide files = /*.java/*.cpp/  #  隐藏指定文件 
   veto files = /*config/*secret/ # 完全隐藏文件，比隐藏要强硬。重要文件使用
   delete veto files = no        # 当用户删除有veto files的目录时， 是否允许删除veto files以及目录.
   delete readonly = no          # 是否允许dos用户删除只读文件 
   security mask = 0777 # 0 表示允许修改，1 表示不允许
   create mask = 0777  # 如果上面的(security mask)没设，则按照这个模式
   force security mode = 0 # 当修改文件的属性，指定哪些模式必须设置
   force create mode = 0 # 如果上面的(force security mode)没设，则按照这个模式
   directory security mask = 0777 # 目录，同上．
   directory mask = 0777
   force directory security mode = 0777 
   force directory mode =0777
   case sensitive = no # 是否区分文件名的大小写(windows 是不区分的)
   default case = upper/lower   #设置默认的是大写还是小写
   preserve case = yes          #不进行大小写的转换，不转换成默认(default case)
   short preserve case = yes    #将文件名转成8.3的dos端文件名
   locking = yes            #由于文件只能同时被打开一次，当文件打开时，samba会自动让其他访问守候，为了文件不被破坏
   oplocks = no            #本地缓存，如果设置成yes,会提高samba的速度，据说在linux-2.5以前的版本有bug,所以在2.4中还是设置成no
   level2 oplocks = no     # 同上
变量替换 VARIABLESUBSTITUTIONS
       在配置文件中可以用很多字符串进行替换.例如,当用户以john的名称建立连接后,选项"path =  %u"就被解释成"path  =
       /tmp/john".
       这些置换会在后面的描述中说明,这里说明一些可以用在任何地方的通用置换.它们是：
       %U     对话用户名(客户端想要的用户名不一定与取得的一致.)
       %G     %U的用户组名
       %h     运行Samba的主机的internet主机名
       %m     客户机的NetBIOS名(非常有用)
       %L     服务器的NetBIOS名.这使得你可以根据调用的客户端来改变你的配置,这样你的服务器就可以拥有"双重个性".
              Note  that this parameter is not available when Samba listens on
              port 445, as clients no longer send this information
       %M     客户端的internet主机名
       %R     协议协商后选择的协议,它可以是CORE,COREPLUS,LANMAN1,LANMAN2或NT1中的一种.
       %d     当前samba服务器的进程号.
       %a     远程主机的结构.现在只能认出来某些类型,并且不是100%可靠.目前支持的有Samba、WfWg、WinNT和Win95.任何其他的都被认作"UNKNOWN".如果出现错误就给samba-
              发一个3级的日志以便修复这个bug.
       %I     客户机的IP地址.
       %T     当前的日期和时间.
       %D     Name of the domain or workgroup of the current user.
       %$(envvar)
              The value of the environment variable envar.
       The following substitutes apply only to some configuration options(only
       those that are used when a connection has been established):
       %S     当前服务名
       %P     当前服务的根目录
       %u     当前服务的用户名
       %g     %u的用户组名
       %H     %u所表示的用户的宿主目录
       %N     tNIS服务器的名字.它从auto.map获得.如果没有用--with-auto-
              mount选项编译samba,那么它的值和%L相同.
       %p     用户宿主目录的路径.它由NIS的auot.map得到.NIS的auot.map入口项被分为"%N:%p".
       灵活运用这些置换和其他的smb.conf选项可以做出非常有创造性的事情来.
 
来自 <http://blog.csdn.net/werm520/article/details/7457833> 
 

backlog：内核listen()中的参数
2015年12月10日 星期四
16:06
 
listen man文档中的description：
'''
listen() marks the socket referred to by sockfd as a passive socket, that is, as a socket that will be used to accept incoming connection requests using accept(2).
The sockfd argument is a file descriptor that refers to a socket of type SOCK_STREAM or SOCK_SEQPACKET.
 
The backlog argument defines the maximum length to which the queue of pending connections for sockfd may grow. If a connection request arrives when the queue is full, the client may receive an error with an indication of ECONNREFUSED or, if the underlying protocol supports retransmission, the request may be ignored so that a later reattempt at connection succeeds.
'''
 
## backlog是一个定义最大连接请求队列的参数。每个socket开始调用listen()时，系统会分配一个backlog参数给socket。如果连接请求超过了这个最大值，会返回给客户端一个ECONNREFUSED。
查看命令：
# ss -ln
State      Recv-Q Send-Q        Local Address:Port          Peer Address:Port
LISTEN     0      128                      :::22                      :::*
LISTEN     0      128                       *:22                       *:*
LISTEN     0      100                     ::1:25                      :::*
LISTEN     0      100               127.0.0.1:25                       *:*
 
## ss 命令参数
-l, --listening
              Display listening sockets.
-n, --numeric
              Do now try to resolve service names.
## ss命令描述
ss is used to dump socket statistics. It allows showing information
similar to netstat. It can display more TCP and state informations
than other tools.

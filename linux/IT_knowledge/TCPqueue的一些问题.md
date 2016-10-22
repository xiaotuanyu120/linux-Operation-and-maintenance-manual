TCP queue 的一些问题
2015年12月11日 星期五
10:14
 
先来回顾下三次握手里面涉及到的问题:
1. 当 client 通过 connect 向 server 发出 SYN 包时，client 会维护一个 socket 等待队列，而 server 会维护一个 SYN 队列
2. 此时进入半链接的状态，如果 socket 等待队列满了，server 则会丢弃，而 client 也会由此返回 connection time out；只要是 client 没有收到 SYN+ACK，3s 之后，client 会再次发送，如果依然没有收到，9s 之后会继续发送
3. 半连接 syn 队列的长度为 max(64, /proc/sys/net/ipv4/tcp_max_syn_backlog)  决定
4. 当 server 收到 client 的 SYN 包后，会返回 SYN, ACK 的包加以确认，client 的 TCP 协议栈会唤醒 socket 等待队列，发出 connect 调用
5. client 返回 ACK 的包后，server 会进入一个新的叫 accept 的队列，该队列的长度为 min(backlog, somaxconn)，默认情况下，somaxconn 的值为 128，表示最多有 129 的 ESTAB 的连接等待 accept()，而 backlog 的值则由 int listen(int sockfd, int backlog) 中的第二个参数指定，listen 里面的 backlog 的含义请看这里。需要注意的是，一些 Linux 的发型版本可能存在对 somaxcon 错误 truncating 方式。
6. 当 accept 队列满了之后，即使 client 继续向 server 发送 ACK 的包，也会不被相应，此时，server 通过 /proc/sys/net/ipv4/tcp_abort_on_overflow 来决定如何返回，0 表示直接丢丢弃该 ACK，1 表示发送 RST 通知 client；相应的，client 则会分别返回 read timeout 或者 connection reset by peer。上面说的只是些理论，如果服务器不及时的调用 accept()，当 queue 满了之后，服务器并不会按照理论所述，不再对 SYN 进行应答，返回 ETIMEDOUT。根据这篇文档的描述，实际情况并非如此，服务器会随机的忽略收到的 SYN，建立起来的连接数可以无限的增加，只不过客户端会遇到延时以及超时的情况。
可以看到，整个 TCP stack 有如下的两个 queue:
1. 一个是 half open(syn queue) queue(max(tcp_max_syn_backlog, 64))，用来保存 SYN_SENT 以及 SYN_RECV 的信息。
2. 另外一个是 accept queue(min(somaxconn, backlog))，保存 ESTAB 的状态，但是调用 accept()。
注意，之前我对 Recv-Q/Send-Q 的理解有些误差，使用 ss 获取到的 Recv-Q/Send-Q 在 LISTEN 状态以及非 LISTEN 状态所表达的含义是不同的。从 tcp_diag.c 源码中可以看到二者的区别:
LISTEN 状态: Recv-Q 表示的当前等待服务端调用 accept 完成三次握手的 listen backlog 数值，也就是说，当客户端通过 connect() 去连接正在 listen() 的服务端时，这些连接会一直处于这个 queue 里面直到被服务端 accept()；Send-Q 表示的则是最大的 listen backlog 数值，这就就是上面提到的 min(backlog, somaxconn) 的值。
其余状态: 非 LISTEN 状态之前理解的没有问题。Recv-Q 表示 receive queue 中的 bytes 数量；Send-Q 表示 send queue 中的 bytes 数值。
要理解上面总结的这些，可以参见下这两个案例(1, 2)。 
通过 "SYNs to LISTEN sockets dropped" 以及 "times the listen queue of a socket overflowed" 这两个 netstat -s 获取到的 TCP 状态，可以很快的发现系统存在的一些问题。
任何一个包含 "dropped" 或者 "overflowed" 并且数值一直居高不下的 metric 从字面含义理解来看，都不是一个好现象。
对于 Nginx 来说，backlog 的默认值为 511，这个可以通过 ss/netstat 的 Send-Q 确认:
State      Recv-Q Send-Q        Local Address:Port          Peer Address:Port
LISTEN     0      511                       *:80                       *:*     
可以通过适当的增大 nginx 的 backlog 以及 somaxconn 来增大队列:
listen 80 backlog=1638
上面说了这么多，其实就是为了引入下面这个问题。
我们线上一个基于 Netty 的代码，3.5.12 的版本，监控显示 "times the listen queue of a socket overflowed" 常年居高不下，动辄几十 K，通过 ss，我们发现其 backlog 的值只有 50:
Recv-Q Send-Q           Local Address:Port               Peer Address:Port   
0      50                           *:6928                          *:*        users:(("java",454409,196))
g 了一下，发现这个版本复用了 Java 默认的 50 这个值。将其增加到 1024 测试，监控曲线一下子降低到了 0。

除了上面这些，还有一个比较基础的 net.core.netdev_max_backlog，如果内核接受包的速度大于被 userspace 处理的速度，该值定义了可以在接口输入最大的的包数量。
chartbeat 分享了两篇很精彩的文档，其中涉及到了 queue 的一些问题。
Lessons learned tuning TCP and Nginx in EC2 1 
Lessons learned tuning TCP and Nginx in EC2 2
ref:
http://madalanarayana.wordpress.com/2014/04/13/learnings-on-tcp-syn/
 
来自 <http://jaseywang.me/2014/07/20/tcp-queue-%E7%9A%84%E4%B8%80%E4%BA%9B%E9%97%AE%E9%A2%98/> 
 

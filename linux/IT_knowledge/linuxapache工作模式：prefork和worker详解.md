linux apache工作模式：prefork和worker详解
Tuesday, 31 March 2015
1:52 PM
 
本文给大家讲述linux下apache的工作模式：prefork和worker
apache作为现今web服务器用的最广泛也是最稳定的开源服务器软件，其工作模式有许多中，目前主要有两种模式：prefork模式和worker模式
一、两种模式
prefork模式：
prefork是Unix平台上的默认（缺省）MPM，使用多个子进程，每个子进程只有一个线程。每个进程在某个确定的时间只能维持一个连接，效率高，但内存占用量比较大。
这个多路处理模块(MPM)实现了一个非线程型的、预派生的web服务器，它的工作方式类似于Apache 1.3。它适合于没有线程安全库，需要避免线程兼容性问题的系统。它是要求将每个请求相互独立的情况下最好的MPM，这样若一个请求出现问题就不会影响到其他请求。
worker模式：
worker使用多个子进程，每个子进程有多个线程，每个线程在某个确定的时间只能维持一个连接，内存占用量比较小，适合高流量的http服务器。缺点是假如一个线程崩溃，整个进程就会连同其任何线程一起"死掉"，所以要保证一个程式在运行时必须被系统识别为"每个线程都是安全的"。
此多路处理模块(MPM)使网络服务器支持混合的多线程多进程。由于使用线程来处理请求，所以可以处理海量请求，而系统资源的开销小于基于进程的MPM。但是它也使用了多进程，每个进程又有多个线程，以获得基于进程的MPM的稳定性。
二、apache模式的查看和安装
1、常看当前模式
如果apache已经安装，我们可以用"httpd -l"命令查看当前模式。若找到 prefork.c 则表示当前工作在prefork模式，同理出现 worker.c 则工作在worker模式。
如果apache还未安装，我们在编译的时候可以加入 --with-pem=(prefork|worker) 选项决定启用什么模式。
2、切换模式
a. 将当前的prefork模式启动文件改名
mv httpd httpd.prefork
b. 将worker模式的启动文件改名
mv httpd.worker httpd
c. 修改Apache配置文件
vi /usr/local/apache2/conf/extra/httpd-mpm.conf
找到里边的如下一段，可适当修改负载等参数：
<IfModule mpm_worker_module>
StartServers 
MaxClients 
MinSpareThreads 
MaxSpareThreads 
ThreadsPerChild 
MaxRequestsPerChild 
</IfModule>
d. 重新启动服务
/usr/local/apache2/bin/apachectl restart
处于稳定性和安全性考虑，不建议更换apache2的运行方式，使用系统默认prefork即可。另外很多php模块不能工作在worker模式下，例如redhat linux自带的php也不能支持线程安全。所以最好不要切换工作模式。
三、prefork和worker模式的比较
prefork模式使用多个子进程，每个子进程只有一个线程。每个进程在某个确定的时间只能维持一个连接。在大多数平台上，Prefork MPM在效率上要比Worker MPM要高，但是内存使用大得多。prefork的无线程设计在某些情况下将比worker更有优势：它可以使用那些没有处理好线程安全的第三方模块，并且对于那些线程调试困难的平台而言，它也更容易调试一些。
worker模式使用多个子进程，每个子进程有多个线程。每个线程在某个确定的时间只能维持一个连接。通常来说，在一个高流量的HTTP服务器上，Worker MPM是个比较好的选择，因为Worker MPM的内存使用比Prefork MPM要低得多。但worker MPM也由不完善的地方，如果一个线程崩溃，整个进程就会连同其所有线程一起"死掉"。由于线程共享内存空间，所以一个程序在运行时必须被系统识别为"每个线程都是安全的"。
总的来说，prefork方式速度要稍高于worker，然而它需要的cpu和memory资源也稍多于woker。
四、prefork模式配置详解
<IfModule mpm_prefork_module>
ServerLimit 
StartServers 
MinSpareServers 
MaxSpareServers 
MaxClients 
MaxRequestsPerChild 
</IfModule>
ServerLimit
默认的MaxClient最大是256个线程，如果想设置更大的值，就的加上ServerLimit这个参数。20000是ServerLimit这个参数的最大值。如果需要更大，则必须编译apache，此前都是不需要重新编译Apache。
生效前提：必须放在其他指令的前面
StartServers
指定服务器启动时建立的子进程数量，prefork默认为5。
MinSpareServers
指定空闲子进程的最小数量，默认为5。如果当前空闲子进程数少于MinSpareServers ，那么Apache将以最大每秒一个的速度产生新的子进程。此参数不要设的太大。
MaxSpareServers
设置空闲子进程的最大数量，默认为10。如果当前有超过MaxSpareServers数量的空闲子进程，那么父进程将杀死多余的子进程。此参数不要设的太大。如果你将该指令的值设置为比MinSpareServers小，Apache将会自动将其修改成"MinSpareServers+1"。
MaxClients
限定同一时间客户端最大接入请求的数量(单个进程并发线程数)，默认为256。任何超过MaxClients限制的请求都将进入等候队列，一旦一个链接被释放，队列中的请求将得到服务。要增大这个值，你必须同时增大ServerLimit。
MaxRequestsPerChild
每个子进程在其生存期内允许伺服的最大请求数量，默认为10000.到达MaxRequestsPerChild的限制后，子进程将会结束。如果 MaxRequestsPerChild为"0"，子进程将永远不会结束。将MaxRequestsPerChild设置成非零值有两个好处：
1. 可以防止(偶然的)内存泄漏无限进行，从而耗尽内存。
2. 给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。
五、worker模式配置详解
<IfModule mpm_worker_module>
StartServers 
MaxClients 
MinSpareThreads 
MaxSpareThreads 
ThreadsPerChild 
MaxRequestsPerChild 
</IfModule>
StartServers
服务器启动时建立的子进程数，默认值是"3"。
MaxClients
允许同时伺服的最大接入请求数量(最大线程数量)。任何超过MaxClients限制的请求都将进入等候队列。默认值 是"400"，16(ServerLimit)乘以25(ThreadsPerChild)的结果。因此要增加MaxClients的时候，你必须同时增加ServerLimit的值。
MinSpareThreads
最小空闲线程数，默认值是"75"。这个MPM将基于整个服务器监视空闲线程数。如果服务器中总的空闲线程数太少，子进程将产生新的空闲线程。
MaxSpareThreads
设置最大空闲线程数。默认值是"250"。这个MPM将基于整个服务器监视空闲线程数。如果服务器中总的空闲线程数太多，子进程将杀死多余的空闲线程。 MaxSpareThreads的取值范围是有限制的。Apache将按照如下限制自动修正你设置的值：worker要求其大于等于 MinSpareThreads加上ThreadsPerChild的和。
ThreadsPerChild
每个子进程建立的常驻的执行线程数。默认值是25。子进程在启动时建立这些线程后就不再建立新的线程了。
MaxRequestsPerChild
设置每个子进程在其生存期内允许伺服的最大请求数量。到达MaxRequestsPerChild的限制后，子进程将会结束。如果MaxRequestsPerChild为"0"，子进程将永远不会结束。将MaxRequestsPerChild设置成非零值有两个好处：
1. 可以防止(偶然的)内存泄漏无限进行，从而耗尽内存。
2. 给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。
注意对于KeepAlive链接，只有第一个请求会被计数。事实上，它改变了每个子进程限制最大链接数量的行为。
六、总结
以前apache主流模式为prefork，现在worker模式也开始多了起来，区别来说，worker模式可以应对高流量，但是安全性不太好；prefork模式安全性比较好，但是性能会差一点，各位可以根据自己服务器的类别选取不同的模式，更好的使用apache。
 
来自 <http://www.itjsxx.com/linux/apache_prefork_worker,.html> 

PHP-FPM:进程数pm.max_children
2015年12月11日 星期五
10:38
 
现在nginx + fpm 基本成为主流的配置，其中我们比较关注的是pm.max_chindren的配置
 
首先，我们关注一个前提设置： pm = static/dynamic，
这个选项是标识fpm子进程的产生模式：
static ：表示在fpm运行时直接fork出pm.max_chindren个worker进程，
dynamic：表示，运行时fork出start_servers个进程，随着负载的情况，动态的调整，最多不超过max_children个进程。
一般推荐用static，优点是不用动态的判断负载情况，提升性能，缺点是多占用些系统内存资源。
上面的告诉我们max_chindren代表的worker的进程数。普遍认为，这个配置越多能同时处理的并发也就越多，这是一个比较大的误区：
 
1） 查看了fpm的相关源码， 管理进程和worker进程是通过pipe进行数据通讯的。所以进程多了，增加进程管理的开销，系统进程切换的开销，更核心的是，能并发执行的fpm进程不会超过cpu个数。通过多开worker的个数来提升qps， 是错误的理解，不会说你多开了几个进程，就多出几个cpu来处理。
2） 但worker进程开少了，如果server比较繁忙的话，会导到nginx把数据打到fpm的时候，发现所有的woker都在工作中，没有空闲的worker来接受请求，从而导致502。
那worker数到底该怎么配置呢？
 
理论上woker进程数=cpu的个数是最合理的，但由于第2点的原因，可能每个worker都没处理完请求，这样，就会频现502了。但多开请求，只是说避免502，暂时把请求hang住，但这只是缓解之道，实际上这不但不会增加系统的并发，而且会加重系统的负荷，所以，设置一个合理的worker数就比较重要了。
天下武功，唯快不破，只有尽可能的提升程序的效率，把单个请求的时间压缩到最低，这样，单个worker的处理时间变短了，那在单位时间里能处理的请求自然就多了。
那么可以通过每个worker在单位时间内处理的请求数来预估max_children的个数。假如最大的一个请求的处理时间是100ms内，而在100ms之内同时有100个请求过来，那了理论上就需要配置100个worker进程，先把请求给hang住。
但最大的请求耗时可能会受很多外在的情况影响，不太好预估，其实这里有一个捷径，来配置你的max_children数， 就是你前期先把max_childnren设置成一个比较大的值，稳定运行一段时间后，观察fpm的status里的 max active processes 是多少，然后把max_children配置比他大一些就ok了。
希望这些文章能给大家有一些帮助。
 
来自 <http://www.epooll.com/archives/784/> 
 

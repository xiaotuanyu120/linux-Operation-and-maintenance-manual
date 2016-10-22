linux内核优化
2016年7月29日
16:38
 
5.4. 容量调节
本小节总结了内存、内核以及文件系统容量，与每一部分相关的参数以及调节这些参数所涉及的交换条件。
要在调节时临时设定这些值，请将所需值 echo 到 proc 文件系统中的适当文件中。例如：要将 overcommit_memory 临时设定为 1，请运行：
# echo 1 > /proc/sys/vm/overcommit_memory
注：到 proc 文件系统中该参数的路径要具体看此变更所影响的系统。
要永久设定这些值，则需要使用 sysctl 命令。有关详情请参考《部署指南》，网址为http://access.redhat.com/site/documentation/Red_Hat_Enterprise_Linux/。
与容量相关的内存可调参数
以下参数位于 proc 文件系统的 /proc/sys/vm/ 目录中。
overcommit_memory
规定决定是否接受超大内存请求的条件。这个参数有三个可能的值：
o 0 - 默认设置。内核执行启发式内存过量使用处理，方法是估算可用内存量，并拒绝明显无效的请求。遗憾的是因为内存是使用启发式而非准确算法计算进行部署，这个设置有时可能会造成系统中的可用内存超载。
o 1 - 内核执行无内存过量使用处理。使用这个设置会增大内存超载的可能性，但也可以增强大量使用内存任务的性能。
o 2 - 内存拒绝等于或者大于总可用 swap 大小以及 overcommit_ratio 指定的物理 RAM 比例的内存请求。如果您希望减小内存过度使用的风险，这个设置就是最好的。
注意
只为 swap 区域大于其物理内存的系统推荐这个设置。
overcommit_ratio
将 overcommit_memory 设定为 2 时，指定所考虑的物理 RAM 比例。默认为 50。
max_map_count
规定某个进程可能使用的最大内存映射区域。在大多数情况下，默认值 65530 就很合适。如果您的程序需要映射比这个文件数更多的文件可增大这个值。
nr_hugepages
规定在内核中配置的超大页数。默认值为 0。只有系统中有足够的连续可用页时方可分配（或者取消分配）超大页。为这个参数保留的页无法用于其他目的。安装的文件 /usr/share/doc/kernel-doc-kernel_version/Documentation/vm/hugetlbpage.txt 中有详细的内容。
与容量相关的内核可调参数
以下参数位于 proc 文件系统的 /proc/sys/kernel/ 目录中。
msgmax
以字节为单位规定信息队列中任意信息的最大允许大小。这个值一定不能超过该队列的大小（msgmnb）。默认值为 65536。
msgmnb
以字节为单位规定单一信息队列的最大值。默认为 65536 字节。
msgmni
规定信息队列识别符的最大数量（以及队列的最大数量）。64 位架构机器的默认值为 1985；32 位架构机器的默认值为 1736。
shmall
以字节为单位规定一次在该系统中可以使用的共享内存总量。64 位架构机器的默认值为 4294967296；32 位架构机器的默认值为 268435456。
shmmax
以字节为单位规定内核可允许的最大共享内存片段。64 位架构机器的默认值为 68719476736；32 位架构机器的默认值为 4294967295。注：但内核支持的值比这个值要多得多。
shmmni
规定系统范围内最大共享内存片段。在 64 位和 32 位架构机器中的默认值都是 4096。
threads-max
规定一次内核使用的最大线程（任务）数。默认值与 max_threads 相同。使用的方程式是：
max_threads = mempages / (8 * THREAD_SIZE / PAGE_SIZE )
threads-max 的最小值为 20。
与容量相关的文件系统可调参数
以下参数位于 proc 文件系统的 /proc/sys/fs/ 目录中。
aio-max-nr
规定在所有活动异步 I/O 上下文中可允许的最多事件数。默认值为 65536。注：更改这个值不会预先分配或者重新定义内核数据结构大小。
file-max
列出内核分配的文件句柄最大值。默认值与内核中的 files_stat.max_files 映射，该参数可将最大值设定为 (mempages * (PAGE_SIZE / 1024)) / 10 或者 NR_FILE（在红帽企业版 Linux 中是 8192）。增大这个值可解决由于缺少文件句柄而造成的错误。
Out-of-Memory Kill 可调参数
内存不足（OOM）指的是所有可用内存，包括 swap 空间都已被分配的计算状态。默认情况下，这个状态可造成系统 panic，并停止如预期般工作。但将 /proc/sys/vm/panic_on_oom 参数设定为 0 会让内核在出现 OOM 时调用 oom_killer 功能。通常 oom_killer 可杀死偷盗进程，并让系统正常工作。
可在每个进程中设定以下参数，提高您对被 oom_killer 功能杀死的进程的控制。它位于 proc 文件系统中 /proc/pid/ 目录下，其中 pid 是进程 ID。
oom_adj
定义 -16 到 15 之间的一个数值以便帮助决定某个进程的 oom_score。oom_score 值越高，被 oom_killer 杀死的进程数就越多。将 oom_adj 值设定为 -17 则为该进程禁用 oom_killer。
重要
由任意调整的进程衍生的任意进程将继承该进程的 oom_score。例如：如果 sshd 进程不受 oom_killer功能影响，所有由 SSH 会话产生的进程都将不受其影响。这可在出现 OOM 时影响 oom_killer 功能救援系统的能力。
 
来自 <https://access.redhat.com/documentation/zh-CN/Red_Hat_Enterprise_Linux/6/html/Performance_Tuning_Guide/s-memory-captun.html> 
 

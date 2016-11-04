MYSQL: 设置wait_timeout控制sleep线程太多
2016年2月6日
11:25
 
现象
============================
## 登入mysql查看processlist
## 可查看mysql所有线程的threadid、执行用户、执行host、执行命令、执行时间等
mysql> show full processlist;
+----------+--------+--------------------+------+---------+------+-------+-----------------------+-----------+---------------+-----------+
| Id       | User   | Host               | db   | Command | Time | State | Info                  | Rows_sent | Rows_examined | Rows_read |
+----------+--------+--------------------+------+---------+------+-------+-----------------------+-----------+---------------+-----------+
| 12429231 | dwuser | 61.14.162.11:31860 | tydb | Sleep   | 3908 |       | NULL                  |        11 |            11 |        11 |
| 12441280 | dwuser | 192.168.3.9:57288  | tydb | Sleep   |    0 |       | NULL                  |         0 |             0 |         0 |
| 12441302 | dwuser | 61.14.162.11:22255 | tydb | Sleep   | 1395 |       | NULL                  |        11 |            11 |        11 |
| 12441341 | dwuser | 192.168.3.8:43953  | tydb | Sleep   |   60 |       | NULL                  |         0 |             0 |         0 |
| 12441380 | dwuser | 61.14.162.11:22623 | tydb | Sleep   |  799 |       | NULL                  |         0 |             0 |         0 |
| 12441563 | dwuser | 192.168.3.9:57449  | tydb | Sleep   |    3 |       | NULL                  |         0 |             0 |         0 |
| 12441573 | dwuser | 192.168.3.9:57454  | tydb | Sleep   |    4 |       | NULL                  |         0 |             0 |         0 |
| 12441687 | dwuser | 192.168.3.8:44244  | tydb | Sleep   |   10 |       | NULL                  |         0 |             0 |         0 |
| 12441739 | dwuser | 192.168.3.9:57526  | tydb | Sleep   |   29 |       | NULL                  |         0 |             0 |         0 |
| 12441751 | dwuser | 192.168.3.8:44315  | tydb | Sleep   |   60 |       | NULL                  |         0 |             0 |         0 |
| 12441779 | dwuser | 192.168.3.5:6814   | dwdb | Sleep   |   34 |       | NULL                  |         0 |             0 |         0 |
| 12441785 | dwuser | 192.168.3.9:57545  | tydb | Sleep   |   21 |       | NULL                  |         0 |             0 |         0 |
| 12441797 | dwuser | 192.168.3.8:44359  | tydb | Sleep   |   75 |       | NULL                  |         0 |             0 |         0 |
| 12441811 | dwuser | 192.168.3.4:30665  | dwdb | Sleep   |   29 |       | NULL                  |         0 |             0 |         0 |
| 12441812 | dwuser | 192.168.3.5:6829   | dwdb | Sleep   |   59 |       | NULL                  |         0 |             0 |         0 |
| 12441813 | dwuser | 192.168.3.4:30711  | dwdb | Sleep   |   38 |       | NULL                  |         0 |             0 |         0 |
| 12441814 | dwuser | 192.168.3.4:30714  | tydb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441817 | dwuser | 192.168.3.9:57570  | tydb | Sleep   |   29 |       | NULL                  |         0 |             0 |         0 |
| 12441819 | dwuser | 192.168.3.3:51829  | dwdb | Sleep   |   33 |       | NULL                  |         0 |             0 |         0 |
| 12441820 | dwuser | 192.168.3.3:51830  | dwdb | Sleep   |   33 |       | NULL                  |         0 |             0 |         0 |
| 12441821 | dwuser | 192.168.3.3:51833  | dwdb | Sleep   |   78 |       | NULL                  |         0 |             0 |         0 |
| 12441822 | dwuser | 192.168.3.3:51832  | dwdb | Sleep   |   78 |       | NULL                  |         0 |             0 |         0 |
| 12441823 | dwuser | 192.168.3.4:30737  | dwdb | Sleep   |   58 |       | NULL                  |         0 |             0 |         0 |
| 12441824 | dwuser | 192.168.3.5:6830   | dwdb | Sleep   |   56 |       | NULL                  |         0 |             0 |         0 |
| 12441825 | dwuser | 192.168.3.4:30839  | dwdb | Sleep   |   29 |       | NULL                  |         0 |             0 |         0 |
| 12441826 | dwuser | 192.168.3.3:51846  | dwdb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441827 | dwuser | 192.168.3.5:6831   | tydb | Sleep   |   58 |       | NULL                  |         0 |             0 |         0 |
| 12441828 | root   | localhost          | NULL | Query   |    0 | NULL  | show full processlist |         0 |             0 |         0 |
| 12441829 | dwuser | 192.168.3.5:6832   | dwdb | Sleep   |   34 |       | NULL                  |         0 |             0 |         0 |
| 12441830 | dwuser | 192.168.3.3:51853  | dwdb | Sleep   |   54 |       | NULL                  |         0 |             0 |         0 |
| 12441831 | dwuser | 192.168.3.3:51852  | dwdb | Sleep   |   54 |       | NULL                  |         0 |             0 |         0 |
| 12441832 | dwuser | 192.168.3.4:30987  | dwdb | Sleep   |   68 |       | NULL                  |         0 |             0 |         0 |
| 12441833 | dwuser | 192.168.3.5:6833   | tydb | Sleep   |   58 |       | NULL                  |         0 |             0 |         0 |
| 12441834 | dwuser | 192.168.3.4:31056  | dwdb | Sleep   |   38 |       | NULL                  |         0 |             0 |         0 |
| 12441835 | dwuser | 192.168.3.3:51870  | dwdb | Sleep   |   38 |       | NULL                  |         0 |             0 |         0 |
| 12441836 | dwuser | 192.168.3.4:31104  | dwdb | Sleep   |   49 |       | NULL                  |         0 |             0 |         0 |
| 12441837 | dwuser | 192.168.3.4:31103  | dwdb | Sleep   |   49 |       | NULL                  |         0 |             0 |         0 |
| 12441838 | dwuser | 192.168.3.9:57584  | tydb | Sleep   |   54 |       | NULL                  |         0 |             0 |         0 |
| 12441839 | dwuser | 192.168.3.8:44382  | tydb | Sleep   |   10 |       | NULL                  |         0 |             0 |         0 |
| 12441840 | dwuser | 192.168.3.5:6838   | dwdb | Sleep   |    8 |       | NULL                  |         0 |             0 |         0 |
| 12441841 | dwuser | 192.168.3.3:51876  | dwdb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441842 | dwuser | 192.168.3.5:6839   | dwdb | Sleep   |    8 |       | NULL                  |         0 |             0 |         0 |
| 12441843 | dwuser | 192.168.3.5:6840   | dwdb | Sleep   |    8 |       | NULL                  |         0 |             0 |         0 |
| 12441844 | dwuser | 192.168.3.5:6843   | tydb | Sleep   |    6 |       | NULL                  |         0 |             0 |         0 |
| 12441845 | dwuser | 192.168.3.5:6842   | tydb | Sleep   |    6 |       | NULL                  |         0 |             0 |         0 |
| 12441846 | dwuser | 192.168.3.5:6844   | dwdb | Sleep   |   59 |       | NULL                  |         0 |             0 |         0 |
| 12441847 | dwuser | 192.168.3.4:31254  | dwdb | Sleep   |   58 |       | NULL                  |         0 |             0 |         0 |
| 12441848 | dwuser | 192.168.3.9:57587  | tydb | Sleep   |   54 |       | NULL                  |         0 |             0 |         0 |
| 12441849 | dwuser | 192.168.3.4:31333  | dwdb | Sleep   |    6 |       | NULL                  |         0 |             0 |         0 |
| 12441850 | dwuser | 192.168.3.5:6845   | dwdb | Sleep   |    7 |       | NULL                  |         0 |             0 |         0 |
| 12441851 | dwuser | 192.168.3.9:57588  | tydb | Sleep   |   21 |       | NULL                  |         0 |             0 |         0 |
| 12441852 | dwuser | 192.168.3.8:44384  | tydb | Sleep   |   60 |       | NULL                  |         0 |             0 |         0 |
| 12441853 | dwuser | 192.168.3.8:44385  | tydb | Sleep   |   16 |       | NULL                  |         0 |             0 |         0 |
| 12441854 | dwuser | 192.168.3.8:44383  | tydb | Sleep   |   60 |       | NULL                  |         0 |             0 |         0 |
| 12441855 | dwuser | 192.168.3.3:51913  | dwdb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441856 | dwuser | 192.168.3.3:51912  | dwdb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441857 | dwuser | 192.168.3.4:31404  | tydb | Sleep   |   37 |       | NULL                  |         0 |             0 |         0 |
| 12441858 | dwuser | 192.168.3.3:51929  | dwdb | Sleep   |   35 |       | NULL                  |         1 |             0 |         0 |
| 12441859 | dwuser | 192.168.3.3:51931  | dwdb | Sleep   |   34 |       | NULL                  |         1 |             0 |         0 |
| 12441860 | dwuser | 192.168.3.3:51930  | dwdb | Sleep   |   34 |       | NULL                  |         1 |             0 |         0 |
| 12441861 | dwuser | 192.168.3.4:31454  | tydb | Sleep   |   30 |       | NULL                  |         1 |             0 |         0 |
| 12441862 | dwuser | 192.168.3.4:31453  | tydb | Sleep   |   30 |       | NULL                  |         1 |             0 |         0 |
+----------+--------+--------------------+------+---------+------+-------+-----------------------+-----------+---------------+-----------+
62 rows in set (0.00 sec)
 
## 发现sleep进程很多,而且有的等待时间超过了3000
 
 
分析及解决
=================================
## sleep命令解释
The thread is waiting for the client to send a new statement to it. 
官方解释为,等待客户端发送新的语句
 
## 开发角度排查
1.　程序中，不使用持久链接，即使用mysql_connect而不是pconnect。
2.  程序执行完毕，应该显式调用mysql_close
3.　只能逐步分析系统的SQL查询，找到查询过慢的SQL,优化之
 
## 运维角度解决
## 查看wait_timeout变量
mysql> show global variables like 'wait_timeout';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| wait_timeout  | 72000 |
+---------------+-------+
1 row in set (0.00 sec)
 
## mysql终端中解决
mysql> set global wait_timeout=100
 
## 配置文件中解决
# vim /etc/my.cnf
*********************************
[mysqld]
wait_timeout = 100
*********************************
 

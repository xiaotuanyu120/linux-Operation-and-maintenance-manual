MySQL:备份及恢复理论
2015年11月22日 星期日
13:43
 
备份类型理论介绍
=================================
物理备份：
简要介绍
物理备份是包含数据库目录和文件的raw copies，这种备份方式适合大型的、重要的并且需要在问题发生时快速恢复的数据库。
 
特点
* 是整个MySQL的data directoy的物理拷贝
* 比逻辑备份快速，因为只是拷贝文件而已
* 比逻辑备份的output更简洁（因为就是确切的copy过程）
* 因为备份速度和更简洁的输出，使得操作频繁和重要的商业数据库偏向于物理备份
* 提供表级（InnoDB）到数据库级的文件备份
* 物理备份包含数据文件相关的其他文件，例如log和configuration文件
* 备份可用于其他相同或类似硬件的机器
* 物理备份需要停掉或者lock数据库，MySQL商业备份会自动化完成table的lock操作
* 物理备份包含"mysqlbackup" for InnoDB 、"mysqlhotcopy" for MyISAM和其他表级或系统级的备份命令（cp，scp，tar，rsync）
* 恢复方式只需要把文件拷贝到MySQL server的指定data-dir即可
 
逻辑备份：
简要介绍
逻辑备份保存数据库逻辑结构的信息（CREATE DATABASE, CREATE TABLE）和内容改变信息（INSERT语句或delimited-text文件），这种备份适合小型的你可能要重建数据表结构或重建数据的数据库，并把他部署到另一个不同的机器上。
 
特点
* 通过向MySQL server发出请求获得database strcture 和 content infromation
* 比物理备份慢，因为它需要获取数据库信息，并转换成逻辑格式。
* output比物理备份大，特别是保存到text格式的时候
* 备份和恢复可以是server level（所有数据库），database level（所有的表），或table level。它并不区分储存引擎
* 备份不包括log日志或配置文件，也不包括其他不属于备份数据库的文件
* 备份储存格式是逻辑格式，独立于机器，可很方便转到其他不同类型机器
* 逻辑备份不用停止运行MySQL server
* 逻辑备份的工具有"mysqldump"和"SELECT ... INTO OUTFILE"语句
* 恢复工具要使用mysql client，加载delimited-text文件要使用"LOAD DATA INFILE"语句或者"mysqlimport" client
 
PS:相关 热备份 versus 冷备份、本地备份 versus 远程备份等
https://dev.mysql.com/doc/refman/5.5/en/backup-types.html
 
本次研究重点
==============================================
完整备份 Versus 增量备份
区别：
* A full backup includes all data managed by a MySQL server at a given point in time. 
* An incremental backup consists of the changes made to the data during a given time span (from one point in time to another).
增量备份的条件
Incremental backups are made possible by enabling the server's binary log, which the server uses to record data changes.
 
完整恢复 Versus Point-in-Time (增量) 恢复
 
A full recovery restores all data from a full backup. This restores the server instance to the state that it had when the backup was made. If that state is not sufficiently current, a full recovery can be followed by recovery of incremental backups made since the full backup, to bring the server to a more up-to-date state.
 
Incremental recovery is recovery of changes made during a given time span. This is also called point-in-time recovery because it makes a server's state current up to a given time. Point-in-time recovery is based on the binary log and typically follows a full recovery from the backup files that restores the server to its state when the backup was made. Then the data changes written in the binary log files are applied as incremental recovery to redo data modifications and bring the server up to the desired point in time.

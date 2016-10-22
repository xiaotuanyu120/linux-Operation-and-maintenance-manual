扩展: ssh连接的相关信息
2016年3月25日
16:02
 
ansible1.3及后期版本，默认情况下是使用原生OpenSSH来远程连接客户端节点，这启用了ControlPersist(提升性能)、kerberos和~/.ssh/config，可是某些系统的OpenSSH版本太低，并不支持ControlPersist，此时ansible就会采用备用方式，使用paramiko。
 
ansible默认采用sftp模式传输模块，一般情况下我们保持它不变，除非sftp出问题，我们可以在配置文件中修改为scp模式
 
ansible默认用SSHkey来连接ssh，使用--ask-pass也可以强制使用密码连接
 
ansible监控云端服务器的时候，最好跟云服务器在同一个网络中，这样性能会比通过internet好

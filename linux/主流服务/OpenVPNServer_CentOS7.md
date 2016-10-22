OpenVPN Server: CentOS 7
2015年9月7日
18:00
 
## 理论准备
什么是vpn？
什么是openvpn？
openvpn的官网去看介绍，简单来说是一个开源的vpn
版本：
free的社区版本
收费的openvpn-as版本 
## 准备工作
* 服务器：CentOS 7 server
* 权限：root access to the server
* Domain or subdomain that resolves to your server that you can use for the certificates 
## 安装epel源
yum install epel-release 
 
## Step 1 - Installing OpenVPN
# 安装openvpn，安装rsa来生成SSL key（用来加密VPN连接） 
yum install openvpn easy-rsa -y 
## Step 2 - Configuring OpenVPN
# 复制openvpn的配置文件模板到/etc/openvpn
cp /usr/share/doc/openvpn-*/sample/sample-config-files/server.conf /etc/openvpn 
## Let's open the file for editing.
vi /etc/openvpn/server.conf
# 修改以下内容
******************************************
# TCP or UDP server?
proto tcp
;proto udp
When we generate our keys later, the default Diffie-Hellman encryption length for Easy RSA will be 2048 bytes, so we need to change the dh filename to dh2048.pem.
dh dh2048.pem
We need to uncomment the push "redirect-gateway def1 bypass-dhcp" line, which tells the client to redirect all traffic through our OpenVPN.
push "redirect-gateway def1 bypass-dhcp"
Next we need to provide DNS servers to the client, as it will not be able to use the default DNS servers provided by your Internet service provider. We're going to use Google's public DNS servers, 8.8.8.8 and 8.8.4.4.
Do this by uncommenting the push "dhcp-option DNS lines and updating the IP addresses.
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"
We want OpenVPN to run with no privileges once it has started, so we need to tell it to run with a user and group of nobody. To enable this you'll need to uncomment these lines:
user nobody
group nobody
****************************************** 
## Step 3 - Generating Keys and Certificates
# 生成key之前的准备工作
# 创建生成key需要的环境
# 创建keys目录
mkdir -p /etc/openvpn/easy-rsa/keys
# 复制easy-rsa的key生成脚本
cp -rf /usr/share/easy-rsa/2.0/* /etc/openvpn/easy-rsa 
# 修改一些key生成时的默认值
vi /etc/openvpn/easy-rsa/vars                # 红色是需要自定义的值
****************************************************
We're going to be changing the values that start with KEY_. Update the following values to be accurate for your organization.
The ones that matter the most are:
* KEY_NAME: You should enter server here; you could enter something else, but then you would also have to update the configuration files that reference server.key and server.crt
* KEY_CN: Enter the domain or subdomain that resolves to your server
For the other values, you can enter information for your organization based on the variable name.
 
# These are the default values for fields
# which will be placed in the certificate.
# Don't leave any of these fields blank.
export KEY_COUNTRY="US"
export KEY_PROVINCE="NY"
export KEY_CITY="New York"
export KEY_ORG="DigitalOcean"
export KEY_EMAIL="sammy@example.com"
export KEY_OU="Community"
# X509 Subject Field
export KEY_NAME="server"
 
export KEY_CN=openvpn.example.com
**************************************************** 
# 拷贝openssl的配置文件
cp /etc/openvpn/easy-rsa/openssl-1.0.0.cnf /etc/openvpn/easy-rsa/openssl.cnf 
# 生成key
# 生成key之间，需要source新的variables文件
# 切换目录
cd /etc/openvpn/easy-rsa
# source variables文件
source ./vars
# 清除keys目录中以前的key文件
./clean-all 
# 生成认证授权文件及key
# 生成certificate authority
./build-ca
# 生成certificate for server
./build-key-server server
# 生成Diffie-Hellman key交换文件
./build-dh 
# 复制授权文件和key去/etc/openvpn
cd /etc/openvpn/easy-rsa/keys
cp dh2048.pem ca.crt server.crt server.key /etc/openvpn 
# 生成客户端的认证文件
cd /etc/openvpn/easy-rsa
./build-key client                           #client可以自定义最好给每个client不同的认证文件 
## Step 4 - Routing 
# 安装iptables 代替 firewalld
yum install iptables-services -y
systemctl mask firewalld
systemctl enable iptables
systemctl stop firewalld
systemctl start iptables 
# 创建iptables rule去开放1194端口
# 清空iptables规则
iptables -F
 
#编辑iptables规则脚本并执行
vi /bin/iptables.sh
**************************************************
iptables -t nat -F
 
####openvpn####
iptables -A INPUT -p tcp --destination-port 1194 -j ACCEPT
iptables -A INPUT -i tun0 -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT
**************************************************
sh /bin/iptables.sh
 
# 保存iptables规则
iptables-save > /etc/sysconfig/iptables 
# 开启IP转发
# 编辑sysctl.conf开启IP转发
vi /etc/sysctl.conf
******************************************
Add the following line at the top of the file:
net.ipv4.ip_forward = 1
******************************************
# 重启 network service 使IP forwarding生效
systemctl restart network.service  
## Step 5 - Starting OpenVPN
# So lets add it to systemctl:
systemctl -f enable openvpn@server.service
# Start OpenVPN:
systemctl start openvpn@server.service 
Well done; that's all the server-side configuration done for OpenVPN.
Next we'll talk about how to connect a client to the server.
 
## Step 6 - Configuring a Client
# 无论任何平台的客户端，服务器需提供以下三个文件，其中client是自定义的认证文件
/etc/openvpn/easy-rsa/keys/ca.crt
/etc/openvpn/easy-rsa/keys/client.crt
/etc/openvpn/easy-rsa/keys/client.key
 
# 我们需要创建一个client.ovpn来配置client如何连接到VPN
1、You'll need to change the first line to reflect the name you gave the client in your key and certificate; in our case, this is just client
2、需要把You also need to update the IP address from your_server_ip to the IP address of your server; port 1194 can stay the same
Make sure the paths to your key and certificate files are correct
**************************************
client
dev tun
proto tcp
remote your_server_ip 1194
resolv-retry infinite
nobind
persist-key
persist-tun
comp-lzo
verb 3
ca /path/to/ca.crt
cert /path/to/client.crt
key /path/to/client.key
**************************************
 
# 不同OS平台的配置文件使用方法
Windows:
On Windows, you will need the official OpenVPN Community Edition binaries which come with a GUI. Then, place your .ovpn configuration file into the proper directory, C:\Program Files\OpenVPN\config, and click Connect in the GUI. OpenVPN GUI on Windows must be executed with administrative privileges.
windows example
client
dev tun
proto tcp
remote 182.19.252.76 1194
resolv-retry infinite
nobind
persist-key
persist-tun
comp-lzo
verb 3
ca "C:\\Program Files\\OpenVPN\\config\\ca.crt"
cert "C:\\Program Files\\OpenVPN\\config\\test.crt"
key "C:\\Program Files\\OpenVPN\\config\\test.key"OS X:
On Mac OS X, the open source application Tunnelblick provides an interface similar to the OpenVPN GUI on Windows, and comes with OpenVPN and the required TUN/TAP drivers. As with Windows, the only step required is to place your .ovpn configuration file into the ~/Library/Application
Support/Tunnelblick/Configurations directory. Or, you can double-click on your .ovpn file.
Linux:
On Linux, you should install OpenVPN from your distribution's official repositories. You can then invoke OpenVPN by executing:
sudo openvpn --config ~/path/to/client.ovpn
Conclusion
Congratulations! You should now have a fully operational virtual private network running on your OpenVPN server.
After you establish a successful client connection, you can verify that your traffic is being routed through the VPN by checking Google to reveal your public IP. 
参考链接 <https://www.digitalocean.com/community/tutorials/how-to-setup-and-configure-an-openvpn-server-on-centos-7> 

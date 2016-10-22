OpenVPN Server: CentOS 6
2015年9月7日
18:00
 
## 服务器环境
* 服务器：CentOS 6.4
* Domain or subdomain that resolves to your server that you can use for the certificates
 
## 安装epel源与基础包
# yum groupinstall -y base "Development tools"
# yum install epel-release
 
 
## Step 1 - Installing OpenVPN
## 安装openvpn，安装rsa来生成SSL key（用来加密VPN连接） 
# yum install openvpn easy-rsa -y
 
## Step 2 - Configuring OpenVPN
## 复制openvpn的配置文件模板到/etc/openvpn
# cp /usr/share/doc/openvpn-*/sample/sample-config-files/server.conf /etc/openvpn
 
## Let's open the file for editing.
# vi /etc/openvpn/server.conf
******************************************
# TCP or UDP server?
proto tcp
;proto udp
When we generate our keys later, the default Diffie-Hellman encryption length for Easy RSA will be 2048 bytes, so we need to change the dh filename to dh2048.pem.
dh dh2048.pem
We need to uncomment the push "redirect-gateway def1 bypass-dhcp" line, which tells the client to redirect all traffic through our OpenVPN.
push "redirect-gateway def1"
Next we need to provide DNS servers to the client, as it will not be able to use the default DNS servers provided by your Internet service provider. We're going to use Google's public DNS servers, 8.8.8.8 and 8.8.4.4.
Do this by uncommenting the push "dhcp-option DNS lines and updating the IP addresses.
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"
We want OpenVPN to run with no privileges once it has started, so we need to tell it to run with a user and group of nobody. To enable this you'll need to uncomment these lines:
user nobody
group nobody
******************************************
 
 
## Step 3 - Generating Keys and Certificates
## 创建生成key需要的环境
## 创建keys目录
# mkdir -p /etc/openvpn/easy-rsa/keys
## 复制easy-rsa的key生成脚本
# cp -rf /usr/share/easy-rsa/2.0/* /etc/openvpn/easy-rsa
 
 
## 修改一些key生成时的环境变量
# vi /etc/openvpn/easy-rsa/vars                # 红色是需要自定义的值
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
 
## 拷贝openssl的配置文件
# cp /etc/openvpn/easy-rsa/openssl-1.0.0.cnf /etc/openvpn/easy-rsa/openssl.cnf
 
## 生成key之前，需要source新的variables文件
# cd /etc/openvpn/easy-rsa
# source ./vars
# 清除keys目录中以前的key文件
# ./clean-all
 
## 生成certificate authority
# ./build-ca
## 生成certificate for server
# ./build-key-server server
## 生成Diffie-Hellman key交换文件
# ./build-dh
 
## 复制授权文件和key去/etc/openvpn
# cd /etc/openvpn/easy-rsa/keys
# cp dh2048.pem ca.crt server.crt server.key /etc/openvpn
 
## 生成客户端的认证文件
# cd /etc/openvpn/easy-rsa
# ./build-key client                           #client可以自定义
## 最好给每个client不同的认证文件，客户端配置时需要严格与此处client名称一致
 
## Step 4 - Routing 
## 开放1194端口
# vim /etc/sysconfig/iptables
********************************
## 在下面一行下面添加
-A INPUT -i lo -j ACCEPT
-A INPUT -p tcp -m tcp --dport 1194 -j ACCEPT
-A INPUT -i tun0 -j ACCEPT
 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
## 保证添加内容在此行之上......
********************************
 
## 开启iptables转发规则，配置client通过vpn上外网
# iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
# iptables -I FORWARD -p tcp -i tun0 -o eth0 -j ACCEPT
# iptables -I FORWARD -p tcp -i eth0 -o tun0 -j ACCEPT
 
 
## 保存iptables规则
# iptables-save > /etc/sysconfig/iptables
 
 
## 开启内核IPv4转发
## 编辑sysctl.conf开启IP转发
# vi /etc/sysctl.conf
******************************************
Add the following line at the top of the file:
net.ipv4.ip_forward = 1
******************************************
# sysctl -p
## 重启 network service 使IP forwarding生效
# service network restart
 
## Step 5 - Starting OpenVPN
# So lets add it to systemctl:
# service openvpn start
# Start OpenVPN:
# chkconfig openvpn on
 
 
Well done; that's all the server-side configuration done for OpenVPN.
Next we'll talk about how to connect a client to the server.
 
## Step 6 - Configuring a Client
## 无论任何平台的客户端，服务器需提供以下三个文件，其中client是自定义的认证文件
/etc/openvpn/easy-rsa/keys/ca.crt
/etc/openvpn/easy-rsa/keys/client.crt
/etc/openvpn/easy-rsa/keys/client.key
 
## 我们需要创建一个client.ovpn来配置client如何连接到VPN
1、You'll need to change the first line to reflect the name you gave the client in your key and certificate; in our case, this is just client
2、You also need to update the IP address from your_server_ip to the IP address of your server; port 1194 can stay the same
**************************************
client
dev tun
proto tcp
remote your_server_ip 1194
resolv-retry infinite
remote-cert-tls server
nobind
user nobody
group nobody
 
persist-key
persist-tun
comp-lzo
verb 3
<ca>
-----BEGIN CERTIFICATE-----
contents of ca.crt
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
contents of client.crt ,只要begin和end中间一块就可以
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
contents of client.key
-----END PRIVATE KEY-----
</key>
**************************************
 
## 不同OS平台的配置文件使用方法
Windows:
On Windows, you will need the official OpenVPN Community Edition binaries which come with a GUI. Then, place your .ovpn configuration file into the proper directory, C:\Program Files\OpenVPN\config, and click Connect in the GUI. OpenVPN GUI on Windows must be executed with administrative privileges.
OS X:
On Mac OS X, the open source application Tunnelblick provides an interface similar to the OpenVPN GUI on Windows, and comes with OpenVPN and the required TUN/TAP drivers. As with Windows, the only step required is to place your .ovpn configuration file into the ~/Library/Application
Support/Tunnelblick/Configurations directory. Or, you can double-click on your .ovpn file.
Linux:
On Linux, you should install OpenVPN from your distribution's official repositories. You can then invoke OpenVPN by executing:
sudo openvpn --config ~/path/to/client.ovpn
Conclusion
Congratulations! You should now have a fully operational virtual private network running on your OpenVPN server.
After you establish a successful client connection, you can verify that your traffic is being routed through the VPN by checking Google to reveal your public IP. 
参考链接 <https://www.digitalocean.com/community/tutorials/how-to-setup-and-configure-an-openvpn-server-on-centos-6> 

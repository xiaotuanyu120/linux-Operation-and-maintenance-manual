wordpress blog 创建流程
2015年2月4日
上午 11:11
 
1、VPS准备和域名购买
VPS(vitrual private server)购买自budgetvw.com
Domain(san01.com)购买自godaddy.com
2、VPS系统环境准备
Centos6.5 32位
准备LNMP环境
3、san01.com的DNS配置
去域名提供商godaddy.com后台创建DNS的A记录(www指向VPS的公网IP)
4、按照wordpress.org的官方指引来安装wordpress
   大致流程：
下载wordpress并解压到VPS上的网站根目录(/data/www/)
mysql为wordpress准备数据库及操作用户
用windows浏览器访问san01.com开始安装过程

WIKI: moinmoin基本设置
2016年2月4日
16:44
 
## 配置wiki
# vim /usr/local/py27/share/moin/mywiki/wikiconfig.py
**********************************
## 去掉下面一行的注释，避免启动的时候自动跳去language setup页面
page_front_page = u"FrontPage"
 
## 去掉下面一行的注释，来创建管理员账户
superuser = [u"igadmin", ]
**********************************
# /etc/init.d/uwsgid reload
 
## 创建管理员账户
* 打开浏览器，访问wiki服务器的ip（我这里是10.10.210.9）
* 点击左上角的login
* 创建跟上面superuser里配置的用户名一样的用户
 
## 语言包安装
访问http://10.10.210.9/LanguageSetup?action=language_setup
在Choose:那一行语言选择链接里选择简体中文（Simplified_Chinese）
在下面的all_pages那里点击install
（成功后提示Attachment 'Simplified_Chinese--all_pages.zip' installed.）

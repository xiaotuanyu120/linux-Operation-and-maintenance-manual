PEP8: F821 undefined name
2016年5月12日
22:40
 
flake8工具检测报错：
mail-main.py:28:12:  F821 undefined name 'SMTPAuthenticationError'
 
原代码：
*****************************************
 ......
try:
        smtp.login(FROM, "bendan.521")
except SMTPAuthenticationError as login_error:
......
*****************************************
 
原因详解：
因为引入smtplib时使用下面方式
"import smtplib"
所以handle异常的时候需要这样声明
"except smtplibf.someerror as e:"
 
解决办法：
## 修改原代码如下
*****************************************
 ......
try:
        smtp.login(FROM, "bendan.521")
except smtplib.SMTPAuthenticationError as login_error:
......
*****************************************

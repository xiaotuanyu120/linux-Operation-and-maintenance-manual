PHP: module already loaded in ** on line No.
2015年12月20日 星期日
12:49
 
问题描述：
## 当你在查看php信息或者重启php时遇到类似下面的信息
"PHP Warning:  Module 'PDO' already loaded in Unknown on line 0"
问题解释：
## 这代表了你重复载入了同一个module，这时候只要你去配置文件找到重复的配置，并禁用一个就可以取消这个错误

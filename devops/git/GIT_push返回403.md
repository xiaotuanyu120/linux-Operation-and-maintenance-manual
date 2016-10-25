GIT: push返回403
2016年5月5日
14:18
 
问题描述：
首先git clone自己的分支
修改后git push
返回错误
# git push
error: The requested URL returned error: 403 Forbidden while accessing https://github.com/xiaotuanyu120/op-utility.git/info/refs
 
解决方案：
## 尝试方法1
# git remote set-url origin https://github.com/xiaotuanyu120/op-utility.git
# git push
error: The requested URL returned error: 403 Forbidden while accessing https://github.com/xiaotuanyu120/op-utility.git/info/refs
 
fatal: HTTP request failed
 
## 尝试方法2
# vim .git/config
************************************
## 找到下面这条信息
url = https://github.com/xiaotuanyu120/op-utility.git
## 修改为
url = https://username:password@github.com/xiaotuanyu120/op-utility.git
************************************
# git push
## 成功解决

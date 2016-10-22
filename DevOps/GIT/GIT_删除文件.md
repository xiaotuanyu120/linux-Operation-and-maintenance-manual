GIT: 删除文件
2016年3月24日
15:58
 
## 若不小心暂存了不想添加的文件，可以用git rm 删除它
# git rm *.pyc
rm 'ssh_key_dispense/keygen_ssh.pyc'
rm 'ssh_key_dispense/main.pyc'
 
## 删除之后记得重新commit和push
# git commit -m "delete *.pyc"
[master 610c0a5] delete *.pyc
 2 files changed, 0 insertions(+), 0 deletions(-)
 delete mode 100644 ssh_key_dispense/keygen_ssh.pyc
 delete mode 100644 ssh_key_dispense/main.pyc
 
# git push
 
## 若希望取消暂存，但是不想在硬盘上删除它
``` git
git rm -r --cached src/db.sqlite3
```

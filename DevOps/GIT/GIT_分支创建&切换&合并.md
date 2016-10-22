GIT: 分支创建&切换&合并
2016年3月1日
16:03
 
HOW TO CHANGE BRANCH
## create new branch
# git branch branch_name
 
## check branch
# git branch
* client
  list
  master
  test
 
 
## switch to new branch
# git checkout branch_name
# git checkout master    # 切换到原来的主分支
## "git branch -b branch_name" == "git branch branch_name;git checkout branch_name"
 
## 切换时文件的改变
# git checkout url-class-optimize
# echo "check" >> README.md
# git commit -a -m "check file status when branch changed"
## 切换分支之前，尽量commit所有更改，保持切换时分支是干净的
 
# git checkout master
# cat README.md
# op-utility
utilities for operation
## 发现并没有上面添加的内容
 
## merge  branch_name to current branch
# git status
# On branch master
nothing to commit, working directory clean
 
# git merge branch_name
## 相当于把branch_name分支合并到了当前master分支
 
# git branch -d branch_name
## 相当于删除了branch_name分支，因为我们已经merge它到master了，所以就没有用了

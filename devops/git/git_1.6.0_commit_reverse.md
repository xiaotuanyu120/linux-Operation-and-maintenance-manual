---
title: git: 1.6.0 撤销操作
date: 2016-12-09 18:32:00
categories: devops/git
tags: [git,reverse]
---
### git: 1.6.0 撤销操作

---

### 1. 修改最后一次提交
当你提交之后，可能会发现刚才的提交忘记了几个文件或者提交信息不合理，这时候可以使用--amend命令  
`git commit --amend`会将stage区域的文件合并到上次的提交中，最终我们会只有一次提交(第二次提交会替代第一次提交)
``` bash
# 做出部分修改，并提交分支
echo "version 2" > version.txt
touch newfile
git add version.txt
git commit -m "change version info"

# 此时突然发现忘记添加新创建的newfile
git add newfile
git commit --amend
#这里会让你重新编辑提交信息
```

---

### 2. reset撤回操作(适用于私人仓库)
在提交层面上，reset将分支的末端指向另外一个提交，这可以用来移除当前分支的某些提交，让我们拥有重新来过的机会。为了理解这个，我们需要牢记git中的一个基本知识(文件区域)  
工作目录 --> stage区域 --> commit区域  

reset其实用三个参数，来对应的对于上面的区域做撤回操作
- --soft - 只会改变commit区域，stage区域和工作目录都不会被改变
- --mixed - 默认选项。stage区域和你指定的提交同步，但工作目录不受影响
- --hard - stage区域和工作目录都同步到你指定的提交

#### 1) commit之前，撤销stage区域的文件
我们会将工作区的文件修改后，添加到stage区域，但有时候我们希望撤销stage区域的全部文件或者部分文件
``` bash
# 对当前分支两个文件做出修改
git mv newfile oldfile
echo "version 3" > version.txt
# stage所有修改过的文件
git add *
# 查看当前状态
git status
位于分支 master
要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

	重命名：   newfile -> oldfile
	修改：     version.txt

# 此时我们发现有些文件需要撤回
git reset HEAD
重置后取消暂存的变更：
D	newfile
M	version.txt

# 之所以我们会发现恢复后的状态是删除了newfile，而新的oldfile并没有被add，是因为git mv本身就是两步操作的合集，mv + git add
git status
位于分支 master
尚未暂存以备提交的变更：
  （使用 "git add/rm <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

	删除：     newfile
	修改：     version.txt

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

	oldfile
```
> 若只希望撤回某个文件，可以使用git reset HEAD <file>

#### 2）--mixed，撤回最后一次commit和stage区域的文件
``` bash
# 添加oldfile
git add oldfile
# 提交"add oldfile"
git commit -a -m "add oldfile"
# 查看最后一次提交信息
git log|head -5
commit 9f78a8c7a48363479347a88e8b7be79e97902641
Author: zhao <zhaopeiwu@outlook.com>
Date:   Thu Apr 6 21:45:17 2017 +0800

    add oldfile

# 此时希望回退到上一次提交，则执行下面的命令
git reset HEAD~1
# 查看最后一次提交信息，发现已经回退到了上一次的提交
git log|head -5
commit b35b3b2d1a0600a9d09ad9dfa6f9dbfc8df46bf7
Author: zhao <zhaopeiwu@outlook.com>
Date:   Thu Apr 6 21:07:36 2017 +0800

    update newfile
# 由于默认reset是--mixed，会改变stage区域和指定的commit
#所以上次提交到stage区域的oldfile也被撤回到了工作区域
git status
位于分支 master
未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

	oldfile

提交为空，但是存在尚未跟踪的文件（使用 "git add" 建立跟踪）
```

#### 3) --hard，撤回最后一次commit和stage区域的文件，同时撤回工作目录的所有修改
``` bash
# 修改newfile文件名称及修改version.txt内容
git mv newfile file
echo "version hard" > version.txt
git add *
git commit -m "rename newfile and change version"
[master 9699d6a] rename newfile and change version
 2 files changed, 1 insertion(+), 1 deletion(-)
 rename newfile => file (100%)

# 使用--hard回退到上一次提交的完整状态
git reset --hard HEAD~1
HEAD 现在位于 b35b3b2 update newfile
# stage区域的操作被撤回，包括工作目录的全部改动
git status
位于分支 master
无文件要提交，干净的工作区

ls
newfile  version.txt
```
> 可以看到reset可以更改commit信息，这样的操作不可用在公共仓库上，适用于私人仓库或还没有push的私有分支，因为我们不希望已经被团队接纳的操作再被私自撤回或修改，这样不利于团队配合

#### 4) reset撤回到指定的commit
工作中遇到这样一个问题，按照`reset --hard HEAD~1`回退，结果有一个是merge的commit，每一个merge的commit都有两个额外的commit标记(commit_num_1 commit_num_2)，此时reset撤回，如果不指定的话，直接默认是回退到commit_num_1上，如果我们想回退到第二个commit号上，就只能用`revert -m commit_num_2`。 然而revert是向前增加commit，reset是向后撤销commit。 我当时的需求是后面需要继续reset，也可以用一个简单的用法`reset --hard commit_num`, 直接指向更后面的comit号也可以。

---

### 3. revert撤回操作(适用于公共仓库)
reset会回退commit信息，来达到撤回操作的目的，但是那样不适用于多人维护的公共仓库，因为有可能别人的工作是基于你撤销的那个commit，有没有一种办法，不会修改历史的commit也能达到撤销操作的目的呢？那就是revert，revert撤销一个提交的同时会创建一个新的提交，新的提交不会改变提交历史，但是通过这个新的提交，我们撤销了之前提交的一些操作。
``` bash
# 目前我们有4次commit(每次commit都是修改version.txt的内容)
git log
commit ca6d40697dbf88d3bec1c98b5c7d933eadacb272
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:56:01 2017 +0000

    commit 4

commit 5844493eadc4797fef97f698782524c98bc388c5
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:55:55 2017 +0000

    commit 3

commit 557de5cb4f48df417b6d8ce88651904b94b0fe9c
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:54:58 2017 +0000

    commit 2

commit b2c685b1aa00b772bee38cfca0368ffc2c17cbb0
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:54:49 2017 +0000

    commit 1


# 目前我们有两个文件
ls
oldfile  version.txt

# 我们希望从version4回退到version3
git revert HEAD
Finished one revert.
[master c0b7328] Revert "commit 4"
 1 files changed, 1 insertions(+), 1 deletions(-)
#这里我们有一次新的机会重新填写commit信息，会创建一个新的comit，但是其实是撤销了最后一次commit的操作

# 查看git commit信息
git log
commit c0b732867d3aa39ab76bb6b7d883b454225c2a1a
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:56:34 2017 +0000

    Revert "commit 4"

    This reverts commit ca6d40697dbf88d3bec1c98b5c7d933eadacb272.

commit ca6d40697dbf88d3bec1c98b5c7d933eadacb272
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:56:01 2017 +0000

    commit 4

commit 5844493eadc4797fef97f698782524c98bc388c5
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:55:55 2017 +0000

    commit 3

commit 557de5cb4f48df417b6d8ce88651904b94b0fe9c
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:54:58 2017 +0000

    commit 2

commit b2c685b1aa00b772bee38cfca0368ffc2c17cbb0
Author: zhao <zhaopeiwu@outlook.com>
Date:   Tue Apr 11 08:54:49 2017 +0000

    commit 1
```
> 结果我们经过revert撤销操作，并没有修改以前的commit历史，这种操作适合公共仓库

> 如果希望撤销多个commit，可使用`git revert -m commit_num`来操作
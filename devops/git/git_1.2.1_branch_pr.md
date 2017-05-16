---
title: git: 1.2.1 分支-Pull Request
date: 2017-05-16 13:21:00
categories: devops/git
tags: [git,branch,pullrequest]
---
### git: 1.2.1 分支-Pull Request

---

### 1. 如何进行pull request？
当团队去合作维护一个项目时，作为团队里面的开发，我们需要首先在线上master分支fork一份代码到自己的仓库。然后创建一个分支，修改完毕并确保解决了和线上的冲突后，我们pull request到线上的master分支中。  
这个过程就是pull request的完整过程。

---

### 2. pull request示例
``` bash
# 1. fork线上master到自己的仓库中

# 2. 创建新分支
git branch pr_test
git checkout pr_test

# 3. 在本地分支做出改动

# 4. 提交本地分支
git commit -a -m "commit message"

# 5. fetch线上master分支内容
git remote add upstream http://example.com/original_group/original_repo.git

# 6. merge线上master的最新分支
git merge upstream/master

# 7. 推送本地分支到自己的代码仓库中
git push origin pr_test

# 8. 在自己的代码仓库中创建新的pull request到线上
```
> 最后，线上仓库的管理员会收到你的pr申请，并在审查你的代码觉得ok之后，merge你的commit。

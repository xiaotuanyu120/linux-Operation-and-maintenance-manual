---
title: fedora: 1.0 rime输入法
date: 2017-05-10 12:05:00
categories: linux/desktop
tags: [linux,fedora,rime]
---
### fedora: 1.0 rime输入法

---

### 1. 安装rime
```
sudo dnf install ibus-rime
```
> fedora默认是安装了ibus框架的，启动ibus框架的命令是`ibus-daemon`，重启是`ibus restart`

---

### 2. 启用rime
在"设置"-"区域和语言"中，选择"添加"，选择"汉语(中国)"，选择"汉语(RIME)"  
fedora中切换输入法的快捷键是win+space

---

### 3. 启用双拼
#### 1) 在~/.config/ibus/rime中创建default.custom.yaml
``` yaml
patch:
  schema_list:
    - schema: luna_pinyin          # 朙月拼音
    - schema: luna_pinyin_simp     # 朙月拼音 简化字模式
    - schema: double_pinyin        # 自然碼雙拼
    - schema: emoji                # emoji 表情
```
#### 2) 重启ibus
``` bash
ibus restart
```
#### 3) 切换双拼方案
然后在任意输入框按下"ctrl+\`"选择双拼方案，这里需要注意的是要选择子菜单里面的简体和繁体切换，不然默认是繁体字
